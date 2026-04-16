'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { checkPasswordStrength } from '@/lib/password-strength';
import { useLanguage } from '@/contexts/LanguageContext';

interface PasswordStrengthBarProps {
  password: string;
}

const SEGMENT_COLORS = [
  '#E53E3E', // 1/4 - red
  '#DD6B20', // 2/4 - orange
  '#D4A017', // 3/4 - yellow-brown
  'var(--success)', // 4/4 - green
];

export default function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const { t } = useLanguage();
  const { score, requirements } = checkPasswordStrength(password);

  if (!password) return null;

  const labelKey = ['passwordStrengthWeak', 'passwordStrengthWeak', 'passwordStrengthFair', 'passwordStrengthGood', 'passwordStrengthStrong'][score] as keyof typeof t.auth;
  const filledColor = score > 0 ? SEGMENT_COLORS[score - 1] : 'transparent';

  return (
    <div style={{ marginTop: '10px' }}>
      {/* 4-segment bar */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              background: score >= seg ? filledColor : 'var(--border)',
              transition: 'background 0.25s ease',
            }}
          />
        ))}
      </div>

      {/* Strength label */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: score > 0 ? filledColor : 'var(--text-muted)',
            transition: 'color 0.25s ease',
          }}
        >
          {t.auth[labelKey] as string}
        </span>
      </div>

      {/* Requirements checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {requirements.map((req) => (
          <div
            key={req.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {req.met ? (
              <CheckCircle2 size={12} strokeWidth={2.5} style={{ color: 'var(--success)', flexShrink: 0 }} />
            ) : (
              <Circle size={12} strokeWidth={2} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            )}
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: req.met ? 'var(--text-secondary)' : 'var(--text-muted)',
                transition: 'color 0.2s',
              }}
            >
              {t.auth[req.label as keyof typeof t.auth] as string}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
