// src/app/admin/properties/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Textarea,
  VStack,
  SimpleGrid,
  Image,
  Text,
  Flex,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { supabase } from "@/lib/supabaseClient";

type PropertyRow = {
  id: string;
  title: string;
  tagline?: string | null;
  description?: string | null;
  location?: string | null;
  price?: number | null;
  main_image_url?: string | null;
  slug?: string | null;
  created_at?: string | null;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Upload helpers
 *
 * IMPORTANT:
 * - This helper assumes the bucket already exists.
 * - It returns **public URLs** (not raw paths) and logs clear errors if bucket missing.
 */

const STORAGE_BUCKET = "property-images";

async function bucketExists(bucket = STORAGE_BUCKET) {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error("Error listing buckets:", error.message);
      return false;
    }
    return buckets?.some((b) => b.id === bucket) ?? false;
  } catch (err) {
    console.error("Unexpected error listing buckets:", err);
    return false;
  }
}

// Upload multiple files and return array of public URLs (in same order)
async function uploadFilesToStorage(bucket = STORAGE_BUCKET, files?: File[] | null) {
  if (!files || files.length === 0) return [];

  // Check bucket exists
  const exists = await bucketExists(bucket);
  if (!exists) {
    throw new Error(`Storage bucket "${bucket}" not found. Create it in Supabase Storage -> Buckets.`);
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const safeName = file.name.replace(/\s+/g, "_");
    const filePath = `properties/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
      upsert: true,
    });

    if (uploadError) {
      console.error("Upload error:", uploadError.message, uploadError);
      // skip this file but continue others
      continue;
    }

    const { data: publicData, error: publicErr } = supabase.storage.from(bucket).getPublicUrl(filePath);
    if (publicErr) {
      console.error("getPublicUrl error:", publicErr.message);
      continue;
    }
    if (!publicData?.publicUrl) {
      console.error("No publicUrl returned for:", filePath);
      continue;
    }
    uploadedUrls.push(publicData.publicUrl);
  }

  return uploadedUrls;
}

// ------------------- MAIN COMPONENT -------------------

export default function AdminPropertiesPage() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<any | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Create form state
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState<number | undefined>();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Edit modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<PropertyRow | null>(null);
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editLoading, setEditLoading] = useState(false);

  // SESSION CHECK
  useEffect(() => {
    let mounted = true;
    async function check() {
      setLoadingSession(true);
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session ?? null;
        if (!session) {
          router.push("/admin/login");
          return;
        }
        if (mounted) setUser(session.user);
      } catch {
        router.push("/admin/login");
      } finally {
        if (mounted) setLoadingSession(false);
      }
    }
    check();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, _session) => {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          router.push("/admin/login");
        } else {
          setUser(data.session.user);
        }
      });
    });
    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, [router]);

  // FETCH PROPERTIES
  async function fetchProperties() {
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("id, title, tagline, description, location, price, main_image_url, slug, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (!error && data) {
      setProperties(data as PropertyRow[]);
    } else if (error) {
      console.error("Error fetching properties:", error.message);
      toast({ title: "Unable to load properties", status: "error", duration: 4000 });
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!loadingSession) fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingSession]);

  // CREATE property with multiple images
  async function handleUploadAndCreate() {
    if (!title.trim()) {
      toast({ title: "Title is required", status: "warning" });
      return;
    }

    setUploading(true);
    try {
      let imageUrls: string[] = [];

      if (files && files.length > 0) {
        try {
          imageUrls = await uploadFilesToStorage(STORAGE_BUCKET, files);
        } catch (err: any) {
          toast({ title: "Upload failed", description: err.message, status: "error" });
          setUploading(false);
          return;
        }
      }

      const slug = slugify(title) || `property-${Date.now()}`;

      // insert property and store **public URLs**
      const { data: inserted, error: insertError } = await supabase
        .from("properties")
        .insert([
          {
            title: title.trim(),
            tagline: tagline?.trim() || null,
            description: description.trim() || null,
            location: location.trim() || null,
            price: price ?? null,
            main_image_url: imageUrls[0] ?? null, // first image as main (full public URL)
            slug,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError.message);
        toast({ title: "Failed to create property", status: "error" });
      } else {
        // Save remaining images to property_images using full public URLs
        if (inserted && imageUrls.length > 1) {
          const imageRows = imageUrls.map((url, i) => ({
            property_id: inserted.id,
            image_url: url,
            display_order: i,
          }));
          const { error: imgsErr } = await supabase.from("property_images").insert(imageRows);
          if (imgsErr) {
            console.error("Error inserting property_images:", imgsErr.message);
          }
        }

        // reset
        setTitle("");
        setTagline("");
        setDescription("");
        setLocation("");
        setPrice(undefined);
        setFiles([]);

        toast({ title: "Property created", status: "success" });
        fetchProperties();
      }
    } catch (err: any) {
      console.error("Unexpected error creating property:", err);
      toast({ title: "Unexpected error", description: String(err), status: "error" });
    } finally {
      setUploading(false);
    }
  }

  // OPEN EDIT modal
  function openEditModal(row: PropertyRow) {
    setEditing(row);
    setEditFiles([]);
    onOpen();
  }

  // UPDATE property and optionally upload new images (append to property_images)
  async function handleUpdateProperty() {
    if (!editing) return;
    setEditLoading(true);

    try {
      let imageUrls: string[] = [];
      if (editFiles && editFiles.length > 0) {
        try {
          imageUrls = await uploadFilesToStorage(STORAGE_BUCKET, editFiles);
        } catch (err: any) {
          toast({ title: "Upload failed", description: err.message, status: "error" });
          setEditLoading(false);
          return;
        }
      }

      const newSlug = editing.slug?.trim() || slugify(editing.title || "") || `property-${Date.now()}`;

      const { error } = await supabase
        .from("properties")
        .update({
          title: editing.title,
          tagline: editing.tagline ?? null,
          description: editing.description ?? null,
          location: editing.location ?? null,
          price: editing.price ?? null,
          main_image_url: imageUrls[0] ?? editing.main_image_url ?? null,
          slug: newSlug,
        })
        .eq("id", editing.id);

      if (error) {
        console.error("Update error:", error.message);
        toast({ title: "Update failed", status: "error" });
      } else {
        // append new image rows if there are any
        if (editing.id && imageUrls.length > 0) {
          const imageRows = imageUrls.map((url, i) => ({
            property_id: editing.id,
            image_url: url,
            display_order: i,
          }));
          const { error: imgsErr } = await supabase.from("property_images").insert(imageRows);
          if (imgsErr) {
            console.error("Error inserting property_images:", imgsErr.message);
          }
        }

        toast({ title: "Property updated", status: "success" });
        fetchProperties();
        onClose();
      }
    } catch (err: any) {
      console.error("Unexpected error updating property:", err);
      toast({ title: "Unexpected error", description: String(err), status: "error" });
    } finally {
      setEditLoading(false);
    }
  }

  // DELETE property
  async function handleDeleteProperty(id: string) {
    const ok = window.confirm("Delete this property?");
    if (!ok) return;

    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error.message);
      toast({ title: "Delete failed", status: "error" });
    } else {
      toast({ title: "Property deleted", status: "info" });
      fetchProperties();
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (loadingSession) {
    return (
      <Container maxW="4xl" py={10}>
        <Flex align="center" justify="center" minH="40vh">
          <Spinner size="lg" />
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Admin — Properties</Heading>
        <HStack spacing={3}>
          <Text fontSize="sm" color="gray.600">
            {user?.email}
          </Text>
          <Button colorScheme="red" size="sm" onClick={handleSignOut}>
            Logout
          </Button>
        </HStack>
      </HStack>

      {/* Create form */}
      <Box mb={8} borderWidth="1px" borderRadius="md" p={4}>
        <Heading size="sm" mb={4}>
          Add new property
        </Heading>

        <VStack spacing={3} align="stretch">
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>Tagline</FormLabel>
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Price (INR)</FormLabel>
              <Input type="number" value={price ?? ""} onChange={(e) => setPrice(Number(e.target.value || 0))} />
            </FormControl>

            <FormControl>
              <FormLabel>Images</FormLabel>
              <Input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
              <Text fontSize="xs" color="gray.500">You can select multiple files.</Text>
            </FormControl>
          </SimpleGrid>

          <HStack>
            <Button colorScheme="blue" onClick={handleUploadAndCreate} isLoading={uploading}>
              Create property
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Properties list */}
      <Heading size="md" mb={3}>
        Existing properties
      </Heading>

      {loading ? (
        <Box><Text>Loading…</Text></Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {properties.map((p) => (
            <Box key={p.id} borderWidth="1px" borderRadius="md" p={3}>
              <HStack spacing={3} align="start">
                <Box minW="120px" maxW="160px" height="100px" bg="gray.50" borderRadius="md" overflow="hidden">
                  {p.main_image_url ? (
                    // Chakra Image accepts remote urls; Next/Image not used here for admin list
                    <Image src={p.main_image_url} alt={p.title} objectFit="cover" width="100%" height="100%" />
                  ) : (
                    <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
                      <Text fontSize="sm" color="gray.500">No image</Text>
                    </Box>
                  )}
                </Box>

                <Box flex="1">
                  <Heading size="sm">{p.title}</Heading>
                  <Text fontSize="sm" color="gray.600">{p.tagline}</Text>
                  <Text>{p.location}</Text>
                  <Text fontWeight="bold">{typeof p.price === "number" ? `₹${p.price.toLocaleString("en-IN")}` : "—"}</Text>
                  <Text fontSize="xs" color="gray.400">{p.created_at ? new Date(p.created_at).toLocaleString() : ""}</Text>

                  <HStack spacing={2} mt={3}>
                    <Button size="sm" onClick={() => openEditModal(p)}>Edit</Button>
                    <Button size="sm" colorScheme="red" onClick={() => handleDeleteProperty(p.id)}>Delete</Button>
                  </HStack>
                </Box>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => { setEditing(null); onClose(); }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit property</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editing ? (
              <VStack spacing={3} align="stretch">
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </FormControl>

                <FormControl>
                  <FormLabel>Slug</FormLabel>
                  <Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input type="number" value={editing.price ?? ""} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value || 0) })} />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Additional images (add more)</FormLabel>
                    <Input type="file" accept="image/*" multiple onChange={(e) => setEditFiles(Array.from(e.target.files ?? []))} />
                    <Text fontSize="xs" color="gray.500" mt={1}>You can append more images to this property.</Text>
                  </FormControl>
                </SimpleGrid>
              </VStack>
            ) : null}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={() => { setEditing(null); setEditFiles([]); onClose(); }}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleUpdateProperty} isLoading={editLoading}>
              Save changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
