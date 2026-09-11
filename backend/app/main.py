from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import init_db
from app.routes import eligibility, schemes, benefit_status, dashboard

app = FastAPI(
    title="SevaSetu API",
    description="Government Welfare Benefit Gap Detection & Resolution System (SIH Prototype). "
                 "Uses ONLY synthetic/demo data.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # relaxed for local prototype/demo only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "SevaSetu API"}


app.include_router(eligibility.router, prefix="/api")
app.include_router(schemes.router, prefix="/api")
app.include_router(benefit_status.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
