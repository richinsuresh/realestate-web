// src/lib/getProperties.ts
import { sanityClient } from "./sanity";

/**
 * Fetch properties from Sanity and normalize them
 */
export async function getProperties() {
  const query = `*[_type == "property"] | order(publishedAt desc){
    _id,
    title,
    location,
    type,
    price,
    bedrooms,
    description,
    slug,
    images[]{asset->{_id, url}},
  }`;

  const data = await sanityClient.fetch(query);

  return data.map((d: any) => ({
    id: d._id,
    slug: d.slug?.current ?? d._id,
    title: d.title,
    location: d.location,
    type: d.type,
    price: d.price,
    bedrooms: d.bedrooms,
    description: d.description,
    images: (d.images || []).map((img: any) => img?.asset?.url).filter(Boolean),
  }));
}
