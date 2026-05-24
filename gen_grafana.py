"""Generate a realistic Grafana-style Healthcare monitoring dashboard screenshot."""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.gridspec as gridspec
import numpy as np

DARK   = '#1a1d2e'
PANEL  = '#212332'
BORDER = '#2d3048'
GREEN  = '#73bf69'
YELLOW = '#f5a623'
BLUE   = '#5794f2'
RED    = '#f2495c'
ORANGE = '#ff9830'
PURPLE = '#b877d9'
WHITE  = '#d8d9da'
GREY   = '#8e8e8e'

fig = plt.figure(figsize=(16, 10), facecolor=DARK)
fig.patch.set_facecolor(DARK)

# ── top bar ──────────────────────────────────────────────────────────────────
ax_top = fig.add_axes([0, 0.94, 1, 0.06])
ax_top.set_facecolor('#111217')
ax_top.axis('off')
ax_top.text(0.01, 0.5, '⬡  Grafana', color=ORANGE, fontsize=13, fontweight='bold',
            va='center', transform=ax_top.transAxes)
ax_top.text(0.18, 0.5, 'HealthAI System Overview', color=WHITE, fontsize=12,
            va='center', transform=ax_top.transAxes)
ax_top.text(0.72, 0.5, 'Last 1 hour  ▼    Auto  ▼    🔄  10s', color=GREY, fontsize=9,
            va='center', transform=ax_top.transAxes)
ax_top.text(0.98, 0.5, '◉  3 / 3 online', color=GREEN, fontsize=9,
            va='center', ha='right', transform=ax_top.transAxes)

t = np.linspace(0, 60, 120)   # 60 minutes, 120 data points

def make_axes(left, bottom, width, height):
    ax = fig.add_axes([left, bottom, width, height])
    ax.set_facecolor(PANEL)
    for sp in ax.spines.values():
        sp.set_color(BORDER)
    ax.tick_params(colors=GREY, labelsize=7)
    ax.xaxis.label.set_color(GREY)
    ax.yaxis.label.set_color(GREY)
    return ax

def panel_title(ax, title, value=None, unit='', color=WHITE):
    ax.set_title(title, color=GREY, fontsize=8, loc='left', pad=4)
    if value is not None:
        ax.text(1.0, 1.08, f'{value} {unit}', color=color, fontsize=11,
                fontweight='bold', ha='right', va='bottom',
                transform=ax.transAxes)

# ── ROW 1: stat cards ────────────────────────────────────────────────────────
cards = [
    ('API Request Rate',     '142',  'req/s', GREEN),
    ('Avg Response Time',    '38',   'ms',    BLUE),
    ('Error Rate',           '0.3',  '%',     YELLOW),
    ('Active Backend Pods',  '3',    'pods',  PURPLE),
]
for i, (title, val, unit, col) in enumerate(cards):
    ax = fig.add_axes([0.01 + i*0.248, 0.78, 0.235, 0.13])
    ax.set_facecolor(PANEL)
    for sp in ax.spines.values(): sp.set_color(BORDER)
    ax.axis('off')
    ax.text(0.05, 0.85, title, color=GREY, fontsize=8, transform=ax.transAxes, va='top')
    ax.text(0.05, 0.38, val,   color=col,  fontsize=28, fontweight='bold',
            transform=ax.transAxes, va='center')
    ax.text(0.05 + len(val)*0.07 + 0.01, 0.38, unit, color=GREY, fontsize=10,
            transform=ax.transAxes, va='center')

# ── ROW 2: API rate + Response time ──────────────────────────────────────────
ax1 = make_axes(0.01, 0.48, 0.485, 0.27)
rate = 120 + 30*np.sin(t/8) + np.random.normal(0, 5, len(t))
ax1.plot(t, rate, color=GREEN, lw=1.5)
ax1.fill_between(t, rate, alpha=0.15, color=GREEN)
ax1.set_xlim(0, 60); ax1.set_ylim(60, 200)
ax1.set_yticks([80, 120, 160, 200])
ax1.set_xticks([0, 15, 30, 45, 60])
ax1.set_xticklabels(['-60m','-45m','-30m','-15m','now'])
panel_title(ax1, 'API Request Rate (req/s)', '142', 'req/s', GREEN)
ax1.axhline(100, color=YELLOW, lw=0.8, linestyle='--', alpha=0.5)
ax1.text(1, 102, 'threshold', color=YELLOW, fontsize=6, alpha=0.7)
ax1.grid(True, color=BORDER, lw=0.5, alpha=0.6)

ax2 = make_axes(0.505, 0.48, 0.485, 0.27)
resp = 35 + 8*np.sin(t/6) + np.random.normal(0, 2, len(t))
ax2.plot(t, resp, color=BLUE, lw=1.5)
ax2.fill_between(t, resp, alpha=0.15, color=BLUE)
spikes = [25, 40, 52]
for s in spikes:
    idx = int(s/60 * len(t))
    resp[idx] = resp[idx] + 40 + np.random.uniform(10, 30)
ax2.plot(t, resp, color=BLUE, lw=1.5)
ax2.set_xlim(0, 60); ax2.set_ylim(0, 120)
ax2.set_xticks([0, 15, 30, 45, 60])
ax2.set_xticklabels(['-60m','-45m','-30m','-15m','now'])
ax2.set_yticks([0, 30, 60, 90, 120])
panel_title(ax2, 'Response Time P95 (ms)', '38', 'ms', BLUE)
ax2.axhline(100, color=RED, lw=0.8, linestyle='--', alpha=0.6)
ax2.text(1, 102, 'SLA limit', color=RED, fontsize=6, alpha=0.8)
ax2.grid(True, color=BORDER, lw=0.5, alpha=0.6)

# ── ROW 3: CPU + Memory + HPA ─────────────────────────────────────────────────
ax3 = make_axes(0.01, 0.20, 0.31, 0.25)
cpu1 = 45 + 15*np.sin(t/7 + 0.5) + np.random.normal(0, 3, len(t))
cpu2 = 38 + 12*np.sin(t/7 + 1.2) + np.random.normal(0, 2, len(t))
cpu3 = 52 + 18*np.sin(t/7 + 0.1) + np.random.normal(0, 4, len(t))
ax3.plot(t, cpu1, color=GREEN,  lw=1.3, label='backend-pod-1')
ax3.plot(t, cpu2, color=BLUE,   lw=1.3, label='backend-pod-2')
ax3.plot(t, cpu3, color=ORANGE, lw=1.3, label='backend-pod-3')
ax3.set_xlim(0, 60); ax3.set_ylim(0, 100)
ax3.set_xticks([0, 20, 40, 60])
ax3.set_xticklabels(['-60m','-40m','-20m','now'])
ax3.axhline(60, color=YELLOW, lw=0.8, linestyle='--', alpha=0.5)
ax3.legend(fontsize=6, facecolor=PANEL, labelcolor=WHITE, loc='upper right',
           framealpha=0.8)
panel_title(ax3, 'CPU Utilisation (%)', '45', '%', GREEN)
ax3.grid(True, color=BORDER, lw=0.5, alpha=0.6)

ax4 = make_axes(0.335, 0.20, 0.31, 0.25)
mem1 = 320 + 20*np.sin(t/10) + np.random.normal(0, 5, len(t))
mem2 = 290 + 15*np.sin(t/10 + 1) + np.random.normal(0, 4, len(t))
ax4.plot(t, mem1, color=PURPLE, lw=1.3, label='backend-pod-1')
ax4.plot(t, mem2, color=BLUE,   lw=1.3, label='backend-pod-2')
ax4.fill_between(t, mem1, alpha=0.1, color=PURPLE)
ax4.set_xlim(0, 60); ax4.set_ylim(200, 512)
ax4.set_xticks([0, 20, 40, 60])
ax4.set_xticklabels(['-60m','-40m','-20m','now'])
ax4.axhline(400, color=YELLOW, lw=0.8, linestyle='--', alpha=0.5)
ax4.legend(fontsize=6, facecolor=PANEL, labelcolor=WHITE, loc='upper right',
           framealpha=0.8)
panel_title(ax4, 'Memory Usage (MiB)', '314', 'MiB', PURPLE)
ax4.grid(True, color=BORDER, lw=0.5, alpha=0.6)

ax5 = make_axes(0.66, 0.20, 0.33, 0.25)
pods_t = np.array([0,10,10,20,20,35,35,45,45,55,55,60])
pods_v = np.array([2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 3, 3])
ax5.step(pods_t, pods_v, color=ORANGE, lw=2, where='post')
ax5.fill_between(pods_t, pods_v, step='post', alpha=0.15, color=ORANGE)
ax5.set_xlim(0, 60); ax5.set_ylim(0, 6)
ax5.set_yticks([0, 1, 2, 3, 4, 5, 6])
ax5.set_xticks([0, 20, 40, 60])
ax5.set_xticklabels(['-60m','-40m','-20m','now'])
ax5.axhline(6, color=RED, lw=0.8, linestyle='--', alpha=0.5)
ax5.text(1, 6.1, 'max replicas', color=RED, fontsize=6, ha='right', alpha=0.8,
         transform=ax5.get_xaxis_transform())
panel_title(ax5, 'HPA Replica Count (backend)', '3', 'pods', ORANGE)
ax5.grid(True, color=BORDER, lw=0.5, alpha=0.6)

# ── bottom bar ────────────────────────────────────────────────────────────────
ax_bot = fig.add_axes([0, 0, 1, 0.17])
ax_bot.set_facecolor(PANEL)
ax_bot.axis('off')
ax_bot.set_xlim(0, 1); ax_bot.set_ylim(0, 1)
ax_bot.add_patch(mpatches.FancyBboxPatch([0.005, 0.05], 0.98, 0.9,
                 boxstyle='round,pad=0.01', facecolor=DARK, edgecolor=BORDER, lw=1))
ax_bot.text(0.02, 0.85, 'Microservice Health Status', color=GREY, fontsize=8,
            fontweight='bold')
services = [
    ('Auth Service',      '99.98%', '12 ms',  GREEN),
    ('AI Analysis Engine','99.91%', '44 ms',  GREEN),
    ('Data Sync Service', '99.95%', '28 ms',  GREEN),
    ('MySQL (healthcare_db)','100%','3 ms',   GREEN),
    ('Redis Cache',       '100%',   '< 1 ms', GREEN),
    ('Prometheus',        '100%',   '—',      GREEN),
]
for i, (name, uptime, resp, col) in enumerate(services):
    x = 0.02 + i * 0.165
    dot = '●'
    ax_bot.text(x, 0.58, dot,  color=col,  fontsize=10)
    ax_bot.text(x+0.018, 0.60, name,   color=WHITE,  fontsize=7)
    ax_bot.text(x+0.018, 0.38, uptime, color=GREEN,  fontsize=7)
    ax_bot.text(x+0.018, 0.18, resp,   color=BLUE,   fontsize=7)

fig.text(0.5, 0.005, 'HealthAI Monitoring  •  Prometheus + Grafana  •  Namespace: healthcare',
         color=GREY, fontsize=7, ha='center')

OUT = r'd:\M.tech\SEM IV\Healthcare Dashboard Development\screenshots\11_grafana.png'
plt.savefig(OUT, dpi=150, bbox_inches='tight', facecolor=DARK, edgecolor='none')
plt.close()
print(f'Saved: {OUT}')
