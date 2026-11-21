"""
Generate high-resolution academic UML and architectural diagrams for the InboxPilot Project Report.
Outputs 8 figures + 4 UI screenshots to D:/InboxPilot-Frontend/diagrams/
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = r"D:\InboxPilot-Frontend\diagrams"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Set global styles
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

# -------------------------------------------------------------
# 1. Figure 1: Workflow Diagram
# -------------------------------------------------------------
def create_workflow_diagram():
    fig, ax = plt.subplots(figsize=(14, 8), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 8)
    ax.axis('off')

    # Background canvas
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_facecolor('#F8FAFC')

    # Title
    ax.text(7, 7.5, "Figure No-1: InboxPilot End-to-End Workflow Diagram", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#0F172A')

    steps = [
        {"x": 1.2, "y": 5.2, "w": 2.2, "h": 1.4, "title": "1. User Authentication", "desc": "Google OAuth 2.0 PKCE\nJWT Bearer Session\nHTTP-Only Cookie", "bg": "#EFF6FF", "border": "#3B82F6"},
        {"x": 4.2, "y": 5.2, "w": 2.2, "h": 1.4, "title": "2. Mailbox Ingestion", "desc": "Gmail API v1 Ingestion\nIncremental Sync\nCheckpoint Tracking", "bg": "#EFF6FF", "border": "#3B82F6"},
        {"x": 7.2, "y": 5.2, "w": 2.2, "h": 1.4, "title": "3. Cleaning & Parsing", "desc": "Strip HTML & MIME\nNormalize Metadata\nClean Email Body", "bg": "#F0FDF4", "border": "#10B981"},
        {"x": 10.2, "y": 5.2, "w": 2.2, "h": 1.4, "title": "4. Vector Embedding", "desc": "768-Dim Dense Vectors\nPinecone Serverless\nUser Namespaced Index", "bg": "#F0FDF4", "border": "#10B981"},
        
        {"x": 10.2, "y": 1.8, "w": 2.2, "h": 1.4, "title": "5. Query Processing", "desc": "Natural Language Query\nChat History Injection\nSimilarity Search", "bg": "#FFFBEB", "border": "#F59E0B"},
        {"x": 7.2, "y": 1.8, "w": 2.2, "h": 1.4, "title": "6. Dense Retrieval", "desc": "Cosine Metric Matching\nTop-K Candidate Chunks\nRelevance Scoring", "bg": "#FFFBEB", "border": "#F59E0B"},
        {"x": 4.2, "y": 1.8, "w": 2.2, "h": 1.4, "title": "7. Grounded LLM Gen", "desc": "Google Gemini 2.5\nStrict Source Grounding\nCite [1], [2] Badges", "bg": "#FDF2F8", "border": "#EC4899"},
        {"x": 1.2, "y": 1.8, "w": 2.2, "h": 1.4, "title": "8. Frontend Render", "desc": "Vite 6 + React 18 UI\nInteractive Citations\nSource Inspector Modal", "bg": "#FDF2F8", "border": "#EC4899"},
    ]

    for step in steps:
        box = patches.FancyBboxPatch((step['x'], step['y']), step['w'], step['h'],
                                     boxstyle="round,pad=0.1,rounding_size=0.15",
                                     linewidth=2, edgecolor=step['border'], facecolor=step['bg'])
        ax.add_patch(box)
        ax.text(step['x'] + step['w']/2, step['y'] + step['h'] - 0.35, step['title'],
                ha='center', va='center', fontsize=9.5, fontweight='bold', color='#1E293B')
        ax.text(step['x'] + step['w']/2, step['y'] + 0.45, step['desc'],
                ha='center', va='center', fontsize=8, color='#475569', linespacing=1.25)

    # Connecting arrows
    arrow_props = dict(arrowstyle="->", color="#0284C7", lw=2.5, mutation_scale=15)
    
    # Horizontal top arrows
    ax.annotate("", xy=(4.1, 5.9), xytext=(3.5, 5.9), arrowprops=arrow_props)
    ax.annotate("", xy=(7.1, 5.9), xytext=(6.5, 5.9), arrowprops=arrow_props)
    ax.annotate("", xy=(10.1, 5.9), xytext=(9.5, 5.9), arrowprops=arrow_props)

    # Downward turn
    ax.annotate("", xy=(11.3, 3.3), xytext=(11.3, 5.1), 
                arrowprops=dict(arrowstyle="->", color="#D97706", lw=2.5, mutation_scale=15))

    # Horizontal bottom arrows
    ax.annotate("", xy=(9.5, 2.5), xytext=(10.1, 2.5), arrowprops=dict(arrowstyle="->", color="#D97706", lw=2.5, mutation_scale=15))
    ax.annotate("", xy=(6.5, 2.5), xytext=(7.1, 2.5), arrowprops=dict(arrowstyle="->", color="#DB2777", lw=2.5, mutation_scale=15))
    ax.annotate("", xy=(3.5, 2.5), xytext=(4.1, 2.5), arrowprops=dict(arrowstyle="->", color="#DB2777", lw=2.5, mutation_scale=15))

    # Data Store icon in the center
    db_box = patches.FancyBboxPatch((5.5, 3.7), 3.0, 1.1,
                                    boxstyle="round,pad=0.1,rounding_size=0.1",
                                    linewidth=1.5, edgecolor='#64748B', facecolor='#FFFFFF')
    ax.add_patch(db_box)
    ax.text(7.0, 4.4, "MongoDB Atlas & Pinecone Index", ha='center', va='center', fontsize=9.5, fontweight='bold', color='#334155')
    ax.text(7.0, 3.95, "Dual Persistence: Structured JSON & 768-D Vectors", ha='center', va='center', fontsize=7.5, color='#64748B')

    # Bidirectional links to central stores
    ax.annotate("", xy=(7.0, 4.9), xytext=(7.0, 5.1), arrowprops=dict(arrowstyle="<->", color="#64748B", lw=1.5, linestyle="--"))
    ax.annotate("", xy=(7.0, 3.6), xytext=(7.0, 3.3), arrowprops=dict(arrowstyle="<->", color="#64748B", lw=1.5, linestyle="--"))

    plt.tight_layout()
    out_path = os.path.join(OUTPUT_DIR, "workflow_diagram.png")
    plt.savefig(out_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved:", out_path)

# -------------------------------------------------------------
# 2. Figure 2: System Architecture Diagram
# -------------------------------------------------------------
def create_architecture_diagram():
    fig, ax = plt.subplots(figsize=(14, 9), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC')

    ax.text(7, 8.5, "Figure No-2: InboxPilot Three-Tier System Architecture", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#0F172A')

    # Tier 1: Presentation Tier
    tier1 = patches.FancyBboxPatch((0.8, 5.6), 12.4, 2.4, boxstyle="round,pad=0.1,rounding_size=0.15",
                                  linewidth=1.5, edgecolor='#3B82F6', facecolor='#EFF6FF')
    ax.add_patch(tier1)
    ax.text(1.2, 7.6, "TIER 1: PRESENTATION TIER (Vite 6 + React 18 SPA)", fontsize=11, fontweight='bold', color='#1D4ED8')
    
    t1_components = [
        ("Login & OAuth Handler", "Google Sign-In\nPKCE Flow\nCookie Auth", 1.2, 5.9),
        ("Unified Sidebar", "Search & Navigation\nRecent Conversations\nMailbox Explorer Trigger", 4.2, 5.9),
        ("Chat & Hero Stage", "Prompt Suggestions\nMarkdown Answer Renderer\nInline Citations [1]", 7.2, 5.9),
        ("Inspection Modals", "Email Explorer\nSource Inspector\nLight/Dark Theme", 10.2, 5.9),
    ]
    for title, desc, x, y in t1_components:
        box = patches.FancyBboxPatch((x, y), 2.6, 1.4, boxstyle="round,pad=0.08,rounding_size=0.1",
                                     linewidth=1, edgecolor='#93C5FD', facecolor='#FFFFFF')
        ax.add_patch(box)
        ax.text(x+1.3, y+1.1, title, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#1E3A8A')
        ax.text(x+1.3, y+0.45, desc, ha='center', va='center', fontsize=7.5, color='#475569', linespacing=1.2)

    # Tier 2: Application Tier (FastAPI)
    tier2 = patches.FancyBboxPatch((0.8, 2.8), 12.4, 2.4, boxstyle="round,pad=0.1,rounding_size=0.15",
                                  linewidth=1.5, edgecolor='#10B981', facecolor='#F0FDF4')
    ax.add_patch(tier2)
    ax.text(1.2, 4.8, "TIER 2: APPLICATION SERVICES TIER (FastAPI ASGI Engine)", fontsize=11, fontweight='bold', color='#047857')

    t2_components = [
        ("Auth & Security", "JWT Validation\nAES Credential Encrypt\nCORS & State Guard", 1.2, 3.1),
        ("Ingestion Engine", "Gmail Ingestion (/fetch)\nCheckpoint Sync (/sync)\nMIME/HTML Sanitizer", 4.2, 3.1),
        ("RAG Chat Orchestrator", "Intent Analysis\nDense Semantic Search\nEvidence Prompt Builder", 7.2, 3.1),
        ("Vector Store Client", "Pinecone Index Ops\n768-D Embedding Driver\nCosine Similarity Filter", 10.2, 3.1),
    ]
    for title, desc, x, y in t2_components:
        box = patches.FancyBboxPatch((x, y), 2.6, 1.4, boxstyle="round,pad=0.08,rounding_size=0.1",
                                     linewidth=1, edgecolor='#A7F3D0', facecolor='#FFFFFF')
        ax.add_patch(box)
        ax.text(x+1.3, y+1.1, title, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#065F46')
        ax.text(x+1.3, y+0.45, desc, ha='center', va='center', fontsize=7.5, color='#475569', linespacing=1.2)

    # Tier 3: Data & Cloud AI Services
    tier3 = patches.FancyBboxPatch((0.8, 0.4), 12.4, 2.0, boxstyle="round,pad=0.1,rounding_size=0.15",
                                  linewidth=1.5, edgecolor='#8B5CF6', facecolor='#F5F3FF')
    ax.add_patch(tier3)
    ax.text(1.2, 2.05, "TIER 3: DATA, VECTOR & EXTERNAL CLOUD SERVICES", fontsize=11, fontweight='bold', color='#6D28D9')

    t3_components = [
        ("Google Gmail API", "OAuth 2.0 & Gmail v1\nRaw MIME Messages\nIncremental Checkpoints", 1.2, 0.6),
        ("MongoDB Atlas", "Users Collection\nEmails Collection\nChats Turn History", 4.2, 0.6),
        ("Pinecone Vector DB", "Serverless Index\n768-Dim Dense Space\nPer-User Namespace Isolation", 7.2, 0.6),
        ("Google Gemini 2.5", "GenAI SDK Client\nStrict System Grounding\nTemperature=0.2", 10.2, 0.6),
    ]
    for title, desc, x, y in t3_components:
        box = patches.FancyBboxPatch((x, y), 2.6, 1.2, boxstyle="round,pad=0.08,rounding_size=0.1",
                                     linewidth=1, edgecolor='#DDD6FE', facecolor='#FFFFFF')
        ax.add_patch(box)
        ax.text(x+1.3, y+0.9, title, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#4C1D95')
        ax.text(x+1.3, y+0.38, desc, ha='center', va='center', fontsize=7.5, color='#475569', linespacing=1.15)

    # Connecting vertical arrows
    for x in [2.5, 5.5, 8.5, 11.5]:
        ax.annotate("", xy=(x, 5.5), xytext=(x, 5.7), arrowprops=dict(arrowstyle="<->", color="#3B82F6", lw=2))
        ax.annotate("", xy=(x, 2.7), xytext=(x, 2.9), arrowprops=dict(arrowstyle="<->", color="#10B981", lw=2))

    plt.tight_layout()
    out_path = os.path.join(OUTPUT_DIR, "architecture_diagram.png")
    plt.savefig(out_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved:", out_path)

# -------------------------------------------------------------
# 3. Figure 3: Data Flow Diagram (Level 1)
# -------------------------------------------------------------
def create_dfd_diagram():
    fig, ax = plt.subplots(figsize=(14, 8.5), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 8.5)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC')

    ax.text(7, 8.1, "Figure No-3: Data Flow Diagram (DFD Level 1) for InboxPilot", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#0F172A')

    # External Entities (Rectangles)
    def draw_entity(x, y, w, h, name):
        box = patches.Rectangle((x, y), w, h, linewidth=2, edgecolor='#1E293B', facecolor='#E2E8F0')
        ax.add_patch(box)
        ax.text(x+w/2, y+h/2, name, ha='center', va='center', fontsize=9.5, fontweight='bold', color='#0F172A')

    draw_entity(0.6, 5.8, 1.8, 1.0, "USER\n(Browser)")
    draw_entity(11.6, 6.2, 1.8, 1.0, "GMAIL API\n(Google)")
    draw_entity(11.6, 3.8, 1.8, 1.0, "PINECONE\n(Vector DB)")
    draw_entity(11.6, 1.4, 1.8, 1.0, "GEMINI 2.5\n(Google AI)")

    # Processes (Circles / Rounded Rectangles)
    processes = [
        (4.0, 6.2, "1.0\nAuth & Session\nManagement", "#EFF6FF", "#2563EB"),
        (7.8, 6.2, "2.0\nMailbox Ingestion\n& Preprocessing", "#F0FDF4", "#059669"),
        (7.8, 3.8, "3.0\nVector Embedding\n& Upsert", "#FFFBEB", "#D97706"),
        (4.0, 3.8, "4.0\nConversational RAG\nQuery Processing", "#FDF2F8", "#DB2777"),
        (4.0, 1.4, "5.0\nChat History &\nMailbox Explorer", "#F5F3FF", "#7C3AED"),
    ]

    for x, y, label, bg, border in processes:
        box = patches.FancyBboxPatch((x-0.9, y-0.55), 1.8, 1.1, boxstyle="round,pad=0.1,rounding_size=0.4",
                                     linewidth=2, edgecolor=border, facecolor=bg)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#1E293B')

    # Data Stores (Open-ended parallel lines)
    def draw_datastore(x, y, w, h, d_id, name):
        ax.plot([x, x+w], [y, y], color='#475569', lw=2)
        ax.plot([x, x+w], [y+h, y+h], color='#475569', lw=2)
        ax.plot([x+0.5, x+0.5], [y, y+h], color='#475569', lw=1.5)
        ax.fill_between([x, x+w], [y, y], [y+h, y+h], color='#FFFFFF', alpha=0.9)
        ax.text(x+0.25, y+h/2, d_id, ha='center', va='center', fontsize=8, fontweight='bold', color='#0F172A')
        ax.text(x+0.6+(w-0.6)/2, y+h/2, name, ha='center', va='center', fontsize=8, fontweight='bold', color='#334155')

    draw_datastore(0.6, 4.0, 2.0, 0.6, "D1", "Users Collection")
    draw_datastore(0.6, 2.5, 2.0, 0.6, "D2", "Emails Collection")
    draw_datastore(0.6, 1.0, 2.0, 0.6, "D3", "Chats Collection")

    # Arrows with annotations
    ap = dict(arrowstyle="->", color="#0284C7", lw=1.5, mutation_scale=12)
    
    # User to 1.0
    ax.annotate("1. Login Request", xy=(3.1, 6.5), xytext=(2.4, 6.5), arrowprops=ap, fontsize=7)
    # 1.0 to D1
    ax.annotate("Store Token/User", xy=(2.6, 4.3), xytext=(3.5, 5.8), arrowprops=ap, fontsize=7)
    # 1.0 to 2.0
    ax.annotate("Authorized Token", xy=(6.9, 6.5), xytext=(4.9, 6.5), arrowprops=ap, fontsize=7)
    # 2.0 to Gmail
    ax.annotate("Fetch /messages", xy=(11.6, 6.7), xytext=(8.7, 6.7), arrowprops=ap, fontsize=7)
    # Gmail to 2.0
    ax.annotate("Raw MIME JSON", xy=(8.7, 6.3), xytext=(11.6, 6.3), arrowprops=ap, fontsize=7)
    # 2.0 to D2
    ax.annotate("Parsed Messages", xy=(2.6, 2.8), xytext=(7.2, 5.8), arrowprops=ap, fontsize=7)
    # 2.0 to 3.0
    ax.annotate("Cleaned Text Chunks", xy=(7.8, 4.4), xytext=(7.8, 5.6), arrowprops=ap, fontsize=7)
    # 3.0 to Pinecone
    ax.annotate("768-D Vectors & Meta", xy=(11.6, 4.3), xytext=(8.7, 4.3), arrowprops=ap, fontsize=7)
    # User to 4.0
    ax.annotate("Natural Lang Question", xy=(3.1, 4.2), xytext=(1.8, 5.8), arrowprops=ap, fontsize=7)
    # 4.0 to Pinecone
    ax.annotate("Query Vector Search", xy=(11.6, 3.9), xytext=(4.9, 3.9), arrowprops=ap, fontsize=7)
    # 4.0 to Gemini
    ax.annotate("Context & Prompt", xy=(11.6, 2.0), xytext=(4.9, 3.5), arrowprops=ap, fontsize=7)
    # Gemini to 4.0
    ax.annotate("Grounded Answer [1]", xy=(4.9, 3.7), xytext=(11.6, 1.8), arrowprops=ap, fontsize=7)
    # 4.0 to D3
    ax.annotate("Persist Turn History", xy=(2.6, 1.3), xytext=(3.5, 3.4), arrowprops=ap, fontsize=7)
    # 4.0 to User
    ax.annotate("Synthesized Answer + Badges", xy=(1.5, 5.8), xytext=(3.3, 4.5), arrowprops=ap, fontsize=7)

    plt.tight_layout()
    out_path = os.path.join(OUTPUT_DIR, "dfd_level1.png")
    plt.savefig(out_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved:", out_path)

# -------------------------------------------------------------
# 4. Figure 4: Use Case Diagram
# -------------------------------------------------------------
def create_use_case_diagram():
    fig, ax = plt.subplots(figsize=(14, 9), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC')

    ax.text(7, 8.5, "Figure No-4: Use Case Diagram for InboxPilot", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#0F172A')

    # System Boundary Box
    system_box = patches.FancyBboxPatch((3.0, 0.4), 8.0, 7.8, boxstyle="round,pad=0.1,rounding_size=0.15",
                                        linewidth=2, edgecolor='#0EA5E9', facecolor='#F0F9FF', alpha=0.5)
    ax.add_patch(system_box)
    ax.text(7.0, 8.0, "InboxPilot Email Intelligence System Boundary", ha='center', va='center', fontsize=11, fontweight='bold', color='#0369A1')

    # Stick figure actor function
    def draw_actor(x, y, name):
        # Head
        circle = patches.Circle((x, y+0.4), 0.18, edgecolor='#0F172A', facecolor='#E2E8F0', lw=1.8)
        ax.add_patch(circle)
        # Body
        ax.plot([x, x], [y+0.22, y-0.2], color='#0F172A', lw=2)
        # Arms
        ax.plot([x-0.25, x+0.25], [y+0.08, y+0.08], color='#0F172A', lw=2)
        # Legs
        ax.plot([x, x-0.2], [y-0.2, y-0.55], color='#0F172A', lw=2)
        ax.plot([x, x+0.2], [y-0.2, y-0.55], color='#0F172A', lw=2)
        # Label
        ax.text(x, y-0.75, name, ha='center', va='center', fontsize=9, fontweight='bold', color='#0F172A')

    draw_actor(1.2, 4.5, "User\n(Authorized)")
    draw_actor(12.6, 6.8, "Google\nOAuth & Gmail")
    draw_actor(12.6, 4.5, "Pinecone\nVector DB")
    draw_actor(12.6, 2.2, "Google\nGemini 2.5 AI")

    # Use Cases (Ellipses)
    use_cases = [
        (5.0, 7.2, "UC1: Sign In via Google OAuth"),
        (8.5, 7.2, "UC2: Ingest & Checkpoint Sync"),
        (5.0, 5.8, "UC3: Browse Indexed Emails"),
        (8.5, 5.8, "UC4: Embed & Index Messages"),
        (5.0, 4.4, "UC5: Ask Natural Language Question"),
        (8.5, 4.4, "UC6: Retrieve Top-K Semantics"),
        (5.0, 3.0, "UC7: Inspect Cited Email Sources"),
        (8.5, 3.0, "UC8: Synthesize Grounded Answer"),
        (5.0, 1.6, "UC9: Manage Chat History"),
        (8.5, 1.6, "UC10: Toggle Light / Dark UI"),
    ]

    for x, y, title in use_cases:
        ellipse = patches.Ellipse((x, y), 3.0, 0.9, edgecolor='#0284C7', facecolor='#FFFFFF', lw=1.5)
        ax.add_patch(ellipse)
        ax.text(x, y, title, ha='center', va='center', fontsize=8, fontweight='bold', color='#1E293B')

    # Association lines
    # User to primary use cases
    for uy in [7.2, 5.8, 4.4, 3.0, 1.6]:
        ax.plot([1.5, 3.5], [4.5, uy], color='#334155', lw=1.2)

    # Secondary actors to use cases
    # Gmail to UC1, UC2
    ax.plot([10.0, 12.3], [7.2, 6.8], color='#334155', lw=1.2)
    ax.plot([6.5, 12.3], [7.2, 6.8], color='#334155', lw=1.2, linestyle=':')
    
    # Pinecone to UC4, UC6
    ax.plot([10.0, 12.3], [5.8, 4.5], color='#334155', lw=1.2)
    ax.plot([10.0, 12.3], [4.4, 4.5], color='#334155', lw=1.2)

    # Gemini to UC8
    ax.plot([10.0, 12.3], [3.0, 2.2], color='#334155', lw=1.2)

    # <<include>> and <<extend>> dependencies
    def draw_dep(x1, y1, x2, y2, label):
        ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", color="#DC2626", lw=1.2, linestyle="--"))
        ax.text((x1+x2)/2, (y1+y2)/2 + 0.15, label, ha='center', va='center', fontsize=6.5, color='#DC2626', fontweight='bold')

    draw_dep(6.5, 4.4, 7.0, 4.4, "<<include>>")
    draw_dep(6.5, 3.0, 7.0, 3.0, "<<include>>")
    draw_dep(6.5, 7.2, 7.0, 7.2, "<<include>>")

    plt.tight_layout()
    out_path = os.path.join(OUTPUT_DIR, "use_case_diagram.png")
    plt.savefig(out_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved:", out_path)

# -------------------------------------------------------------
# 5. Figure 5: Database and File Design
# -------------------------------------------------------------
def create_db_design_diagram():
    fig, ax = plt.subplots(figsize=(14, 9), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC')

    ax.text(7, 8.5, "Figure No-5: Database and Vector Storage Schema Design", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#0F172A')

    # Tables / Collections
    tables = [
        {
            "name": "Collection: USERS (MongoDB Atlas)",
            "x": 0.8, "y": 4.5, "w": 5.8, "h": 3.6, "header_bg": "#1E3A8A",
            "fields": [
                ("google_sub", "String (PK)", "Unique Google user ID"),
                ("email", "String (Indexed)", "Primary Gmail address"),
                ("name", "String", "User display name"),
                ("picture", "String (URL)", "Google avatar image URL"),
                ("oauth_credentials", "Encrypted Dict", "AES-256 encrypted refresh token"),
                ("checkpoint_ms", "Int64", "Epoch timestamp of last synced email"),
                ("checkpoint_timestamp", "DateTime", "ISO format sync checkpoint"),
                ("created_at / updated_at", "DateTime", "Account auditing timestamps")
            ]
        },
        {
            "name": "Collection: EMAILS (MongoDB Atlas)",
            "x": 7.4, "y": 4.5, "w": 5.8, "h": 3.6, "header_bg": "#065F46",
            "fields": [
                ("email_id", "String (PK)", "Gmail permanent message ID"),
                ("user_id", "String (FK)", "Owner's google_sub reference"),
                ("thread_id", "String", "Gmail conversation thread ID"),
                ("sender", "String", "From: header address"),
                ("receiver", "String", "To: header address"),
                ("subject", "String", "Cleaned subject line"),
                ("date / internal_date", "String / Int64", "RFC 2822 & epoch millisecond date"),
                ("snippet / body", "Text (Sanitized)", "Clean plain text stripped of HTML")
            ]
        },
        {
            "name": "Collection: CHATS (MongoDB Atlas)",
            "x": 0.8, "y": 0.4, "w": 5.8, "h": 3.6, "header_bg": "#831843",
            "fields": [
                ("_id", "ObjectId (PK)", "MongoDB primary key"),
                ("conversation_id", "UUID4 (Indexed)", "Multi-turn session identifier"),
                ("user_id", "String (FK)", "Owner's google_sub reference"),
                ("question", "Text", "User natural language query"),
                ("answer", "Text", "Grounded synthesized markdown answer"),
                ("sources", "Array<Object>", "[{source_id, email_id, snippet, score}]"),
                ("top_k", "Integer", "Number of vectors retrieved (1-20)"),
                ("created_at", "DateTime", "Turn creation timestamp")
            ]
        },
        {
            "name": "Index: INBOXPILOT-EMAILS (Pinecone Serverless)",
            "x": 7.4, "y": 0.4, "w": 5.8, "h": 3.6, "header_bg": "#701A75",
            "fields": [
                ("id", "String (Vector ID)", "Format: user_id#email_id"),
                ("values", "Float32[768]", "Dense embedding coordinates"),
                ("namespace", "String", "Per-user partition namespace"),
                ("metadata.user_id", "String", "Filter attribute for access control"),
                ("metadata.subject", "String", "Email subject text preview"),
                ("metadata.sender", "String", "Originating email sender"),
                ("metadata.date", "String", "Normalized message date"),
                ("metadata.snippet", "String", "Searchable content snippet (500 chars)")
            ]
        }
    ]

    for t in tables:
        # Table Header
        h_box = patches.FancyBboxPatch((t['x'], t['y']+t['h']-0.6), t['w'], 0.6,
                                       boxstyle="round,pad=0.04,rounding_size=0.1",
                                       linewidth=1.5, edgecolor=t['header_bg'], facecolor=t['header_bg'])
        ax.add_patch(h_box)
        ax.text(t['x']+t['w']/2, t['y']+t['h']-0.3, t['name'], ha='center', va='center',
                fontsize=9.5, fontweight='bold', color='#FFFFFF')

        # Table Body
        b_box = patches.FancyBboxPatch((t['x'], t['y']), t['w'], t['h']-0.6,
                                       boxstyle="round,pad=0.04,rounding_size=0.1",
                                       linewidth=1.5, edgecolor=t['header_bg'], facecolor='#FFFFFF')
        ax.add_patch(b_box)

        # Field Rows
        row_y = t['y'] + t['h'] - 0.95
        for col1, col2, col3 in t['fields']:
            ax.text(t['x']+0.2, row_y, col1, fontsize=8, fontweight='bold', color='#0F172A')
            ax.text(t['x']+2.2, row_y, col2, fontsize=7.5, fontstyle='italic', color='#475569')
            ax.text(t['x']+3.6, row_y, col3, fontsize=7.5, color='#64748B')
            ax.plot([t['x']+0.1, t['x']+t['w']-0.1], [row_y-0.1, row_y-0.1], color='#E2E8F0', lw=0.8)
            row_y -= 0.35

    plt.tight_layout()
    out_path = os.path.join(OUTPUT_DIR, "db_design.png")
    plt.savefig(out_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved:", out_path)

# -------------------------------------------------------------
# 6. Figure 6: Entity-Relationship (ER) Diagram
# -------------------------------------------------------------
def create_er_diagram():
    fig, ax = plt.subplots(figsize=(14, 8.5), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 8.5)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC')

    ax.text(7, 8.0, "Figure No-6: Entity-Relationship (ER) Diagram for InboxPilot", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#0F172A')

    def draw_entity(x, y, w, h, name, key_attr):
        box = patches.Rectangle((x, y), w, h, linewidth=2, edgecolor='#1E3A8A', facecolor='#EFF6FF')
        ax.add_patch(box)
        ax.text(x+w/2, y+h-0.3, name, ha='center', va='center', fontsize=10, fontweight='bold', color='#1E3A8A')
        ax.text(x+w/2, y+0.35, f"PK: {key_attr}", ha='center', va='center', fontsize=8, fontstyle='italic', color='#475569')

    def draw_relation(x, y, text):
        poly = patches.Polygon([[x, y+0.45], [x+0.8, y], [x, y-0.45], [x-0.8, y]],
                               closed=True, edgecolor='#D97706', facecolor='#FEF3C7', lw=1.8)
        ax.add_patch(poly)
        ax.text(x, y, text, ha='center', va='center', fontsize=8, fontweight='bold', color='#92400E')

    # Entities
    draw_entity(1.0, 5.0, 2.4, 1.2, "USER", "google_sub")
    draw_entity(6.0, 5.0, 2.4, 1.2, "EMAIL", "email_id")
    draw_entity(11.0, 5.0, 2.4, 1.2, "VECTOR_INDEX", "vector_id")
    draw_entity(1.0, 1.5, 2.4, 1.2, "CHAT_SESSION", "conversation_id")
    draw_entity(6.0, 1.5, 2.4, 1.2, "CHAT_TURN", "_id")
    draw_entity(11.0, 1.5, 2.4, 1.2, "SOURCE_CITE", "source_id")

    # Relationships
    draw_relation(4.6, 5.6, "OWNS\n(1:N)")
    draw_relation(9.6, 5.6, "EMBEDS\n(1:1)")
    draw_relation(1.0, 3.8, "STARTS\n(1:N)")
    draw_relation(4.6, 2.1, "HAS\n(1:N)")
    draw_relation(9.6, 2.1, "CITES\n(1:N)")

    # Connectors
    ax.plot([3.4, 3.8], [5.6, 5.6], color='#1E293B', lw=1.5)
    ax.plot([5.4, 6.0], [5.6, 5.6], color='#1E293B', lw=1.5)
    ax.text(3.5, 5.8, "1", fontsize=9, fontweight='bold')
    ax.text(5.8, 5.8, "N", fontsize=9, fontweight='bold')

    ax.plot([8.4, 8.8], [5.6, 5.6], color='#1E293B', lw=1.5)
    ax.plot([10.4, 11.0], [5.6, 5.6], color='#1E293B', lw=1.5)
    ax.text(8.5, 5.8, "1", fontsize=9, fontweight='bold')
    ax.text(10.8, 5.8, "1", fontsize=9, fontweight='bold')

    ax.plot([2.2, 2.2], [5.0, 4.25], color='#1E293B', lw=1.5)
    ax.plot([2.2, 2.2], [3.35, 2.7], color='#1E293B', lw=1.5)
    ax.text(2.4, 4.8, "1", fontsize=9, fontweight='bold')
    ax.text(2.4, 2.9, "N", fontsize=9, fontweight='bold')

    ax.plot([3.4, 3.8], [2.1, 2.1], color='#1E293B', lw=1.5)
    ax.plot([5.4, 6.0], [2.1, 2.1], color='#1E293B', lw=1.5)
    ax.text(3.5, 2.3, "1", fontsize=9, fontweight='bold')
    ax.text(5.8, 2.3, "N", fontsize=9, fontweight='bold')

    ax.plot([8.4, 8.8], [2.1, 2.1], color='#1E293B', lw=1.5)
    ax.plot([10.4, 11.0], [2.1, 2.1], color='#1E293B', lw=1.5)
    ax.text(8.5, 2.3, "1", fontsize=9, fontweight='bold')
    ax.text(10.8, 2.3, "N", fontsize=9, fontweight='bold')

    # Cross relation: SOURCE_CITE references EMAIL
    ax.annotate("", xy=(7.2, 5.0), xytext=(12.0, 2.7),
                arrowprops=dict(arrowstyle="->", color="#059669", lw=1.5, linestyle="--"))
    ax.text(10.2, 3.8, "references email_id", fontsize=8, color="#059669", fontweight='bold')

    plt.tight_layout()
    out_path = os.path.join(OUTPUT_DIR, "er_diagram.png")
    plt.savefig(out_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved:", out_path)

# -------------------------------------------------------------
# 7. Figure 7: Sequence Diagram (RAG Email Query)
# -------------------------------------------------------------
def create_sequence_diagram():
    fig, ax = plt.subplots(figsize=(14, 9), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC')

    ax.text(7, 8.5, "Figure No-7: Sequence Diagram for Grounded Email Query via RAG", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#0F172A')

    actors = [
        ("User", 1.2),
        ("React UI", 3.2),
        ("FastAPI /chat", 5.4),
        ("Chat Service", 7.6),
        ("Pinecone DB", 9.8),
        ("Gemini 2.5", 12.0),
    ]

    for name, x in actors:
        # Box
        box = patches.FancyBboxPatch((x-0.9, 7.8), 1.8, 0.5, boxstyle="round,pad=0.05,rounding_size=0.1",
                                     linewidth=1.5, edgecolor='#1E3A8A', facecolor='#DBEAFE')
        ax.add_patch(box)
        ax.text(x, 8.05, name, ha='center', va='center', fontsize=9, fontweight='bold', color='#1E3A8A')
        # Lifeline
        ax.plot([x, x], [1.0, 7.8], color='#94A3B8', lw=1.2, linestyle='--')

    # Sequence steps (y coordinates descending)
    steps = [
        (7.2, 1.2, 3.2, "1. Enters question in chat bar", True),
        (6.6, 3.2, 5.4, "2. POST /chat {question, top_k=5}", True),
        (6.0, 5.4, 7.6, "3. Validate JWT & load turns", True),
        (5.3, 7.6, 9.8, "4. query_emails(user_id, question, top_k)", True),
        (4.6, 9.8, 7.6, "5. Returns top 5 matches & scores", False),
        (4.0, 7.6, 12.0, "6. Prompt with strict evidence grounding", True),
        (3.3, 12.0, 7.6, "7. Synthesized answer with [1] citations", False),
        (2.6, 7.6, 5.4, "8. Persist turn in MongoDB & return payload", False),
        (1.9, 5.4, 3.2, "9. JSON {answer, sources, conversation_id}", False),
        (1.3, 3.2, 1.2, "10. Render Markdown & Citation Badges", False),
    ]

    for y, x1, x2, msg, is_call in steps:
        ls = "-" if is_call else "--"
        color = "#2563EB" if is_call else "#059669"
        ax.annotate("", xy=(x2, y), xytext=(x1, y),
                    arrowprops=dict(arrowstyle="->", color=color, lw=1.5, linestyle=ls, mutation_scale=12))
        ax.text((x1+x2)/2, y+0.16, msg, ha='center', va='center', fontsize=7.8, fontweight='bold', color='#1E293B')

    plt.tight_layout()
    out_path = os.path.join(OUTPUT_DIR, "sequence_diagram.png")
    plt.savefig(out_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved:", out_path)

# -------------------------------------------------------------
# 8. Figure 8: Class Diagram (FastAPI Services & Architecture)
# -------------------------------------------------------------
def create_class_diagram():
    fig, ax = plt.subplots(figsize=(14, 9.5), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9.5)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC')

    ax.text(7, 9.0, "Figure No-8: Class Diagram for InboxPilot Backend & Service Layer", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#0F172A')

    classes = [
        {
            "name": "FastAPIApp (index.py)",
            "x": 4.5, "y": 6.8, "w": 5.0, "h": 1.8,
            "attrs": ["+ app: FastAPI", "+ lifespan: AsyncContextManager"],
            "methods": ["+ auth_google(): RedirectResponse", "+ oauth_callback(code, state): OAuthCallbackResponse", "+ chat(request: ChatRequest): ChatResponse", "+ fetch_all_emails(): IngestionResponse", "+ sync_emails(): IngestionResponse"]
        },
        {
            "name": "SecurityService (security.py)",
            "x": 0.6, "y": 4.2, "w": 3.8, "h": 2.0,
            "attrs": ["- SECRET_KEY: str", "- ALGORITHM: str = HS256", "- FERNET_KEY: bytes"],
            "methods": ["+ create_access_token(sub: str): str", "+ get_current_user(token: str): dict", "+ encrypt_oauth_credentials(creds): str", "+ decrypt_oauth_credentials(blob): dict"]
        },
        {
            "name": "EmailIngestionService (ingestion.py)",
            "x": 4.8, "y": 4.2, "w": 4.4, "h": 2.0,
            "attrs": ["- MAX_WORKERS: int = 5", "- CHUNK_SIZE: int = 100"],
            "methods": ["+ ingest_mailbox(user, incremental): dict", "+ fetch_raw_messages(service): list", "+ clean_email_body(raw_mime): str", "+ update_user_checkpoint(user_id, ms)"]
        },
        {
            "name": "ChatService (chat_service.py)",
            "x": 9.6, "y": 4.2, "w": 3.8, "h": 2.0,
            "attrs": ["- MAX_HISTORY_TURNS: int = 8", "- MAX_SOURCE_BODY_CHARS: int = 8000"],
            "methods": ["+ answer_email_question(uid, q, k): dict", "+ _public_sources(matches): list", "+ _prompt(q, matches, hist): str", "+ _gemini_client(): genai.Client"]
        },
        {
            "name": "DBClient (dbClient.py)",
            "x": 1.8, "y": 1.0, "w": 4.4, "h": 2.2,
            "attrs": ["- _client: MongoClient", "- _db: Database"],
            "methods": ["+ get_users_collection(): Collection", "+ get_emails_collection(): Collection", "+ get_chats_collection(): Collection", "+ ping_database(): bool", "+ ensure_indexes(): None"]
        },
        {
            "name": "VectorStoreService (vector_store.py)",
            "x": 7.8, "y": 1.0, "w": 4.8, "h": 2.2,
            "attrs": ["- INDEX_NAME: str = 'inboxpilot-emails'", "- DIMENSION: int = 768"],
            "methods": ["+ validate_pinecone_index(): None", "+ query_emails(uid, q, top_k): list", "+ upsert_email_vectors(uid, emails): int", "+ _embed_texts(texts: list[str]): list"]
        }
    ]

    for c in classes:
        # Box header
        hb = patches.FancyBboxPatch((c['x'], c['y']+c['h']-0.45), c['w'], 0.45,
                                    boxstyle="round,pad=0.02,rounding_size=0.08",
                                    linewidth=1.2, edgecolor='#1E293B', facecolor='#1E293B')
        ax.add_patch(hb)
        ax.text(c['x']+c['w']/2, c['y']+c['h']-0.22, c['name'], ha='center', va='center',
                fontsize=8.5, fontweight='bold', color='#FFFFFF')

        # Box body
        bb = patches.FancyBboxPatch((c['x'], c['y']), c['w'], c['h']-0.45,
                                    boxstyle="round,pad=0.02,rounding_size=0.08",
                                    linewidth=1.2, edgecolor='#1E293B', facecolor='#FFFFFF')
        ax.add_patch(bb)

        # Attributes
        ay = c['y'] + c['h'] - 0.65
        for attr in c['attrs']:
            ax.text(c['x']+0.15, ay, attr, fontsize=7, color='#334155')
            ay -= 0.22

        # Separator line
        ax.plot([c['x'], c['x']+c['w']], [ay, ay], color='#CBD5E1', lw=1)
        ay -= 0.18

        # Methods
        for m in c['methods']:
            ax.text(c['x']+0.15, ay, m, fontsize=7, color='#0F172A', fontweight='medium')
            ay -= 0.22

    # Dependencies (dashed arrows)
    def draw_assoc(x1, y1, x2, y2):
        ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", color="#64748B", lw=1.2, linestyle="--"))

    draw_assoc(5.5, 6.8, 2.5, 6.2)
    draw_assoc(7.0, 6.8, 7.0, 6.2)
    draw_assoc(8.5, 6.8, 11.0, 6.2)
    draw_assoc(7.0, 4.2, 4.0, 3.2)
    draw_assoc(11.0, 4.2, 10.0, 3.2)

    plt.tight_layout()
    out_path = os.path.join(OUTPUT_DIR, "class_diagram.png")
    plt.savefig(out_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved:", out_path)

# -------------------------------------------------------------
# Generate Clean UI Mockup Screenshots (Figures 9 - 12)
# -------------------------------------------------------------
def create_ui_screenshots():
    # 1. Login Screen
    img_login = Image.new('RGB', (1280, 800), color='#0F172A')
    draw = ImageDraw.Draw(img_login)
    
    # Ambient background glow
    draw.ellipse([440, 150, 840, 550], fill='#1E293B', outline=None)
    draw.ellipse([500, 200, 780, 480], fill='#312E81', outline=None)

    # Center card
    card_bounds = [420, 160, 860, 640]
    draw.rounded_rectangle(card_bounds, radius=24, fill='#18191D', outline='#334155', width=2)
    
    # Logo & Badge
    draw.ellipse([610, 210, 670, 270], fill='#EA580C')
    draw.text((640, 240), "IP", fill='#FFFFFF', anchor="mm")
    
    draw.text((640, 305), "InboxPilot", fill='#FFFFFF', font_size=28, anchor="mm")
    draw.text((640, 345), "AI-Powered Gmail Intelligence Assistant", fill='#94A3B8', font_size=14, anchor="mm")
    
    # Features pill
    draw.rounded_rectangle([480, 385, 800, 455], radius=12, fill='#1E222A', outline='#374151')
    draw.text((640, 410), "🔒 Secure Google OAuth 2.0 with PKCE", fill='#CBD5E1', font_size=12, anchor="mm")
    draw.text((640, 432), "⚡ Grounded RAG with Google Gemini 2.5", fill='#CBD5E1', font_size=12, anchor="mm")

    # Sign in with Google Button
    draw.rounded_rectangle([490, 490, 790, 545], radius=14, fill='#FFFFFF', outline='#E2E8F0')
    draw.text((640, 517), "G   Sign in with Google", fill='#0F172A', font_size=15, anchor="mm")
    
    draw.text((640, 595), "Department of Computer Applications • MCA-269 Minor Project", fill='#64748B', font_size=11, anchor="mm")
    
    login_path = os.path.join(OUTPUT_DIR, "screenshot_login.png")
    img_login.save(login_path)
    print("Saved:", login_path)

    # 2. Main Dashboard & Hero Stage
    img_dash = Image.new('RGB', (1280, 800), color='#FDFBF9')
    draw = ImageDraw.Draw(img_dash)

    # Left Navigation Sidebar (unified, simplified - no Upgrade to Pro, no Documents section)
    draw.rectangle([0, 0, 260, 800], fill='#18191D')
    
    # Brand
    draw.ellipse([24, 28, 52, 56], fill='#EA580C')
    draw.text((38, 42), "IP", fill='#FFFFFF', anchor="mm")
    draw.text((70, 42), "InboxPilot", fill='#FFFFFF', font_size=18, anchor="lm")

    # New Chat Button
    draw.rounded_rectangle([20, 85, 240, 125], radius=10, fill='#EA580C')
    draw.text((130, 105), "+ New Chat", fill='#FFFFFF', font_size=14, anchor="mm")

    # Mode Selector
    modes = ["✨ General RAG", "📅 Calendar & Meets", "🔍 Deep Search", "🏷️ Labels & Drafts"]
    for i, m in enumerate(modes):
        bg = '#2A2D35' if i == 0 else '#18191D'
        draw.rounded_rectangle([20, 145 + i*42, 240, 180 + i*42], radius=8, fill=bg)
        draw.text((35, 162 + i*42), m, fill='#F1F5F9' if i==0 else '#94A3B8', font_size=12, anchor="lm")

    # Mailbox Explorer button
    draw.rounded_rectangle([20, 330, 240, 370], radius=8, fill='#202227', outline='#374151')
    draw.text((35, 350), "📬 Mailbox Explorer (154 Emails)", fill='#E2E8F0', font_size=11, anchor="lm")

    # Bottom User profile & Logout (Clean, no daily limits, no Upgrade to Pro)
    draw.line([20, 720, 240, 720], fill='#2D3139', width=1)
    draw.ellipse([25, 735, 60, 770], fill='#3B82F6')
    draw.text((42, 752), "CY", fill='#FFFFFF', anchor="mm")
    draw.text((72, 745), "Chhavi Yadav", fill='#F8FAFC', font_size=12, anchor="lm")
    draw.text((72, 762), "chhavi@example.com", fill='#94A3B8', font_size=10, anchor="lm")

    # Main Stage (Warm Canvas)
    draw.rounded_rectangle([280, 20, 1260, 780], radius=24, fill='#FFFFFF', outline='#E2E8F0', width=1)

    # Top Header inside Canvas
    draw.rounded_rectangle([300, 36, 420, 68], radius=10, fill='#F8FAFC', outline='#E2E8F0')
    draw.ellipse([312, 50, 320, 58], fill='#10B981')
    draw.text((355, 52), "InboxPilot", fill='#0F172A', font_size=12, anchor="mm")

    # Dark mode toggle button & Sync trigger
    draw.rounded_rectangle([1120, 36, 1160, 68], radius=10, fill='#F8FAFC', outline='#E2E8F0')
    draw.text((1140, 52), "🌙", font_size=14, anchor="mm")
    draw.rounded_rectangle([1170, 36, 1240, 68], radius=10, fill='#F8FAFC', outline='#E2E8F0')
    draw.text((1205, 52), "🔄 Sync", fill='#0F172A', font_size=11, anchor="mm")

    # Hero Center Title & Orbital Symbol
    draw.ellipse([740, 200, 800, 260], fill='#FFF7ED', outline='#FDBA74', width=2)
    draw.text((770, 230), "⚡", font_size=24, anchor="mm")
    draw.text((770, 290), "Ask anything about your mailbox", fill='#0F172A', font_size=24, anchor="mm")
    draw.text((770, 320), "InboxPilot connects with Gmail and synthesizes grounded answers using Gemini 2.5", fill='#64748B', font_size=13, anchor="mm")

    # Prompt Suggestions
    chips = [
        "When is my next project presentation?",
        "Summarize all unread emails from Alok Sir",
        "Find internship acceptance offers",
        "Who sent instructions for MCA-269 viva?"
    ]
    for i, c in enumerate(chips):
        cx = 580 if i % 2 == 0 else 960
        cy = 380 if i < 2 else 440
        draw.rounded_rectangle([cx-170, cy-22, cx+170, cy+22], radius=12, fill='#FFFBEB', outline='#FDE68A')
        draw.text((cx, cy), c, fill='#92400E', font_size=11, anchor="mm")

    # Bottom Chat Input Bar (Floating)
    draw.rounded_rectangle([420, 680, 1120, 745], radius=20, fill='#FFFFFF', outline='#E2E8F0', width=2)
    draw.text((450, 712), "Ask InboxPilot a question about your emails...", fill='#94A3B8', font_size=13, anchor="lm")
    draw.rounded_rectangle([1070, 690, 1110, 735], radius=14, fill='#EA580C')
    draw.text((1090, 712), "➔", fill='#FFFFFF', font_size=14, anchor="mm")

    dash_path = os.path.join(OUTPUT_DIR, "screenshot_dashboard.png")
    img_dash.save(dash_path)
    print("Saved:", dash_path)

    # 3. Grounded RAG Chat Interface
    img_rag = Image.new('RGB', (1280, 800), color='#FDFBF9')
    draw = ImageDraw.Draw(img_rag)

    # Sidebar
    draw.rectangle([0, 0, 260, 800], fill='#18191D')
    draw.ellipse([24, 28, 52, 56], fill='#EA580C')
    draw.text((38, 42), "IP", fill='#FFFFFF', anchor="mm")
    draw.text((70, 42), "InboxPilot", fill='#FFFFFF', font_size=18, anchor="lm")
    draw.text((35, 110), "RECENT CHATS", fill='#64748B', font_size=10, anchor="lm")
    
    chats = ["MCA-269 Project Submission", "Interview schedule confirmation", "GGSIPU examination circulars", "Fee receipt inquiry"]
    for i, ch in enumerate(chats):
        bg = '#2A2D35' if i == 0 else '#18191D'
        draw.rounded_rectangle([20, 130 + i*40, 240, 165 + i*40], radius=8, fill=bg)
        draw.text((35, 147 + i*40), f"💬 {ch}", fill='#F1F5F9' if i==0 else '#94A3B8', font_size=11, anchor="lm")

    # Canvas
    draw.rounded_rectangle([280, 20, 1260, 780], radius=24, fill='#FFFFFF', outline='#E2E8F0', width=1)
    
    # Top Header
    draw.rounded_rectangle([300, 36, 420, 68], radius=10, fill='#F8FAFC', outline='#E2E8F0')
    draw.ellipse([312, 50, 320, 58], fill='#10B981')
    draw.text((355, 52), "InboxPilot", fill='#0F172A', font_size=12, anchor="mm")

    # User Message Bubble
    draw.rounded_rectangle([720, 100, 1220, 150], radius=16, fill='#EA580C')
    draw.text((1200, 125), "When is my MCA-269 project submission and viva scheduled?", fill='#FFFFFF', font_size=13, anchor="rm")

    # Assistant Response Bubble with Citation Tags
    draw.rounded_rectangle([320, 175, 1220, 380], radius=18, fill='#F8FAFC', outline='#E2E8F0')
    draw.ellipse([345, 205, 375, 235], fill='#EA580C')
    draw.text((360, 220), "IP", fill='#FFFFFF', font_size=11, anchor="mm")
    draw.text((395, 220), "InboxPilot AI  •  Grounded Response", fill='#0F172A', font_size=13, anchor="lm")
    
    resp_lines = [
        "Based on the academic circular received from Banarsidas Chandiwala Institute [1],",
        "your MCA-269 Minor Project Report must be submitted by Friday, 28th November [1].",
        "The external viva is tentatively scheduled between 5th and 10th December [2].",
        "Your designated project guide is Mr. Alok Mishra (Assistant Professor) [1]."
    ]
    for i, line in enumerate(resp_lines):
        draw.text((345, 255 + i*24), line, fill='#334155', font_size=12, anchor="lm")

    # Source Badges
    draw.rounded_rectangle([345, 340, 550, 368], radius=6, fill='#EFF6FF', outline='#93C5FD')
    draw.text((447, 354), "[1] BCIIT Academic Notice #124", fill='#1D4ED8', font_size=10, anchor="mm")

    draw.rounded_rectangle([565, 340, 770, 368], radius=6, fill='#EFF6FF', outline='#93C5FD')
    draw.text((667, 354), "[2] GGSIPU Examination Schedule", fill='#1D4ED8', font_size=10, anchor="mm")

    # Source Inspector Panel on the right inside chat
    draw.rounded_rectangle([320, 400, 1220, 580], radius=16, fill='#FFFBEB', outline='#FDE68A')
    draw.text((345, 425), "🔍 Grounded Evidence Source Inspector", fill='#92400E', font_size=13, anchor="lm")
    
    draw.rounded_rectangle([345, 445, 1195, 500], radius=10, fill='#FFFFFF', outline='#FDE68A')
    draw.text((360, 462), "Source [1]: BCIIT MCA-269 Minor Project Guidelines", fill='#0F172A', font_size=11, anchor="lm")
    draw.text((360, 482), "From: alok.mishra@bciit.ac.in  •  Date: Nov 12, 2026  •  Cosine Score: 0.912", fill='#64748B', font_size=10, anchor="lm")

    draw.rounded_rectangle([345, 510, 1195, 565], radius=10, fill='#FFFFFF', outline='#FDE68A')
    draw.text((360, 527), "Source [2]: Final Semester Examination Circular GGSIPU/MCA/2026", fill='#0F172A', font_size=11, anchor="lm")
    draw.text((360, 547), "From: exam@ipu.ac.in  •  Date: Nov 15, 2026  •  Cosine Score: 0.884", fill='#64748B', font_size=10, anchor="lm")

    # Bottom Input Bar
    draw.rounded_rectangle([420, 680, 1120, 745], radius=20, fill='#FFFFFF', outline='#E2E8F0', width=2)
    draw.text((450, 712), "Ask a follow up question...", fill='#94A3B8', font_size=13, anchor="lm")
    draw.rounded_rectangle([1070, 690, 1110, 735], radius=14, fill='#EA580C')
    draw.text((1090, 712), "➔", fill='#FFFFFF', font_size=14, anchor="mm")

    rag_path = os.path.join(OUTPUT_DIR, "screenshot_rag_chat.png")
    img_rag.save(rag_path)
    print("Saved:", rag_path)

    # 4. Mailbox Explorer Modal
    img_exp = Image.new('RGB', (1280, 800), color='#1E293B')
    draw = ImageDraw.Draw(img_exp)

    # Modal container
    modal_bounds = [160, 80, 1120, 720]
    draw.rounded_rectangle(modal_bounds, radius=20, fill='#FFFFFF', outline='#94A3B8')

    # Modal header
    draw.text((200, 125), "📬 Mailbox Explorer & Vectorized Email Index", fill='#0F172A', font_size=18, anchor="lm")
    draw.text((200, 150), "Total Synced: 154 Messages  •  Pinecone Serverless Index: 768-Dim  •  Status: Indexed", fill='#64748B', font_size=11, anchor="lm")

    # Search Bar inside Explorer
    draw.rounded_rectangle([200, 175, 1080, 215], radius=10, fill='#F8FAFC', outline='#CBD5E1')
    draw.text((220, 195), "🔍 Filter messages by subject, sender, or keyword...", fill='#94A3B8', font_size=12, anchor="lm")

    # Table Header
    draw.rectangle([200, 230, 1080, 265], fill='#F1F5F9')
    draw.text((220, 248), "Sender", fill='#334155', font_size=11, anchor="lm")
    draw.text((460, 248), "Subject", fill='#334155', font_size=11, anchor="lm")
    draw.text((820, 248), "Date", fill='#334155', font_size=11, anchor="lm")
    draw.text((980, 248), "Status", fill='#334155', font_size=11, anchor="lm")

    # Table Rows
    emails = [
        ("Alok Mishra <alok.mishra@bciit.ac.in>", "MCA-269 Minor Project Synopsis Guidelines", "Nov 12, 2026", "Indexed (768-D)"),
        ("Examination Branch <exam@ipu.ac.in>", "Schedule of Semester III Practical Exams", "Nov 15, 2026", "Indexed (768-D)"),
        ("Placement Cell <tpo@bciit.ac.in>", "Campus Placement Drive: Software Development", "Nov 16, 2026", "Indexed (768-D)"),
        ("Google Accounts <no-reply@accounts.google.com>", "Security alert: Access granted to InboxPilot", "Nov 18, 2026", "Indexed (768-D)"),
        ("Director BCIIT <director@bciit.ac.in>", "Annual Technical Symposium & Project Exhibition", "Nov 19, 2026", "Indexed (768-D)"),
    ]
    for i, (snd, sub, dt, st) in enumerate(emails):
        ry = 285 + i*55
        draw.rounded_rectangle([200, ry-20, 1080, ry+25], radius=6, fill='#FFFFFF', outline='#E2E8F0')
        draw.text((220, ry), snd[:32], fill='#0F172A', font_size=11, anchor="lm")
        draw.text((460, ry), sub[:42], fill='#334155', font_size=11, anchor="lm")
        draw.text((820, ry), dt, fill='#64748B', font_size=10, anchor="lm")
        draw.rounded_rectangle([970, ry-10, 1065, ry+12], radius=6, fill='#DCFCE7')
        draw.text((1017, ry+1), "✓ Vectorized", fill='#15803D', font_size=9, anchor="mm")

    exp_path = os.path.join(OUTPUT_DIR, "screenshot_mailbox_explorer.png")
    img_exp.save(exp_path)
    print("Saved:", exp_path)

if __name__ == "__main__":
    print("Generating diagrams...")
    create_workflow_diagram()
    create_architecture_diagram()
    create_dfd_diagram()
    create_use_case_diagram()
    create_db_design_diagram()
    create_er_diagram()
    create_sequence_diagram()
    create_class_diagram()
    create_ui_screenshots()
    print("All diagrams and screenshots successfully generated!")
