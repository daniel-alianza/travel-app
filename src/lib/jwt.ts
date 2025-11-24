interface JWTPayload {
  sub?: string;
  email?: string;
  name?: string;
  nombre?: string;
  firstName?: string;
  paternalSurname?: string;
  maternalSurname?: string;
  [key: string]: unknown;
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload) as JWTPayload;
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}

export function getUserNameFromToken(token: string | null): string | null {
  if (!token) {
    return null;
  }

  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  // Si hay nombre completo, usarlo
  if (payload.name || payload.nombre) {
    return (payload.name || payload.nombre) as string;
  }

  // Si hay nombre y apellidos por separado, combinarlos
  if (payload.firstName) {
    const parts = [
      payload.firstName,
      payload.paternalSurname,
      payload.maternalSurname,
    ].filter(Boolean) as string[];

    if (parts.length > 0) {
      return parts.join(' ');
    }
  }

  // Fallback al email o sub
  return (payload.email || payload.sub || null) as string | null;
}
