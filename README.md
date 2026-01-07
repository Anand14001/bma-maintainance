# BMA Maintenance Client

A comprehensive maintenance management portal built for the BMA community. This application streamlines ticket tracking, user management, and maintenance requests with a modern, responsive interface.

## 🚀 Features

### 🎫 Ticket Management
-   **Create Tickets**: Residents can easily report issues with categories (Plumbing, Electrical, etc.) and priority levels.
-   **Track Status**: Real-time status updates (Open, In Progress, Resolved).
-   **Activity Log**: detailed history of all actions and comments on a ticket.
-   **Filtering & Pagination**: Efficiently manage large volumes of tickets.

### 👥 User Management (Admin)
-   **Role-Based Access Control (RBAC)**: Distinct roles for Residents, Committee Members, and Admins.
-   **User Approval Workflow**: New registrations are set to **Pending**. Admins must approve users before they can log in.
-   **Status Management**: Admins can Activate, Deactivate, or Approve users.
-   **Mobile Responsive**: Fully optimized "Card View" for managing users on mobile devices.

### 🔐 Authentication & Security
-   **Firebase Auth**: Secure email/password authentication.
-   **Protected Routes**: ensuring only authorized personnel access admin sections.
-   **Session Management**: Secure session handling with automatic logout for deactivated users.

## 🛠️ Tech Stack

-   **Frontend Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Material UI (MUI)](https://mui.com/)
-   **Backend / DB**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **State/Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
-   **Forms**: React Hook Form + Zod Validation

## 📱 Responsiveness
The application is designed with a **Mobile-First** approach:
-   **User Management**: Switches seamlessly between a Desktop Table view and a Mobile Card view.
-   **Navigation**: Adaptive sidebar and layout for various screen sizes.

## 🏃‍♂️ Getting Started

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd bma_maintainance_client
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory with your Firebase configuration:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 📜 Scripts

-   `npm run dev`: Start the development server.
-   `npm run build`: Build the application for production.
-   `npm run preview`: Preview the production build locally.
