/**
 * SEMILLERO PRO - Legal Modal Component
 * 
 * COMPONENTE CRÍTICO - COMPLIANCE FIFA
 * Bloquea el acceso a la plataforma hasta que el usuario acepte todos los términos.
 */

'use client';

import React, { useState, useEffect } from 'react';
import './LegalModal.css';

interface LegalModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline?: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onAccept, onDecline }) => {
  const [acceptFifaDisclaimer, setAcceptFifaDisclaimer] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fifaDisclaimerText = `
    El usuario reconoce que adquiere un Activo Digital coleccionable basado en estadísticas. 
    NO adquiere derechos económicos sobre el jugador (TPO - Third Party Ownership), 
    ni derechos federativos, cumpliendo con la normativa FIFA vigente.
    Este activo representa únicamente un derecho de colección y especulación 
    sobre el rendimiento estadístico del jugador.
  `;

  const canAccept = acceptFifaDisclaimer && acceptTerms && acceptPrivacy && hasScrolled;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    if (isAtBottom && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  const handleAccept = async () => {
    if (!canAccept) return;

    setIsSubmitting(true);

    try {
      // Llamar a la API para registrar el consentimiento
      const response = await fetch('http://localhost:8000/api/legal/accept-terms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Agregar token JWT de autenticación
        },
        body: JSON.stringify({
          fifa_tpo_disclaimer_accepted: acceptFifaDisclaimer,
          terms_and_conditions_accepted: acceptTerms,
          privacy_policy_accepted: acceptPrivacy,
          user_agent: navigator.userAgent,
        }),
      });

      if (response.ok) {
        onAccept();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'No se pudo registrar el consentimiento'}`);
      }
    } catch (error) {
      console.error('Error al enviar consentimiento:', error);
      alert('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="legal-modal-overlay">
      <div className="legal-modal">
        <div className="legal-modal-header">
          <h2>⚖️ Términos y Condiciones</h2>
          <p className="legal-modal-subtitle">
            Debes leer y aceptar todos los términos para continuar
          </p>
        </div>

        <div className="legal-modal-content" onScroll={handleScroll}>
          {/* DESCARGO FIFA - CRÍTICO */}
          <section className="legal-section fifa-section">
            <div className="fifa-badge">
              <span className="fifa-icon">🛡️</span>
              <span className="fifa-text">COMPLIANCE FIFA</span>
            </div>
            <h3>Descargo de Responsabilidad - Normativa FIFA</h3>
            <div className="legal-text-box important">
              <p>{fifaDisclaimerText}</p>
            </div>
            <label className="legal-checkbox">
              <input
                type="checkbox"
                checked={acceptFifaDisclaimer}
                onChange={(e) => setAcceptFifaDisclaimer(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span className="checkbox-label">
                <strong>He leído y acepto</strong> que NO adquiero derechos económicos 
                sobre el jugador (TPO prohibido por FIFA)
              </span>
            </label>
          </section>

          {/* TÉRMINOS Y CONDICIONES */}
          <section className="legal-section">
            <h3>Términos y Condiciones Generales</h3>
            <div className="legal-text-box">
              <p>
                <strong>1. Naturaleza del Activo Digital:</strong> Los tokens representan 
                activos digitales coleccionables basados en el rendimiento estadístico de 
                jugadores de fútbol. No representan propiedad parcial del jugador.
              </p>
              <p>
                <strong>2. Riesgos:</strong> La inversión en tokens de rendimiento conlleva 
                riesgos. El valor puede subir o bajar. No garantizamos retornos.
              </p>
              <p>
                <strong>3. Uso de Datos:</strong> Los datos de jugadores se obtienen de 
                fuentes públicas (Transfermarkt, etc.) y pueden contener imprecisiones.
              </p>
              <p>
                <strong>4. Regulación:</strong> Este servicio opera cumpliendo con las 
                normativas de activos digitales de cada jurisdicción.
              </p>
            </div>
            <label className="legal-checkbox">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span className="checkbox-label">
                Acepto los Términos y Condiciones
              </span>
            </label>
          </section>

          {/* PRIVACIDAD */}
          <section className="legal-section">
            <h3>Política de Privacidad</h3>
            <div className="legal-text-box">
              <p>
                Recopilamos y procesamos tus datos personales de acuerdo con las leyes 
                de protección de datos aplicables (GDPR, LGPD, etc.).
              </p>
              <p>
                Tus datos se utilizan únicamente para proveer el servicio y no se 
                comparten con terceros sin tu consentimiento.
              </p>
            </div>
            <label className="legal-checkbox">
              <input
                type="checkbox"
                checked={acceptPrivacy}
                onChange={(e) => setAcceptPrivacy(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span className="checkbox-label">
                Acepto la Política de Privacidad
              </span>
            </label>
          </section>

          {!hasScrolled && (
            <div className="scroll-indicator">
              <p>↓ Desplázate hasta el final para continuar ↓</p>
            </div>
          )}
        </div>

        <div className="legal-modal-footer">
          {onDecline && (
            <button
              className="btn-decline"
              onClick={onDecline}
              disabled={isSubmitting}
            >
              Rechazar
            </button>
          )}
          <button
            className="btn-accept"
            onClick={handleAccept}
            disabled={!canAccept || isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : 'Aceptar y Continuar'}
          </button>
        </div>

        {!canAccept && (
          <div className="legal-modal-warning">
            <p>
              ⚠️ Debes aceptar todos los términos y leer hasta el final para continuar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalModal;
