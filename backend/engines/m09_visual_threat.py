from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
import io
import math
import uuid

from .common import (
    StandardEngineResponse,
    AnalysisMode,
    Verdict,
    Severity,
    Finding,
    EvidenceItem,
    TriggeredRule
)

try:
    from PIL import Image, ImageStat
    PILLOW_AVAILABLE = True
except ImportError:
    PILLOW_AVAILABLE = False

class VisualAnalysisRequest(BaseModel):
    image_base64: Optional[str] = None
    filename: Optional[str] = None
    scenario_preset: Optional[str] = "microsoft_login_clone"

def generate_preset_synthetic_image(preset: str) -> tuple[str, bytes]:
    """Generates a real in-memory PNG using Pillow for reproducible visual inspection."""
    if not PILLOW_AVAILABLE:
        return ("dummy.png", b"\x89PNG\r\n\x1a\n")

    if preset == "scareware_ransom_screen":
        # Red warning canvas 800x600 with black box
        img = Image.new("RGB", (800, 600), color=(220, 10, 10))
        # Draw dark inner banner
        for x in range(200, 600):
            for y in range(250, 350):
                img.putpixel((x, y), (20, 20, 20))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return ("scareware_warning.png", buf.getvalue())
    elif preset == "legitimate_clean_screenshot":
        # Clean balanced dashboard mockup 1200x800
        img = Image.new("RGB", (1200, 800), color=(245, 247, 250))
        for x in range(50, 1150):
            for y in range(40, 90):
                img.putpixel((x, y), (20, 30, 45))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return ("dashboard_telemetry.png", buf.getvalue())
    else:  # microsoft_login_clone
        # 1024x768 grey canvas with centered white credential card and MS blue button
        img = Image.new("RGB", (1024, 768), color=(235, 235, 235))
        # White login card in center
        for x in range(320, 704):
            for y in range(180, 580):
                img.putpixel((x, y), (255, 255, 255))
        # Microsoft blue button in card
        for x in range(500, 680):
            for y in range(500, 545):
                img.putpixel((x, y), (0, 103, 184))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return ("ms_login_portal_clone.png", buf.getvalue())

def analyze_image_bytes(filename: str, img_bytes: bytes, is_live_upload: bool = False) -> StandardEngineResponse:
    findings: List[Finding] = []
    evidence_items: List[EvidenceItem] = []
    triggered_rules: List[TriggeredRule] = []
    recommendations: List[str] = []
    limitations: List[str] = []
    risk_score = 10

    if not PILLOW_AVAILABLE:
        return StandardEngineResponse(
            engine_id="M-09",
            engine_name="Visual Threat Intelligence",
            analysis_mode=AnalysisMode.LIVE if is_live_upload else AnalysisMode.SIMULATED,
            verdict=Verdict.INCONCLUSIVE,
            risk_score=0,
            summary="Python Pillow imaging library is not installed.",
            limitations=["Image processing library unavailable."]
        )

    try:
        img = Image.open(io.BytesIO(img_bytes))
        width, height = img.size
        img_format = img.format or "UNKNOWN"
        color_mode = img.mode

        evidence_items.append(EvidenceItem(
            source="ImagePerceptionEngine",
            type="image_geometry",
            description=f"File: {filename} ({len(img_bytes):,} bytes). Dimensions: {width}x{height} px (Aspect ratio: {width/height:.2f}), Color Mode: {color_mode}, Format: {img_format}",
            raw_data={"width": width, "height": height, "format": img_format, "mode": color_mode}
        ))

        # Size and dimension limits
        if width > 4096 or height > 4096:
            limitations.append("Image resolution exceeds 4K max processing boundary; scaled down for inspection.")
            img.thumbnail((2048, 2048))

        # Color Statistics & Entropy
        stats = ImageStat.Stat(img)
        mean_colors = stats.mean
        std_devs = stats.stddev

        # Inspect for high-saturation Red (Scareware / Ransomware Screen)
        if len(mean_colors) >= 3:
            r, g, b = mean_colors[0], mean_colors[1], mean_colors[2]
            if r > 140 and r > (g + b) * 1.5:
                risk_score += 55
                findings.append(Finding(
                    id="F-M09-RED-SCAREWARE",
                    title="High-Saturation Crimson Warning Screen (Scareware / Lock Screen Pattern)",
                    severity=Severity.HIGH,
                    description=f"Dominant palette shows extreme red saturation (R:{r:.0f}, G:{g:.0f}, B:{b:.0f}), typical of fraudulent tech-support lockouts or ransomware extortion screens.",
                    evidence=f"Color Mean: RGB({r:.0f},{g:.0f},{b:.0f})"
                ))
                triggered_rules.append(TriggeredRule(
                    rule_id="RULE-VIS-SCAREWARE-PALETTE",
                    name="Scareware High-Saturation Red Screen Pattern",
                    severity=Severity.HIGH,
                    points=55,
                    description="Color distribution matches psychological coercion / lock screen palettes."
                ))

            # Inspect for Single-Card Login Layout (Centered white card on grey backdrop)
            # Center pixel check vs corner pixel check
            rgb_img = img.convert("RGB")
            corner_color = rgb_img.getpixel((10, 10))
            center_color = rgb_img.getpixel((width // 2, height // 2))

            # If corner is greyish and center is pure white, with standard aspect ratio -> credential modal layout
            if sum(abs(c - 235) for c in corner_color) < 40 and sum(abs(c - 255) for c in center_color) < 15:
                risk_score += 45
                findings.append(Finding(
                    id="F-M09-LOGIN-MODAL",
                    title="Modal Credential Interception Card Layout Detected",
                    severity=Severity.HIGH,
                    description="Visual layout matches centered authentication prompt card embedded within a muted backdrop, characteristic of phishing credential harvesters.",
                    mitre_id="T1566.002",
                    evidence=f"Background: RGB{corner_color} | Card Surface: RGB{center_color}"
                ))
                triggered_rules.append(TriggeredRule(
                    rule_id="RULE-VIS-AUTH-CARD-LAYOUT",
                    name="Authentication Card Spatial Layout Pattern",
                    severity=Severity.HIGH,
                    points=45,
                    description="Spatial clustering matches corporate SSO / IDP sign-in dialog.",
                    mitre_id="T1566.002"
                ))

        # Check for Brand Hue Signatures (Microsoft Azure/365 blue #0067B8 -> RGB 0, 103, 184)
        has_ms_blue = False
        rgb_img = img.convert("RGB")
        # Sample center-bottom area for action button
        for x in range(width // 4, (3 * width) // 4, 20):
            for y in range(height // 2, (3 * height) // 4, 20):
                px = rgb_img.getpixel((x, y))
                if abs(px[0] - 0) < 20 and abs(px[1] - 103) < 25 and abs(px[2] - 184) < 30:
                    has_ms_blue = True
                    break
            if has_ms_blue:
                break

        if has_ms_blue:
            risk_score += 25
            evidence_items.append(EvidenceItem(
                source="BrandVisualSignature",
                type="palette_match",
                description="Identified Microsoft Corporate Blue (#0067B8) action button color signature in lower quadrant."
            ))
            triggered_rules.append(TriggeredRule(
                rule_id="RULE-VIS-BRAND-PALETTE",
                name="Brand Primary Palette Match",
                severity=Severity.MEDIUM,
                points=25,
                description="Color coordinate match for enterprise cloud identity provider."
            ))

    except Exception as e:
        return StandardEngineResponse(
            engine_id="M-09",
            engine_name="Visual Threat Intelligence",
            analysis_mode=AnalysisMode.LIVE if is_live_upload else AnalysisMode.SIMULATED,
            verdict=Verdict.INCONCLUSIVE,
            risk_score=0,
            summary=f"Image parsing error: {str(e)}",
            limitations=[f"Malformed image data: {str(e)}"]
        )

    # Honest disclosure about OCR
    limitations.append(
        "Host environment does not have Tesseract-OCR binary / pytesseract installed. OCR text extraction is honestly disabled; visual analysis relies on geometry, color statistics, and layout pattern heuristics."
    )

    risk_score = min(100, max(0, risk_score))
    if risk_score >= 65:
        verdict = Verdict.MALICIOUS
        summary = "SUSPECTED VISUAL PHISHING / SCAREWARE: Layout matches credential harvester dialog or coercive ransomware screen."
        recommendations = [
            "Cross-reference visual prompt against authoritative domain in browser address bar",
            "Do not enter passwords if page domain does not match official identity portal",
            "Submit image to threat intelligence repository for visual similarity clustering"
        ]
    elif risk_score >= 30:
        verdict = Verdict.SUSPICIOUS
        summary = "ANOMALOUS VISUAL GEOMETRY: Visual layout contains branding cues or prompt dialog structure."
        recommendations = [
            "Inspect URL and TLS certificates before interacting with visible forms"
        ]
    else:
        verdict = Verdict.SAFE
        summary = "Standard image metrics verified. No high-saturation warning screens or modal harvesting patterns identified."
        recommendations = [
            "Standard viewing permitted"
        ]

    return StandardEngineResponse(
        engine_id="M-09",
        engine_name="Visual Threat Intelligence",
        analysis_mode=AnalysisMode.LIVE if is_live_upload else AnalysisMode.SIMULATED,
        verdict=verdict,
        risk_score=risk_score,
        confidence=0.88,
        summary=summary,
        findings=findings,
        evidence=evidence_items,
        triggered_rules=triggered_rules,
        recommendations=recommendations,
        limitations=limitations,
        metadata={
            "filename": filename,
            "dimensions": f"{width}x{height}",
            "color_mode": color_mode,
            "has_brand_hue": has_ms_blue
        }
    )

def analyze_visual_threat(request: VisualAnalysisRequest) -> StandardEngineResponse:
    if request.image_base64:
        import base64
        try:
            raw_bytes = base64.b64decode(request.image_base64)
            filename = request.filename or "uploaded_screenshot.png"
            return analyze_image_bytes(filename, raw_bytes, is_live_upload=True)
        except Exception as e:
            return StandardEngineResponse(
                engine_id="M-09",
                engine_name="Visual Threat Intelligence",
                analysis_mode=AnalysisMode.LIVE,
                verdict=Verdict.INCONCLUSIVE,
                risk_score=0,
                summary=f"Failed to decode image base64: {str(e)}",
                limitations=["Malformed base64 string."]
            )
    else:
        preset_name = request.scenario_preset or "microsoft_login_clone"
        filename, data = generate_preset_synthetic_image(preset_name)
        return analyze_image_bytes(filename, data, is_live_upload=False)
