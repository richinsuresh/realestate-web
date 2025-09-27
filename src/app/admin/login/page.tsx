"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin() {
    setErrorMsg("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        // On success, redirect to admin panel
        router.push("/admin/properties");
      }
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxW="sm" py={20}>
      <Box borderWidth="1px" borderRadius="md" p={6} boxShadow="md">
        <Heading mb={6} size="md">
          Admin Login
        </Heading>

        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
          </FormControl>

          {errorMsg && <Text color="red.500">{errorMsg}</Text>}

          <Button colorScheme="blue" onClick={handleLogin} isLoading={loading}>
            Log in
          </Button>

          <Text fontSize="sm" color="gray.500">
            Manage properties for the site. If you don't have an account, create
            one under Supabase → Authentication → Users.
          </Text>
        </VStack>
      </Box>
    </Container>
  );
}
