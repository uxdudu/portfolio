import { defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Título (EN)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "client",
      title: "Cliente",
      type: "string",
    }),
    defineField({
      name: "role",
      title: "Função",
      type: "string",
    }),
    defineField({
      name: "roleEn",
      title: "Função (EN)",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
    }),
    defineField({
      name: "statusEn",
      title: "Status (EN)",
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Ordem",
      type: "number",
      initialValue: 100,
    }),
    defineField({
      name: "summary",
      title: "Resumo",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "summaryEn",
      title: "Resumo (EN)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "stack",
      title: "Stack",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "stackEn",
      title: "Stack (EN)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "sections",
      title: "Seções",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
            defineField({ name: "title", title: "Título", type: "string" }),
            defineField({
              name: "body",
              title: "Parágrafos",
              type: "array",
              of: [{ type: "text" }],
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "eyebrow",
            },
          },
        },
      ],
    }),
    defineField({
      name: "sectionsEn",
      title: "Seções (EN)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
            defineField({ name: "title", title: "Título", type: "string" }),
            defineField({
              name: "body",
              title: "Parágrafos",
              type: "array",
              of: [{ type: "text" }],
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "eyebrow",
            },
          },
        },
      ],
    }),
    defineField({
      name: "evidence",
      title: "Evidências",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Título", type: "string" }),
            defineField({ name: "caption", title: "Legenda", type: "string" }),
            defineField({ name: "image", title: "Imagem", type: "image" }),
          ],
          preview: {
            select: {
              title: "title",
              media: "image",
            },
          },
        },
      ],
    }),
    defineField({
      name: "testimonials",
      title: "Depoimentos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "quote",
              title: "Depoimento",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "quoteEn",
              title: "Depoimento (EN)",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "author",
              title: "Nome",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "role", title: "Cargo", type: "string" }),
            defineField({ name: "roleEn", title: "Cargo (EN)", type: "string" }),
            defineField({ name: "company", title: "Empresa", type: "string" }),
          ],
          preview: {
            select: {
              title: "author",
              subtitle: "company",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "client",
    },
  },
});
