# Security Layer Implementation Plan

> อัปเดตสถานะในไฟล์นี้ทุกครั้งที่ task เสร็จ
> สร้างเมื่อ: 2026-04-16

## ภาพรวมฟีเจอร์

1. **URL Malware Scan** — สแกนด้วย URLhaus API (ไม่ต้องใช้ API Key) ตอนสร้างลิงก์
2. **Password-Protected Links** — ตั้งรหัสผ่านก่อนเข้าถึงลิงก์ (SHA-256 hash เก็บใน DB)
3. **Safe Mode** — ผู้สร้างเปิดได้ per-link หรือผู้คลิกเพิ่ม `?preview=1` เพื่อดูปลายทางก่อน redirect

---

## Step 1: Database Migration (ทำใน Supabase Dashboard)

```sql
ALTER TABLE urls ADD COLUMN password_hash TEXT;
ALTER TABLE urls ADD COLUMN safe_mode BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE urls ADD COLUMN scan_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE urls ADD COLUMN scanned_at TIMESTAMPTZ;
```

- [ ] รัน SQL ใน Supabase

---

## Step 2: อัปเดต TypeScript Types

**`types/database.types.ts`** — เพิ่ม 4 columns ใหม่ใน Row, Insert, Update

**`types/index.ts`** — อัปเดต `UrlRecord` + `ShortenResponse`

- [ ] `types/database.types.ts`
- [ ] `types/index.ts`

---

## Step 3: สร้าง `lib/scan.ts`

- URLhaus endpoint: `POST https://urlhaus-api.abuse.ch/v1/url/`
- `is_listed` → `'malicious'` | `no_results` → `'safe'` | error/timeout → `'unknown'` (fail open)
- Timeout: 4 วินาที

- [ ] สร้างไฟล์ `lib/scan.ts`

---

## Step 4: อัปเดต `app/api/shorten/route.ts`

เพิ่ม request body fields: `password?: string`, `safe_mode?: boolean`

Logic ใหม่ (ระหว่าง duplicate check กับ insert):
1. Hash password ด้วย `crypto.createHash('sha256')` ถ้ามี
2. เรียก `scanUrl()` — ถ้า `malicious` return 400
3. Insert ข้อมูลใหม่พร้อม `password_hash`, `safe_mode`, `scan_status`, `scanned_at`
4. Return `safe_mode` และ `scan_status` ใน response

- [ ] `app/api/shorten/route.ts`

---

## Step 5: สร้าง `app/api/verify/route.ts`

POST `{ code, password }` → verify SHA-256 hash → increment click_count → return `{ success: true, url }`

- [ ] สร้างไฟล์ `app/api/verify/route.ts`

---

## Step 6: สร้าง UI Components

### `app/[code]/components/DangerPage.tsx`
- แสดงคำเตือนสีแดง ไม่มีปุ่ม "ไปต่อ"

### `app/[code]/components/PreviewPage.tsx`
- แสดง URL ปลายทาง + scan status badge
- ปุ่ม "ไปยังปลายทาง" เป็น `<a href={url}>`

### `app/[code]/components/PasswordGate.tsx`
- ช่อง input รหัสผ่าน
- POST `/api/verify` → ถ้า success → `window.location.href = url`

- [ ] `app/[code]/components/DangerPage.tsx`
- [ ] `app/[code]/components/PreviewPage.tsx`
- [ ] `app/[code]/components/PasswordGate.tsx`

---

## Step 7: อัปเดต `app/[code]/page.tsx`

Routing logic (ตามลำดับ):
```
if scan_status === 'malicious'  → render <DangerPage />
if password_hash !== null       → render <PasswordGate code={code} />
if safe_mode || ?preview=1      → render <PreviewPage url={...} />
else                            → increment click_count + redirect()
```

รับ `searchParams` เพิ่มเติมสำหรับ `?preview=1`

- [ ] `app/[code]/page.tsx`

---

## Step 8: อัปเดต `components/UrlShortenerForm.tsx`

เพิ่ม "Advanced Options" section (collapsed by default):
- Checkbox: Safe Mode
- Input: รหัสผ่าน (optional, type="password")

แสดง scan status badge ใน result card

- [ ] `components/UrlShortenerForm.tsx`

---

## Step 9: อัปเดต `contexts/LanguageContext.tsx`

เพิ่ม translation keys ใหม่ ~15 keys ทั้ง EN/TH/JA:
`safeMode`, `safeModeDesc`, `setPassword`, `passwordPlaceholder`, `advancedOptions`,
`scanSafe`, `scanUnknown`, `errorMalicious`,
`previewTitle`, `previewProceed`, `previewCancel`,
`dangerTitle`, `dangerDesc`, `dangerBack`,
`passwordGateTitle`, `passwordGatePlaceholder`, `passwordGateSubmit`, `passwordGateError`, `passwordGateVerifying`

- [ ] `contexts/LanguageContext.tsx`

---

## Step 10: Commit & Push

- [ ] Commit ทุก step พร้อม message ที่ชัดเจน
- [ ] Push branch `claude/add-claude-md-config-2JjDp`

---

## Verification Checklist

- [ ] Malicious URL ถูก block (ทดสอบด้วย URLhaus test URL)
- [ ] Password gate แสดงเมื่อเข้าลิงก์ที่มีรหัสผ่าน
- [ ] รหัสผ่านผิด → error message แสดง
- [ ] รหัสผ่านถูก → redirect ไปปลายทาง
- [ ] Safe Mode per-link ทำงาน
- [ ] `?preview=1` ทำงานกับทุกลิงก์
- [ ] URLhaus timeout → สร้างลิงก์ได้ (scan_status: 'unknown')
- [ ] `npm run lint` ผ่าน
- [ ] `npm run build` ผ่าน
