from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
import time
import uuid

class AnalysisMode(str, Enum):
    LIVE = "live"
    SIMULATED = "simulated"

class Verdict(str, Enum):
    SAFE = "safe"
    SUSPICIOUS = "suspicious"
    MALICIOUS = "malicious"
    INCONCLUSIVE = "inconclusive"

class Severity(str, Enum):
    INFO = "info"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class EvidenceItem(BaseModel):
    source: str
    type: str
    description: str
    raw_data: Optional[Any] = None

class TriggeredRule(BaseModel):
    rule_id: str
    name: str
    severity: Severity
    points: int
    description: str
    mitre_id: Optional[str] = None

class Finding(BaseModel):
    id: str
    title: str
    severity: Severity
    description: str
    mitre_id: Optional[str] = None
    evidence: Optional[str] = None

class StandardEngineResponse(BaseModel):
    engine_id: str
    engine_name: str
    analysis_id: str = Field(default_factory=lambda: f"AGEIS-{uuid.uuid4().hex[:10].upper()}")
    analysis_mode: AnalysisMode
    verdict: Verdict
    risk_score: int = Field(..., ge=0, le=100)
    confidence: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    summary: str
    findings: List[Finding] = Field(default_factory=list)
    evidence: List[EvidenceItem] = Field(default_factory=list)
    triggered_rules: List[TriggeredRule] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    timestamp: float = Field(default_factory=time.time)
    limitations: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
