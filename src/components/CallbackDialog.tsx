// src/components/CallbackDialog.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  Textarea,
  useToast,
} from "@chakra-ui/react";

export default function CallbackDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const handler = () => setOpen(true);
    // Listen to custom event dispatched from Navbar/Footer/etc.
    window.addEventListener("openCallbackDialog", handler);
    return () => window.removeEventListener("openCallbackDialog", handler);
  }, []);

  const close = () => {
    setOpen(false);
    setName("");
    setPhone("");
    setNotes("");
    setLoading(false);
  };

  const validate = () => {
    if (!name.trim()) return "Please enter your name";
    if (!phone.trim() || phone.trim().length < 6) return "Please enter a valid phone number";
    return null;
  };

  const handleSubmit = async () => {
    const v = validate();
    if (v) {
      toast({ title: v, status: "error", duration: 4000, isClosable: true });
      return;
    }

    setLoading(true);

    try {
      // Replace this with real API call when ready (e.g. /api/callback or send to sanity)
      // For now we'll simulate success
      // Example:
      // await fetch("/api/callback", { method: "POST", body: JSON.stringify({ name, phone, notes }) });

      await new Promise((res) => setTimeout(res, 700));

      toast({ title: "Request received", description: "We'll call you back shortly.", status: "success", duration: 4000, isClosable: true });
      close();
    } catch (err) {
      console.error("Callback request failed", err);
      toast({ title: "Failed", description: "Something went wrong. Please try again later.", status: "error", duration: 4000, isClosable: true });
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={close} isCentered>
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader>Book a callback</ModalHeader>
        <ModalBody>
          <FormControl mb={3} isRequired>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Phone</FormLabel>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Notes (optional)</FormLabel>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferred time, property of interest, etc." />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={close} disabled={loading}>
            Cancel
          </Button>

          {/* Visible, styled submit button */}
          <Button
            colorScheme="brand" // ensure 'brand' exists; fallback to teal if not
            bgGradient="linear(to-r, teal.400, green.400)"
            _hover={{ transform: "translateY(-1px)" }}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Book a callback
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
