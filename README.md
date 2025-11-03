# ⚡ Elite Typing Speed Tester Pro

Elite Typing Speed Tester Pro is a **modern web-based typing trainer** built with **HTML, CSS & JavaScript**.  
It helps users improve typing speed and accuracy with **real-time analytics**, **challenges**, **achievements**, **persistent history**, and a clean responsive UI.

---

## 🚀 Key Features

- **Typing Test**: Real-time Words Per Minute (WPM), Accuracy, Errors, Keystrokes, Streaks.
- **Multiple Text Types**: Easy, Medium, Hard, Code snippets, Numbers & Symbols, Quotes.
- **Practice & Challenge Modes**: Toggle between laid-back practice and randomized challenges.
- **Live Analytics**: Speed, Accuracy, Consistency progress bars and a WPM sparkline-like chart.
- **Achievements & Gamification**: Unlock badges (Speed Demon, Perfect Score, On Fire).
- **Local Leaderboard & History**: Saved in browser LocalStorage (top results & complete session history).
- **Export**: Export detailed `.txt` results of history & summary.
- **Audio Feedback**: Web Audio API feedback for correct/incorrect keystrokes.
- **Animations & UX**: Confetti, motivational pop-ups, Zen/Rush/Normal typing modes.
- **Responsive**: Works well on desktop and mobile.

---

## 🧩 File Structure

    Elite-Typing-Speed-Tester-Pro/
    │
    ├── speed_tester.html      # Main HTML structure and UI layout
    ├── styles.css             # Styling, layout, responsive rules, animations
    └── script.js              # All JS logic: text generation, stats, localStorage, UI

*(All content is designed to be client-only; drop the three files into the same folder and open `speed_tester.html`.)*

---

## ⚙️ Installation & Quick Start

1. Download or clone the repository to your local machine:
   - `git clone https://github.com/pranav-abhyankar/Elite-Typing-Speed-Tester-Pro.git`  
     *(or simply download the ZIP and extract)*

2. Ensure the three files (`speed_tester.html`, `styles.css`, `script.js`) are in the same directory.

3. Open `speed_tester.html` in a modern browser (Chrome, Edge, Firefox, Safari).

4. Controls:
   - Choose **Text Type**, **Duration**, and **Typing Mode**.
   - Click **Start Test** (or press **Ctrl/Cmd + Enter**) to begin.
   - Press **Ctrl/Cmd + Enter** again to end early. Reset with **Ctrl/Cmd + R**.

---

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + Enter** — Start / End Test  
- **Ctrl/Cmd + R** — Reset Test

---

## 📊 What the UI Tracks

- **Time Left** — Countdown timer.
- **WPM** — Words per minute, updated live.
- **Accuracy (%)** — Percentage of correct characters typed.
- **Errors** — Number of incorrect characters.
- **Keystrokes** — Total keys pressed during the session.
- **Streak** — Consecutive correct characters count.
- **Characters / Words Typed** — Running totals.
- **Progress Bars** — Visual feedback for speed, accuracy, consistency.
- **WPM Chart** — Small bar chart representing WPM across the session.

---

## 🏆 Achievements & Challenges

Achievements are unlocked automatically and stored:

- **🏃 Speed Demon** — Reach 80+ WPM  
- **🎯 Perfect Score** — 100% accuracy  
- **🔥 On Fire** — 50+ correct streak

Challenges are randomly assigned in Challenge mode (e.g., reach 60 WPM, 95% accuracy).

---

## 💾 Persistence & Export

- Session history and achievements are saved to `localStorage` so they persist between visits.
- Export a detailed `.txt` report (summary + session-by-session history) via the **Export** button.

---

## 🧪 Example Usage Flow

1. Select `Medium` text type and `60` seconds duration.  
2. Press **Start Test** (Ctrl/Cmd + Enter).  
3. Type the highlighted text — live stats update as you type.  
4. When time ends (or you end it), the results panel shows: performance badge, level, text summary, earned achievements, and a WPM chart.  
5. Results added to history and leaderboard. You can export all results as a `.txt` file.

---

## 🔧 Implementation Notes (for maintainers)

- **Text Samples**: Provided in `script.js` grouped by difficulty (`easy`, `medium`, `hard`, `code`, `numbers`, `quotes`).
- **WPM Calculation**: Uses word count / elapsed minutes (words are split by whitespace).
- **Accuracy Calculation**: (correctChars / typedChars) * 100.
- **Sound**: Web Audio API oscillator used for short beep feedback (soft on supported browsers).
- **Animations**: Confetti and popups created dynamically in JS; CSS handles transitions.
- **Storage Keys** (in `localStorage`):
  - `typingHistory` — array of session results.
  - `typingAchievements` — achievements object.
- **Privacy**: All data remains in the browser. No backend or telemetry.

---

## 🧩 Suggested Improvements / Roadmap

- Add optional **cloud sync** + global leaderboard (authenticated users).
- Add **Dark Mode** toggle and theme customizations.
- Provide **CSV/JSON** export in addition to `.txt`.
- Add **per-key latency & heatmap** analytics to surface weak areas.
- Add **multilingual text bundles** and language-specific word counts.
- Integrate **keyboard-layout aware** difficulties (e.g., Dvorak tests).

---

## 🛠️ Contributing

- Fork the repo, create a new branch for features/fixes: `git checkout -b feature/awesome-feature`
- Make your changes, commit with clear messages, and open a PR.
- Keep changes scoped (UI, logic, or assets) and test across Chrome/Edge/Firefox.

---


## 📄 License

This project is released under the **MIT License** — feel free to use, modify, and distribute it.

---

**Made with ❤️ using HTML, CSS & JavaScript — type faster, practice smarter!**
