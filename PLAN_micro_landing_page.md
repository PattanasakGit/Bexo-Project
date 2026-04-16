# Micro-Landing Page (Linktree-like) — Implementation Plan

> อัปเดตสถานะในไฟล์นี้ทุกครั้งที่ task เสร็จ
> สร้างเมื่อ: 2026-04-16
> **แยกจาก** PLAN_security_layer.md — คนละ feature

## ภาพรวมฟีเจอร์

แทนที่ short link จะ redirect ทันที สามารถสร้างเป็น "หน้าเล็กๆ" ที่รวมลิงก์หลายอันไว้ในที่เดียว (เหมือน Linktree / link-in-bio) เข้าถึงได้ผ่าน URL เดียว เช่น `bexo.link/abc1234`

**Core concept:**
- ไม่ต้องสมัครสมาชิก — privacy-first เหมือนเดิม
- Cookie เก็บ "หน้า" ที่เคยสร้าง (เหมือน URL history)
- รองรับ 3 theme: Warm / Dark / Gradient
- ติดตาม view_count และ click_count รายลิงก์

---

## Step 1: Database Migration (ทำใน Supabase Dashboard)

```sql
CREATE TABLE pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_code VARCHAR(20) NOT NULL UNIQUE,
  title TEXT NOT NULL,
  bio TEXT,
  avatar_emoji TEXT NOT NULL DEFAULT '🔗',
  theme TEXT NOT NULL DEFAULT 'warm',
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE page_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  click_count INTEGER NOT NULL DEFAULT 0
);
```

**RLS policies:**
```sql
-- pages: public read, public insert
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read pages" ON pages FOR SELECT USING (true);
CREATE POLICY "public insert pages" ON pages FOR INSERT WITH CHECK (true);
CREATE POLICY "public update page view_count" ON pages FOR UPDATE USING (true);

-- page_links: public read, public insert, public update (click_count)
ALTER TABLE page_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read page_links" ON page_links FOR SELECT USING (true);
CREATE POLICY "public insert page_links" ON page_links FOR INSERT WITH CHECK (true);
CREATE POLICY "public update page_links" ON page_links FOR UPDATE USING (true);
```

- [ ] รัน SQL ใน Supabase

---

## Step 2: อัปเดต TypeScript Types

### `types/database.types.ts`
เพิ่ม 2 tables ใหม่ใน `Database` type:

```typescript
pages: {
  Row: { id, page_code, title, bio, avatar_emoji, theme, view_count, created_at }
  Insert: { page_code, title, bio?, avatar_emoji?, theme?, view_count?, created_at? }
  Update: { ... (all optional) }
}
page_links: {
  Row: { id, page_id, title, url, position, click_count }
  Insert: { page_id, title, url, position?, click_count? }
  Update: { ... (all optional) }
}
```

### `types/index.ts`
เพิ่ม interfaces ใหม่:

```typescript
export interface PageRecord {
  id: string;
  page_code: string;
  title: string;
  bio: string | null;
  avatar_emoji: string;
  theme: 'warm' | 'dark' | 'gradient';
  view_count: number;
  created_at: string;
}

export interface PageLink {
  id: string;
  page_id: string;
  title: string;
  url: string;
  position: number;
  click_count: number;
}

export interface PageWithLinks extends PageRecord {
  page_links: PageLink[];
}

export interface CreatePageRequest {
  title: string;
  bio?: string;
  avatar_emoji?: string;
  theme?: string;
  links: { title: string; url: string }[];
}

export interface CreatePageResponse {
  page_code: string;
  page_url: string;
  title: string;
}

export interface PageHistoryItem {
  page_code: string;
  title: string;
  page_url: string;
  created_at: string;
}
```

- [ ] `types/database.types.ts`
- [ ] `types/index.ts`

---

## Step 3: สร้าง `app/api/page/route.ts`

**POST** รับ `CreatePageRequest`:

Logic:
1. Validate: `title` ต้องมี, `links` ต้องมีอย่างน้อย 1 รายการ (max 20), แต่ละ link ต้องผ่าน `isValidUrl()`
2. Generate `page_code` ด้วย `generateShortCode()` จาก `lib/utils.ts`
3. **Collision check ทั้งสองตาราง** — ตรวจ `urls` table และ `pages` table (retry ≤5 ครั้ง)
4. Insert `pages` record
5. Insert `page_links` records (bulk insert พร้อม `position` index)
6. Return `{ page_code, page_url, title }`

```typescript
// ตรวจทั้งสองตาราง
const { data: urlConflict } = await supabase.from('urls').select('short_code').eq('short_code', code).maybeSingle();
const { data: pageConflict } = await supabase.from('pages').select('page_code').eq('page_code', code).maybeSingle();
if (urlConflict || pageConflict) { /* retry */ }
```

- [ ] สร้าง `app/api/page/route.ts`

---

## Step 4: สร้าง `app/api/page/[code]/click/route.ts`

**POST** รับ `{ link_id: string }`:
1. Fetch `page_links` record ด้วย `id === link_id`
2. Increment `click_count` (non-blocking, best-effort)
3. Return `{ success: true }`

ใช้สำหรับ client-side tracking เมื่อผู้ใช้คลิกลิงก์บน landing page

- [ ] สร้าง `app/api/page/[code]/click/route.ts`

---

## Step 5: อัปเดต `app/[code]/page.tsx`

เพิ่ม fallback ไปตรวจ `pages` table เมื่อไม่พบใน `urls`:

```typescript
// ปัจจุบัน: ตรวจ urls → redirect หรือ notFound()
// ใหม่:
// 1. ตรวจ urls → ถ้าพบ → redirect flow (เดิม + security layer)
// 2. ตรวจ pages → ถ้าพบ → increment view_count + render <LandingPage />
// 3. ไม่พบทั้งคู่ → notFound()
```

Fetch pages พร้อม links:
```typescript
const { data: page } = await supabase
  .from('pages')
  .select('*, page_links(*)') // JOIN via foreign key
  .eq('page_code', code)
  .maybeSingle();
```

Increment `view_count` non-blocking เหมือน `click_count` ของ URLs.

- [ ] `app/[code]/page.tsx`

---

## Step 6: สร้าง `app/[code]/components/LandingPage.tsx`

**Client component** ('use client') — render Micro-Landing Page:

**Layout:**
```
┌─────────────────────────────┐
│  [avatar_emoji in circle]   │
│  Page Title (bold, large)   │
│  Bio text (muted, centered) │
│                             │
│  ┌─────────────────────┐   │
│  │  🔗  Link Title     │   │
│  │  domain.com         │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │  🔗  Link Title 2   │   │
│  └─────────────────────┘   │
│                             │
│  Powered by Bexo            │
└─────────────────────────────┘
```

**Features:**
- แต่ละปุ่มลิงก์: click → `fetch('/api/page/{code}/click', { body: { link_id } })` (non-blocking) → `window.open(url, '_blank')`
- Theme applied via inline CSS variables
- Domain label ดึงจาก `new URL(link.url).hostname`
- Animation: `fade-up` class (มีใน `globals.css` แล้ว)

### 3 Themes (inline CSS variables):

**warm** (default):
```
bg: #FAF7F2, card: #FFFFFF, text: #2C2014, btn: #2C2014, btn-text: #FFFFFF, accent: #B8845A
```

**dark**:
```
bg: #1A1A1A, card: #2A2A2A, text: #F5F5F5, btn: #B8845A, btn-text: #FFFFFF, accent: #D4A574
```

**gradient**:
```
bg: linear-gradient(135deg, #6B73FF, #9B59B6), card: rgba(255,255,255,0.15), text: #FFFFFF, btn: rgba(255,255,255,0.2), btn-text: #FFFFFF
```

- [ ] สร้าง `app/[code]/components/LandingPage.tsx`

---

## Step 7: สร้าง `app/create/page.tsx`

หน้า UI สำหรับสร้าง Micro-Landing Page (**Client component**):

**Sections:**
1. **Page Info** — emoji picker (grid ตัวอย่าง emoji ยอดนิยม), title input, bio textarea
2. **Links** — Dynamic list ของ `{ title, url }` inputs, ปุ่ม "เพิ่มลิงก์" / "ลบ", จัด order ด้วยปุ่ม ↑↓
3. **Theme Picker** — 3 ตัวเลือก แสดง preview สี
4. **Create Button** — POST `/api/page`
5. **Result Card** — URL ของหน้า + copy button + QR option + บันทึก cookie

**State:**
```typescript
emoji: string = '🔗'
title: string = ''
bio: string = ''
links: { title: string; url: string }[] = [{ title: '', url: '' }]
theme: 'warm' | 'dark' | 'gradient' = 'warm'
isLoading: boolean
result: CreatePageResponse | null
error: string | null
```

**Validation rules:**
- `title`: required, max 60 chars
- `links`: min 1, max 20, แต่ละ URL ต้องผ่าน `isValidUrl()` (import จาก `lib/utils.ts`)
- `link.title`: required, max 80 chars per link

**Cookie บันทึก page history** (`page_history` key) — structure เหมือน `url_history`:
```typescript
[{ page_code, title, page_url, created_at }]  // max 10 items, 30-day expiry
```

- [ ] สร้าง `app/create/page.tsx`

---

## Step 8: อัปเดต `app/page.tsx` (Home)

เพิ่ม CTA button "สร้างหน้ารวมลิงก์" ที่ Hero section หรือ Feature pills ด้านล่างฟอร์ม:

```tsx
<a href="/create" style={{ ... }}>
  <LayoutGrid size={14} /> สร้างหน้ารวมลิงก์
</a>
```

ใช้ icon `LayoutGrid` จาก lucide-react (มี library นี้อยู่แล้ว)

- [ ] `app/page.tsx`

---

## Step 9: อัปเดต `contexts/LanguageContext.tsx`

เพิ่ม keys ใน `Translations` interface และทั้ง 3 ภาษา (EN/TH/JA):

```typescript
// Page creation
createPageNav: string        // "Create Page" (nav link)
createPageHeading: string    // "Create your link page"
createPageSub: string        // "Collect all your links in one place"
pageTitle: string            // "Page Title"
pageTitlePlaceholder: string // "e.g. My Links"
pageBio: string              // "Bio"
pageBioPlaceholder: string   // "Short description (optional)"
chooseEmoji: string          // "Choose an icon"
addLink: string              // "Add Link"
linkTitle: string            // "Link title"
linkUrl: string              // "URL"
removeLink: string           // "Remove"
chooseTheme: string          // "Theme"
themeWarm: string            // "Warm"
themeDark: string            // "Dark"
themeGradient: string        // "Gradient"
createPageBtn: string        // "Create My Page"
creatingPage: string         // "Creating..."
pageReady: string            // "Your page is ready!"
viewPage: string             // "View Page"
// Validation errors
errorPageTitle: string       // "Please enter a page title"
errorNoLinks: string         // "Please add at least one link"
errorTooManyLinks: string    // "Maximum 20 links allowed"
// Landing page display
poweredBy: string            // "Powered by Bexo"
```

- [ ] `contexts/LanguageContext.tsx`

---

## Step 10: อัปเดต `CLAUDE.md`

เพิ่ม SQL ของ tables ใหม่, route ใหม่ (`/create`, `/api/page`), และอธิบาย logic การแยก URL vs Page ใน `[code]/page.tsx`

- [ ] `CLAUDE.md`

---

## Step 11: Commit & Push

- [ ] Commit ทีละ step พร้อม message ที่ชัดเจน
- [ ] Push branch `claude/add-claude-md-config-2JjDp`

---

## Critical Files

| File | Action |
|------|--------|
| `types/database.types.ts` | เพิ่ม 2 tables ใหม่ |
| `types/index.ts` | เพิ่ม Page interfaces |
| `app/api/page/route.ts` | **CREATE** — Page creation endpoint |
| `app/api/page/[code]/click/route.ts` | **CREATE** — Link click tracking |
| `app/[code]/page.tsx` | เพิ่ม pages table fallback check |
| `app/[code]/components/LandingPage.tsx` | **CREATE** — Landing page UI |
| `app/create/page.tsx` | **CREATE** — Page creation UI |
| `app/page.tsx` | เพิ่ม CTA "สร้างหน้ารวมลิงก์" |
| `contexts/LanguageContext.tsx` | เพิ่ม ~20 translation keys (EN/TH/JA) |
| `CLAUDE.md` | อัปเดต architecture docs |

---

## Verification Checklist

- [ ] สร้าง page ที่ `/create` ได้สำเร็จ พร้อมชื่อ + bio + 3 ลิงก์
- [ ] เข้า `/{page_code}` แสดง landing page (ไม่ redirect)
- [ ] คลิกลิงก์บน landing page → เปิด URL ใน tab ใหม่ + click_count เพิ่ม
- [ ] view_count เพิ่มทุกครั้งที่เข้าหน้า landing page
- [ ] URL ปกติยังคง redirect เหมือนเดิม (ไม่กระทบ)
- [ ] Theme warm/dark/gradient แสดงผลถูกต้อง
- [ ] Cookie บันทึก page_history หลังสร้าง
- [ ] Validation: title ว่าง → แสดง error, ไม่มีลิงก์ → แสดง error, URL ไม่ valid → แสดง error
- [ ] `npm run lint` ผ่าน
- [ ] `npm run build` ผ่าน
