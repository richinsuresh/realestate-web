// src/components/ContactForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  FormHelperText,
  FormErrorMessage,
  Stack,
  useToast,
} from "@chakra-ui/react";

type Props = {
  defaultSubject?: string;
};

export default function ContactForm({ defaultSubject = "" }: Props) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // If defaultSubject changes (e.g., hyperlink navigated), update the field
  useEffect(() => setSubject(defaultSubject ?? ""), [defaultSubject]);

  // Basic client-side validation
  const validate = () => {
    if (!name.trim()) return "Please enter your name.";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (!subject.trim()) return "Please enter a subject.";
    if (!message.trim() || message.trim().length < 10) return "Please enter a message (10+ characters).";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast({ title: err, status: "error", duration: 4000, isClosable: true });
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send message");
      }

      // Success
      toast({ title: "Message sent", description: "Thanks — we will contact you soon.", status: "success", duration: 5000, isClosable: true });
      setName("");
      setEmail("");
      setMessage("");
      // leave subject intact so user knows which property was referenced
    } catch (err: any) {
      toast({ title: "Send failed", description: err.message || "Something went wrong", status: "error", duration: 6000, isClosable: true });
    } finally {
      setSending(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl id="name" isRequired>
          <FormLabel>Your name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" type="email" />
          <FormHelperText>We will reply to this address.</FormHelperText>
        </FormControl>

        <FormControl id="subject" isRequired>
          <FormLabel>Subject</FormLabel>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enquiry about Property ABC" />
        </FormControl>

        <FormControl id="message" isRequired>
          <FormLabel>Message</FormLabel>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hi — I'm interested in..." minH="160px" />
        </FormControl>

        <Button type="submit" colorScheme="teal" isLoading={sending} loadingText="Sending..." width={{ base: "100%", md: "auto" }}>
          Send message
        </Button>
      </Stack>
    </Box>
  );
}
