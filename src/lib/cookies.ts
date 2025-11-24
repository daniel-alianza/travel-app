/**
 * Utilidades para manejar cookies en el navegador
 */

/**
 * Obtiene el valor de una cookie por su nombre
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
}

/**
 * Establece una cookie con el nombre, valor y opciones especificadas
 */
export function setCookie(
  name: string,
  value: string,
  options?: {
    days?: number;
    path?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  },
): void {
  if (typeof document === 'undefined') {
    return;
  }

  const {
    days = 365,
    path = '/',
    secure = true,
    sameSite = 'Lax',
  } = options || {};

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const cookieValue =
    `${name}=${encodeURIComponent(value)};` +
    `expires=${expires.toUTCString()};` +
    `path=${path};` +
    (secure ? 'secure;' : '') +
    `sameSite=${sameSite}`;

  document.cookie = cookieValue;
}

/**
 * Elimina una cookie por su nombre
 */
export function deleteCookie(name: string, path = '/'): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
}

/**
 * Verifica si una cookie existe
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

