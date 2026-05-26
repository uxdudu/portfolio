# 🖥️ Eduardo Amaral — Portfolio

A modern, interactive, and premium portfolio website for **Eduardo Amaral**, showcasing expertise in **Product Design**, **Frontend Development**, and **AI integrations**.

Live at: [eduardoamaral.me](https://eduardoamaral.me)

---

## ✨ Features

- 🌐 **Internationalization (i18n)**: Fully translated into Portuguese (`pt-BR`) and English (`en`) with context preservation.
- 📄 **Standalone CV (Print-Ready)**: Standalone curriculum vitae pages at `/cv/pt` and `/cv/en` built with Standalone early routing. Optimized for print and PDF saving (no site headers/footers in print mode, custom Geist typography).
- ✉️ **Contact Form & Toast Notification**: Contact form powered by FormSubmit that redirects back and displays a smooth, animated success toast notification using Framer Motion.
- 🎨 **Premium Visuals**: Dark mode and light mode options with smooth glassmorphism effects, radial background gradients, and micro-interactions.
- 🚀 **Performance & Motion**: Smooth scrolling powered by **Lenis** and premium animations powered by **Framer Motion** (`motion/react`), with support for `prefers-reduced-motion` accessibility standards.

---

## 🛠️ Technology Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion / Motion](https://motion.dev/)
- **Smooth Scroll**: [Lenis Scroll](https://lenis.darkroom.engineering/)
- **CMS (Seeding)**: [Sanity.io](https://www.sanity.io/) (configured for portfolio content storage)
- **Deployment**: [Vercel](https://vercel.com/) (Speed Insights integrated)

---

## 📂 Project Structure

```text
├── public/
│   └── favicon.png         # New custom site favicon (avatar portrait)
├── src/
│   ├── assets/             # Brand logos (Clinia, Talqui, Petrobras), images, and graphics
│   ├── lib/                # Client state, sanity queries, and helper hooks
│   ├── App.tsx             # Main router, pages (Home, About, Cases, standalone CV, Contact), and state
│   ├── main.tsx            # App entry point
│   └── styles.css          # Core custom styles, print overrides, and custom CSS variables
├── index.html              # HTML shell linking font configurations and assets
├── package.json            # Node project configuration and dependencies
└── vite.config.ts          # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/uxdudu/portfolio.git
   cd portfolio
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the local development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser to view the application.

### Build & Production

Build the optimized production bundle:
```bash
npm run build
```
The output files will be generated in the `dist` directory, ready to be served or hosted.
