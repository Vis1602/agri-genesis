import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password });
      console.log(response.data);
      // Handle successful login (e.g., store token, redirect)
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const boxBgColor = useColorModeValue('white', 'gray.700');

  return (
    <Box bg={bgColor} minH="calc(100vh - 64px)" py={20}>
      <Box maxW="md" mx="auto" bg={boxBgColor} p={8} borderRadius="lg" boxShadow="lg">
        <Heading mb={6} textAlign="center" color="brand.600">Welcome Back</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Button type="submit" colorScheme="brand" width="full" mt={4}>
              Login
            </Button>
          </VStack>
        </form>
        <Text mt={4} textAlign="center">
          Don't have an account? <Button variant="link" color="brand.500">Sign up</Button>
        </Text>
      </Box>
    </Box>
  );
}

export default Login;