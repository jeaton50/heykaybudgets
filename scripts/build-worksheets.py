"""Build the four public, one-page budgeting worksheets."""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

OUT = Path(__file__).resolve().parent.parent / "static" / "downloads"
OUT.mkdir(parents=True, exist_ok=True)
STYLES = getSampleStyleSheet()
STYLES.add(ParagraphStyle(name="SheetTitle", fontName="Helvetica-Bold", fontSize=22, leading=27, spaceAfter=12))
STYLES.add(ParagraphStyle(name="SheetBody", fontName="Helvetica", fontSize=10, leading=15, spaceAfter=10))

def paragraph(text):
    return Paragraph(text, STYLES["SheetBody"])

def grid(headings, rows, widths=None):
    table = Table([headings] + rows, colWidths=widths, rowHeights=[30] + [34] * len(rows), repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e8f3f1")),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#162720")),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#a5b5b0")),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
    ]))
    return table

def build(slug, title, intro, elements):
    filename = OUT / (slug + ".pdf")
    doc = SimpleDocTemplate(str(filename), pagesize=letter, leftMargin=42, rightMargin=42, topMargin=42, bottomMargin=42)
    story = [paragraph("HEY KAY BUDGETS | Free printable"), Paragraph(title, STYLES["SheetTitle"]), paragraph(intro), Spacer(1, 12)]
    for element in elements:
        story.extend([paragraph(element) if isinstance(element, str) else element, Spacer(1, 12)])
    def footer(canvas, document):
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor("#3e5149"))
        canvas.drawString(42, 25, "heykaybudgets.com/free-resources | Educational worksheet")
        canvas.drawRightString(570, 25, str(document.page))
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(filename.name)

build("monthly-budget-worksheet", "Monthly Budget Worksheet",
      "Month: ____________________   Take-home income: $____________________",
      [grid(["Category", "Planned ($)", "Actual ($)"], [[x, "", ""] for x in ["Housing", "Utilities", "Food", "Transportation", "Insurance / health", "Debt minimums / extra", "Emergency savings", "Sinking funds", "Personal / giving", "Other"]], [270, 120, 120]),
       "Total planned: $________________  Total actual: $________________",
       "Income minus all planned spending and saving: $________________",
       "A zero-based plan assigns every dollar, including savings. A $0 remainder does not mean you should empty your bank account."])
build("sinking-fund-tracker", "Sinking Fund Tracker",
      "Review month: ____________________   Account balance: $________________",
      [grid(["Fund", "Target ($)", "Saved ($)", "Months left", "Monthly ($)"], [["", "", "", "", ""] for _ in range(8)], [150, 90, 90, 90, 90]),
       "Monthly contribution = (target - amount already saved) / months remaining.",
       "Illustration: ($600 - $150) / 9 months = $50 per month.",
       "Total allocated to funds: $________________  Total monthly saving: $________________",
       "Record deposits and withdrawals. If several funds share one account, reconcile their total with the bank balance."])
build("debt-payoff-worksheet", "Debt Payoff Worksheet",
      "Review date: ____________________   Extra-payment budget: $________________",
      [grid(["Debt / account label", "Balance ($)", "APR (%)", "Minimum ($)", "Extra ($)"], [["", "", "", "", ""] for _ in range(7)], [150, 90, 90, 90, 90]),
       "Focus debt: ____________________   Next payment date: ____________________",
       "Strategy: snowball (smallest balance) / avalanche (highest rate) / other",
       "Protect essential bills and required payments before choosing extra payments.",
       "Use the calculator at heykaybudgets.com for an illustrative schedule. Lender interest, fees, minimums, and payment dates may change the actual result."])
build("budget-buffer-worksheet", "Checking-Account Buffer",
      "Use a protected checking floor for ordinary timing gaps and small overages.",
      ["Chosen checking floor: $________________   Current cushion: $________________",
       "Amount still needed: $________________   Affordable payday addition: $________________",
       grid(["Timing gap / routine overage", "Amount ($)", "Refill date"], [["", "", ""] for _ in range(5)], [270, 120, 120]),
       "Before new spending: checking balance - pending transactions - assigned bills - protected floor.",
       "Keep the jobs separate:",
       "Checking buffer: ordinary timing gaps. One-month-ahead reserve: next month's bills, held in designated savings until needed.",
       "Sinking fund: anticipated irregular costs. Emergency savings: major unexpected expenses or income disruption.",
       "Example amounts are illustrations. Set a target that fits your expenses and income stability."])
