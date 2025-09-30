// src/app/about/page.tsx
import { Box, Container, Flex, Heading, Text, VStack, HStack, Button, SimpleGrid } from "@chakra-ui/react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+918891143812";

async function fetchListingImages() {
  let urls: string[] = [];
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("main_image_url")
      .limit(3); // ✅ only fetch 3 images

    if (!error && data) {
      urls = data.map((p) => p.main_image_url).filter(Boolean) as string[];
    }
  } catch (err) {
    console.error("Error fetching listing images for About page:", err);
  }
  return urls;
}

export default async function AboutPage() {
  const images = await fetchListingImages();

  return (
    <Box bg="black" color="white" minH="100vh" py={12}>
      <Container maxW="1100px">
        {/* Logo + Intro */}
        <Flex align="center" gap={6} mb={10} wrap="wrap">
          <Box flexShrink={0} w="120px" h="120px" position="relative">
            <Image
              src="/logo.png"
              alt="ARK Infra Logo"
              fill
              style={{ objectFit: "contain" }} // ✅ no cropping
              priority
            />
          </Box>
          <VStack align="start" spacing={2}>
            <Heading as="h1" size="xl" fontWeight={800}>
              ARK Infra
            </Heading>
            <Text fontSize="lg" color="gray.300">
              Premium real estate
            </Text>
          </VStack>
        </Flex>

        {/* About text */}
        <Heading as="h2" size="lg" mb={4}>
          About ARK Infra
        </Heading>
        <VStack align="start" spacing={4} maxW="700px" mb={10}>
          <Text color="gray.300">
            At ARK Infra, we specialise in presenting premium residential and commercial properties
            with an emphasis on photographic storytelling and international standards. Our team of
            experienced architects, interior stylists and marketing creatives ensure every listing
            looks its best and reaches the right audience.
          </Text>
          <Text color="gray.300">
            We handle property scouting, professional photography, listing curation and buyer
            engagement — making the selling and leasing experience seamless for owners and
            straightforward for buyers.
          </Text>
          <Text color="gray.300">
            Whether you are looking for a high-end apartment, a well-located villa or a commercial
            space with pedigree, we guide you through discovery, viewings and negotiations with
            transparency and local expertise.
          </Text>
        </VStack>

        {/* WhatsApp button */}
        <Button
          as="a"
          href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(
            "Hello, I'm interested in learning more about ARK Infra."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          size="lg"
          bg="green.600"
          _hover={{ bg: "green.700" }}
          mb={12}
        >
          Chat on WhatsApp
        </Button>

        {/* Work Images */}
        <Heading as="h3" size="md" mb={4}>
          Our work
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {images.slice(0, 3).map((url, idx) => (
            <Box key={idx} borderRadius="md" overflow="hidden" position="relative" height="220px">
              <Image
                src={url}
                alt={`Listing ${idx + 1}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          ))}
        </SimpleGrid>

        {/* Address */}
        <Box mt={12}>
          <Heading as="h4" size="sm" mb={2}>
            Office
          </Heading>
          <Text color="gray.400">
            New Akash Nagar, Stage 3 <br />
            Indiranagar, Bengaluru, Karnataka 560008
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
