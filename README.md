# ⌨️ KeyMaster Pro — Elite Typing Test Platform

> **Type faster. Race smarter.** The premium typing test with real-time multiplayer arenas, detailed analytics, competitive leaderboards, and a satisfying typing experience that feels like butter.

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-green?style=flat-square)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 🚀 Features

### ⚡ Competitive Arena
- **Real-time multiplayer races** with live WebSocket connections
- Race against friends and typists worldwide
- Instant feedback on typing speed, accuracy, and performance
- Dynamic matchmaking and skill-based competitions

### 📊 Advanced Analytics
- **Live telemetry** with detailed typing metrics
- Toggle between focused and data-rich display modes
- Real-time WPM, accuracy, consistency tracking
- Historical performance analytics and progress charts
- Visual form feedback to improve your typing technique

### 🎯 Challenge System
- **Curated typing challenges** for skill development
- Progressive difficulty levels
- Achievement tracking and badges
- Practice modes with detailed feedback

### 🏆 Global Leaderboards
- **Worldwide rankings** updated in real-time
- Compare performance with top typists globally
- Daily, weekly, and all-time leaderboards
- Personal best tracking and streak counter

### 👤 User Profiles
- Customizable profile pages
- Statistics dashboard with typing insights
- Achievement showcase
- Social competition tracking

### 🎨 Premium UI/UX
- **Coffee House Edition** theme with ambient aesthetics
- Espresso blacks, amber highlights, and noise texture
- Smooth animations with Framer Motion
- Dark mode support with theme switching
- Fully responsive design (mobile, tablet, desktop)
- Beautiful chart visualizations with Recharts

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 15](https://nextjs.org/) with Turbopack
- **UI Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript 5.8](https://www.typescriptlang.org/)
- **Styling:** [TailwindCSS 3](https://tailwindcss.com/) with custom theme
- **State Management:** [Zustand](https://zustand.dev/)
- **Component Library:** [Radix UI](https://www.radix-ui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Charts:** [Recharts](https://recharts.org/)
- **Theme:** [Next Themes](https://github.com/pacocoursey/next-themes)

### Real-Time
- **WebSocket:** [Socket.io Client](https://socket.io/)
- **Real-time multiplayer** race synchronization

### Utilities
- **ID Generation:** [Nanoid](https://github.com/ai/nanoid)
- **CSS Utility:** [Clsx](https://github.com/lukeed/clsx), [Tailwind Merge](https://github.com/dcastil/tailwind-merge)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/keymaster-pro.git
cd keyboard

# Install dependencies
npm install

# Set up environment variables (if needed)
# Copy .env.example to .env.local and configure
```

### Development

```bash
# Run development server with Turbo
npm run dev

# Open http://localhost:3000 in your browser
```

### Build & Deploy

```bash
# Type check
npm run type-check

# Build for production
npm build

# Start production server
npm start
```

---

## 📁 Project Structure

```
keyboard/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── arena/             # Competitive racing mode
│   │   ├── challenge/         # Challenge mode
│   │   ├── leaderboard/       # Global rankings
│   │   ├── profile/           # User profiles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── typing/            # Typing engine components
│   │   ├── charts/            # Analytics visualizations
│   │   ├── arena/             # Arena-specific components
│   │   ├── challenge/         # Challenge components
│   │   └── ui/                # Reusable UI components
│   ├── hooks/
│   │   ├── useTypingEngine    # Core typing logic
│   │   └── useSocket          # WebSocket integration
│   ├── lib/
│   │   ├── socket.ts          # Socket.io configuration
│   │   ├── calculations.ts    # WPM/accuracy calculations
│   │   └── utils.ts           # Utility functions
│   ├── store/                 # Zustand stores
│   │   ├── typingStore        # Typing state
│   │   ├── arenaStore         # Arena state
│   │   ├── challengeStore     # Challenge state
│   │   └── userStore          # User state
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
└── next.config.ts             # Next.js configuration
```

---

## 🎮 How to Use

### Solo Typing Test
1. Visit the **home page** and start typing
2. Watch real-time metrics update as you type
3. View detailed analytics when finished
4. Save your results to your profile

### Competitive Arena
1. Navigate to **Arena**
2. Create a new race or join an existing one
3. Race against other players in **real-time**
4. See rankings update as you type
5. Climb the global leaderboard

### Take Challenges
1. Browse **Challenges** section
2. Select a challenge matching your skill level
3. Complete it with specific requirements
4. Earn achievements and badges

### Check Leaderboards
1. View **Global Rankings** to see top typists
2. Filter by time period (daily, weekly, all-time)
3. Compare your stats with other users
4. Track your personal bests

---

## 🎨 Customization

### Theme & Colors
Customize the theme by editing `tailwind.config.ts`:
```typescript
// Modify color palette, typography, and animations
```

### Typing Settings
Adjust typing engine behavior in `hooks/useTypingEngine.ts`:
- Time limits
- Word pools
- Difficulty levels

---

## 📊 Analytics & Metrics

KeyMaster Pro tracks:
- **WPM** (Words Per Minute)
- **Accuracy %** (correct keystrokes / total keystrokes)
- **Consistency** (standard deviation of speed)
- **Time** (session duration)
- **Errors** (mistake count and categories)
- **Caret smoothness** (visual feedback quality)

---

## 🔌 Real-Time Multiplayer

The arena uses **Socket.io** for real-time synchronization:
- Live player positions
- Instant race updates
- Spectator support
- Automatic reconnection handling

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Coding Standards
- Use TypeScript strictly
- Follow existing code style
- Write meaningful commit messages
- Test your changes before submitting

---

## 🐛 Known Issues & Roadmap

### Planned Features
- [ ] Mobile app with React Native
- [ ] Voice-guided typing lessons
- [ ] Custom theme creator
- [ ] Replay system for races
- [ ] Tournament mode
- [ ] Integration with popular typing games

### Known Issues
- See [GitHub Issues](https://github.com/yourusername/keymaster-pro/issues) for current bugs

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 💬 Support & Community

- **Discussions:** [GitHub Discussions](https://github.com/yourusername/keymaster-pro/discussions)
- **Issues:** [Report Bugs](https://github.com/yourusername/keymaster-pro/issues)
- **Twitter:** [@keymaster_pro](https://twitter.com/keymaster_pro)

---

## 👨‍💻 Author

Created with ❤️ and ☕ by the KeyMaster Pro team.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) — The React framework
- [Radix UI](https://www.radix-ui.com/) — Unstyled, accessible components
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [Socket.io](https://socket.io/) — Real-time communication
- All our amazing typists and contributors!

---

<div align="center">

**Ready to master the keyboard? 🚀**

[Get Started](http://localhost:3000) · [Report Bug](https://github.com/yourusername/keymaster-pro/issues) · [Request Feature](https://github.com/yourusername/keymaster-pro/discussions)

⭐ If you like this project, consider giving it a star on GitHub!

</div>
