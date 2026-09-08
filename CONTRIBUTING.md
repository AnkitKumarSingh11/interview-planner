# Contributing Guidelines 🚀

Thank you for your interest in contributing to **Planly — Interview Preparation Tracker**! 

Whether you are suggesting new questions, fixing bugs, improving the UI, or adding new features, your help is greatly appreciated.

---

## 📌 Code of Conduct

Please be respectful, collaborative, and constructive when opening issues, submitting pull requests, or participating in discussions.

---

## 💡 How You Can Contribute

### 1. Suggesting / Adding New Questions
All user-submitted questions go through an **Admin Approval Process** before going live on the main syllabus:
- Use the **Submit Question** modal directly in the app.
- Provide a clear, concise question title (e.g. `Lowest Common Ancestor in Binary Tree`).
- Select the appropriate **Parent Topic** and **Sub-section**.
- Set difficulty (`Easy`, `Medium`, `Hard`) and provide a verified reference link (LeetCode, GFG, etc.).
- An administrator will review your submission in the **Admin Approvals** queue.

### 2. Reporting Bugs & Issues
If you encounter a bug:
- Check existing GitHub issues to ensure it hasn't been reported.
- Open a new issue with:
  - Clear title and description.
  - Steps to reproduce the issue.
  - Expected vs. actual behavior.
  - Screenshots or browser environment details.

### 3. Development Workflow

1. **Fork & Clone**:
   ```bash
   git clone https://github.com/your-username/interview-preparation-tracker.git
   cd interview-preparation-tracker
   ```

2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install Dependencies & Test Build**:
   ```bash
   npm install
   npm run dev
   ```

4. **Verify Build & Types**:
   Before submitting a Pull Request, ensure that TypeScript compilation and Next.js production build pass cleanly:
   ```bash
   npm run build
   ```

5. **Submit a Pull Request (PR)**:
   - Push your branch to GitHub and open a PR against the `main` branch.
   - Describe what changes were made and reference any related issue numbers.

---

## 🎨 Code Conventions & Architecture

* **TypeScript**: Use strict types (`interface`, `type`). Avoid `any` where possible.
* **Styling**: Use Tailwind CSS utility classes adhering to dark theme colors (`bg-slate-950`, `bg-slate-900`, `text-slate-100`, `indigo-500`).
* **Database**: All database interactions must go through SQLite helpers defined in [`src/db/index.ts`](./src/db/index.ts).
* **Components**: Keep components modular, accessible, and functional.

---

Thank you for helping make **Planly** better for everyone! Happy coding! 💻✨
