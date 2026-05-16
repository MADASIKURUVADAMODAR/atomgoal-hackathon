## 📌 Problem Statement

Organizations struggle with fragmented goal tracking through spreadsheets and manual workflows. AtomGoal provides a centralized Goal Setting & Tracking Portal with Employee, Manager, and Admin workflows.

---

## ✨ Key Features

- Employee Goal Creation & Submission
- Manager Approval Workflow
- Admin Portal & Analytics
- Quarterly Check-ins
- Goal Weightage Validation
- Shared Goals
- Role-Based Authentication
- Progress Tracking Dashboard

---

## 🛠️ Tech Stack

Frontend: Next.js + TailwindCSS  
Backend: Express.js + JWT  
Database: SQLite

# AtomGoal – Smart Goal Setting & Tracking Portal

A comprehensive full-stack solution for organizational goal management.

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18+)
- **npm** (v9+)

### 2. Backend Setup
1. Open a terminal in the `/server` directory.
2. Run `npm install`.
3. The database (SQLite) will automatically initialize and seed on the first run.
4. Run `npm run dev`.
   - Server will start at `http://localhost:5000`

### 3. Frontend Setup
1. Open a new terminal in the `/client` directory.
2. Run `npm install`.
3. Run `npm run dev`.
   - Frontend will start at `http://localhost:3000`

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin/HR** | `sneha@atomgoal.com` | `demo123` |
| **Manager** | `amit@atomgoal.com` | `demo123` |
| **Employee** | `rahul@atomgoal.com` | `demo123` |
| **Employee** | `priya@atomgoal.com` | `demo123` |

---

## 🏗️ Architecture

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Recharts.
- **Backend**: Node.js, Express, TypeScript, JWT Auth.
- **Database**: SQLite (Portability & Speed).

---

## 🗺️ Demo Journey Walkthrough

1. **Phase 1: Goal Creation**
   - Login as **Rahul Sharma** (Employee).
   - Click "Create Goal Sheet".
   - Add goals, ensuring total weightage = 100%.
   - Click "Submit to Manager".

2. **Phase 2: Review & Approval**
   - Login as **Amit Kumar** (Manager).
   - Go to "Team Dashboard".
   - Click "Review Sheet" for Rahul.
   - Adjust targets/weightages if needed and click "Approve & Lock".

3. **Phase 3: Progress Update**
   - Login back as **Rahul**.
   - Go to "Quarterly Check-ins".
   - Select an approved goal and update "Achievement" for Q1.
   - Click "Update Progress" (Note the progress bar updating).

4. **Phase 4: Admin Oversight**
   - Login as **Sneha Reddy** (Admin).
   - Go to "Admin Center".
   - View organization-wide performance charts and departmental completion rates.
   - Push a "Shared Goal" to the Engineering department.
