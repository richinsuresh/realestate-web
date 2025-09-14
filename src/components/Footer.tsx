// src/components/Footer.tsx
'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Flex,
  HStack,
  Text,
  Link as ChakraLink,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react'

export default function Footer() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  // form state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  // Update these to your real contact details if needed
  const companyName = 'ARK Infra'
  const contactEmail = 'hello@arkinfra.com'
  const contactPhone = '+91 98765 43210'

  // Listen for global event from Navbar to open the modal
  useEffect(() => {
    function handleOpen() {
      onOpen()
    }
    window.addEventListener('open-callback-modal', handleOpen)
    return () => window.removeEventListener('open-callback-modal', handleOpen)
  }, [onOpen])

  function submitViaMailto() {
    const subject = encodeURIComponent('Callback request from website')
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nMessage: ${message}`
    )
    // opens user's mail client with prefilled message
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`
    onClose()
  }

  return (
    <>
      <Box as="footer" bg="black" borderTopWidth="1px" borderColor="gray.700" py={8}>
        <Container maxW="1100px">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            justify="space-between"
            gap={6}
          >
            {/* Left: company info */}
            <Text color="gray.400" fontSize="sm">
              © {new Date().getFullYear()} {companyName}. All rights reserved.
            </Text>

            {/* Middle: callback CTA */}
            <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Text color="gray.300" fontWeight={600}>
                Not seeing your desired property?
              </Text>
              <Text color="gray.400" fontSize="sm">
                Book a callback now
              </Text>
              <Button colorScheme="brand" onClick={onOpen} size="sm">
                Book a callback
              </Button>
            </HStack>

            {/* Right: contact links */}
            <HStack spacing={6} mt={{ base: 4, md: 0 }}>
              <ChakraLink href={`tel:${contactPhone}`} color="white" _hover={{ color: 'blue.400' }}>
                {contactPhone}
              </ChakraLink>
              <ChakraLink href={`mailto:${contactEmail}`} color="white" _hover={{ color: 'blue.400' }}>
                {contactEmail}
              </ChakraLink>
            </HStack>
          </Flex>

          {/* Mobile CTA row below (visible on small screens) */}
          <Flex mt={6} display={{ base: 'flex', md: 'none' }} justify="center">
            <HStack spacing={3}>
              <Text color="gray.300" fontWeight={600}>
                Not seeing your desired property?
              </Text>
              <Button colorScheme="brand" onClick={onOpen} size="sm">
                Book a callback
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book a callback</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  placeholder="+91 98xxxx xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Message (optional)</FormLabel>
                <Input
                  placeholder="Preferred time, city, budget..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={submitViaMailto}>
              Request callback
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
