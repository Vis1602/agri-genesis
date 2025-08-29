// Test file to check environment variables
console.log("=== Environment Test ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("REACT_APP_GEMINI_API_KEY:", process.env.REACT_APP_GEMINI_API_KEY);
console.log("All REACT_APP vars:", Object.keys(process.env).filter(key => key.startsWith('REACT_APP')));

export const testEnv = () => {
  return {
    hasApiKey: !!process.env.REACT_APP_GEMINI_API_KEY,
    apiKey: process.env.REACT_APP_GEMINI_API_KEY
  };
};
