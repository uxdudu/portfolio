import { defineField, defineType } from "sanity";

export const portfolioProject = defineType({
  name: "portfolioProject",
  title: "Projeto",
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
      name: "id",
      title: "ID",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "group",
      title: "Grupo",
      type: "string",
      options: {
        list: [
          { title: "Portfólio", value: "portfolio" },
          { title: "Clinia", value: "clinia" },
          { title: "Petrobras", value: "petrobras" },
        ],
      },
      initialValue: "portfolio",
    }),
    defineField({
      name: "featured",
      title: "Destaque na Home",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Ordem",
      type: "number",
      initialValue: 100,
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
    }),
    defineField({
      name: "eyebrowEn",
      title: "Eyebrow (EN)",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Descrição curta",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "descriptionEn",
      title: "Descrição curta (EN)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "summary",
      title: "Resumo para catálogo",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "summaryEn",
      title: "Resumo para catálogo (EN)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "href",
      title: "URL interna",
      type: "string",
      description: "Exemplo: /cases/clinia",
    }),
    defineField({
      name: "tags",
      title: "Tags da capa",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: "tagsEn",
      title: "Tags da capa (EN)",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: "type",
      title: "Tipo",
      type: "string",
      options: {
        list: ["Web app", "App", "Blog", "Site"],
      },
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
      name: "deliverables",
      title: "Entregáveis",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: ["UI/UX", "Design System", "Motion", "No code", "AI"],
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "status",
    },
  },
});
