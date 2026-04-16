'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'th' | 'ja';

export interface Translations {
  badge: string;
  tagline: string;
  aboutLink: string;
  heading: string;
  headingAccent: string;
  sub: string;
  placeholder: string;
  shorten: string;
  shortening: string;
  ready: string;
  originalLabel: string;
  pills: [string, string, string];
  pillIcons: ['zap', 'lock', 'bar'];
  recentLinks: string;
  clear: string;
  savedLocally: string;
  footerTagline: string;
  copy: string;
  copied: string;
  qrCode: string;
  qrTitle: string;
  share: string;
  shareTitle: string;
  close: string;
  download: string;
  errorEmpty: string;
  errorNetwork: string;
  errorGeneric: string;
  about: {
    title: string;
    subtitle: string;
    whatTitle: string;
    whatDesc: string;
    howTitle: string;
    howSteps: [string, string, string];
    featuresTitle: string;
    features: { name: string; desc: string }[];
    privacyTitle: string;
    privacyDesc: string;
    backHome: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    badge: 'Free · Instant · No account',
    tagline: 'Free · No signup',
    aboutLink: 'About',
    heading: 'Short links.',
    headingAccent: 'Big impression.',
    sub: 'Trim any URL to a clean, shareable link — instant and free.',
    placeholder: 'Paste a URL — we\'ll make it shorter',
    shorten: 'Shorten',
    shortening: 'Shortening',
    ready: 'Ready to share',
    originalLabel: 'Original:',
    pills: ['Lightning fast', 'No signup required', 'Click tracking'],
    pillIcons: ['zap', 'lock', 'bar'],
    recentLinks: 'Recent Links',
    clear: 'Clear',
    savedLocally: 'Stored locally · never shared',
    footerTagline: 'Your links. Your data. Always free.',
    copy: 'Copy',
    copied: 'Copied!',
    qrCode: 'QR Code',
    qrTitle: 'Scan to open',
    share: 'Share',
    shareTitle: 'Share this link',
    close: 'Close',
    download: 'Download PNG',
    errorEmpty: 'Please enter a URL to shorten.',
    errorNetwork: 'Network error — please check your connection.',
    errorGeneric: 'Something went wrong. Please try again.',
    about: {
      title: 'About Bexo',
      subtitle: 'Fast, private URL shortening — no account, no tracking, no friction.',
      whatTitle: 'What is Bexo?',
      whatDesc:
        'Bexo is a free URL shortening service that converts long, complex URLs into short, clean links. No registration or personal data required.',
      howTitle: 'How it works',
      howSteps: [
        'Paste any long URL into the input field.',
        'Click the Shorten button.',
        'Your short link is instantly ready — copy it, scan the QR code, or share directly.',
      ],
      featuresTitle: 'Features',
      features: [
        { name: 'Instant', desc: 'Short links are generated in under a second.' },
        { name: 'No account needed', desc: 'Use Bexo without any registration or sign-in.' },
        { name: 'QR Code', desc: 'Generate a scannable QR code for any shortened link.' },
        { name: 'Share', desc: 'Share your link directly via native share or social platforms.' },
        { name: 'Browser history', desc: 'Recent links are saved locally in your browser — private by design.' },
        { name: 'Click tracking', desc: 'Each link records how many times it has been opened.' },
      ],
      privacyTitle: 'Privacy',
      privacyDesc:
        'Your link history is stored locally in your browser via cookies and is never transmitted to our servers. We collect no personal data whatsoever.',
      backHome: 'Back to Bexo',
    },
  },

  th: {
    badge: 'ฟรี · ทันที · ไม่ต้องมีบัญชี',
    tagline: 'ฟรี · ไม่ต้องสมัคร',
    aboutLink: 'เกี่ยวกับ',
    heading: 'ลิงก์สั้น',
    headingAccent: 'ส่งต่อได้ทุกที่',
    sub: 'ย่อ URL ยาวให้กระทัดรัด แชร์ได้ทุกแพลตฟอร์ม ฟรี ไม่ต้องสมัคร',
    placeholder: 'วาง URL — เราจะทำให้สั้นลง',
    shorten: 'ย่อ URL',
    shortening: 'กำลังย่อ',
    ready: 'พร้อมแชร์แล้ว',
    originalLabel: 'ต้นฉบับ:',
    pills: ['รวดเร็ว', 'ไม่ต้องสมัคร', 'ติดตามคลิก'],
    pillIcons: ['zap', 'lock', 'bar'],
    recentLinks: 'ลิงก์ล่าสุด',
    clear: 'ล้างประวัติ',
    savedLocally: 'บันทึกในเบราว์เซอร์ · ไม่ส่งต่อ',
    footerTagline: 'ลิงก์ของคุณ ข้อมูลของคุณ ฟรีเสมอ',
    copy: 'คัดลอก',
    copied: 'คัดลอกแล้ว',
    qrCode: 'QR Code',
    qrTitle: 'สแกนเพื่อเปิด',
    share: 'แชร์',
    shareTitle: 'แชร์ลิงก์นี้',
    close: 'ปิด',
    download: 'ดาวน์โหลด PNG',
    errorEmpty: 'กรุณากรอก URL ที่ต้องการย่อ',
    errorNetwork: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่',
    errorGeneric: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
    about: {
      title: 'เกี่ยวกับ Bexo',
      subtitle: 'ย่อ URL รวดเร็ว ปลอดภัย ไม่ต้องสมัคร ไม่ต้องเปิดเผยข้อมูล',
      whatTitle: 'Bexo คืออะไร?',
      whatDesc:
        'Bexo คือบริการย่อ URL ฟรีที่แปลง URL ยาวซับซ้อนให้กลายเป็นลิงก์สั้นกระทัดรัด ไม่ต้องลงทะเบียนหรือให้ข้อมูลส่วนตัวใด ๆ',
      howTitle: 'วิธีการใช้งาน',
      howSteps: [
        'วาง URL ยาวในช่องกรอกข้อมูล',
        'คลิกปุ่มย่อ URL',
        'ลิงก์สั้นพร้อมให้คัดลอก สแกน QR Code หรือแชร์ได้ทันที',
      ],
      featuresTitle: 'ฟีเจอร์',
      features: [
        { name: 'รวดเร็ว', desc: 'สร้างลิงก์สั้นได้ภายในเสี้ยววินาที' },
        { name: 'ไม่ต้องสมัครบัญชี', desc: 'ใช้งาน Bexo ได้เลยโดยไม่ต้องลงทะเบียน' },
        { name: 'QR Code', desc: 'สร้าง QR Code สำหรับสแกนลิงก์สั้นของคุณ' },
        { name: 'แชร์', desc: 'แชร์ลิงก์โดยตรงผ่านแอปหรือโซเชียลมีเดีย' },
        { name: 'ประวัติในเบราว์เซอร์', desc: 'ลิงก์ล่าสุดถูกบันทึกในเบราว์เซอร์ของคุณ ปลอดภัยโดยดีไซน์' },
        { name: 'ติดตามคลิก', desc: 'แต่ละลิงก์บันทึกจำนวนครั้งที่ถูกเปิด' },
      ],
      privacyTitle: 'ความเป็นส่วนตัว',
      privacyDesc:
        'ประวัติลิงก์ถูกเก็บไว้ในเบราว์เซอร์ของคุณผ่าน Cookie และไม่ถูกส่งไปยังเซิร์ฟเวอร์ของเรา เราไม่เก็บรวบรวมข้อมูลส่วนบุคคลใด ๆ',
      backHome: 'กลับหน้าหลัก',
    },
  },

  ja: {
    badge: '無料 · 即時 · アカウント不要',
    tagline: '無料 · 登録不要',
    aboutLink: 'サービス概要',
    heading: '短く、',
    headingAccent: '鋭く、届ける。',
    sub: 'どんなURLも、シンプルな短縮リンクに。登録不要、即座に。',
    placeholder: 'URLをここに貼り付け',
    shorten: '短縮する',
    shortening: '処理中',
    ready: '共有できます',
    originalLabel: '元のURL:',
    pills: ['高速', '登録不要', 'クリック追跡'],
    pillIcons: ['zap', 'lock', 'bar'],
    recentLinks: '最近のリンク',
    clear: '履歴を削除',
    savedLocally: 'ブラウザに保存 · 外部送信なし',
    footerTagline: 'あなたのリンク。あなたのデータ。ずっと無料。',
    copy: 'コピー',
    copied: 'コピー済み',
    qrCode: 'QRコード',
    qrTitle: 'スキャンして開く',
    share: '共有',
    shareTitle: 'リンクを共有',
    close: '閉じる',
    download: 'PNG保存',
    errorEmpty: 'URLを入力してください',
    errorNetwork: 'ネットワークエラーが発生しました。再試行してください。',
    errorGeneric: 'エラーが発生しました。再試行してください。',
    about: {
      title: 'Bexoについて',
      subtitle: '高速・プライベート・登録不要のURL短縮サービス',
      whatTitle: 'Bexoとは？',
      whatDesc:
        'Bexoは、長くて複雑なURLをシンプルな短縮リンクに変換する無料サービスです。登録や個人情報の入力は一切不要です。',
      howTitle: '使い方',
      howSteps: [
        '入力欄に長いURLを貼り付けます。',
        '「短縮する」ボタンをクリックします。',
        '短縮リンクが即座に生成され、コピー・QRスキャン・直接共有が可能です。',
      ],
      featuresTitle: '機能',
      features: [
        { name: '即座に生成', desc: '1秒以内に短縮リンクを生成します。' },
        { name: 'アカウント不要', desc: '登録なしでBexoをご利用いただけます。' },
        { name: 'QRコード', desc: '短縮リンクのスキャン用QRコードを生成できます。' },
        { name: '共有', desc: 'ネイティブ共有またはSNSから直接リンクを共有できます。' },
        { name: 'ブラウザ履歴', desc: '最近のリンクはブラウザにローカル保存されます。' },
        { name: 'クリック追跡', desc: '各リンクの開封回数を記録します。' },
      ],
      privacyTitle: 'プライバシー',
      privacyDesc:
        '閲覧履歴はCookieを使用してブラウザにローカル保存され、サーバーには送信されません。個人データは一切収集しません。',
      backHome: 'ホームに戻る',
    },
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bexo-lang') as Language;
      if (saved && ['en', 'th', 'ja'].includes(saved)) {
        setLangState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('bexo-lang', newLang);
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
