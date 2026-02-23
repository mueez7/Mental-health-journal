# ✨ Lumina — LLM-Powered Mental Health Journal

<p align="center">
  <img src="frontend/src/assets/Logo.svg" alt="Lumina Logo" width="120" />
</p>

<p align="center">
  <strong>A calm, intelligent journaling companion powered by AI.</strong><br/>
  Gain clarity, track your emotional well-being, and reflect with purpose.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3FCF8E?logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenRouter-LLM-8B5CF6" />
</p>

---

## 📖 About

Lumina is a full-stack, single-page application designed to be a **distraction-free mental health journaling tool**. It combines a premium, animated UI with an LLM-powered insights engine to help you understand your journaling trends and emotional patterns over time.

### Key Features

| Feature | Description |
|---|---|
| **📝 Distraction-Free Writing** | A clean, focused journal entry editor with guided prompts |
| **📊 Smart Dashboard** | At-a-glance metrics — total entries, streaks, mood trends, and weekly activity |
| **📅 Interactive Timeline** | A chronological, searchable feed of all past journal entries |
| **🧠 AI-Powered Insights** | LLM-generated reflections, patterns, and summaries over your journaling history |
| **🎨 Theming** | Dark / Light mode toggle with persistent user preferences |
| **⚙️ Account Settings** | Profile management, password updates, and data export |
| **🔐 Auth with Supabase** | Secure sign-up, login, and session management via Supabase Auth |
| **✨ Smooth Animations** | Page transitions, micro-interactions, and a branded animated logo (Framer Motion + GSAP) |

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) + [Vite 7](https://vite.dev/) | UI framework & build tool |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Page transitions & animations |
| [GSAP](https://gsap.com/) | Advanced animation sequences |
| [React Router DOM](https://reactrouter.com/) | Client-side routing |
| [Recharts](https://recharts.org/) | Dashboard charts & visualizations |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Axios](https://axios-http.com/) | HTTP client |
| [Supabase JS](https://supabase.com/docs/reference/javascript) | Auth & database client |

### Backend
| Technology | Purpose |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | Python API framework |
| [Supabase](https://supabase.com/) | PostgreSQL database & auth |
| [OpenRouter](https://openrouter.ai/) | LLM gateway (AI insights) |
| [Pydantic](https://docs.pydantic.dev/) | Data validation & settings |
| [PyJWT](https://pyjwt.readthedocs.io/) | JWT token verification |
| [python-dotenv](https://pypi.org/project/python-dotenv/) | Environment variable management |

---

## 📁 Project Structure

```text
Mental-health-journal/
├── README.md
├── frontend/                        # React + Vite SPA
│   ├── src/
│   │   ├── assets/                  # Logo (SVG), animated logo (GIF/MP4), loader
│   │   ├── components/
│   │   │   ├── AppShell.jsx         # Authenticated layout shell (header, nav, dropdowns)
│   │   │   ├── Dashboard.jsx        # Metrics, charts, recent entries overview
│   │   │   ├── GlobalLoader.jsx     # Full-screen animated loading screen
│   │   │   ├── Insights.jsx         # AI-generated journal insights page
│   │   │   ├── LightRays.jsx        # Decorative animated background effect
│   │   │   ├── Login.jsx            # Login & sign-up page
│   │   │   ├── Settings.jsx         # User profile & account settings
│   │   │   ├── SplitText.jsx        # Animated text reveal component
│   │   │   ├── Timeline.jsx         # Chronological journal entry feed
│   │   │   └── WriteEntry.jsx       # New journal entry editor
│   │   ├── contexts/
│   │   │   └── ThemeContext.jsx      # Dark / Light mode provider
│   │   ├── lib/
│   │   │   ├── api.js               # Axios API client configuration
│   │   │   └── supabaseClient.js    # Supabase client initialization
│   │   ├── App.jsx                  # Root component & route definitions
│   │   ├── App.css                  # App-level custom styles
│   │   ├── index.css                # Tailwind CSS entry point
│   │   └── main.jsx                 # React DOM entry point
│   ├── .env.example                 # Frontend env variable template
│   ├── package.json
│   └── vite.config.js
│
└── backend/                         # FastAPI REST API
    ├── app/
    │   ├── api/
    │   │   ├── deps.py              # Dependency injection (auth guards)
    │   │   └── routes/
    │   │       ├── entries.py       # CRUD endpoints for journal entries
    │   │       ├── dashboard.py     # Dashboard metrics endpoint
    │   │       └── insights.py      # LLM-powered insights endpoint
    │   ├── core/                    # App config & settings
    │   ├── schemas/                 # Pydantic request/response schemas
    │   ├── services/
    │   │   ├── db_service.py        # Supabase database operations
    │   │   └── llm_service.py       # OpenRouter LLM integration
    │   └── main.py                  # FastAPI app entry point
    ├── .env.example                 # Backend env variable template
    └── requirements.txt             # Python dependencies
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** v18+
- **Python** 3.9+
- **Git**
- A [Supabase](https://supabase.com/) project (free tier works)
- An [OpenRouter](https://openrouter.ai/) API key (free models available)

### 1. Clone the Repository

```bash
git clone https://github.com/mueez7/Mental-health-journal.git
cd Mental-health-journal
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file from the template and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```env
# frontend/.env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the dev server:

```bash
npm run dev
```

The frontend will be running at **http://localhost:5173**.

### 3. Backend Setup

```bash
cd backend
```

Create and activate a virtual environment:

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file from the template and fill in your keys:

```bash
cp .env.example .env
```

```env
# backend/.env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_LLM_MODEL=nvidia/nemotron-nano-9b-v2:free
```

Start the API server:

```bash
uvicorn app.main:app --reload
```

The API will be running at **http://localhost:8000**. Visit **http://localhost:8000/docs** for the interactive Swagger UI.

---

## 🧩 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/entries/` | List all journal entries |
| `POST` | `/api/v1/entries/` | Create a new journal entry |
| `GET` | `/api/v1/dashboard/` | Dashboard summary metrics |
| `GET` | `/api/v1/insights/` | AI-generated insights |

> All `/api/v1/*` routes require a valid Supabase JWT in the `Authorization` header.

---

## 📄 License

This application is fully open source.
