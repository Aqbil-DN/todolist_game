# 🎮 S.BRAIN - The Gamified Digital Second Brain

[![React Version](https://img.shields.io/badge/React-v19.2.6-blue?logo=react&logoColor=white)](https://react.dev/)
[![Vite Build](https://img.shields.io/badge/Vite-v8.0.12-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.3.0-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**S.BRAIN** (Second Brain Arcade Universe) is an immersive, retro-arcade-themed productivity ecosystem. Built to bridge the gap between routine management and high-octane gameplay, S.BRAIN transforms daily procrastination into high-score missions. With integrated RPG dynamics, custom-engineered pixel aesthetics, 3D physical cards, and advanced gacha mechanics, completing tasks isn't just efficient—it's highly rewarding.

---

## ✨ Fundamental Concepts & Core Pillars

S.BRAIN functions through four core, interconnected pillars that gamify the psychological loop of productivity:

### 📜 1. The Quest System (Level Clearing)
Traditional to-do lists lack stake. In S.BRAIN, every routine task is a high-stakes **Active Level**.
* **Bardify AI:** Leverages generative AI prompt-engineering to convert mundane entries ("Do laundry") into epic narrative quests ("The Purification of the Linen Void").
* **Tiered Rewards:** Success triggers dynamic XP Pellets & Score multipliers relative to the quest's difficulty tag (Focus, Work, Lore, Health).

### 🛡️ 2. The Focus Arena (Boss Battle)
A deeply gamified, distraction-blocking Focus Simulator. 
* **Immersion Protocol:** Activates a specialized Retro-Pomodoro cycle stylized as a Boss Fight.
* **Ghost Immunity:** Implements visual and auditory shields to safeguard users against distractions while timer loops represent defensive battle strategies.

### 🧪 3. The Energy Journal (Aura Alchemy)
Emotional energy directly governs output capacity. This system serves as a visual mood tracking mechanism.
* **Mood Translation:** Uses natural language processing models to parse journal inputs.
* **Stat Alignment:** Alchemizes the player's energetic aura into numeric RPG state effects (e.g., Focus +10, Stamina -5), tracking real-time patterns in mental reserves.

### 🔮 4. Neural Net Idols (Gacha Summoning)
The ultimate incentive loop. Players don't just accumulate XP; they invest it into digital asset summoning.
* **Gacha Terminal:** Burn collected XP to override the system mainframe and summon one of 15 distinct **Neural Net Idols**.
* **Card Physics:** Unlocked entities feature rare cryptographic holographic foils, distinct 3D flip mechanics with rear stats/lore decryption, and precision pixel-art framing.

---

## 🛠️ Tech Stack

* **Frontend Architecture:** [React 19](https://react.dev/) (React-DOM, Hooks, Context-driven states)
* **Build Orchestration:** [Vite 8](https://vitejs.dev/) (High-performance HMR, ESM bundling)
* **Navigation Layer:** [React Router DOM v7](https://reactrouter.com/)
* **Visual Framework:** [Tailwind CSS v4](https://tailwindcss.com/) + Embedded PostCSS architecture
* **Iconography:** [Lucide React](https://lucide.dev/)
* **Animation Matrix:** Custom CSS keyframes for 3D transforms, CRT screen scanning, Pac-man vectors, comic-shadows, and hardware-accelerated foil gradients.

---

## 📂 Project Architecture & Directory Structure

```plaintext
game_web/
├── public/                   # Static configuration assets
├── src/
│   ├── assets/               # Project media and static art assets
│   │   └── card_pull/        # Decrypted high-res pixel art for Idols (01-15)
│   │
│   ├── pages/                # Application view components
│   │   ├── Home.jsx          # Interactive landing terminal with prototype widgets
│   │   ├── Login.jsx         # Cyberpunk authentication terminal
│   │   ├── Register.jsx      # Digital uplink registration
│   │   ├── EnterSystem.jsx   # Post-auth bootloader sequence & animation
│   │   ├── Dashboard.jsx     # Central command hub, XP tiers & system overview
│   │   ├── Arena.jsx         # Boss-fight Focus timer / Pomodoro room
│   │   ├── Achievements.jsx  # Progression milestones & global trophies
│   │   ├── Notifications.jsx # Global broadcast network & quest updates
│   │   ├── Profile.jsx       # Character sheet, stat trees, and configurations
│   │   ├── HeroCollection.jsx# 3D holographic collection grid for summoned Idols
│   │   └── Gacha.jsx         # The Mainframe Decryptor / Summons portal
│   │
│   ├── App.jsx               # Global router definitions & core wrapping
│   ├── main.jsx              # React mounting entry-point
│   ├── App.css               # Modular animation declarations & styles
│   └── index.css             # Base design tokens & Tailwind utilities
│
├── index.html                # Master DOM node
├── vite.config.js            # Tooling & compilation parameters
├── package.json              # Manifest, dependencies, and scripts
└── README.md                 # Primary documentation
```

---

## 🚀 Getting Started / Installation

Follow these instructions to boot up the S.BRAIN mainframe locally.

### 📋 Prerequisites
Ensure you have **Node.js (v18.0.0 or newer)** and **npm** installed on your host system.

### 🔧 Setup Procedures

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/game_web.git
   cd game_web
   ```

2. **Install Mainframe Dependencies:**
   ```bash
   npm install
   ```

3. **Run in Development Mode:**
   ```bash
   npm run dev
   ```
   This starts the Vite development server. Open [http://localhost:5173](http://localhost:5173) in your browser to enter the arcade universe.

4. **Build for Production:**
   To compile optimization bundles for server hosting:
   ```bash
   npm run build
   ```
   Output binaries are stored in the `/dist` directory.

---

## 🎨 Design System Aesthetic

S.BRAIN uses a **"Neo-Retro Arcade"** system architecture characterized by:
* **CRT Scanning Filters:** Vintage CRT line gradients (`.crt::before`) for visual immersion.
* **Vibrant High-Contrast Neons:** A strict, curated palette utilizing `#5CE1E6` (Cyan), `#FF5DA2` (Pink), `#FFD60A` (Yellow), `#A3FF12` (Lime), and Deep Matrix Obsidian backgrounds.
* **Tactile Micro-Animations:** 3D perspective rotation variables, bouncy `.btn-comic` interactions, parallax mouse responses, and randomized glow oscillations.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
<p align="center">Developed with 💖 by the Digital Resistance. Stay Productive, Player One.</p>
