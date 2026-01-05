# Trampoline Easter Egg Minigame

A high-quality, interactive character animation minigame designed as an easter egg for websites. Built with React, Framer Motion, and Lottie.

## Features
- **Interactive Trampoline**: Click the trampoline to make the mascot bounce.
- **Dynamic Physics**: Subtle jumps on the first two bounces, followed by a high floaty jump on the third.
- **Lottie Animations**: Smooth transitions between idle and jumping states using After Effects exports.
- **Responsive & Tiny**: Designed to fit seamlessly into any part of a website.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the local development server:
```bash
npm run dev
```

### Building for Production
Create a production-ready build in the `dist/` folder:
```bash
npm run build
```

## Deployment
This project is ready to be hosted on **GitHub Pages**, Vercel, or Netlify. Since it uses standard ESM and Vite, just point your deployment service to the repository and set the build command to `npm run build` with the output directory as `dist`.

## License
MIT