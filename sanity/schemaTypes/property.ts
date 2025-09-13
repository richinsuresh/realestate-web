// sanity/schemas/property.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "property",
  title: "Property",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Full description shown on the property detail page",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short description shown in listings cards",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "image",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "images",
      title: "Gallery Images",
      type: "array",
      of: [
        defineField({
          name: "imageItem",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "City, neighborhood or area (shown on the map)",
    }),
    defineField({
      name: "coordinates",
      title: "Coordinates",
      type: "geopoint",
      description: "Optional latitude/longitude for more accurate map placement",
    }),
  ],
});
