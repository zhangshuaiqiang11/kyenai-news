#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["reportlab==4.4.9"]
# ///
"""Render the generated MCP security control data as a polished downloadable PDF."""

from __future__ import annotations

import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "frontend" / "public" / "resources" / "mcp-security-controls.json"
PUBLIC_PDF = ROOT / "frontend" / "public" / "resources" / "mcp-security-controls.pdf"

INK = colors.HexColor("#18252D")
MUTED = colors.HexColor("#52616B")
TEAL = colors.HexColor("#0B6663")
TEAL_SOFT = colors.HexColor("#E8F4F3")
BORDER = colors.HexColor("#CCD7DC")
CRITICAL = colors.HexColor("#9D2B1F")
HIGH = colors.HexColor("#A65A00")
MEDIUM = colors.HexColor("#45606E")


def build_pdf(data: dict) -> None:
    PUBLIC_PDF.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(PUBLIC_PDF),
        pagesize=A4,
        rightMargin=17 * mm,
        leftMargin=17 * mm,
        topMargin=19 * mm,
        bottomMargin=18 * mm,
        title=data["title"],
        author="KyenAI Editorial Automation Desk",
        subject="A source-backed checklist for reviewing MCP server security",
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "Title",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=23,
        leading=28,
        textColor=INK,
        alignment=TA_LEFT,
        spaceAfter=8,
    )
    intro_style = ParagraphStyle(
        "Intro",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=MUTED,
        spaceAfter=8,
    )
    heading_style = ParagraphStyle(
        "Heading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=19,
        textColor=INK,
        spaceBefore=4,
        spaceAfter=8,
    )
    control_title_style = ParagraphStyle(
        "ControlTitle",
        parent=styles["Heading3"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=INK,
        spaceAfter=4,
    )
    label_style = ParagraphStyle(
        "Label",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=10,
        textColor=TEAL,
        spaceAfter=2,
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.2,
        leading=11.5,
        textColor=INK,
    )
    source_style = ParagraphStyle(
        "Source",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=7.8,
        leading=11,
        textColor=INK,
        spaceAfter=5,
    )

    story = [
        Paragraph("KYENAI SECURITY RESOURCE", label_style),
        Paragraph(data["title"], title_style),
        Paragraph(
            f"Verified {data['verifiedAt']} | {data['controlCount']} controls | PDF, CSV, and JSON editions",
            intro_style,
        ),
        Table(
            [[Paragraph("How to use this checklist", control_title_style)], [Paragraph(data["scope"], body_style)]],
            colWidths=[176 * mm],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), TEAL_SOFT),
                    ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#B8D4D1")),
                    ("LEFTPADDING", (0, 0), (-1, -1), 10),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                    ("TOPPADDING", (0, 0), (-1, -1), 7),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ]
            ),
        ),
        Spacer(1, 6 * mm),
        Paragraph("25 verifiable controls", heading_style),
    ]

    for control in data["controls"]:
        risk_color = {"Critical": CRITICAL, "High": HIGH, "Medium": MEDIUM}[control["risk"]]
        title = Paragraph(
            f"{control['number']:02d}  {control['title']}  <font color='{risk_color.hexval()}'>{control['risk']}</font>",
            control_title_style,
        )
        detail_table = Table(
            [
                ["GUIDANCE", Paragraph(control["guidance"], body_style)],
                ["VERIFY", Paragraph(control["verificationMethod"], body_style)],
                ["PASS", Paragraph(control["passCriteria"], body_style)],
                ["BASIS", Paragraph(control["claimBasis"], body_style)],
            ],
            colWidths=[20 * mm, 148 * mm],
            style=TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (0, -1), 7.5),
                    ("TEXTCOLOR", (0, 0), (0, -1), TEAL),
                    ("LINEBELOW", (0, 0), (-1, -2), 0.35, BORDER),
                    ("LEFTPADDING", (0, 0), (-1, -1), 5),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            ),
        )
        card = Table(
            [[title], [detail_table]],
            colWidths=[176 * mm],
            style=TableStyle(
                [
                    ("BOX", (0, 0), (-1, -1), 0.65, BORDER),
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F4F7F8")),
                    ("LEFTPADDING", (0, 0), (-1, -1), 7),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                    ("TOPPADDING", (0, 0), (-1, -1), 6),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ]
            ),
        )
        story.extend([KeepTogether(card), Spacer(1, 3.5 * mm)])

    story.extend([PageBreak(), Paragraph("Evidence sources", heading_style)])
    for source in data["sources"]:
        story.append(
            Paragraph(
                f"<b>{source['title']}</b><br/>{source['scope']}<br/><link href='{source['url']}' color='{TEAL.hexval()}'>{source['url']}</link>",
                source_style,
            )
        )
    story.extend(
        [
            Spacer(1, 5 * mm),
            Paragraph("Scope boundary", heading_style),
            Paragraph(
                "This checklist separates official MCP requirements and guidance from KyenAI operational recommendations. It does not replace a product-specific threat model, legal review, penetration test, or incident-response plan.",
                intro_style,
            ),
        ]
    )

    doc.build(story, onFirstPage=draw_page, onLaterPages=draw_page)


def draw_page(canvas, doc) -> None:
    width, height = A4
    canvas.saveState()
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(17 * mm, 13 * mm, width - 17 * mm, 13 * mm)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(17 * mm, 8.5 * mm, "KyenAI | MCP Server Security Checklist")
    canvas.setFillColor(TEAL)
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.drawRightString(width - 17 * mm, 8.5 * mm, f"Page {doc.page}")
    canvas.restoreState()


def main() -> None:
    with DATA_PATH.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if data.get("controlCount") != 25:
        raise SystemExit(f"Expected 25 controls, found {data.get('controlCount')}")
    build_pdf(data)
    print(f"Generated {PUBLIC_PDF}")


if __name__ == "__main__":
    main()
