# Planly — Interview Preparation Tracker 🎯

**Planly** is a modern, high-performance web application designed to help software engineers plan, track, and master their interview preparation across **Data Structures & Algorithms (DSA)**, **Low Level Design (LLD)**, and custom technical domains.

Built with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**, and **SQLite**.

---

## 🌟 Key Features

### 1. Pre-loaded Complete Syllabi
* **DSA Track**: 59 topic sections with **315+ curated questions** covering Arrays, Hashing, Binary Search, Recursion, Linked Lists, Greedy Algorithms, Sliding Window/2-Pointer, Stack/Queues, Binary Trees, BSTs, Heaps, Graphs, and Dynamic Programming.
* **LLD Track**: 13 topic sections with **70+ design topics & machine coding problems** covering SOLID Principles, UML, Creational/Structural/Behavioural Design Patterns, Multithreading, Dependency Injection, and real-world system designs (Parking Lot, Vending Machine, ATM, PubSub, Elevator, Digital Wallet, etc.).

### 2. Timeline Planning & Target Duration Selector
* Set custom roadmap targets (**30 Days**, **60 Days**, **90 Days**, **120 Days**, **160 Days**, or Custom Start Date & Duration).
* **Document Complexity-Based Auto-Scaling**: Timeline dates automatically scale proportionally across all main topics based on their exact complexity weights from official reference timetables.

### 3. Moderated Question Submission & Admin Approval Queue
* **Public Question Submission**: Users can submit new questions with difficulty levels, reference links, and notes.
* **Admin Review Queue**: Submitted questions enter a `pending` state. Platform administrators can review, edit, **Approve** (publishing live to all users), or **Reject** submissions.

### 4. Direct External Problem Links
* Every question includes direct clickable links to **LeetCode**, **GeeksforGeeks**, or **GitHub LLD Code Repositories** that open directly in a new tab.

### 5. High-Performance Local SQLite Persistence
* Backed by an in-process **SQLite** database (`better-sqlite3` in WAL mode) with zero external database dependencies.
* Supports JSON export and import for local backups.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
* **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
* **Database**: [SQLite](https://www.sqlite.org/) via `better-sqlite3`
* **Utilities**: `date-fns`, `clsx`, `tailwind-merge`

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18.x or higher
* npm / yarn / pnpm

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
   Navigate to `http://localhost:3000` in your web browser. On initial boot, the SQLite database (`./data/tracker.db`) will automatically initialize and seed the complete DSA and LLD syllabi.

---

## 📖 Question Approval & Admin Workflow

1. **Submitting a Question**:
   * Click **Submit Question** in the top navbar.
   * Select the **Parent Topic** (e.g. `Arrays` or `Graphs`), and the **Sub-section** dropdown will dynamically populate.
   * Provide title, difficulty, optional reference link, and notes.
   * Click **Submit Question for Review**.

2. **Admin Reviewing & Approving Questions**:
   * Click **Admin Approvals** in the navbar to open the pending submissions queue.
   * Click **Approve & Publish Live** to publish the question to the main syllabus, or **Reject** to remove it.

---

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on code standards, submitting new questions, reporting issues, and opening pull requests.

---

## 📄 License

This project is licensed under the MIT License.
