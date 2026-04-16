export interface PasswordStrengthResult {
  score: number;          // 0–4
  requirements: {
    label: string;
    met: boolean;
  }[];
}

export function checkPasswordStrength(password: string): PasswordStrengthResult {
  const requirements = [
    { label: 'pwRequireLength', met: password.length >= 8 },
    { label: 'pwRequireUppercase', met: /[A-Z]/.test(password) },
    { label: 'pwRequireLowercase', met: /[a-z]/.test(password) },
    { label: 'pwRequireNumber', met: /[0-9]/.test(password) },
  ];

  const score = requirements.filter((r) => r.met).length;

  return { score, requirements };
}

export function isPasswordStrong(password: string): boolean {
  return checkPasswordStrength(password).score === 4;
}
