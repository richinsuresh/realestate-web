// src/lib/properties.ts
export type Property = {
  id: string;
  title: string;
  price: number; // price in rupees (integer)
  type: "Apartment" | "Villa" | "Office" | "Studio";
  bedrooms: number;
  location: string;
  description?: string;
  images: string[]; // relative to /public
};

export const properties: Property[] = [
  {
    id: "p1",
    title: "Skyline 2BHK Apartment",
    price: 7500000,
    type: "Apartment",
    bedrooms: 2,
    location: "Central City",
    description: "Bright 2BHK with balcony and city view. Modern kitchen, 2 baths.",
    images: ["/properties/p1/1.jpg", "/properties/p1/2.jpg", "/properties/p1/3.jpg"],
  },
  {
    id: "p2",
    title: "Seaside Luxury Villa",
    price: 25000000,
    type: "Villa",
    bedrooms: 4,
    location: "Seaside",
    description: "Spacious villa with garden, pool and private parking.",
    images: ["/properties/p2/1.jpg", "/properties/p2/2.jpg", "/properties/p2/3.jpg"],
  },
  {
    id: "p3",
    title: "Urban Studio",
    price: 3200000,
    type: "Studio",
    bedrooms: 1,
    location: "Downtown",
    description: "Compact studio ideal for young professionals. Great location.",
    images: ["/properties/p3/1.jpg", "/properties/p3/2.jpg"],
  },
  {
    id: "p4",
    title: "Business Park Office",
    price: 12000000,
    type: "Office",
    bedrooms: 0,
    location: "Business Park",
    description: "Open-plan office space with high ceilings and natural light.",
    images: ["/properties/p4/1.jpg", "/properties/p4/2.jpg"],
  },
  {
    id: "p5",
    title: "Green Meadows 3BHK",
    price: 11000000,
    type: "Apartment",
    bedrooms: 3,
    location: "Green Meadows",
    description: "Family-friendly 3BHK near parks and schools.",
    images: ["/properties/p5/1.jpg", "/properties/p5/2.jpg", "/properties/p5/3.jpg"],
  },
  {
    id: "p6",
    title: "Penthouse Royale",
    price: 45000000,
    type: "Apartment",
    bedrooms: 5,
    location: "Uptown",
    description: "Top-floor penthouse with panoramic city views and private lift.",
    images: ["/properties/p6/1.jpg", "/properties/p6/2.jpg", "/properties/p6/3.jpg"],
  },
];
