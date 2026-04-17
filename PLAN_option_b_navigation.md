# Option B — แยก Navigation: Marketing Home + /shorten + /create

> สร้างเมื่อ: 2026-04-17
> อัปเดตสถานะในไฟล์นี้ทุกครั้งที่ task เสร็จ

## ภาพรวม

แบ่งเว็บออกเป็น 3 ส่วนชัดเจน:

| Route | เนื้อหา |
|-------|---------|
| `/` | Marketing homepage — แนะนำ 2 ฟีเจอร์ พร้อม CTA |
| `/shorten` | URL Shortener (ย้ายจาก `/` เดิม) |
| `/create` | Bio Page Creator (มีอยู่แล้ว — ไม่เปลี่ยน) |

Navbar จะมี 2 feature links ชัดเจน:
```
Bexo  |  Shorten Link  |  Bio Page  |  About  |  [Login]  [EN/TH/JA]
```

---

## Step 1: เพิ่ม Translation Keys ใน `contexts/LanguageContext.tsx`

เพิ่มใน `Translations` interface และทั้ง 3 ภาษา:

```typescript
// Navbar feature links
shortenNav: string        // "Shorten Link" / "ย่อลิงก์" / "短縮リンク"
bioPageNav: string        // "Bio Page" / "หน้า Bio" / "Bioページ"

// Marketing homepage
homeHeading: string       // "Your links," / "จัดการลิงก์ของคุณ" / "リンクを、"
homeAccent: string        // "one place." / "ในที่เดียว" / "一か所で。"
homeSub: string           // "Two powerful tools..."
homeFeatureShortenTitle: string  // "URL Shortener"
homeFeatureShortenDesc: string   // "Turn any long URL into a clean..."
homeFeatureShortenCTA: string    // "Shorten a Link" / "ย่อลิงก์" / "リンクを短縮"
homeFeatureBioTitle: string      // "Bio Page"
homeFeatureBioDesc: string       // "Collect all your links in one..."
homeFeatureBioCTA: string        // "Create Bio Page" / "สร้างหน้า Bio" / "Bioページを作成"
```

- [ ] เพิ่ม keys ใน interface
- [ ] เพิ่ม EN translations
- [ ] เพิ่ม TH translations
- [ ] เพิ่ม JA translations

**ไฟล์:** `contexts/LanguageContext.tsx`

---

## Step 2: สร้าง `app/shorten/page.tsx`

**ย้าย** เนื้อหาจาก `app/page.tsx` ปัจจุบันมาทั้งหมด (ไม่เปลี่ยนอะไร):
- Hero section (badge, heading, subline)
- Form card (`<UrlShortenerForm />`)
- Feature pills
- `<HistoryList />`
- Footer

เปลี่ยนเพียง: import Navbar ให้ยังคงอยู่, ไม่ต้องทำอะไรเพิ่ม

- [ ] สร้าง `app/shorten/page.tsx` (copy จาก `app/page.tsx` ปัจจุบัน)

**ไฟล์ใหม่:** `app/shorten/page.tsx`

---

## Step 3: เขียน `app/page.tsx` ใหม่ (Marketing Homepage)

**Layout:**
```
┌──────────────────────────────────────────┐
│  <Navbar />                              │
├──────────────────────────────────────────┤
│                                          │
│   [hero: heading + sub]                  │
│                                          │
│  ┌────────────────┐ ┌────────────────┐  │
│  │  🔗            │ │  🌟            │  │
│  │  URL Shortener │ │  Bio Page      │  │
│  │  desc...       │ │  desc...       │  │
│  │  [Shorten →]   │ │  [Create →]    │  │
│  └────────────────┘ └────────────────┘  │
│                                          │
│  stats/feature pills (optional)          │
│                                          │
├──────────────────────────────────────────┤
│  <Footer />                              │
└──────────────────────────────────────────┘
```

**Design tokens ที่ใช้:**
- Cards: `var(--bg-card)`, border `var(--border)`, borderRadius `24px`
- Gradient top border บน card (เหมือน form card เดิม): `linear-gradient(90deg, #D4A876, var(--accent), #9A6E48)`
- CTA buttons: primary = `var(--accent)` bg white text, secondary = outline

- [ ] เขียน `app/page.tsx` ใหม่เป็น marketing homepage

**ไฟล์:** `app/page.tsx`

---

## Step 4: อัปเดต `components/Navbar.tsx`

เพิ่ม 2 links ใน `NAV_LINKS`:

```typescript
const NAV_LINKS = [
  { href: '/shorten', labelKey: 'shortenNav' as const },
  { href: '/create',  labelKey: 'bioPageNav'  as const },
  { href: '/about',   labelKey: 'aboutLink'   as const },
];
```

Mobile drawer จะได้ links ใหม่อัตโนมัติ เพราะใช้ `NAV_LINKS` array เดิม

- [ ] อัปเดต `NAV_LINKS` array

**ไฟล์:** `components/Navbar.tsx`

---

## Step 5: ลบ CTA pill ใน `app/shorten/page.tsx`

ตอนนี้มี CTA "สร้างหน้ารวมลิงก์" อยู่ใต้ form (เพิ่มไปใน Step ก่อนหน้า) — ให้ลบออก เพราะ nav จะทำหน้าที่แทนแล้ว

- [ ] ลบ `{/* ── Create Page CTA ── */}` block ออกจาก shorten page

**ไฟล์:** `app/shorten/page.tsx`

---

## Step 6: อัปเดต `CLAUDE.md`

เพิ่ม route ใหม่ `/shorten` และอธิบาย marketing homepage ที่ `/`

- [ ] อัปเดต Key Files table
- [ ] อัปเดต Data Flow section

**ไฟล์:** `CLAUDE.md`

---

## Step 7: Commit & Push

- [ ] Commit พร้อม message ที่ชัดเจน
- [ ] Push branch `claude/micro-landing-page-LnECB`

---

## Critical Files

| ไฟล์ | Action |
|------|--------|
| `contexts/LanguageContext.tsx` | เพิ่ม ~10 translation keys (EN/TH/JA) |
| `app/shorten/page.tsx` | **CREATE** — ย้ายเนื้อหา URL shortener จาก `/` |
| `app/page.tsx` | **REWRITE** — marketing homepage |
| `components/Navbar.tsx` | เพิ่ม 2 nav links |
| `CLAUDE.md` | อัปเดต docs |

**ไม่ต้องเปลี่ยน:**
- `app/create/page.tsx` — ใช้ได้เลย
- `app/[code]/page.tsx` — back links ที่ชี้ `/` ยังถูกต้อง (marketing home)
- `app/api/*` — ไม่กระทบ

---

## Verification Checklist

- [ ] `/` แสดง marketing homepage พร้อม 2 feature cards
- [ ] `/shorten` แสดง URL shortener เหมือนเดิมทุกอย่าง (form, history, pills)
- [ ] `/create` ยังทำงานปกติ
- [ ] Navbar desktop แสดง: Shorten Link · Bio Page · About
- [ ] Navbar mobile drawer แสดง links ครบ
- [ ] Active nav item highlight ถูก route
- [ ] URL ย่อเดิมที่ `/{code}` ยัง redirect ได้ปกติ
- [ ] `npm run build` ผ่าน
