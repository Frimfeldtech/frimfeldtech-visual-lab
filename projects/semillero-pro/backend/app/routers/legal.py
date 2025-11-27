"""
SEMILLERO PRO - Router Legal (Compliance FIFA)
Endpoint crítico para aceptación de términos y condiciones
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import Dict

from app.schemas.schemas import LegalConsentRequest, LegalConsentResponse
from app.models.models import UserConsent, User
from app.config import settings
from app.database import get_db

router = APIRouter(prefix="/api/legal", tags=["Legal & Compliance"])


@router.post("/accept-terms", response_model=LegalConsentResponse, status_code=201)
async def accept_terms(
    consent_data: LegalConsentRequest,
    request: Request,
    current_user: User = Depends(get_current_user),  # Implementar autenticación
    db: Session = Depends(get_db)
):
    """
    **ENDPOINT CRÍTICO - COMPLIANCE FIFA**
    
    El usuario DEBE aceptar explícitamente el descargo de responsabilidad FIFA
    que establece que NO adquiere derechos económicos sobre el jugador (TPO).
    
    Este endpoint bloquea el acceso a la plataforma hasta que se acepten TODOS los términos.
    """
    
    # Verificar si ya existe un consentimiento previo
    existing_consent = db.query(UserConsent).filter(
        UserConsent.user_id == current_user.id
    ).first()
    
    if existing_consent:
        raise HTTPException(
            status_code=400,
            detail="Los términos ya han sido aceptados previamente. Contacta soporte para modificaciones."
        )
    
    # Obtener IP del cliente
    client_ip = request.client.host if request.client else "unknown"
    
    # Crear registro de consentimiento
    new_consent = UserConsent(
        user_id=current_user.id,
        fifa_tpo_disclaimer_accepted=consent_data.fifa_tpo_disclaimer_accepted,
        terms_and_conditions_accepted=consent_data.terms_and_conditions_accepted,
        privacy_policy_accepted=consent_data.privacy_policy_accepted,
        fifa_disclaimer_text=settings.FIFA_COMPLIANCE_TEXT,  # Guardar el texto exacto
        ip_address=client_ip,
        user_agent=consent_data.user_agent or request.headers.get("User-Agent", "unknown")
    )
    
    db.add(new_consent)
    db.commit()
    db.refresh(new_consent)
    
    # Preparar response
    response = LegalConsentResponse(
        user_id=new_consent.user_id,
        fifa_tpo_disclaimer_accepted=new_consent.fifa_tpo_disclaimer_accepted,
        terms_and_conditions_accepted=new_consent.terms_and_conditions_accepted,
        privacy_policy_accepted=new_consent.privacy_policy_accepted,
        accepted_at=new_consent.accepted_at,
        is_fully_compliant=new_consent.is_fully_compliant()
    )
    
    return response


@router.get("/compliance-status")
async def get_compliance_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Verifica si el usuario ha completado todos los requisitos legales.
    
    Returns:
        - is_compliant: bool
        - fifa_disclaimer_text: str (texto completo del descargo FIFA)
        - accepted_at: datetime (si ya fue aceptado)
    """
    consent = db.query(UserConsent).filter(
        UserConsent.user_id == current_user.id
    ).first()
    
    if not consent:
        return {
            "is_compliant": False,
            "fifa_disclaimer_text": settings.FIFA_COMPLIANCE_TEXT,
            "message": "Debes aceptar los términos para usar la plataforma",
            "accepted_at": None
        }
    
    return {
        "is_compliant": consent.is_fully_compliant(),
        "fifa_disclaimer_text": consent.fifa_disclaimer_text,
        "fifa_tpo_disclaimer_accepted": consent.fifa_tpo_disclaimer_accepted,
        "terms_and_conditions_accepted": consent.terms_and_conditions_accepted,
        "privacy_policy_accepted": consent.privacy_policy_accepted,
        "accepted_at": consent.accepted_at,
        "ip_address": consent.ip_address
    }


@router.get("/fifa-disclaimer")
async def get_fifa_disclaimer() -> Dict[str, str]:
    """
    Endpoint público para obtener el texto completo del descargo FIFA.
    Útil para mostrarlo en el frontend antes de que el usuario se registre.
    """
    return {
        "disclaimer": settings.FIFA_COMPLIANCE_TEXT,
        "title": "Descargo de Responsabilidad - Cumplimiento FIFA",
        "summary": "Este activo NO representa derechos económicos sobre el jugador (TPO prohibido por FIFA)"
    }


# Dependency placeholder - implementar autenticación JWT
async def get_current_user(db: Session = Depends(get_db)) -> User:
    """
    Dependency para obtener el usuario autenticado.
    TODO: Implementar lógica de autenticación JWT real
    """
    # Por ahora retornamos un usuario de prueba
    # En producción, validar token JWT y retornar usuario real
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=401, detail="No autenticado")
    return user
