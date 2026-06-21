# 🌳 Carbon Tree

Carbon Tree is a premium, interactive, and gamified carbon footprint calculator and tracker. It is designed to empower individuals and organizations to measure, track, and systematically reduce their environmental footprint to help reach net-zero emissions.

The application features a sleek, responsive, glassmorphic design styled with a custom-themed palette (Eco Green, Forest Deep, Leaf Light, and Bark Gray) to provide a premium and visually engaging user experience.

---

## ✨ Features

- **🌐 Interactive Carbon Footprint Calculator**:
  - A step-by-step questionnaire evaluating personal impact across key lifestyle areas (Transportation, Home Energy, Diet/Food, and Lifestyle/Shopping).
  - Visual output summarizing annual emissions in kilograms/tonnes of $CO_2$ and the equivalent number of trees needed to offset it (based on a standard absorption rate of 22 kg $CO_2$/tree).
- **🎮 Weekly Gamified Challenges**:
  - Structured, 7-day sustainability quests such as *Eco Thermostat Warrior*, *Active Commute Champion*, *Plant-Powered Week*, and *Zero-Single-Use Quest*.
  - Daily checkboxes to track progress, earn category-specific badges, and watch virtual community follower counts grow.
- **📈 Historical Progress Tracking**:
  - A dashboard showcasing a visual log of past calculator results to track personal progress and reduction trends over time.
- **📖 Rich Sustainability Resources**:
  - **Methodology**: Detailed documentation of emission calculation factors and global baselines.
  - **Climate Blog**: Direct insights on carbon-reduction habits.
  - **Carbon Offset Guide**: Actionable guidance on tree-planting and carbon offsetting.
- **🔒 Privacy-First Local & Sync Modes**:
  - **Guest Mode (Local)**: Runs entirely client-side without storing personal data on servers.
  - **Cloud Sync Mode**: Uses Firebase Authentication and Firestore to securely save assessment history and challenges progress across devices.

---

## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- **Routing**: [React Router (v7)](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (configured via HTML configuration) + CSS custom variables for advanced theming, responsive layouts, and glassmorphic micro-animations.
- **Icons**: [Lucide React](https://lucide.dev/) & [Google Material Symbols Outlined](https://fonts.google.com/icons)
- **Database & Auth**: [Firebase SDK v12](https://firebase.google.com/) (Authentication & Cloud Firestore)
- **Testing**: [Playwright](https://playwright.dev/) (End-to-End browser testing suite)

---

## 📂 Project Structure

```
carbon-foot-print/
├── src/
│   ├── assets/              # Static media and graphics
│   ├── components/          # React components
│   │   ├── UI/              # Shared UI inputs (CustomSlider, Toggle, IconCard)
│   │   ├── About.tsx        # Mission and Team Info
│   │   ├── Calculator.tsx   # Carbon Calculator Questionnaire & results logic
│   │   ├── Challenges.tsx   # Weekly gamified challenges dashboard
│   │   ├── HistoryDashboard.tsx  # Interactive list of past calculator entries
│   │   └── Resources.tsx    # Methodology, Blog, and Carbon Offset pages
│   ├── config/
│   │   └── firebase.ts      # Firebase configuration & initialization
│   ├── context/
│   │   └── AuthContext.tsx  # User auth state (Firebase & Guest modes)
│   ├── data/
│   │   ├── challengesData.ts # Data structures for gamified challenges
│   │   └── questions.ts     # Questionnaire steps & emission factors
│   ├── utils/
│   │   ├── calculator.ts    # Mathematical formulas for carbon footprint
│   │   ├── challengesService.ts # Firestore integration for weekly challenges
│   │   └── firebaseService.ts   # Firestore integration for historical runs
│   ├── App.tsx              # Main Layout, Navigation, and Router
│   ├── main.tsx             # Application entrypoint
│   └── index.css            # Core global typography and animations
├── tests/                   # Playwright E2E test specs
│   ├── about.spec.js
│   ├── auth.spec.js
│   ├── calculator.spec.js
│   ├── challenges.spec.js
│   └── footer.spec.js
├── index.html               # Custom HTML wrapper, fonts, and Tailwind configuration
├── package.json             # Build commands and dependencies
└── playwright.config.js     # Playwright configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+) and **npm** installed on your machine.

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   cd carbon-foot-print
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

### Environment Configuration (Firebase Integration)

The application automatically runs in **Local Guest Mode** if Firebase is not configured. To save carbon reports and track challenge histories across logins, configure Firebase:

1. Copy the example environment file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and replace the placeholder credentials with your Firebase Web App configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_real_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

---

## 💻 Running the App

### Development Server
Start the application in local development mode:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Production Build
Generate a compiled production bundle inside the `dist` directory:
```bash
npm run build
```

### Preview Production Build
Launch a local web server to preview your production bundle:
```bash
npm run preview
```

---

## 🧪 Testing

Carbon Tree features a Playwright End-to-End testing suite ensuring calculator calculations, routes, user authentication flow, and footer interactions remain functional.

- **Run all E2E tests**:
  ```bash
  npm run test:e2e
  ```

- **Run E2E tests in Playwright's interactive UI**:
  ```bash
  npm run test:e2e:ui
  ```

- **Show the HTML test report**:
  ```bash
  npm run test:e2e:report
  ```

---

## 📖 Emission Calculation Methodology

Carbon Tree calculates annual carbon dioxide equivalents ($CO_2e$) using global average values:
- **Transportation**: Distance travelled per year multiplied by vehicle-specific emission factors (e.g., Petrol/Diesel vs. EV vs. Public Transit).
- **Home Energy**: Monthly utility costs divided by average unit rates and multiplied by the region's grid carbon intensity.
- **Diet**: Dietary habits scaled from high-impact heavy-meat diets ($3.3\text{ tonnes } CO_2e/\text{year}$) down to low-impact plant-based vegan diets ($1.5\text{ tonnes } CO_2e/\text{year}$).
- **Shopping & Lifestyle**: Consumption frequencies adjusted by carbon production estimates.

For full breakdowns, navigate to the **Methodology** tab under the **Resources** page in the application.
