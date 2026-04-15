'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'th' | 'ja';

export interface Translations {
  tagline: string;
  aboutLink: string;
  heading: string;
  headingAccent: string;
  placeholder: string;
  shorten: string;
  shortening: string;
  ready: string;
  originalLabel: string;
  pills: [string, string, string];
  recentLinks: string;
  clear: string;
  savedLocally: string;
  footerText: string;
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
    tagline: 'Free · No signup',
    aboutLink: 'About',
    heading: 'Shorten your URLs',
    headingAccent: 'beautifully',
    placeholder: 'Paste your long URL here...',
    shorten: 'Shorten',
    shortening: 'Shortening',
    ready: 'Link ready',
    originalLabel: 'Original:',
    pills: ['Lightning fast', 'Cookie history', 'Click tracking'],
    recentLinks: 'Recent Links',
    clear: 'Clear',
    savedLocally: 'Saved in browser',
    footerText: 'Free · No account needed',
    copy: 'Copy',
    copied: 'Copied',
    qrCode: 'QR Code',
    qrTitle: 'Scan QR Code',
    share: 'Share',
    shareTitle: 'Share this link',
    close: 'Close',
    download: 'Download',
    errorEmpty: 'Please enter a URL to shorten.',
    errorNetwork: 'Network error. Please check your connection.',
    errorGeneric: 'Something went wrong. Please try again.',
    about: {
      title: 'About Bexo',
      subtitle: 'A free, fast, and private URL shortener.',
      whatTitle: 'What is Bexo?',
      whatDesc:
        'Bexo is a free URL shortening service that converts long, complex URLs into short, clean links. No registration or personal data required.',
      howTitle: 'How it works',
      howSteps: [
        'Paste any long URL into the input field.',
        'Click the Shorten button.',
        'Your short link is instantly ready to copy, share, or scan via QR code.',
      ],
      featuresTitle: 'Features',
      features: [
        { name: 'Lightning fast', desc: 'Short links are generated instantly.' },
        { name: 'No account needed', desc: 'Use Bexo without registration or sign-in.' },
        { name: 'QR Code', desc: 'Generate a QR code for any shortened link.' },
        { name: 'Share', desc: 'Share your link directly from the app.' },
        { name: 'Browser history', desc: 'Recent links are stored locally in your browser.' },
        { name: 'Click tracking', desc: 'Each link records how many times it has been clicked.' },
      ],
      privacyTitle: 'Privacy',
      privacyDesc:
        'Your link history is stored locally in your browser via cookies and is never sent to our servers. We do not collect any personal data.',
      backHome: 'Back to Bexo',
    },
  },

  th: {
    tagline: 'ฟรี · ไม่ต้องสมัคร',
    aboutLink: 'เกี่ยวกับ',
    heading: 'ย่อ URL ของคุณ',
    headingAccent: 'อย่างสวยงาม',
    placeholder: 'วาง URL ยาวของคุณที่นี่...',
    shorten: 'ย่อ URL',
    shortening: 'กำลังย่อ',
    ready: 'ลิงก์พร้อมแล้ว',
    originalLabel: 'ต้นฉบับ:',
    pills: ['รวดเร็ว', 'ประวัติ Cookie', 'ติดตามคลิก'],
    recentLinks: 'ลิงก์ล่าสุด',
    clear: 'ล้าง',
    savedLocally: 'บันทึกในเบราว์เซอร์',
    footerText: 'ฟรี · ไม่ต้องมีบัญชี',
    copy: 'คัดลอก',
    copied: 'คัดลอกแล้ว',
    qrCode: 'QR Code',
    qrTitle: 'สแกน QR Code',
    share: 'แชร์',
    shareTitle: 'แชร์ลิงก์นี้',
    close: 'ปิด',
    download: 'ดาวน์โหลด',
    errorEmpty: 'กรุณากรอก URL ที่ต้องการย่อ',
    errorNetwork: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่',
    errorGeneric: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
    about: {
      title: 'เกี่ยวกับ Bexo',
      subtitle: 'บริการย่อ URL ฟรี รวดเร็ว และปลอดภัย',
      whatTitle: 'Bexo คืออะไร?',
      whatDesc:
        'Bexo คือบริการย่อ URL ฟรีที่แปลง URL ยาวซับซ้อนให้กลายเป็นลิงก์สั้นกระทัดรัด ไม่ต้องลงทะเบียนหรือให้ข้อมูลส่วนตัว',
      howTitle: 'วิธีการใช้งาน',
      howSteps: [
        'วาง URL ยาวในช่องกรอกข้อมูล',
        'คลิกปุ่มย่อ URL',
        'ลิงก์สั้นพร้อมให้คัดลอก แชร์ หรือสแกน QR Code ได้ทันที',
      ],
      featuresTitle: 'ฟีเจอร์',
      features: [
        { name: 'รวดเร็ว', desc: 'สร้างลิงก์สั้นได้ทันที' },
        { name: 'ไม่ต้องสมัครบัญชี', desc: 'ใช้งาน Bexo ได้โดยไม่ต้องลงทะเบียน' },
        { name: 'QR Code', desc: 'สร้าง QR Code สำหรับลิงก์สั้นของคุณ' },
        { name: 'แชร์', desc: 'แชร์ลิงก์โดยตรงจากแอป' },
        { name: 'ประวัติในเบราว์เซอร์', desc: 'ลิงก์ล่าสุดถูกบันทึกในเบราว์เซอร์ของคุณ' },
        { name: 'ติดตามคลิก', desc: 'แต่ละลิงก์มีการนับจำนวนครั้งที่ถูกคลิก' },
      ],
      privacyTitle: 'ความเป็นส่วนตัว',
      privacyDesc:
        'ประวัติลิงก์ถูกเก็บไว้ในเบราว์เซอร์ของคุณผ่าน Cookie และไม่ถูกส่งไปยังเซิร์ฟเวอร์ของเรา เราไม่เก็บรวบรวมข้อมูลส่วนบุคคลใด ๆ',
      backHome: 'กลับหน้าหลัก',
    },
  },

  ja: {
    tagline: '無料 · 登録不要',
    aboutLink: 'サービス概要',
    heading: 'URLを短縮',
    headingAccent: 'シンプルに',
    placeholder: 'URLをここに貼り付け...',
    shorten: '短縮する',
    shortening: '処理中',
    ready: 'リンク完成',
    originalLabel: '元のURL:',
    pills: ['高速', 'Cookie履歴', 'クリック追跡'],
    recentLinks: '最近のリンク',
    clear: '削除',
    savedLocally: 'ブラウザに保存',
    footerText: '無料 · アカウント不要',
    copy: 'コピー',
    copied: 'コピー済み',
    qrCode: 'QRコード',
    qrTitle: 'QRコードをスキャン',
    share: '共有',
    shareTitle: 'リンクを共有',
    close: '閉じる',
    download: '保存',
    errorEmpty: 'URLを入力してください',
    errorNetwork: 'ネットワークエラーが発生しました。再試行してください。',
    errorGeneric: 'エラーが発生しました。再試行してください。',
    about: {
      title: 'Bexoについて',
      subtitle: '無料・高速・プライベートなURL短縮サービス',
      whatTitle: 'Bexoとは？',
      whatDesc:
        'Bexoは、長くて複雑なURLをシンプルな短縮リンクに変換する無料のURL短縮サービスです。登録や個人情報の入力は一切不要です。',
      howTitle: '使い方',
      howSteps: [
        '入力欄に長いURLを貼り付けます。',
        '「短縮する」ボタンをクリックします。',
        '短縮リンクが即座に生成され、コピー・共有・QRコードスキャンが可能です。',
      ],
      featuresTitle: '機能',
      features: [
        { name: '高速', desc: '短縮リンクを即座に生成します。' },
        { name: 'アカウント不要', desc: '登録なしでBexoをご利用いただけます。' },
        { name: 'QRコード', desc: '短縮リンクのQRコードを生成できます。' },
        { name: '共有', desc: 'アプリから直接リンクを共有できます。' },
        { name: 'ブラウザ履歴', desc: '最近のリンクはブラウザにローカル保存されます。' },
        { name: 'クリック追跡', desc: '各リンクのクリック数を記録します。' },
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
