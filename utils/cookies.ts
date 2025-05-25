// utils/cookie.ts
export  function setSessionCookie(sessionId: string) {
  const expireDate = new Date(Date.now() + 5 * 60 * 1000); // 5 menit
  document.cookie = `session_id=${sessionId}; expires=${expireDate.toUTCString()}; path=/`;
}

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

export function clearSessionCookie() {
  document.cookie = `session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}
