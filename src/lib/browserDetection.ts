export function detectBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('firefox')) {
    return 'firefox';
  } else if (userAgent.includes('edg')) {
    return 'edge';
  } else if (userAgent.includes('chrome')) {
    return 'chrome';
  } else if (userAgent.includes('safari')) {
    return 'safari';
  } else if (userAgent.includes('opera') || userAgent.includes('opr')) {
    return 'opera';
  }

  return 'unknown';
}

export function isFirefox(): boolean {
  return detectBrowser() === 'firefox';
}

export function getBrowserName(): string {
  const browser = detectBrowser();

  switch (browser) {
    case 'firefox':
      return 'Firefox';
    case 'chrome':
      return 'Chrome';
    case 'edge':
      return 'Edge';
    case 'safari':
      return 'Safari';
    case 'opera':
      return 'Opera';
    default:
      return 'Unknown Browser';
  }
}
