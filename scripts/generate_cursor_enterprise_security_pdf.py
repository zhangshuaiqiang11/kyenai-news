#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["reportlab==4.4.9"]
# ///
"""Render the Cursor Enterprise security assessment as a downloadable PDF."""

from __future__ import annotations

import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "frontend/public/resources/cursor-enterprise-security-controls.json"
OUTPUT = ROOT / "frontend/public/resources/cursor-enterprise-security-controls.pdf"
INK = colors.HexColor("#18252D")
MUTED = colors.HexColor("#52616B")
TEAL = colors.HexColor("#0B6663")
BORDER = colors.HexColor("#CCD7DC")
SOFT = colors.HexColor("#E8F4F3")


def render(data: dict) -> None:
    styles = getSampleStyleSheet()
    title = ParagraphStyle("Title", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=22, leading=27, textColor=INK)
    heading = ParagraphStyle("Heading", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=14, leading=18, textColor=INK, spaceBefore=4, spaceAfter=7)
    control_title = ParagraphStyle("ControlTitle", parent=styles["Heading3"], fontName="Helvetica-Bold", fontSize=10.5, leading=13, textColor=INK)
    body = ParagraphStyle("Body", parent=styles["BodyText"], fontName="Helvetica", fontSize=7.8, leading=10.8, textColor=INK)
    small = ParagraphStyle("Small", parent=body, fontSize=7.2, leading=9.5, textColor=MUTED)
    label = ParagraphStyle("Label", parent=body, fontName="Helvetica-Bold", fontSize=7.4, textColor=TEAL)

    doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, leftMargin=17*mm, rightMargin=17*mm, topMargin=18*mm, bottomMargin=18*mm,
                            title=data["title"], author="KyenAI Founder", subject="Source-backed Cursor Enterprise security assessment")
    story = [
        Paragraph("KYENAI ENTERPRISE SECURITY RESOURCE", label),
        Paragraph(data["title"], title),
        Paragraph(f"Version {data['version']} | Verified {data['verifiedAt']} | {data['license']} | PDF, CSV, and JSON editions", small),
        Spacer(1, 3*mm),
        Table([[Paragraph(data["scope"], body)]], colWidths=[176*mm], style=TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), SOFT), ("BOX", (0,0), (-1,-1), .7, BORDER),
            ("LEFTPADDING", (0,0), (-1,-1), 9), ("RIGHTPADDING", (0,0), (-1,-1), 9),
            ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ])),
        Spacer(1, 5*mm),
        Paragraph("Responsibility matrix", heading),
    ]
    matrix = [[Paragraph("<b>Owner</b>", body), Paragraph("<b>Accountable for</b>", body)]] + [
        [Paragraph(item["role"], body), Paragraph(item["accountableFor"], body)] for item in data["responsibilityMatrix"]
    ]
    story.append(Table(matrix, colWidths=[48*mm, 128*mm], style=TableStyle([
        ("BACKGROUND", (0,0), (-1,0), SOFT), ("GRID", (0,0), (-1,-1), .4, BORDER), ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("LEFTPADDING", (0,0), (-1,-1), 5), ("RIGHTPADDING", (0,0), (-1,-1), 5),
        ("TOPPADDING", (0,0), (-1,-1), 4), ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ])))
    story.extend([Spacer(1, 6*mm), Paragraph("30 administrator controls", heading)])

    for control in data["controls"]:
        basis = "Official public basis" if control["claimBasis"] == "official-public" else "KyenAI operational recommendation"
        rows = [
            ["OWNER", control["owner"]],
            ["GUIDANCE", control["guidance"]],
            ["VERIFY", control["verificationMethod"]],
            ["PASS", control["passCriteria"]],
            ["CHECK", control["contractOrConsoleCheck"]],
            ["BASIS", basis],
        ]
        detail = Table([[Paragraph(f"<b>{label_text}</b>", label), Paragraph(value, body)] for label_text, value in rows],
                       colWidths=[20*mm, 148*mm], style=TableStyle([
                           ("VALIGN", (0,0), (-1,-1), "TOP"), ("LINEBELOW", (0,0), (-1,-2), .3, BORDER),
                           ("LEFTPADDING", (0,0), (-1,-1), 4), ("RIGHTPADDING", (0,0), (-1,-1), 4),
                           ("TOPPADDING", (0,0), (-1,-1), 3), ("BOTTOMPADDING", (0,0), (-1,-1), 3),
                       ]))
        card = Table([
            [Paragraph(f"{control['number']:02d}  {control['title']}  <font color='{TEAL.hexval()}'>{control['domain']}</font>", control_title)],
            [detail],
        ], colWidths=[176*mm], style=TableStyle([
            ("BOX", (0,0), (-1,-1), .6, BORDER), ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#F4F7F8")),
            ("LEFTPADDING", (0,0), (-1,-1), 6), ("RIGHTPADDING", (0,0), (-1,-1), 6),
            ("TOPPADDING", (0,0), (-1,-1), 5), ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ]))
        story.extend([KeepTogether(card), Spacer(1, 3*mm)])

    story.extend([PageBreak(), Paragraph("Evidence sources and citation", heading)])
    for source in data["sources"]:
        story.append(Paragraph(f"<b>{source['title']}</b><br/>{source['scope']}<br/><link href='{source['url']}' color='{TEAL.hexval()}'>{source['url']}</link>", small))
        story.append(Spacer(1, 2*mm))
    story.extend([Spacer(1, 4*mm), Paragraph(data["preferredCitation"], body)])
    doc.build(story, onFirstPage=footer, onLaterPages=footer)


def footer(canvas, doc) -> None:
    width, _ = A4
    canvas.saveState()
    canvas.setStrokeColor(BORDER)
    canvas.line(17*mm, 13*mm, width-17*mm, 13*mm)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(17*mm, 8.5*mm, "KyenAI | Cursor Enterprise Security Assessment")
    canvas.setFillColor(TEAL)
    canvas.drawRightString(width-17*mm, 8.5*mm, f"Page {doc.page}")
    canvas.restoreState()


def main() -> None:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    if data.get("controlCount") != 30:
        raise SystemExit(f"Expected 30 controls, found {data.get('controlCount')}")
    render(data)
    print(f"Generated {OUTPUT}")


if __name__ == "__main__":
    main()
