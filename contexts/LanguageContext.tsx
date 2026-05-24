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
  // Security layer
  advancedOptions: string;
  safeMode: string;
  safeModeDesc: string;
  setPassword: string;
  passwordPlaceholder: string;
  scanSafe: string;
  scanUnknown: string;
  errorMalicious: string;
  previewTitle: string;
  previewProceed: string;
  previewCancel: string;
  dangerTitle: string;
  dangerDesc: string;
  dangerBack: string;
  passwordGateTitle: string;
  passwordGatePlaceholder: string;
  passwordGateSubmit: string;
  passwordGateError: string;
  passwordGateVerifying: string;
  // Page creation
  createPageNav: string;
  createPageHeading: string;
  createPageSub: string;
  pageTitle: string;
  pageTitlePlaceholder: string;
  pageBio: string;
  pageBioPlaceholder: string;
  chooseEmoji: string;
  addLink: string;
  linkTitle: string;
  linkUrl: string;
  removeLink: string;
  chooseTheme: string;
  themeWarm: string;
  themeDark: string;
  themeGradient: string;
  createPageBtn: string;
  creatingPage: string;
  pageReady: string;
  viewPage: string;
  errorPageTitle: string;
  errorNoLinks: string;
  errorTooManyLinks: string;
  poweredBy: string;
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
  // Authentication
  auth: {
    // Nav
    loginLink: string;
    registerLink: string;
    dashboardLink: string;
    logoutBtn: string;
    // Login page
    loginTitle: string;
    loginSubtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    rememberMe: string;
    forgotPassword: string;
    loginBtn: string;
    signingIn: string;
    noAccount: string;
    signUpLink: string;
    // Register page
    registerTitle: string;
    registerSubtitle: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    registerBtn: string;
    registering: string;
    hasAccount: string;
    signInLink: string;
    // Password strength
    passwordStrength: string;
    pwRequireLength: string;
    pwRequireUppercase: string;
    pwRequireLowercase: string;
    pwRequireNumber: string;
    passwordsNoMatch: string;
    passwordStrengthWeak: string;
    passwordStrengthFair: string;
    passwordStrengthGood: string;
    passwordStrengthStrong: string;
    // Forgot password
    forgotTitle: string;
    forgotSubtitle: string;
    sendResetLink: string;
    sendingReset: string;
    resetEmailSent: string;
    resetEmailDesc: string;
    backToLogin: string;
    // Reset password
    resetTitle: string;
    resetSubtitle: string;
    newPasswordLabel: string;
    resetBtn: string;
    resetting: string;
    // Verify email
    verifyTitle: string;
    verifyDesc: string;
    resendEmail: string;
    // Dashboard
    dashboardTitle: string;
    dashboardSubtitle: string;
    profileSection: string;
    displayNameLabel: string;
    displayNamePlaceholder: string;
    saveProfile: string;
    savingProfile: string;
    profileSaved: string;
    myLinksSection: string;
    noLinksYet: string;
    noLinksDesc: string;
    deleteLink: string;
    // Auth errors
    errorInvalidEmail: string;
    errorInvalidCredentials: string;
    errorEmailTaken: string;
    errorRateLimited: string;
    errorWeakPassword: string;
    errorSessionExpired: string;
    errorExpiredLink: string;
    errorGenericAuth: string;
    errorEmailNotConfirmed: string;
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
    advancedOptions: 'Advanced Options',
    safeMode: 'Safe Mode',
    safeModeDesc: 'Show a preview page before redirecting visitors.',
    setPassword: 'Password (optional)',
    passwordPlaceholder: 'Leave blank for no password',
    scanSafe: 'Scanned — Safe',
    scanUnknown: 'Scan Unknown',
    errorMalicious: 'This URL has been flagged as malicious and cannot be shortened.',
    previewTitle: 'Destination Preview',
    previewProceed: 'Proceed to Destination',
    previewCancel: 'Cancel',
    dangerTitle: 'Dangerous Link Blocked',
    dangerDesc: 'This link has been flagged as malicious. Visiting it may put your device or personal information at risk.',
    dangerBack: '← Back to Safety',
    passwordGateTitle: 'Password Required',
    passwordGatePlaceholder: 'Enter password',
    passwordGateSubmit: 'Unlock Link',
    passwordGateError: 'Incorrect password. Please try again.',
    passwordGateVerifying: 'Verifying…',
    createPageNav: 'Create link page',
    createPageHeading: 'Create your link page',
    createPageSub: 'Collect all your links in one place',
    pageTitle: 'Page Title',
    pageTitlePlaceholder: 'e.g. My Links',
    pageBio: 'Bio',
    pageBioPlaceholder: 'Short description (optional)',
    chooseEmoji: 'Choose an icon',
    addLink: 'Add Link',
    linkTitle: 'Link title',
    linkUrl: 'URL',
    removeLink: 'Remove',
    chooseTheme: 'Theme',
    themeWarm: 'Warm',
    themeDark: 'Dark',
    themeGradient: 'Gradient',
    createPageBtn: 'Create My Page',
    creatingPage: 'Creating…',
    pageReady: 'Your page is ready!',
    viewPage: 'View Page',
    errorPageTitle: 'Please enter a page title',
    errorNoLinks: 'Please add at least one link',
    errorTooManyLinks: 'Maximum 20 links allowed',
    poweredBy: 'Powered by Bexo',
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
    auth: {
      loginLink: 'Login',
      registerLink: 'Sign up',
      dashboardLink: 'Dashboard',
      logoutBtn: 'Log out',
      loginTitle: 'Welcome back',
      loginSubtitle: 'Sign in to your Bexo account',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      loginBtn: 'Sign in',
      signingIn: 'Signing in…',
      noAccount: "Don't have an account?",
      signUpLink: 'Sign up',
      registerTitle: 'Create an account',
      registerSubtitle: 'Join Bexo — free forever',
      confirmPasswordLabel: 'Confirm password',
      confirmPasswordPlaceholder: 'Re-enter your password',
      registerBtn: 'Create account',
      registering: 'Creating account…',
      hasAccount: 'Already have an account?',
      signInLink: 'Sign in',
      passwordStrength: 'Password strength',
      pwRequireLength: 'At least 8 characters',
      pwRequireUppercase: 'One uppercase letter',
      pwRequireLowercase: 'One lowercase letter',
      pwRequireNumber: 'One number',
      passwordsNoMatch: 'Passwords do not match',
      passwordStrengthWeak: 'Weak',
      passwordStrengthFair: 'Fair',
      passwordStrengthGood: 'Good',
      passwordStrengthStrong: 'Strong',
      forgotTitle: 'Reset your password',
      forgotSubtitle: "Enter your email and we'll send you a reset link",
      sendResetLink: 'Send reset link',
      sendingReset: 'Sending…',
      resetEmailSent: 'Check your inbox!',
      resetEmailDesc: 'We sent a password reset link to your email',
      backToLogin: 'Back to login',
      resetTitle: 'Set new password',
      resetSubtitle: 'Enter your new password below',
      newPasswordLabel: 'New password',
      resetBtn: 'Update password',
      resetting: 'Updating…',
      verifyTitle: 'Verify your email',
      verifyDesc: "We sent a confirmation link to your email. Click the link to activate your account.",
      resendEmail: 'Resend email',
      dashboardTitle: 'Dashboard',
      dashboardSubtitle: 'Manage your links and profile',
      profileSection: 'Your Profile',
      displayNameLabel: 'Display name',
      displayNamePlaceholder: 'Your name',
      saveProfile: 'Save',
      savingProfile: 'Saving…',
      profileSaved: 'Saved!',
      myLinksSection: 'My Links',
      noLinksYet: 'No links yet',
      noLinksDesc: 'Shortened links you create while logged in will appear here.',
      deleteLink: 'Delete',
      errorInvalidEmail: 'Please enter a valid email address',
      errorInvalidCredentials: 'Incorrect email or password',
      errorEmailTaken: 'This email is already registered',
      errorRateLimited: 'Too many attempts. Please wait a moment and try again',
      errorWeakPassword: 'Password does not meet requirements',
      errorSessionExpired: 'Your session has expired. Please log in again',
      errorExpiredLink: 'This link has expired. Please request a new one',
      errorGenericAuth: 'Something went wrong. Please try again',
      errorEmailNotConfirmed: 'Please verify your email before logging in',
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
    advancedOptions: 'ตัวเลือกเพิ่มเติม',
    safeMode: 'Safe Mode',
    safeModeDesc: 'แสดงหน้าตัวอย่างก่อน redirect ทุกครั้ง',
    setPassword: 'รหัสผ่าน (ไม่บังคับ)',
    passwordPlaceholder: 'เว้นว่างหากไม่ต้องการรหัสผ่าน',
    scanSafe: 'สแกนแล้ว — ปลอดภัย',
    scanUnknown: 'ไม่ทราบผลสแกน',
    errorMalicious: 'URL นี้ถูกระบุว่าเป็นอันตราย ไม่สามารถย่อได้',
    previewTitle: 'ตัวอย่างปลายทาง',
    previewProceed: 'ไปยังปลายทาง',
    previewCancel: 'ยกเลิก',
    dangerTitle: 'ลิงก์อันตราย — ถูกบล็อก',
    dangerDesc: 'ลิงก์นี้ถูกระบุว่าเป็นอันตราย การเข้าถึงอาจเป็นอันตรายต่ออุปกรณ์หรือข้อมูลส่วนตัวของคุณ',
    dangerBack: '← กลับสู่ความปลอดภัย',
    passwordGateTitle: 'ต้องใส่รหัสผ่าน',
    passwordGatePlaceholder: 'กรอกรหัสผ่าน',
    passwordGateSubmit: 'ปลดล็อกลิงก์',
    passwordGateError: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่',
    passwordGateVerifying: 'กำลังตรวจสอบ…',
    createPageNav: 'สร้างหน้ารวมลิงก์',
    createPageHeading: 'สร้างหน้ารวมลิงก์ของคุณ',
    createPageSub: 'รวมลิงก์ทั้งหมดไว้ในที่เดียว',
    pageTitle: 'ชื่อหน้า',
    pageTitlePlaceholder: 'เช่น ลิงก์ของฉัน',
    pageBio: 'คำอธิบาย',
    pageBioPlaceholder: 'คำอธิบายสั้นๆ (ไม่บังคับ)',
    chooseEmoji: 'เลือกไอคอน',
    addLink: 'เพิ่มลิงก์',
    linkTitle: 'ชื่อลิงก์',
    linkUrl: 'URL',
    removeLink: 'ลบ',
    chooseTheme: 'ธีม',
    themeWarm: 'อบอุ่น',
    themeDark: 'มืด',
    themeGradient: 'ไล่สี',
    createPageBtn: 'สร้างหน้าของฉัน',
    creatingPage: 'กำลังสร้าง…',
    pageReady: 'หน้าของคุณพร้อมแล้ว!',
    viewPage: 'ดูหน้า',
    errorPageTitle: 'กรุณากรอกชื่อหน้า',
    errorNoLinks: 'กรุณาเพิ่มลิงก์อย่างน้อย 1 รายการ',
    errorTooManyLinks: 'เพิ่มได้สูงสุด 20 ลิงก์',
    poweredBy: 'ขับเคลื่อนโดย Bexo',
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
    auth: {
      loginLink: 'เข้าสู่ระบบ',
      registerLink: 'สมัครสมาชิก',
      dashboardLink: 'แดชบอร์ด',
      logoutBtn: 'ออกจากระบบ',
      loginTitle: 'ยินดีต้อนรับกลับ',
      loginSubtitle: 'เข้าสู่ระบบบัญชี Bexo ของคุณ',
      emailLabel: 'อีเมล',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'รหัสผ่าน',
      rememberMe: 'จดจำฉัน',
      forgotPassword: 'ลืมรหัสผ่าน?',
      loginBtn: 'เข้าสู่ระบบ',
      signingIn: 'กำลังเข้าสู่ระบบ…',
      noAccount: 'ยังไม่มีบัญชี?',
      signUpLink: 'สมัครสมาชิก',
      registerTitle: 'สร้างบัญชีใหม่',
      registerSubtitle: 'เข้าร่วม Bexo — ฟรีตลอดไป',
      confirmPasswordLabel: 'ยืนยันรหัสผ่าน',
      confirmPasswordPlaceholder: 'กรอกรหัสผ่านอีกครั้ง',
      registerBtn: 'สร้างบัญชี',
      registering: 'กำลังสร้างบัญชี…',
      hasAccount: 'มีบัญชีอยู่แล้ว?',
      signInLink: 'เข้าสู่ระบบ',
      passwordStrength: 'ความแข็งแกร่งของรหัสผ่าน',
      pwRequireLength: 'อย่างน้อย 8 ตัวอักษร',
      pwRequireUppercase: 'ตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว',
      pwRequireLowercase: 'ตัวพิมพ์เล็กอย่างน้อย 1 ตัว',
      pwRequireNumber: 'ตัวเลขอย่างน้อย 1 ตัว',
      passwordsNoMatch: 'รหัสผ่านไม่ตรงกัน',
      passwordStrengthWeak: 'อ่อนแอ',
      passwordStrengthFair: 'พอใช้',
      passwordStrengthGood: 'ดี',
      passwordStrengthStrong: 'แข็งแกร่ง',
      forgotTitle: 'รีเซ็ตรหัสผ่าน',
      forgotSubtitle: 'กรอกอีเมลของคุณ เราจะส่งลิงก์รีเซ็ตให้',
      sendResetLink: 'ส่งลิงก์รีเซ็ต',
      sendingReset: 'กำลังส่ง…',
      resetEmailSent: 'ตรวจสอบกล่องจดหมาย!',
      resetEmailDesc: 'เราส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว',
      backToLogin: 'กลับสู่หน้าเข้าสู่ระบบ',
      resetTitle: 'ตั้งรหัสผ่านใหม่',
      resetSubtitle: 'กรอกรหัสผ่านใหม่ของคุณด้านล่าง',
      newPasswordLabel: 'รหัสผ่านใหม่',
      resetBtn: 'อัปเดตรหัสผ่าน',
      resetting: 'กำลังอัปเดต…',
      verifyTitle: 'ยืนยันอีเมลของคุณ',
      verifyDesc: 'เราส่งลิงก์ยืนยันไปยังอีเมลของคุณแล้ว คลิกลิงก์เพื่อเปิดใช้งานบัญชี',
      resendEmail: 'ส่งอีเมลใหม่',
      dashboardTitle: 'แดชบอร์ด',
      dashboardSubtitle: 'จัดการลิงก์และโปรไฟล์ของคุณ',
      profileSection: 'โปรไฟล์ของคุณ',
      displayNameLabel: 'ชื่อแสดง',
      displayNamePlaceholder: 'ชื่อของคุณ',
      saveProfile: 'บันทึก',
      savingProfile: 'กำลังบันทึก…',
      profileSaved: 'บันทึกแล้ว!',
      myLinksSection: 'ลิงก์ของฉัน',
      noLinksYet: 'ยังไม่มีลิงก์',
      noLinksDesc: 'ลิงก์ที่คุณสร้างขณะเข้าสู่ระบบจะปรากฏที่นี่',
      deleteLink: 'ลบ',
      errorInvalidEmail: 'กรุณากรอกอีเมลที่ถูกต้อง',
      errorInvalidCredentials: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      errorEmailTaken: 'อีเมลนี้ถูกลงทะเบียนแล้ว',
      errorRateLimited: 'พยายามเข้าสู่ระบบบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่',
      errorWeakPassword: 'รหัสผ่านไม่ตรงตามข้อกำหนด',
      errorSessionExpired: 'เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่',
      errorExpiredLink: 'ลิงก์นี้หมดอายุแล้ว กรุณาขอลิงก์ใหม่',
      errorGenericAuth: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
      errorEmailNotConfirmed: 'กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ',
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
    advancedOptions: '詳細オプション',
    safeMode: 'セーフモード',
    safeModeDesc: 'リダイレクト前に宛先プレビューを表示します。',
    setPassword: 'パスワード（任意）',
    passwordPlaceholder: 'パスワードなしの場合は空白',
    scanSafe: 'スキャン済 — 安全',
    scanUnknown: 'スキャン不明',
    errorMalicious: 'このURLは危険と判定されたため短縮できません。',
    previewTitle: '遷移先プレビュー',
    previewProceed: '遷移先へ進む',
    previewCancel: 'キャンセル',
    dangerTitle: '危険なリンクをブロック',
    dangerDesc: 'このリンクは悪意のあるURLとして検出されました。アクセスするとデバイスや個人情報が危険にさらされる可能性があります。',
    dangerBack: '← 安全な場所に戻る',
    passwordGateTitle: 'パスワードが必要です',
    passwordGatePlaceholder: 'パスワードを入力',
    passwordGateSubmit: 'リンクを解錠',
    passwordGateError: 'パスワードが正しくありません。再試行してください。',
    passwordGateVerifying: '確認中…',
    createPageNav: 'リンクページを作成',
    createPageHeading: 'リンクページを作成',
    createPageSub: 'すべてのリンクを一か所にまとめましょう',
    pageTitle: 'ページタイトル',
    pageTitlePlaceholder: '例：マイリンク',
    pageBio: '自己紹介',
    pageBioPlaceholder: '短い説明（任意）',
    chooseEmoji: 'アイコンを選択',
    addLink: 'リンクを追加',
    linkTitle: 'リンクのタイトル',
    linkUrl: 'URL',
    removeLink: '削除',
    chooseTheme: 'テーマ',
    themeWarm: 'ウォーム',
    themeDark: 'ダーク',
    themeGradient: 'グラデーション',
    createPageBtn: 'ページを作成',
    creatingPage: '作成中…',
    pageReady: 'ページが完成しました！',
    viewPage: 'ページを見る',
    errorPageTitle: 'ページタイトルを入力してください',
    errorNoLinks: 'リンクを少なくとも1つ追加してください',
    errorTooManyLinks: 'リンクは最大20件までです',
    poweredBy: 'Powered by Bexo',
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
    auth: {
      loginLink: 'ログイン',
      registerLink: '登録',
      dashboardLink: 'ダッシュボード',
      logoutBtn: 'ログアウト',
      loginTitle: 'おかえりなさい',
      loginSubtitle: 'Bexoアカウントにログイン',
      emailLabel: 'メールアドレス',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'パスワード',
      rememberMe: 'ログイン状態を保持',
      forgotPassword: 'パスワードを忘れた方',
      loginBtn: 'ログイン',
      signingIn: 'ログイン中…',
      noAccount: 'アカウントをお持ちでない方',
      signUpLink: '新規登録',
      registerTitle: 'アカウントを作成',
      registerSubtitle: 'Bexoに参加 — 永久無料',
      confirmPasswordLabel: 'パスワード（確認）',
      confirmPasswordPlaceholder: 'パスワードを再入力',
      registerBtn: 'アカウントを作成',
      registering: 'アカウント作成中…',
      hasAccount: 'すでにアカウントをお持ちの方',
      signInLink: 'ログイン',
      passwordStrength: 'パスワード強度',
      pwRequireLength: '8文字以上',
      pwRequireUppercase: '大文字を1文字以上',
      pwRequireLowercase: '小文字を1文字以上',
      pwRequireNumber: '数字を1文字以上',
      passwordsNoMatch: 'パスワードが一致しません',
      passwordStrengthWeak: '弱い',
      passwordStrengthFair: '普通',
      passwordStrengthGood: '良い',
      passwordStrengthStrong: '強い',
      forgotTitle: 'パスワードのリセット',
      forgotSubtitle: 'メールアドレスを入力してください。リセットリンクを送信します',
      sendResetLink: 'リセットリンクを送信',
      sendingReset: '送信中…',
      resetEmailSent: 'メールを確認してください！',
      resetEmailDesc: 'パスワードリセットリンクをメールに送信しました',
      backToLogin: 'ログインに戻る',
      resetTitle: '新しいパスワードを設定',
      resetSubtitle: '以下に新しいパスワードを入力してください',
      newPasswordLabel: '新しいパスワード',
      resetBtn: 'パスワードを更新',
      resetting: '更新中…',
      verifyTitle: 'メールアドレスの確認',
      verifyDesc: 'メールアドレスに確認リンクを送信しました。リンクをクリックしてアカウントを有効化してください。',
      resendEmail: 'メールを再送',
      dashboardTitle: 'ダッシュボード',
      dashboardSubtitle: 'リンクとプロフィールを管理',
      profileSection: 'プロフィール',
      displayNameLabel: '表示名',
      displayNamePlaceholder: 'お名前',
      saveProfile: '保存',
      savingProfile: '保存中…',
      profileSaved: '保存しました！',
      myLinksSection: 'マイリンク',
      noLinksYet: 'リンクはまだありません',
      noLinksDesc: 'ログイン中に作成した短縮リンクがここに表示されます。',
      deleteLink: '削除',
      errorInvalidEmail: '有効なメールアドレスを入力してください',
      errorInvalidCredentials: 'メールアドレスまたはパスワードが正しくありません',
      errorEmailTaken: 'このメールアドレスはすでに登録されています',
      errorRateLimited: 'ログイン試行回数が多すぎます。しばらく待ってから再試行してください',
      errorWeakPassword: 'パスワードが要件を満たしていません',
      errorSessionExpired: 'セッションが期限切れです。再度ログインしてください',
      errorExpiredLink: 'このリンクは期限切れです。新しいリンクを要求してください',
      errorGenericAuth: 'エラーが発生しました。再試行してください',
      errorEmailNotConfirmed: 'ログインする前にメールアドレスを確認してください',
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
        queueMicrotask(() => setLangState(saved));
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
