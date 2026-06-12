# EduVault — Update Instructions

## Files Modified (replace these in your project)

```
styles/globals.css
pages/_app.js
pages/index.js
pages/dashboard.js
pages/auth/login.js
pages/auth/signup.js
pages/auth/admin-login.js
pages/courses/index.js
pages/courses/[id].js
pages/admin/index.js
pages/admin/users.js
pages/admin/courses/index.js
pages/admin/courses/add.js
pages/admin/courses/edit/[id].js
lib/db.js
```

## Files You Can DELETE (payment-related)

```
pages/admin/payments.js          ← delete
pages/payment/                   ← delete entire folder if exists
pages/purchase/                  ← delete entire folder if exists
components/student/PurchaseModal.js  ← delete if exists
components/shared/PaymentCard.js     ← delete if exists
```

---

## What Changed

### 1. Payment System — FULLY REMOVED
- Removed all Buy Course buttons, pricing sections, QR code flows, screenshot uploads
- Removed `submitPayment`, `getPayments`, `approvePayment`, `rejectPayment` from `lib/db.js`
- Replaced with `enrollUserInCourse()` — instant free enrollment
- Admin dashboard no longer shows revenue, pending payments, or payment cards

### 2. All Courses Are Free
- Every logged-in student gets instant access to all courses
- "Start Learning" / "Open Course" replaces "Buy Course"
- No approval needed — enroll and watch immediately

### 3. Mobile Responsiveness — FULLY FIXED
- Navbar: hamburger drawer on mobile, no overlapping elements
- All pages use `clamp()` for fluid font sizes
- Grids use `auto-fill` with `minmax(min(100%, Npx), 1fr)` — safe on all screens
- Admin sidebar: collapses off-screen on mobile, toggled with ☰ button
- Tables wrapped in `.table-wrapper` with `overflow-x: auto`
- Auth cards shrink padding on small screens
- Course cards work on 320px wide screens

### 4. Video Player — FIXED
- Replaced fixed-height player with `padding-top: 56.25%` aspect-ratio trick
- This ensures 16:9 ratio on ALL screen sizes including portrait mobile
- Google Drive links auto-converted to `/preview` embed URL
- Folder links open in Drive instead of crashing the player
- Fullscreen works via native iframe `allowFullScreen`

### 5. Thumbnail System — IMPROVED
- Course add/edit now supports both **Image URL** and **File Upload**
- Fallback placeholder shown if thumbnail URL is broken or missing
- `onError` handler prevents broken image icons
- Thumbnails use `object-fit: cover` with correct aspect ratio

### 6. Admin Panel — INTACT + IMPROVED
- All admin features preserved: users, courses, add/edit/delete, lectures
- Mobile sidebar with overlay added to all admin pages
- Removed payment/revenue columns from analytics

---

## After Replacing Files — Run These Commands

```bash
# No new dependencies needed
# Just redeploy to Vercel or run locally:

npm run dev       # local dev
# OR
vercel --prod     # deploy to Vercel
```

---

## Firestore — No Changes Required

Existing collections stay the same:
- `users` — unchanged
- `courses` — `isFree: true` now always set on new courses
- `enrollments` — same structure, just created instantly without payment
- `payments` — old data untouched, just no new records created

---

## Notes

- `lib/firebase.js` and `lib/AuthContext.js` are **not changed** — leave them as is
- `next.config.js` and `package.json` are **not changed**
- Firebase Authentication setup is **not changed**
- If you had a `pages/admin/payments.js`, you can safely delete it
