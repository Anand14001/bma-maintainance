# BMA Maintenance & Ticket Tracking Portal

Welcome to the BMA Maintenance Client! This application is a digital tool designed to help committee members streamline the process of tracking, managing, and resolving maintenance complaints and requests.

## 📖 What is this App?

Imagine a digital logbook that never gets lost. This portal allows committee members to:
- **Log new complaints** (e.g., "Plumbing leak in Block A").
- **Track progress** (See if a task is "Open", "In Progress", or "Resolved").
- **Discuss issues** (Add comments to tickets).
- **View insights** (See a dashboard of how many issues are pending).

## 🚀 How It Works

Currently, this application runs in **Demo Mode**. Here is what that means for you:

### 1. No Server Required (Yet)
The app runs entirely in your browser. It simulates a connection to a real database using something called "Local Storage".
- **Data Persistence**: If you create a ticket and refresh the page, the ticket will still be there!
- **Device Specific**: Since data maps to your specific browser, if you open the link on a different computer or phone, you won't see the tickets created on the first device.

### 2. Smart Login
The app is protected. You must log in to access the dashboard.
- **Demo Credentials**:
  - **Email**: `admin@bma.com`
  - **Password**: `password`

## 📱 User Guide (Walkthrough)

### Step 1: Login
When you open the app, you will be greeted by a secure login screen. Enter the demo credentials above to enter.

### Step 2: The Dashboard
Once logged in, you land on the **Dashboard**. This is your control center.
- **Stats Cards**: Quickly see how many tickets are Open, In Progress, or Resolved.
- **Recent Activity**: A list of the latest reported issues.

### Step 3: Managing Tickets
Click on **Tickets** in the sidebar (or the bottom bar on mobile).
- **Search & Filter**: Type to find specific issues or click buttons to filter by status (e.g., only show "Open" tickets).
- **Create New**: Click the "New Ticket" button to report a problem. You can specify the Category (Plumbing, Electrical, etc.) and Priority (Low to Critical).

### Step 4: Tracking & Resolution
Click on any ticket card to see its full details.
- **Status Updates**: As work progresses, change the status from "Open" to "In Progress" and finally "Resolved".
- **Activity Log**: Every action (creation, status change, comment) is automatically recorded in the history log with a timestamp.

## 🛠 For Developers

This project is built using:
- **React.js** (User Interface)
- **Tailwind CSS** (Styling)
- **Vite** (Build Tool)

**Architecture**:
It uses a **Service Abstraction Layer**. Currently, `auth.service.js` and `ticket.service.js` interact with a mock data store. When you are ready for a real backend (like Firebase, Supabase, or a Node.js API), you strictly only need to update these service files. The rest of the UI will remain unchanged.

---

*Note: This is a production-ready frontend client waiting for a backend connection.*
