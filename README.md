# BMA Maintenance Client

A professional-grade maintenance management portal designed for the BMA community. This application simplifies ticket tracking, user management, and maintenance requests through a sleek, responsive, and performant web interface.

## 🌟 Key Features

### 🎫 Advanced Ticket Management
- **Smooth Ticket Creation**: User-friendly form for reporting issues with specific categories and priority levels.
- **Real-time Tracking**: Live status updates (Open, In Progress, Resolved) for transparency.
- **Detailed Activity Logs**: Comprehensive history for every ticket, including status changes and collaborative comments.
- **Efficient Organization**: Integrated client-side pagination and robust filtering to manage high volumes of tickets effortlessly.

### 👥 User Administration
- **Role-Based Access Control (RBAC)**: Secure access tiers for Residents, Committee Members, and Administrators.
- **Approval Workflow**: Integrated registration queue where Admins approve new users to maintain community security.
- **Dynamic User Management**: Tools for Admins to Activate, Deactivate, or Approve user accounts in bulk or individually.
- **Adaptive UI**: Optimized "Card View" for managing users on-the-go via mobile devices.

### ⚙️ User Personalization (New)
- **General Settings**: Update profile information, change names, and manage contact emails.
- **Appearance Customization**: Interactive controls for app color schemes and interface templates.
- **Account Security**: Secure password management with strength indicators and account verification workflows.
- **Session Control**: Seamless logout and automated session expiry for enhanced security.

### 📱 Responsive Design
- **Mobile-First Philosophy**: Every feature is built to work flawlessly on devices of all sizes.
- **Smart Navigation**: Adaptive sidebar for desktop and a curated bottom navigation bar for mobile users.
- **Performance Optimized**: Quick loading states and smooth transitions for a premium user experience.

## 🛠️ Tech Stack

- **Core**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) (Lightning fast development and builds)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) (Accessible, modern design system)
- **Backend**: [Firebase](https://firebase.google.com/) (Real-time Firestore & Secure Authentication)
- **State Management**: [TanStack Query v5](https://tanstack.com/query/latest) (Robust data fetching and caching)
- **Icons & UI**: [Lucide React](https://lucide.dev/) + [Sonner](https://sonner.stevenly.me/) (Toasts)
- **Form Handling**: React Hook Form + [Zod](https://zod.dev/) (Type-safe validation)

## 📁 Project Structure

```text
src/
├── components/     # Reusable UI and Feature-specific components
│   ├── layout/     # Layout wrappers (Sidebar, Nav)
│   ├── settings/   # Settings dialog and sections
│   ├── tickets/    # Ticket forms and lists
│   └── ui/         # Base UI primitives (Buttons, Inputs, etc.)
├── contexts/       # React Contexts for global state
├── hooks/          # Custom hooks for logic reuse
├── lib/            # Utility functions and library configs
├── pages/          # Full page components
├── services/       # API and Firebase service abstractions
└── styles/         # Global styles and Tailwind configs
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
```bash
git clone <repository-url>
cd bma_maintainance_client
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Development
```bash
npm run dev
```

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Compiles the application for production.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Checks for linting errors.

---

Built with ❤️ for the BMA Community.
