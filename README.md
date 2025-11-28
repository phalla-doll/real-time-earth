# 🌍 Real-Time Earth 3D

A high-fidelity 3D Earth visualization that rotates in real-time synchronized with UTC. Features solar and sidereal rotation modes, atmospheric clouds, and accurate axial tilt (23.4°).

Built with React, Three.js, and TypeScript for an immersive, scientifically accurate Earth viewing experience.

---

## ✨ Features

- **🕐 Real-Time UTC Synchronization** - Earth rotates in perfect sync with actual UTC time at 1x speed
- **🌞 Dual Rotation Modes**
  - **Solar Day** (86,400s) - Rotation relative to the Sun
  - **Sidereal Day** (86,164s) - Rotation relative to fixed stars
- **⚡ Adjustable Speed** - Choose from 1x, 3x, 5x, or 10x rotation speeds
- **☁️ Atmospheric Cloud Layer** - Dynamic cloud layer with wind simulation (UV scrolling)
- **🌐 Earth's Axial Tilt** - Accurate 23.4° axial tilt visualization
- **🎮 Interactive 3D Controls** - Orbit, zoom, and explore with mouse/touch controls
- **🌃 Night Lights** - City lights visible on the dark side of Earth
- **🎨 High-Quality Textures**
  - 2048x2048 diffuse (color) map
  - Normal map for surface detail
  - Specular map for water reflections
  - Cloud alpha map
  - Night lights emission map

---

## 🛠️ Technology Stack

- **[React](https://react.dev/)** `19.2.0` - UI framework
- **[Three.js](https://threejs.org/)** `0.181.2` - 3D graphics library
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** `9.4.0` - React renderer for Three.js
- **[React Three Drei](https://github.com/pmndrs/drei)** `10.7.7` - Useful helpers for R3F
- **[TypeScript](https://www.typescriptlang.org/)** `5.8.2` - Type safety
- **[Vite](https://vitejs.dev/)** `6.2.0` - Build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling (via CDN)

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-time-earth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

5. **Build for production** (optional)
   ```bash
   npm run build
   npm run preview
   ```

---

## 📖 Usage Guide

### Controls

- **Orbit**: Click and drag to rotate the camera around Earth
- **Zoom**: Scroll or pinch to zoom in/out
- **Pan**: Disabled (to maintain focus on Earth)

### Control Panel

**Rotation Reference**
- **SOLAR** - Earth rotates relative to the Sun (24-hour day)
- **SIDEREAL** - Earth rotates relative to fixed stars (~23h 56m)

**Rotation Speed**
- **1x** - Real-time UTC synchronization (actual Earth rotation speed)
- **3x, 5x, 10x** - Accelerated rotation for visualization (multiplied by 1000x for visibility)

**Toggles**
- **Auto Rotate** - Enable/disable automatic rotation
- **Atmosphere** - Show/hide cloud layer
- **Show Axis** - Display Earth's rotational axis (red line)

### Status Indicators

- **LIVE UTC SYNC ACTIVE** - Running at real-time speed (1x)
- **SIMULATION SPEED Nx** - Running at accelerated speed
- **ROTATION PAUSED** - Auto-rotate is disabled

---

## 📁 Project Structure

```
real-time-earth/
├── components/
│   ├── RealTimeGlobe.tsx    # Main Earth component with rotation logic
│   └── Sun.tsx              # Directional light source (Sun)
├── App.tsx                  # Main application with UI and state management
├── types.ts                 # TypeScript types and physical constants
├── constants.ts             # Texture URLs and configuration
├── index.tsx                # React entry point
├── index.html               # HTML template with Tailwind CDN
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

### Key Files

- **`RealTimeGlobe.tsx`** - Handles Earth rendering, texture loading, rotation physics, and cloud animation
- **`App.tsx`** - Main UI, state management, and control panel
- **`types.ts`** - Defines rotation modes, Earth state interface, and physical constants (solar/sidereal day lengths, axial tilt)
- **`constants.ts`** - Texture URLs from Three.js examples and three-globe repository

---

## 🔬 Technical Details

### Rotation Physics

**Solar Day (24 hours)**
- Duration: 86,400 seconds
- Rotation relative to the Sun
- What we experience as a "day" on Earth

**Sidereal Day (~23h 56m)**
- Duration: 86,164.0905 seconds
- Rotation relative to distant stars
- True rotational period of Earth

**Real-Time Mode (1x speed)**
- Uses `Date.now()` to get current UTC time in milliseconds
- Calculates rotation angle based on elapsed time since Unix epoch
- Ensures Earth's rotation stays synchronized with actual UTC time

**Accelerated Mode (3x, 5x, 10x)**
- Applies a 1000x visual multiplier for perceptible rotation
- 3x button → ~3000x actual speed (~30s per rotation)
- 10x button → ~10,000x actual speed (~8.6s per rotation)

### Axial Tilt

Earth's rotational axis is tilted at **23.439°** (23.4°) relative to its orbital plane, accurately represented in the visualization.

### Textures

All textures are sourced from publicly available CDNs:
- **Diffuse, Normal, Specular, Clouds**: [Three.js Examples](https://threejs.org/examples/)
- **Night Lights**: [vasturiano/three-globe](https://github.com/vasturiano/three-globe)

---

## 📜 License

This project uses textures from Three.js examples and the three-globe repository. Please refer to their respective licenses for texture usage.

---

## 🙏 Credits

- **Textures**: Three.js community and [Vasco Asturiano](https://github.com/vasturiano)
- **Libraries**: React, Three.js, React Three Fiber, React Three Drei

---

## 🌐 View Live

View your app in AI Studio: https://ai.studio/apps/drive/1Sj-yYXfNjCzmJrjurKdhVLONHB9Qv7yI

---

**Made with ❤️ using React, Three.js, and TypeScript**
