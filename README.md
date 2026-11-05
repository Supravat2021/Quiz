# AI Quiz 3D — Interactive Real-Time AI Architecture Experience

A production-ready, interactive 3D AI Quiz Web Application optimized for seamless deployment on **Vercel via GitHub**.

Powered by **React**, **Three.js**, **@react-three/fiber**, **@react-three/drei**, and **Tailwind CSS**, featuring 10 custom procedural 3D simulations that dynamically render for each question.

---

## 🌟 Key Features

1. **10 Distinct Procedural 3D Scenes (Zero External Missing `.glb` Dependencies)**:
   - **Q1 (LLM Next Token Prediction)**: Glowing stream of 3D geometric tokens flowing into a central pulsing neural core projecting a golden prediction cube forward.
   - **Q2 (4 Characters = 1 Token)**: 4 floating glowing spheres orbiting and merging periodically into 1 solid golden dodecahedron.
   - **Q3 (AI Hallucination)**: Mirage-like morphing distorted sphere (`MeshDistortMaterial`) shifting iridescent colors with glitching wireframe rings.
   - **Q4 ("Act as a strict examiner" Role Framework)**: Floating academic mortarboard cap and a rotating glowing metallic evaluation shield.
   - **Q5 (Few-Shot Examples)**: 3 glowing crystal prisms aligned in a row firing directional laser light beams into a target output sphere.
   - **Q6 (AI Slop Detection)**: Chaotic tangle of dull grey torus knots being filtered by a glowing laser ring into pristine multifaceted geometric crystals.
   - **Q7 (--ar 16:9 Aspect Ratio)**: 3D glowing widescreen 16:9 holographic frame with camera frustum projection lines and corner focus brackets.
   - **Q8 (GPT - Generative Pre-trained Transformer)**: Multi-layered 3D Transformer neural network tower with attention plates, interconnected nodes, and rotating data rings.
   - **Q9 (Chatbot Hallucination / False Fact)**: Two intersecting portals—solid cyan truth cube and shimmering translucent illusion sphere with exchange particles.
   - **Q10 (Face ID AI)**: 3D wireframe geometric human head mask with a vertical glowing laser scan line sweeping over a smartphone chassis.

2. **Dual-Mode Real-Time State Architecture**:
   - **Mode 1: Default Local/Demo Mode (Zero Setup)**:
     - Uses `localStorage` + `BroadcastChannel` API + storage events + polling heartbeat.
     - Allows instant multi-tab testing between Participant (`/`) and Admin (`/admin`) on `localhost` or a single device with zero configuration required!
   - **Mode 2: Cloud Production Mode (Supabase Realtime)**:
     - Activates automatically if `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_...` equivalents) are set.
     - Synchronizes quiz status (`waiting`, `active`, `ended`), current question, and live leaderboard across multiple physical devices worldwide on Vercel.

3. **Participant Experience (`/`)**:
   - Sleek dark-mode aesthetic (`#0b132b` deep navy, `#fbbf24` gold/amber, and `#06b6d4` cyan).
   - Interactive 3D floating particle constellation in lobby.
   - Real-time countdown timer (20s) with speed bonus scoring (+100 base points + up to +50 speed bonus for fast answers).
   - Educational concept explanations on answer selection.
   - Victory celebration screen with `canvas-confetti` fireworks, accuracy percentage, and live Top 10 Leaderboard.
   - Built-in "Solo Practice Bypass" for single-player testing without an admin.

4. **Host Admin Portal (`/admin`)**:
   - Protected by frontend PIN: `2026`.
   - Live controls: "Start Quiz for Everyone", "Reset / Clear Session", "Simulate Competitors".
   - Real-time participant tracker table sorted highest score to lowest.
   - One-click "Export Leaderboard to CSV".

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Open in browser:
# Participant view: http://localhost:3000/
# Host Admin view:  http://localhost:3000/admin (PIN: 2026)
```

To test real-time sync locally, open two browser windows side by side:
- Window 1: `http://localhost:3000/` (Participant view - enter name and wait)
- Window 2: `http://localhost:3000/admin` (Enter PIN `2026`, then click "Start Quiz for Everyone")
- Window 1 immediately transitions to Question 1 in real time!

---

## ☁️ Supabase Setup (Optional Cloud Mode)

To enable cross-device synchronization across different networks and physical phones/tablets on Vercel:

### 1. Run this SQL in your Supabase SQL Editor:

```sql
-- 1. Create Quiz Sessions table
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting' | 'active' | 'ended'
  current_question_index INTEGER NOT NULL DEFAULT 0,
  started_at BIGINT,
  ended_at BIGINT,
  reset_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Quiz Participants table
CREATE TABLE IF NOT EXISTS public.quiz_participants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  current_question_index INTEGER NOT NULL DEFAULT 0,
  answers JSONB DEFAULT '{}'::jsonb,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  joined_at BIGINT NOT NULL,
  last_active_at BIGINT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS) with open read/write for demo quiz
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to sessions" ON public.quiz_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update to sessions" ON public.quiz_sessions FOR ALL USING (true);

CREATE POLICY "Allow public read access to participants" ON public.quiz_participants FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update to participants" ON public.quiz_participants FOR ALL USING (true);

-- 4. Enable Supabase Realtime for instant broadcasts
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_participants;

-- 5. Insert default initial session
INSERT INTO public.quiz_sessions (id, status, current_question_index, reset_count)
VALUES ('main-quiz-session', 'waiting', 0, 0)
ON CONFLICT (id) DO NOTHING;
```

### 2. Configure Environment Variables

Create a `.env` file locally or add to your Vercel Project Settings:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Also supports `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` if migrated to Next.js).*

---

## 🚢 Deployment to Vercel via GitHub

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: 3D AI Quiz Web Application"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. In the [Vercel Dashboard](https://vercel.com/):
   - Click **Add New Project** -> **Import Git Repository**.
   - Select your repository.
   - **Framework Preset**: `Vite` (automatically detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - *(Optional)* Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Environment Variables if you configured Supabase.
   - Click **Deploy**.

3. The included `vercel.json` automatically handles Single Page Application routing rewrites so navigating directly to `/admin` works flawlessly without 404s.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling**: Tailwind CSS v4, custom glassmorphism, responsive split-screen
- **Icons**: Lucide Icons
- **Celebration**: `canvas-confetti`
- **Audio**: Web Audio API Procedural Synthesizer (Zero asset loading lag)
- **State & Real-Time**: Dual-Mode (`BroadcastChannel` + `localStorage` + Polling + Supabase Realtime)
