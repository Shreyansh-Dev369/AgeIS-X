from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class SecurityHeadersIntelligence(BaseModel):
    has_hsts: bool = False
    hsts_value: Optional[str] = None
    has_csp: bool = False
    csp_value: Optional[str] = None
    has_x_frame_options: bool = False
    x_frame_options_value: Optional[str] = None
    has_x_content_type_options: bool = False
    referrer_policy: Optional[str] = None
    server_header: Optional[str] = None
    missing_headers: List[str] = Field(default_factory=list)

class FormField(BaseModel):
    name: Optional[str] = None
    type: str = "text"
    is_password: bool = False
    is_sensitive: bool = False

class FormAnalysis(BaseModel):
    action: Optional[str] = None
    method: str = "get"
    is_off_domain_action: bool = False
    is_http_action_on_https: bool = False
    has_password_field: bool = False
    has_payment_field: bool = False
    fields: List[FormField] = Field(default_factory=list)

class IframeAnalysis(BaseModel):
    src: Optional[str] = None
    is_hidden: bool = False
    is_off_domain: bool = False

class JSSecuritySignals(BaseModel):
    has_eval: bool = False
    has_document_write: bool = False
    has_obfuscated_code: bool = False
    has_context_menu_blocker: bool = False
    has_clipboard_manipulation: bool = False
    suspicious_patterns: List[str] = Field(default_factory=list)

class HTMLDOMIntelligence(BaseModel):
    title: Optional[str] = None
    meta_description: Optional[str] = None
    total_forms: int = 0
    forms: List[FormAnalysis] = Field(default_factory=list)
    has_credential_form: bool = False
    has_off_domain_form_submission: bool = False
    total_iframes: int = 0
    iframes: List[IframeAnalysis] = Field(default_factory=list)
    has_hidden_iframes: bool = False
    total_scripts: int = 0
    external_scripts_count: int = 0
    js_signals: JSSecuritySignals = Field(default_factory=JSSecuritySignals)
    detected_brand_in_title: Optional[str] = None
    brand_impersonation_suspected: bool = False

class HTTPResponseIntelligence(BaseModel):
    status: str = "unavailable"  # available, unavailable, blocked, error
    http_status_code: Optional[int] = None
    final_url: Optional[str] = None
    redirect_count: int = 0
    redirect_chain: List[str] = Field(default_factory=list)
    content_type: Optional[str] = None
    content_length_bytes: int = 0
    headers: SecurityHeadersIntelligence = Field(default_factory=SecurityHeadersIntelligence)
    dom: Optional[HTMLDOMIntelligence] = None
    error: Optional[str] = None
    observed_at: float = 0.0
