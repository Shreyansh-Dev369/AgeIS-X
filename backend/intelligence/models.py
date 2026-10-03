from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class EvidenceItem(BaseModel):
    signal: str = Field(..., description="Machine identifier for the signal")
    value: Any = Field(..., description="Extracted value of the signal")
    severity: str = Field("info", description="info | low | medium | high | critical")
    source: str = Field(..., description="rdap | dns | doh | tls | lexical | structural")
    description: str = Field(..., description="Human-readable factual finding")

class RDAPIntelligence(BaseModel):
    status: str = Field("unavailable", description="available | unavailable | blocked | error")
    domain: str
    registrar: Optional[str] = None
    registered_at: Optional[str] = None
    expires_at: Optional[str] = None
    updated_at: Optional[str] = None
    domain_age_days: Optional[int] = None
    domain_age_formatted: Optional[str] = None
    nameservers: List[str] = Field(default_factory=list)
    status_codes: List[str] = Field(default_factory=list)
    source_url: Optional[str] = None
    error: Optional[str] = None
    observed_at: float = 0.0

class DNSIntelligence(BaseModel):
    status: str = Field("unavailable", description="available | unavailable | blocked | error")
    hostname: str
    a: List[str] = Field(default_factory=list)
    aaaa: List[str] = Field(default_factory=list)
    cname: List[str] = Field(default_factory=list)
    mx: List[str] = Field(default_factory=list)
    ns: List[str] = Field(default_factory=list)
    txt: List[str] = Field(default_factory=list)
    is_doh: bool = False
    resolver: str = "system"
    error: Optional[str] = None
    observed_at: float = 0.0

class TLSIntelligence(BaseModel):
    status: str = Field("unavailable", description="available | unavailable | blocked | error")
    target_host: str
    target_port: int = 443
    connected: bool = False
    verified: bool = False
    hostname_match: bool = False
    subject: Dict[str, str] = Field(default_factory=dict)
    issuer: Dict[str, str] = Field(default_factory=dict)
    san: List[str] = Field(default_factory=list)
    not_before: Optional[str] = None
    not_after: Optional[str] = None
    is_expired: bool = False
    is_not_yet_valid: bool = False
    days_until_expiration: Optional[int] = None
    tls_version: Optional[str] = None
    cipher: Optional[str] = None
    error: Optional[str] = None
    observed_at: float = 0.0
