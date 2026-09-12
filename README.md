# Tamizh Mani V — Software Engineer Portfolio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-blue?style=for-the-badge&logo=vercel)](https://my-portfolio-six-amber-edaxizetpv.vercel.app/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

A modern, high-performance developer portfolio website built with **React 19**, **Vite**, and **Vanilla CSS**. Designed with a glassmorphic aesthetic, smooth micro-interactions, dynamic GitHub API synchronization, an interactive certifications showcase, and particle animations.

---

## 🚀 Live Demo

Check out the live deployment here:  
👉 **[https://my-portfolio-six-amber-edaxizetpv.vercel.app/](https://my-portfolio-six-amber-edaxizetpv.vercel.app/)**

---

## ✨ Features

- **🎨 Modern Glassmorphic UI**: Custom design system featuring glowing ambient gradients, glass cards, and fluid typography.
- **🌌 Interactive Background & Animations**: Dynamic HTML5 canvas particles background, trailing multi-colored custom dot cursor, and smooth scroll reveal effects.
- **🚀 Dynamic Project Sync**: Automatically fetches recent public repositories via the GitHub REST API with fallback to offline project showcases.
- **📜 Certifications & Achievements Hub**: Dedicated gallery with tag filtering (Cloud, Full-Stack, Security, Database, DevOps, Programming) and detailed credential view modals.
- **🧭 Lightweight Hash Routing**: Client-side hash navigation (`#/`, `#/projects`, `#/certifications`, `#/about`, `#/contact`) with instant URL state management and keyboard shortcuts (press `P` to jump to projects).
- **📱 Fully Responsive Layout**: Built with a desktop & mobile responsive navigation menu.
- **📬 Contact Integration**: Interactive contact form with input validation and feedback state.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 19, JSX, ES Modules
- **Build Tooling & HMR**: Vite 8, `@vitejs/plugin-react`
- **Styling & Aesthetics**: Vanilla CSS3 (Custom Properties, Flexbox, CSS Grid, Glassmorphism backdrop-filters)
- **Linting & Code Quality**: Oxlint
- **Icons & Assets**: Custom SVG assets and static image assets
- **Deployment Platform**: Vercel

---

## 📁 Project Structure

```
my_portfolio/
├── public/
│   ├── certificates/        # Certificate image assets
│   └── images/              # Portfolio logo and branding assets
├── src/
│   ├── components/
│   │   ├── CertificateModal.jsx   # Modal for detailed certification view
│   │   ├── CertificationsPage.jsx # Certifications gallery with category filters
│   │   ├── ContactForm.jsx        # Interactive contact form component
│   │   ├── ParticlesBg.jsx        # HTML5 Canvas floating particles animation
│   │   ├── ProjectCard.jsx        # Card representation for project showcase
│   │   ├── ProjectModal.jsx       # Modal for full project details & repo links
│   │   └── Typewriter.jsx         # Dynamic typewriter text effect
│   ├── App.css                    # Component specific styles
│   ├── App.jsx                    # Core application layout, routing & state
│   ├── index.css                  # Design system tokens & global styling
│   └── main.jsx                   # React application entry point
├── index.html                     # HTML root template
├── package.json                   # Project dependencies and npm scripts
├── vite.config.js                 # Vite bundler configuration
└── README.md                      # Public project documentation
```

---

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Tamizh-code/my_portfolio.git
   cd my_portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Development

Run the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Production Build

To compile and bundle the production-ready assets:

```bash
npm run build
```

The output files will be generated in the `dist/` directory.

### Preview Build

To test the production build locally:

```bash
npm run preview
```

### Code Linting

Run Oxlint to check for code quality and syntax errors:

```bash
npm run lint
```

---

## 📄 Documentation

For full technical specifications, architecture decisions, component design, and detailed project documentation, see [PROJECT_DOCUMENTATION.md](file:///c:/Users/Admin/Documents/DEVLOPMENT/KNOWLEDGE/PROJECTS/ENAHANCEMENT/my_portfolio/PROJECT_DOCUMENTATION.md).

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
