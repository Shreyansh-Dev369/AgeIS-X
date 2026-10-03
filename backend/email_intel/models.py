from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class EmailSenderInfo(BaseModel):
    display_name: str = ""
    address: str = ""
    domain: str = ""
    reply_to_address: Optional[str] = None
    reply_to_domain: Optional[str] = None
    return_path_address: Optional[str] = None
    return_path_domain: Optional[str] = None
    is_reply_to_mismatch: bool = False
    is_return_path_mismatch: bool = False
    is_display_name_spoofing: bool = False
    impersonation_target: Optional[str] = None

class EmailAuthStatus(BaseModel):
    source: str = "supplied_header"
    verification_status: str = "not_independently_verified"
    spf_status: str = "none"       # pass, fail, softfail, neutral, none, permerror, temperror
    dkim_status: str = "none"      # pass, fail, none, permerror, temperror
    dmarc_status: str = "none"     # pass, fail, none, reject, quarantine
    spf_details: Optional[str] = None
    dkim_details: Optional[str] = None
    dmarc_details: Optional[str] = None
    has_auth_failure: bool = False

class EmailHeaderAnalysis(BaseModel):
    subject: str = ""
    message_id: Optional[str] = None
    date: Optional[str] = None
    received_hops_count: int = 0
    received_from_relays: List[str] = Field(default_factory=list)
    has_valid_message_id: bool = True
    missing_required_headers: List[str] = Field(default_factory=list)
    anomalies: List[str] = Field(default_factory=list)

class AttachmentMetadata(BaseModel):
    filename: str = ""
    extension: str = ""
    declared_mime: str = ""
    size_bytes: int = 0
    sha256: str = ""
    is_dangerous_extension: bool = False
    is_double_extension: bool = False
    is_macro_enabled: bool = False
    is_archive: bool = False
    risk_level: str = "safe"  # safe, suspicious, high_risk

class ExtractedLinkAnalysis(BaseModel):
    url: str
    display_text: Optional[str] = None
    is_mismatched_anchor: bool = False
    is_suspicious: bool = False
    risk_score: int = 0
    verdict: str = "safe"
    reasons: List[str] = Field(default_factory=list)

class SocialEngineeringSignals(BaseModel):
    urgency_score: int = 0
    has_urgency_language: bool = False
    has_credential_request: bool = False
    has_payment_or_wire_request: bool = False
    has_crypto_request: bool = False
    has_gift_card_request: bool = False
    has_executive_impersonation: bool = False
    has_account_suspension_threat: bool = False
    detected_phrases: List[str] = Field(default_factory=list)

class EmailIntelligence(BaseModel):
    status: str = "analyzed" # analyzed, blocked, error, truncated
    subject: str = ""
    sender: EmailSenderInfo = Field(default_factory=EmailSenderInfo)
    auth: EmailAuthStatus = Field(default_factory=EmailAuthStatus)
    headers: EmailHeaderAnalysis = Field(default_factory=EmailHeaderAnalysis)
    social_engineering: SocialEngineeringSignals = Field(default_factory=SocialEngineeringSignals)
    attachments: List[AttachmentMetadata] = Field(default_factory=list)
    links: List[ExtractedLinkAnalysis] = Field(default_factory=list)
    risk_score: int = 0
    verdict: str = "safe" # safe, suspicious, malicious
    evidence: List[str] = Field(default_factory=list)
    limitations: List[str] = Field(default_factory=list)
    observed_at: float = 0.0

class EmailAnalysisRequest(BaseModel):
    raw_email: str

class MessageAnalysisRequest(BaseModel):
    message: str
    sender: Optional[str] = None

class MessageIntelligence(BaseModel):
    status: str = "analyzed"
    sender: Optional[str] = None
    social_engineering: SocialEngineeringSignals = Field(default_factory=SocialEngineeringSignals)
    links: List[ExtractedLinkAnalysis] = Field(default_factory=list)
    risk_score: int = 0
    verdict: str = "safe"
    evidence: List[str] = Field(default_factory=list)
    limitations: List[str] = Field(default_factory=list)
    observed_at: float = 0.0
