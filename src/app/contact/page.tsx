// src/app/contact/page.tsx
import React from "react";
import { Box, Container, Heading, Text } from "@chakra-ui/react";
import ContactForm from "@/components/ContactForm";

type Props = {
  searchParams?: { subject?: string };
};

export default function ContactPage({ searchParams }: Props) {
  const prefillSubject = searchParams?.subject ?? "";

  return (
    <Container maxW="800px" py={{ base: 8, md: 12 }}>
      <Heading mb={4}>Contact Us</Heading>
      <Text color="gray.600" mb={6}>
        Fill the form below and we’ll get back to you within one business day.
      </Text>

      <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="md" boxShadow="sm">
        <ContactForm defaultSubject={prefillSubject} />
      </Box>
    </Container>
  );
}
