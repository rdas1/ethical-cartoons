import os
FRONTEND_BASE_URL = os.environ.get("FRONTEND_BASE_URL", "http://localhost:5173/ethical-cartoons")
# FRONTEND_BASE_URL = os.environ.get("FRONTEND_BASE_URL", "https://rdas1.github.io/ethical-cartoons")
print(f"FRONTEND_BASE_URL: {FRONTEND_BASE_URL}")
