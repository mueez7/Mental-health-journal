# Lumina: LLM-Powered Mental Health Journal

Lumina is a highly responsive, single-page application (SPA) mental health journaling tool. It's designed to provide a distraction-free writing experience, insightful dashboard metrics, dynamic interactive timelines, and an LLM-powered insights engine to better understand your journaling trends.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + PostCSS
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Charts/Visualizations:** Recharts
- **HTTP Client:** Axios
- **Database/Auth Provider:** Supabase JS Client

### Backend
- **Framework:** FastAPI
- **Database/Auth:** Supabase
- **AI Integration:** OpenAI API
- **Utilities:** Pydantic (data validation), PyJWT (authentication)

## 📁 Project Structure

This repository is organized into a modular monorepo format:

```text
mental-health-journal/
├── frontend/               # React Vite Frontend Application
│   ├── src/
│   │   ├── components/     # UI Components (Dashboard, Lading, etc.)
│   │   ├── lib/            # Configuration files (API, Supabase client)
│   │   ├── index.css       # Tailwind entry point
│   │   └── main.jsx        # App entry point
│   ├── package.json        
│   └── vite.config.js      
└── backend/                # FastAPI Backend Application
    ├── app/
    │   ├── api/            # API Route definitions
    │   ├── core/           # Core configurations
    │   ├── models/         # Pydantic/Database models
    │   ├── schemas/        # API schemas
    │   └── main.py         # FastAPI App Entry point
    ├── requirements.txt    # Python dependencies
    └── .env                # Backend environment variables
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Python (3.9+ recommended)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/mueez7/Mental-health-journal.git
cd Mental-health-journal
```

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (create a `.env` file based on `.env.example` if applicable and put your Supabase keys).
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Your frontend should now be running locally on `http://localhost:5173`.

### 3. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your `.env` file with necessary backend keys (Supabase API, OpenAI keys, JWT keys).
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
6. Your backend API should now be running locally on `http://localhost:8000` (Visit `http://localhost:8000/docs` for the interactive Swagger UI).

## 🤝 Contributing
Contributions are always welcome. Please ensure that PRs are made from logically named feature branches.

## 📄 License
This application is fully open source.
