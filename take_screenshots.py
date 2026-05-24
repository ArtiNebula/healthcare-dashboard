"""Take fresh screenshots of the running Healthcare app."""
import sys, os, time, json
sys.stdout.reconfigure(encoding='utf-8')

OUT  = r'd:\M.tech\SEM IV\Healthcare Dashboard Development\screenshots'
BASE = 'http://localhost:5173'

from playwright.sync_api import sync_playwright

def shot(page, path, wait_ms=2000):
    try:
        page.wait_for_load_state('networkidle', timeout=8000)
    except Exception:
        pass
    page.wait_for_timeout(wait_ms)
    page.screenshot(path=path, full_page=False)
    print(f'  Saved: {os.path.basename(path)}')

def inject_user(page, user_obj):
    """Set localStorage user so the app thinks we're logged in."""
    page.evaluate(f"localStorage.setItem('user', JSON.stringify({json.dumps(user_obj)}))")

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={'width': 1280, 'height': 800})
    page = ctx.new_page()

    # ── 1. Home page ─────────────────────────────────────────────────────────
    page.goto(BASE + '/')
    shot(page, os.path.join(OUT, '00_home.png'))

    # ── 2. Login page ────────────────────────────────────────────────────────
    page.goto(BASE + '/login')
    shot(page, os.path.join(OUT, '01_login.png'))

    # ── Inject patient session (John Doe id=1) ───────────────────────────────
    patient = {"id": 1, "name": "John Doe", "email": "john.doe@example.com", "role": "patient"}
    page.goto(BASE + '/user')
    inject_user(page, patient)
    page.reload()
    shot(page, os.path.join(OUT, '02_user_dashboard.png'), wait_ms=2500)

    # ── 3. Add symptoms ──────────────────────────────────────────────────────
    page.goto(BASE + '/user/add-symptoms')
    inject_user(page, patient)
    page.reload()
    shot(page, os.path.join(OUT, '03_add_symptoms.png'))

    # ── 4. Health history ────────────────────────────────────────────────────
    page.goto(BASE + '/user/history')
    inject_user(page, patient)
    page.reload()
    shot(page, os.path.join(OUT, '04_health_history.png'))

    # ── 5. AI suggestions ────────────────────────────────────────────────────
    page.goto(BASE + '/user/ai-suggestions')
    inject_user(page, patient)
    page.reload()
    shot(page, os.path.join(OUT, '05_ai_suggestions.png'))

    # ── 6. User profile ──────────────────────────────────────────────────────
    page.goto(BASE + '/user/profile')
    inject_user(page, patient)
    page.reload()
    shot(page, os.path.join(OUT, '14_user_profile.png'))

    # ── Inject admin session ─────────────────────────────────────────────────
    admin = {"id": 3, "name": "Admin User", "email": "admin@hospital.com", "role": "admin"}

    # ── 7. Admin dashboard ───────────────────────────────────────────────────
    page.goto(BASE + '/admin')
    inject_user(page, admin)
    page.reload()
    shot(page, os.path.join(OUT, '06_admin_dashboard.png'), wait_ms=2500)

    # ── 8. User monitoring ───────────────────────────────────────────────────
    page.goto(BASE + '/admin/monitoring')
    inject_user(page, admin)
    page.reload()
    shot(page, os.path.join(OUT, '07_user_monitoring.png'))

    # ── 9. Severe cases ──────────────────────────────────────────────────────
    page.goto(BASE + '/admin/severe-cases')
    inject_user(page, admin)
    page.reload()
    shot(page, os.path.join(OUT, '08_severe_cases.png'))

    # ── 10. Alerts ───────────────────────────────────────────────────────────
    page.goto(BASE + '/admin/alerts')
    inject_user(page, admin)
    page.reload()
    shot(page, os.path.join(OUT, '09_alerts.png'))

    # ── 11. Reports ──────────────────────────────────────────────────────────
    page.goto(BASE + '/admin/reports')
    inject_user(page, admin)
    page.reload()
    shot(page, os.path.join(OUT, '10_reports.png'))
    shot(page, os.path.join(OUT, '13_admin_reports.png'))

    browser.close()
    print('\nAll screenshots done!')
