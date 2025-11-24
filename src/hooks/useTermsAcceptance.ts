import { useState, useEffect } from 'react';
import { getCookie, setCookie } from '@/lib/cookies';

const POLICIES_COOKIE_NAME = 'policies_accepted';
const POLICIES_COOKIE_VERSION = 'v1';

/**
 * Hook para manejar la aceptación de términos y condiciones de políticas
 */
export function useTermsAcceptance() {
  const [hasAccepted, setHasAccepted] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkAcceptance = () => {
      const cookieValue = getCookie(POLICIES_COOKIE_NAME);
      const isAccepted = cookieValue === POLICIES_COOKIE_VERSION;

      setHasAccepted(isAccepted);
      setShowModal(!isAccepted);
    };

    checkAcceptance();
  }, []);

  const acceptPolicies = () => {
    setCookie(POLICIES_COOKIE_NAME, POLICIES_COOKIE_VERSION, {
      days: 365,
      secure: true,
      sameSite: 'Lax',
    });
    setHasAccepted(true);
    setShowModal(false);
  };

  const closeModal = () => {
    // El modal no se puede cerrar sin aceptar
    // Esta función está aquí por compatibilidad pero no debería ser llamada
    setShowModal(false);
  };

  return {
    hasAccepted,
    showModal,
    acceptPolicies,
    closeModal,
  };
}

