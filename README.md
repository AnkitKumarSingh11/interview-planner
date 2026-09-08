# Planly — Interview Preparation Tracker 🎯

**Planly** is a modern, high-performance web application designed to help software engineers plan, track, and master their interview preparation across **Data Structures & Algorithms (DSA)**, **Low Level Design (LLD)**, and custom technical domains.

Built with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**, and an express backend integration with **MongoDB**.

---

## 🌟 Key Features

### 1. Pre-loaded Complete Syllabi & Dynamic Roadmap Tracks
* **DSA Track**: 59 topic sections with **315+ curated questions** covering Arrays, Hashing, Binary Search, Recursion, Linked Lists, Greedy Algorithms, Sliding Window/2-Pointer, Stack/Queues, Binary Trees, BSTs, Heaps, Graphs, and Dynamic Programming.
* **LLD Track**: 13 topic sections with **70+ design topics & machine coding problems** covering SOLID Principles, UML, Creational/Structural/Behavioural Design Patterns, Multithreading, Dependency Injection, and real-world system designs (Parking Lot, Vending Machine, ATM, PubSub, Elevator, Digital Wallet, etc.).
* **Custom Tracks**: Admin can dynamically add and manage custom roadmap tracks.

### 2. Secure Token Management & Silent Refresh
* **In-Memory & Cross-Tab Token Sharing**: Auth tokens are kept in memory with `localStorage` synchronization across browser tabs.
* **Automatic Silent Token Refresh**: Built-in HTTP interceptor (`apiClient.ts`) automatically catches 401 Unauthorized responses and performs silent 24-hour token refreshes without interrupting user workflow.
* **Single Active Session Enforcement**: Single active login per user/admin across devices. Logging in on a new device automatically invalidates older sessions.

### 3. Comprehensive Admin Portal (`/admin`)
* **Auto-Redirect Clearance**: Visiting `/admin/login` when already authenticated automatically redirects to `/admin`.
* **Tab & Track State Persistence**: Preserves active tab (**Pending Approvals** vs **Syllabus & Topic Manager**) and active track across browser refreshes.
* **On-Demand API Triggers & Loader Feedback**: Tab/track selection immediately triggers API data fetches, rendering animated `<Loader2 />` spinners.
* **Pending Approvals Queue**: Moderation queue to review, approve (publish live), or reject community-submitted questions.
* **Full Syllabus Management**: Admin controls to create, edit, or delete tracks, topic sections, sub-sections, and questions.

### 4. Public Roadmap Tracker (`/`)
* **Guest & Account Progress Sync**: Guest users track progress stored in `localStorage`. Logged-in users sync seamlessly with backend user progress APIs.
* **Clean & Distraction-Free UI**: Clean dark-themed design (Tailwind slate-900 / indigo-500). Normal users see no delete controls on public roadmaps.
* **Timeline Auto-Scaling**: Timeline dates scale based on complexity weights and target durations (30, 60, 90, 120, 160 days).

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
* **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
* **API Client**: Fetch wrapper with token interceptor & silent refresh
* **Backend**: Express.js REST API with MongoDB & Mongoose

---

## 📂 Project Structure

```text
interview-preparation-tracker/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with Toast notification provider
│   │   ├── page.tsx           # Public Roadmap Tracker & Progress page
│   │   ├── admin/
│   │   │   ├── page.tsx       # Admin Dashboard (Pending Queue & Syllabus Manager)
│   │   │   └── login/
│   │   │       └── page.tsx   # Admin Login page with auto-redirect guard
│   ├── components/            # UI Components (SectionCard, QuestionRow, InitialLoader, Modals, Toast)
│   ├── lib/
│   │   └── apiClient.ts       # Central API client, token handling & silent 401 refresh
│   └── types/
│       └── tracker.ts         # TypeScript definitions (Track, Section, Subsection, Question)
├── public/
├── package.json
└── tsconfig.json
```

---

## ⚙️ Environment Variables (`.env.local`)

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18.x or higher
* Express backend server running on port `5000` (see `interview-prep-backend`)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/interview-preparation-tracker.git
   cd interview-preparation-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open application**:
   Navigate to `http://localhost:3000` in your web browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📄 License

This project is licensed under the MIT License.
