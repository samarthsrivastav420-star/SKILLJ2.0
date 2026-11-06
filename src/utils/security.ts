/**
 * Masks sensitive identity and personal data according to Indian cybersecurity guidelines
 * and SKILLJ privacy policies. Never displays full Aadhaar, PAN, mobile, or payment accounts publicly.
 */

export function maskAadhaar(lastFourDigits: string): string {
  const digits = (lastFourDigits || '').trim().slice(-4);
  return `XXXX-XXXX-${digits.padStart(4, '•')}`;
}

export function maskPan(lastFourDigits: string): string {
  const digits = (lastFourDigits || '').trim().slice(-4);
  return `XXXXXX${digits.padStart(4, '•')}`;
}

export function maskMobile(mobile: string): string {
  const clean = (mobile || '').replace(/\D/g, '');
  if (clean.length >= 10) {
    const last3 = clean.slice(-3);
    const first2 = clean.slice(0, 2);
    return `+91 ${first2}•••• •${last3}`;
  }
  return '••••••••••';
}

export function maskBankAccount(accountNumber: string): string {
  const clean = (accountNumber || '').trim();
  if (clean.length >= 4) {
    const last4 = clean.slice(-4);
    return `A/C ••••••••••${last4}`;
  }
  return 'A/C ••••••••';
}

export function maskUpiId(upiId: string): string {
  const clean = (upiId || '').trim();
  const parts = clean.split('@');
  if (parts.length === 2 && parts[0].length >= 3) {
    const prefix = parts[0].slice(0, 2);
    return `${prefix}••••@${parts[1]}`;
  }
  return '••••@upi';
}

export function generateCertificateId(courseCode: string, studentId: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const studentSnippet = studentId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
  return `SKILLJ-UNIV-${courseCode.slice(0, 4).toUpperCase()}-${studentSnippet}-${timestamp}`;
}
