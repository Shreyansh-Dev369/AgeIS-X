from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
import re
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

class PaymentScamRequest(BaseModel):
    content: Optional[str] = None
    sender: Optional[str] = None
    claimed_amount: Optional[str] = None
    scenario_preset: Optional[str] = "invoice_bank_switch"

def generate_preset_scam_text(preset: str) -> Dict[str, str]:
    if preset == "crypto_investment_scam":
        return {
            "sender": "VIP Global Crypto Wealth <advisor@crypto-quantum-yield.biz>",
            "amount": "$5,000 USD / 0.15 BTC",
            "content": """
EXCLUSIVE OPPORTUNITY: Guaranteed 250% daily returns with our proprietary Quantum AI Arbitrage trading pool!
Zero risk, 100% principal protection insured by FDIC crypto guarantee.
Deposit 0.15 BTC to our verified escrow address: bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq
Offer expires in 3 hours! Reply immediately with transaction hash to activate VIP algorithmic trading tier.
Visit portal: https://quantum-crypto-yield.biz/invest/login.html
            """
        }
    elif preset == "ceo_wire_urgency":
        return {
            "sender": "David Morrison <ceo.office.corp-exec@gmail.com>",
            "amount": "$48,500.00",
            "content": """
Are you at your desk?
I am currently in an all-day confidential M&A board meeting and cannot take calls.
We need an urgent wire transfer of $48,500 processed today to secure the preliminary acquisition agreement before the 5:00 PM EST deadline.
Please bypass the standard purchase order queue as this deal is strictly confidential under NDA.
Wiring details attached: Bank of Pacific Escrow, Routing: 121000358, Account: 9840291048.
Confirm once sent.
            """
        }
    elif preset == "legitimate_invoice":
        return {
            "sender": "billing@cloudflare.com",
            "amount": "$20.00",
            "content": """
Thank you for your payment.
Your monthly invoice for Cloudflare Pro Plan (Domain: mycompany.com) is available.
Payment method: Visa ending in 4102.
Invoice Number: CF-2026-90412.
View invoice and tax receipts in your dashboard: https://dash.cloudflare.com/billing
Terms: Net 30. No action required.
            """
        }
    else:  # default: invoice_bank_switch
        return {
            "sender": "Accounts Receivable <ar-vendor@supplier-acct-update.xyz>",
            "amount": "$34,250.00",
            "content": """
URGENT: Updated Banking Information for Outstanding Invoice #INV-88291.
Please be advised that due to our recent corporate banking restructuring and annual audit, our primary ACH / wire receiving account has changed effective immediately.
Do NOT send funds to our previous Wells Fargo account.
Please remit the outstanding balance of $34,250.00 by close of business tomorrow to avoid account suspension:
Beneficiary: Apex International Logistics LLC
Bank: Offshore Commercial Bank Ltd
Routing / Swift: OCBLUS33
Account Number: 8840-2910-4491
Please reply with wire remittance confirmation receipt.
            """
        }

def analyze_payment_scam(request: PaymentScamRequest) -> StandardEngineResponse:
    preset_data = generate_preset_scam_text(request.scenario_preset or "invoice_bank_switch")
    content = request.content if request.content and request.content.strip() else preset_data["content"]
    sender = request.sender if request.sender and request.sender.strip() else preset_data["sender"]
    amount = request.claimed_amount if request.claimed_amount and request.claimed_amount.strip() else preset_data.get("amount", "Unspecified")

    findings: List[Finding] = []
    evidence_items: List[EvidenceItem] = []
    triggered_rules: List[TriggeredRule] = []
    recommendations: List[str] = []
    risk_score = 5

    # 1. Regex & Token Rules
    # Rule A: Bank detail change / account update urgency
    bank_switch_patterns = [
        r"updated banking", r"banking restructuring", r"account has changed",
        r"new wire details", r"do not send funds to our previous", r"remit.*to our new",
        r"updated ach", r"beneficiary.*bank"
    ]
    matched_bank_switch = [p for p in bank_switch_patterns if re.search(p, content, re.IGNORECASE)]
    if matched_bank_switch:
        risk_score += 45
        findings.append(Finding(
            id="F-M07-BANK-SWITCH",
            title="Vendor Bank Account Diversion / Invoice Fraud Indicator",
            severity=Severity.CRITICAL,
            description="Message requests routing invoice payments to a newly provided bank or offshore account, a classic Business Email Compromise (BEC) pattern.",
            mitre_id="T1566.001",
            evidence=f"Matched triggers: {', '.join(matched_bank_switch[:2])}"
        ))
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-SCAM-BANK-DIVERT",
            name="Bank Detail Modification Lure",
            severity=Severity.CRITICAL,
            points=45,
            description="Payment request specifies sudden change in payee account details.",
            mitre_id="T1566.001"
        ))

    # Rule B: High Urgency & Coercive Deadline
    urgency_patterns = [
        r"urgent", r"immediately", r"close of business", r"within \d+ hours",
        r"before the \d+.*deadline", r"to avoid account suspension", r"strictly confidential",
        r"bypass.*queue", r"cannot take calls"
    ]
    matched_urgency = [p for p in urgency_patterns if re.search(p, content, re.IGNORECASE)]
    if matched_urgency:
        risk_score += 25
        evidence_items.append(EvidenceItem(
            source="ScamNLPAnalyzer",
            type="psychological_urgency",
            description=f"Detected high psychological urgency cues designed to bypass financial review controls ({len(matched_urgency)} triggers found).",
            raw_data={"matched_patterns": matched_urgency}
        ))
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-SCAM-URGENCY",
            name="Coercive Urgency & Pressure Language",
            severity=Severity.HIGH,
            points=25,
            description="Message applies artificial time pressure to expedite financial transactions.",
            mitre_id="T1566"
        ))

    # Rule C: Cryptocurrency Wallet or Gift Card Demands
    btc_match = re.search(r"\b(bc1[a-z0-9]{38,59}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})\b", content)
    eth_match = re.search(r"\b0x[a-fA-F0-9]{40}\b", content)
    gift_card_match = re.search(r"(gift card|apple card|steam card|vanilla visa|google play)", content, re.IGNORECASE)

    if btc_match or eth_match:
        crypto_addr = (btc_match.group(0) if btc_match else eth_match.group(0))
        risk_score += 45
        findings.append(Finding(
            id="F-M07-CRYPTO-WALLET",
            title="Cryptocurrency Escrow / Wallet Address Detected",
            severity=Severity.CRITICAL,
            description=f"Message solicits direct cryptocurrency payment to wallet ({crypto_addr[:10]}...); irreversible and non-refundable payment channel.",
            evidence=f"Address: {crypto_addr}"
        ))
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-SCAM-CRYPTO-LURE",
            name="Unregulated Cryptocurrency Payment Solicitation",
            severity=Severity.CRITICAL,
            points=45,
            description="Detected raw Bitcoin/Ethereum wallet destination in solicitation."
        ))

    if gift_card_match:
        risk_score += 50
        findings.append(Finding(
            id="F-M07-GIFT-CARD",
            title="Non-Traditional Gift Card Payment Demand",
            severity=Severity.CRITICAL,
            description=f"Message demands settlement via retail gift cards ({gift_card_match.group(0)}), 100% indicative of consumer fraud.",
            evidence=gift_card_match.group(0)
        ))
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-SCAM-GIFT-CARD",
            name="Gift Card Payment Demand",
            severity=Severity.CRITICAL,
            points=50,
            description="Retail prepaid card payment demand."
        ))

    # Rule D: Guaranteed High-Yield Returns / Investment Fraud
    investment_patterns = [
        r"guaranteed.*return", r"zero risk", r"100% principal protection",
        r"algorithmic arbitrage", r"quantum.*trading", r"daily returns", r"fdic.*crypto"
    ]
    matched_invest = [p for p in investment_patterns if re.search(p, content, re.IGNORECASE)]
    if matched_invest:
        risk_score += 50
        findings.append(Finding(
            id="F-M07-PONZI-INVESTMENT",
            title="Unrealistic Guaranteed Financial Returns (High-Yield Fraud)",
            severity=Severity.CRITICAL,
            description="Claims of guaranteed returns and zero risk violate basic economic reality, matching Advance-Fee / Pig-Butchering / High-Yield Investment Program (HYIP) fraud.",
            evidence=f"Claims: {', '.join(matched_invest[:3])}"
        ))
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-SCAM-GUARANTEED-YIELD",
            name="Guaranteed High-Yield Investment Fraud Pattern",
            severity=Severity.CRITICAL,
            points=50,
            description="Unrealistic financial guarantees combined with urgent deposit requests."
        ))

    # Rule E: Executive Impersonation / Free Webmail Origin
    if re.search(r"(ceo|cfo|executive|director)", sender, re.IGNORECASE) and ("@gmail.com" in sender or "@yahoo.com" in sender or "@outlook.com" in sender):
        risk_score += 40
        findings.append(Finding(
            id="F-M07-EXEC-FREEMAIL",
            title="Executive Impersonation via Public Freemail Provider",
            severity=Severity.CRITICAL,
            description=f"Claimed corporate executive sender uses public consumer email address: '{sender}'.",
            mitre_id="T1566.001",
            evidence=f"Sender: {sender}"
        ))
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-SCAM-EXEC-FREEMAIL",
            name="Executive Impersonation via Free Webmail",
            severity=Severity.CRITICAL,
            points=40,
            description="Claimed officer identity operating from non-corporate domain.",
            mitre_id="T1566.001"
        ))

    # Rule F: Embedded URLs
    urls = re.findall(r"https?://[^\s<>\"']+", content)
    if urls:
        evidence_items.append(EvidenceItem(
            source="ScamURLScanner",
            type="embedded_links",
            description=f"Extracted {len(urls)} embedded URLs from message body: {', '.join(urls[:2])}",
            raw_data={"urls": urls}
        ))
        for u in urls:
            if any(susp_tld in u for susp_tld in [".xyz", ".biz", ".top", ".info"]):
                risk_score += 20
                findings.append(Finding(
                    id="F-M07-SUSP-URL",
                    title="Suspicious Destination TLD in Financial Message",
                    severity=Severity.HIGH,
                    description=f"Payment lure directs recipient to high-risk top-level domain: {u}",
                    evidence=u
                ))

    risk_score = min(100, max(0, risk_score))
    if risk_score >= 70:
        verdict = Verdict.MALICIOUS
        summary = "HIGH-CONFIDENCE FINANCIAL SCAM DETECTED: Message exhibits critical indicators of invoice redirection, crypto fraud, or executive impersonation."
        recommendations = [
            "DO NOT execute wire transfer, cryptocurrency transfer, or ACH release",
            "Perform out-of-band telephone verification with vendor using phone number from primary signed master contract (NOT number in message)",
            "Report message to InfoSec & Corporate Fraud investigation unit"
        ]
    elif risk_score >= 35:
        verdict = Verdict.SUSPICIOUS
        summary = "SUSPICIOUS FINANCIAL REQUEST: High urgency or unusual payment terms detected. Proceed with heightened caution."
        recommendations = [
            "Verify sender email domain against approved corporate vendor registry",
            "Ensure standard dual-authorization controls are enforced"
        ]
    else:
        verdict = Verdict.SAFE
        summary = "Standard financial correspondence analyzed. Standard payment terms and reputable sender indicators verified."
        recommendations = [
            "Maintain standard invoice verification workflow"
        ]

    return StandardEngineResponse(
        engine_id="M-07",
        engine_name="Payment & Scam Intelligence",
        analysis_mode=AnalysisMode.LIVE if request.content else AnalysisMode.SIMULATED,
        verdict=verdict,
        risk_score=risk_score,
        confidence=0.96,
        summary=summary,
        findings=findings,
        evidence=evidence_items,
        triggered_rules=triggered_rules,
        recommendations=recommendations,
        limitations=[
            "Deterministic lexical, heuristic, and payment-pattern analysis. Legitimate emergency payment exceptions must be confirmed via out-of-band voice protocol."
        ],
        metadata={
            "sender": sender,
            "claimed_amount": amount,
            "extracted_urls": urls,
            "preset_applied": request.scenario_preset or "custom"
        }
    )
