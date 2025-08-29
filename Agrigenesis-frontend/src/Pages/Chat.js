import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllExperts, getAllFarmers } from "../services/api";
import { authService } from "../services/auth";
import { askAI } from "../services/geminiService";
import { testEnv } from "../test-env";
import io from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function getRoomId(user1, user2) {
  return [user1, user2].sort().join(":");
}

function Chat() {
  const navigate = useNavigate();
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [aiMode, setAiMode] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // for mobile
  const [chatListLoading, setChatListLoading] = useState(false);
  const [chatListLoaded, setChatListLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const currentUser = authService.getCurrentUser();

  // Check authentication on component mount
  useEffect(() => {
    console.log("=== Chat Component Mounted ===");
    console.log("Current user:", currentUser);
    
    if (!currentUser || !currentUser._id) {
      console.log("User not authenticated, redirecting to login");
      navigate('/login');
      return;
    }
    
    setIsAuthenticated(true);
    const envTest = testEnv();
    console.log("Environment test result:", envTest);
  }, [currentUser, navigate]);

  useEffect(() => {
    async function fetchList() {
      if (!isAuthenticated || !currentUser?._id || !currentUser?.role || chatListLoaded || chatListLoading) return;
      
      console.log('Fetching chat list for user role:', currentUser.role);
      setChatListLoading(true);
      try {
        if (currentUser.role === "farmer") {
          console.log('Fetching experts for farmer');
          const experts = await getAllExperts();
          console.log('Experts fetched:', experts.length);
          setChatList(experts);
        } else {
          console.log('Fetching farmers for expert');
          const farmers = await getAllFarmers();
          console.log('Farmers fetched:', farmers.length);
          setChatList(farmers);
        }
        setChatListLoaded(true);
      } catch (error) {
        console.error("Failed to fetch chat list:", error);
        // Set empty array on error to prevent retries
        setChatList([]);
        setChatListLoaded(true);
      } finally {
        setChatListLoading(false);
      }
    }
    fetchList();
  }, [isAuthenticated, currentUser?._id, currentUser?.role, chatListLoaded, chatListLoading]);

  useEffect(() => {
    if (!isAuthenticated || !currentUser?._id) return;
    
    console.log('Setting up socket connection for user:', currentUser._id);
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000
    });
    
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });
    
    socketRef.current.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });
    
    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
      console.error('Socket connection failed. Please check if the server is running.');
    });
    
    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
    });
    
    return () => {
      if (socketRef.current) {
        console.log('Disconnecting socket');
        socketRef.current.disconnect();
      }
    };
  }, [isAuthenticated, currentUser?._id]); // Use stable ID instead of full object

  useEffect(() => {
    if (!selectedChat || aiMode || !currentUser || !socketRef.current) return;
    
    const room = getRoomId(currentUser._id, selectedChat._id);
    console.log(`Setting up chat for room: ${room}`);
    setMessages([]);
    setLoading(true);
    
    // Join room
    socketRef.current.emit("joinRoom", {
      room,
      userId: currentUser._id,
      userName: currentUser.name,
    });
    
    // Fetch chat history - URL encode the room parameter to handle special characters
    const encodedRoom = encodeURIComponent(room);
    axios.get(`${API_URL}/chat/${encodedRoom}`)
      .then(res => {
        console.log(`Chat history loaded for room: ${room}`, res.data);
        setMessages(res.data || []);
      })
      .catch(error => {
        console.error('Failed to fetch chat history:', error);
        console.error('Error details:', error.response?.data || error.message);
        setMessages([]);
        // Show user-friendly error message
        if (error.response?.status === 404) {
          console.log('No chat history found for this room yet');
        } else if (error.response?.status >= 500) {
          console.error('Server error while fetching chat history');
        }
      })
      .finally(() => setLoading(false));
    
    // Listen for new messages
    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    
    const handleActiveUsers = (users) => {
      setActiveUsers(users || []);
    };
    
    socketRef.current.on("chatMessage", handleNewMessage);
    socketRef.current.on("activeUsers", handleActiveUsers);
    
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveRoom", { room, userId: currentUser._id });
        socketRef.current.off("chatMessage", handleNewMessage);
        socketRef.current.off("activeUsers", handleActiveUsers);
      }
    };
  }, [selectedChat?._id, aiMode, currentUser?._id]); // Use stable IDs instead of full objects

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiMessages]);

  const sendMessage = () => {
    if (!input.trim() || !selectedChat || !socketRef.current) return;
    
    const room = getRoomId(currentUser._id, selectedChat._id);
    const msg = {
      room,
      sender: currentUser._id,
      senderName: currentUser.name,
      message: input,
      isAI: false,
    };
    
    // Send message via Socket.io
    socketRef.current.emit("chatMessage", msg);
    setInput("");
  };

  const sendAiMessage = async () => {
    if (!aiInput.trim()) return;
    console.log("=== Sending AI Message ===");
    console.log("Input:", aiInput);
    
    const userMsg = { sender: "user", message: aiInput };
    setAiMessages((prev) => [...prev, userMsg]);
    const currentInput = aiInput;
    setAiInput("");
    setLoading(true);
    
    try {
      console.log("Calling askAI function...");
      const result = await askAI(currentInput);
      console.log("AI Result:", result);
      
      if (result.success) {
        setAiMessages((prev) => [...prev, { sender: "ai", message: result.answer }]);
      } else {
        setAiMessages((prev) => [...prev, { sender: "ai", message: result.answer }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setAiMessages((prev) => [...prev, { sender: "ai", message: "AI failed to respond. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for better UI
  const handleBackToUsers = () => {
    setSelectedChat(null);
    setAiMode(false);
    setShowSidebar(true);
    setMessages([]);
    setAiMessages([]);
  };

  const handleSelectUser = (user) => {
    setSelectedChat(user);
    setAiMode(false);
    setShowSidebar(false);
  };

  const handleSelectAI = () => {
    setAiMode(true);
    setSelectedChat(null);
    setShowSidebar(false);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMobile = window.innerWidth <= 768;
  const showChatMain = (!showSidebar && isMobile) || !isMobile;
  const showChatSidebar = (showSidebar && isMobile) || !isMobile;

  // Show loading screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 ">
      <Navbar />
      
      <div className="flex h-[calc(100vh-80px)] max-w-7xl mx-auto">
        {/* Sidebar - User List */}
        {showChatSidebar && (
          <div className="w-full md:w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-500">Online</span>
                </div>
              </div>
            </div>

            {/* AI Assistant Option */}
            <div
              className={`flex items-center p-4 cursor-pointer transition-colors ${
                aiMode ? 'bg-blue-50 border-r-4 border-blue-500' : 'hover:bg-gray-50'
              }`}
              onClick={handleSelectAI}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                🤖
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">AI Assistant</h3>
                <p className="text-sm text-gray-500">Get instant help with farming</p>
              </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto">
              {chatListLoading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading users...</p>
                </div>
              ) : chatList.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No {currentUser?.role === 'farmer' ? 'experts' : 'farmers'} available</p>
                </div>
              ) : (
                chatList.map((user) => (
                  <div
                    key={user._id}
                    className={`flex items-center p-4 cursor-pointer transition-colors ${
                      selectedChat && selectedChat._id === user._id && !aiMode
                        ? 'bg-blue-50 border-r-4 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{user.name}</h3>
                      <p className="text-sm text-gray-500 truncate">
                        {user.specialization || (user.role === 'farmer' ? 'Farmer' : 'Expert')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mb-1"></div>
                      <span className="text-xs text-gray-400">Online</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        {showChatMain && (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center">
              {isMobile && (
                <button
                  onClick={handleBackToUsers}
                  className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              <div className="flex items-center flex-1">
                {aiMode ? (
                  <>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                      🤖
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-800">AI Assistant</h2>
                      <p className="text-sm text-gray-500">Always available</p>
                    </div>
                  </>
                ) : selectedChat ? (
                  <>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                      {getInitials(selectedChat.name)}
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-800">{selectedChat.name}</h2>
                      <p className="text-sm text-gray-500">
                        {selectedChat.specialization || (selectedChat.role === 'farmer' ? 'Farmer' : 'Expert')}
                        {activeUsers.length > 0 && ` • ${activeUsers.length} online`}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center flex-1">
                    <h2 className="text-xl font-bold text-gray-800">Welcome to AgriGenesis Chat</h2>
                    <p className="text-gray-500">Select a user or AI assistant to start chatting</p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {aiMode ? (
                // AI Chat Messages
                <div className="space-y-4">
                  {aiMessages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                        🤖
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Assistant</h3>
                      <p className="text-gray-500">Ask me anything about farming, crops, or agriculture!</p>
                    </div>
                  )}
                  {aiMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          msg.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-800 shadow-sm border"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-800 shadow-sm border px-4 py-2 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              ) : selectedChat ? (
                // Human Chat Messages
                <div className="space-y-4">
                  {loading && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                    </div>
                  )}
                  {messages.length === 0 && !loading && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                        {getInitials(selectedChat.name)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Start a conversation</h3>
                      <p className="text-gray-500">Send a message to begin chatting with {selectedChat.name}</p>
                    </div>
                  )}
                  {messages.map((msg, idx) => (
                    <div
                      key={msg._id || idx}
                      className={`flex ${msg.sender === currentUser._id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          msg.sender === currentUser._id
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-800 shadow-sm border"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === currentUser._id ? "text-blue-100" : "text-gray-400"
                        }`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                // Welcome Screen
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">
                      💬
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Start a Conversation</h3>
                    <p className="text-gray-500 mb-6">Choose someone from the sidebar to begin chatting</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                      <div className="p-4 bg-white rounded-lg shadow-sm border">
                        <div className="text-2xl mb-2">🤖</div>
                        <h4 className="font-semibold text-gray-800">AI Assistant</h4>
                        <p className="text-sm text-gray-500">Get instant help</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm border">
                        <div className="text-2xl mb-2">👥</div>
                        <h4 className="font-semibold text-gray-800">Experts & Farmers</h4>
                        <p className="text-sm text-gray-500">Connect with community</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            {(aiMode || selectedChat) && (
              <div className="p-4 border-t border-gray-200 bg-white ">
                <div className="flex items-center space-x-3">
                  <input
                    value={aiMode ? aiInput : input}
                    onChange={e => aiMode ? setAiInput(e.target.value) : setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (aiMode ? sendAiMessage() : sendMessage())}
                    placeholder={aiMode ? "Ask the AI assistant..." : "Type a message..."}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    onClick={aiMode ? sendAiMessage : sendMessage}
                    disabled={loading || !(aiMode ? aiInput : input).trim()}
                    className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default Chat;
