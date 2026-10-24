# 📋 Working Instructions: Customer Onboarding & Setup Guide
### Digital Guestbook & Live Wall System

This document is your complete Standard Operating Procedure (SOP) to quickly customize and deploy this digital guestbook application for each new customer (weddings, engagements, corporate events, etc.).

---

## ⚡ Quick 3-Step Summary

For each new customer, you only need to:
1. **Edit ONE File**: [`src/config/eventConfig.ts`](file:///src/config/eventConfig.ts) with the customer's event details.
2. **Replace 2 Images**: In [`public/assets/img/`](file:///public/assets/img/) (Couple Avatar & Venue Background).
3. **Create Google Drive Folder**: Get the Folder ID & paste it into Google Apps Script.

---

## 🛠️ Step 1: Edit Event Information (`src/config/eventConfig.ts`)

Open [`src/config/eventConfig.ts`](file:///src/config/eventConfig.ts). All event data across the entire website (Cover, Guestbook, Photobooth Studio, Live Wall, and Admin) updates automatically from this single configuration:

```typescript
export const EVENT_CONFIG = {
  // 1. Couple or Event Main Names
  title: 'Atif & Isma', // Change to e.g. 'Aiman & Dahlia' or 'Sarah & Daniel'

  // 2. Event Type / Subtitle (Shown above the main names)
  eventType: {
    en: 'Engagement Celebration', // e.g. 'Wedding Celebration', 'Reception Banquet'
    ms: 'Majlis Pertunangan',      // e.g. 'Majlis Perkahwinan', 'Majlis Kesyukuran'
  },

  // 3. Event Date
  date: {
    en: '26 December 2026',        // English format (e.g. '12 September 2026')
    ms: '26 Disember 2026',        // Malay format (e.g. '12 September 2026')
    numeric: '26.12.2026',         // Used on photobooth strip stamps & badges
  },

  // 4. Venue & Location
  venue: 'OneTwoKL',               // Change to e.g. 'Dewan Seri Melati, Putrajaya'

  // 5. Social Media Hashtag
  hashtag: '#AtifFoundIsma',       // e.g. '#AimanDahlia', '#ForeverSarah'

  // 6. Cover Images (Place image files in /public/assets/img/)
  images: {
    // Couple portrait avatar (circular image on cover)
    avatar: '/assets/img/customer-avatar.jpg',
    // Background venue image (full-bleed cinematic cover photo)
    background: '/assets/img/customer-venue.jpg',
  },

  // 7. Google Drive Photo Storage
  googleDrive: {
    scriptUrl: 'https://script.google.com/macros/s/.../exec',
    folderUrl: 'https://drive.google.com/drive/folders/YOUR_FOLDER_ID',
  },

  // 8. Host Admin PIN (For /admin moderation dashboard)
  adminPin: '1234',                // Give this PIN to the couple/emcee
};
```

---

## 🖼️ Step 2: Customer Photos & Backgrounds

Save the customer's two cover images inside the [`public/assets/img/`](file:///public/assets/img/) folder:

| Image Asset | Recommended Specs | Purpose |
| :--- | :--- | :--- |
| **Avatar Photo** (`avatar`) | `800 x 800 px` (1:1 Square/Circle), JPG or PNG | Circular portrait of the couple on the front cover. |
| **Backdrop Image** (`background`) | `1920 x 1080 px` (16:9 Landscape) or `1080 x 1920 px` (Portrait), JPG | Full-bleed cinematic venue/wedding background photo. |

> **Pro Tip**: Use compressed JPG or WebP images under **1MB** each to ensure instantaneous loading on mobile data at the wedding venue.

---

## 📁 Step 3: Google Drive Folder Setup (Per Customer)

Each customer should have their own private Google Drive folder where all their guest photos and photobooth strips will stream in real time.

### Instructions:
1. Open [Google Drive](https://drive.google.com) and create a folder (e.g. *"Aiman & Dahlia Guestbook Photos"*).
2. Open the folder and copy the **Folder ID** from the URL bar:
   `https://drive.google.com/drive/folders/`**`1a2b3c4d5e6f7g8h9i0j...`**
3. Open [Google Apps Script](https://script.google.com):
   - You can reuse the existing project or create a new project.
   - Paste the code from [`google-drive-apps-script.js`](file:///google-drive-apps-script.js).
   - Paste the customer's `FOLDER_ID` on **Line 31**:
     ```javascript
     var FOLDER_ID = "YOUR_NEW_CUSTOMER_FOLDER_ID";
     ```
   - (Optional) If the customer also wants a live spreadsheet log of all wishes, create a Google Sheet and paste its `SPREADSHEET_ID` on **Line 34**.
4. Click **Deploy** ➔ **Manage deployments** ➔ Edit (Pencil icon) ➔ Set version to **New version** ➔ Click **Deploy**.
5. Copy the Web App URL and update `scriptUrl` and `folderUrl` in [`src/config/eventConfig.ts`](file:///src/config/eventConfig.ts).

---

## 🧪 Step 4: Test & Verify Locally

In your terminal, test the customer's website before building:

```bash
# 1. Start local dev server
npm run dev
```

Visit the following pages in your browser:
* **Home Page**: `http://localhost:3000/` ➔ Verify names, date, venue, hashtag, and couple photo.
* **Photobooth Studio**: `http://localhost:3000/photobooth` ➔ Snap test photos and verify strip rendering.
* **Live Wall**: `http://localhost:3000/wall` ➔ Check the projector view and toggle the 2xN mobile grid.
* **Admin Dashboard**: `http://localhost:3000/admin` ➔ Enter PIN (default `1234`), verify entries moderation, and test the **Google Drive** folder link button.

---

## 🚀 Step 5: Build & Deploy to Production

Once verified, compile the production build:

```bash
# Build the optimized static bundle
npm run build

# Commit and push to GitHub (triggers automated deployment)
git add .
git commit -m "chore: setup event for [Customer Name]"
git push origin main
```

---

## 📌 Checklist for Every Customer

- [ ] Updated Couple Names in `src/config/eventConfig.ts`
- [ ] Updated Event Type (Wedding / Engagement / Reception)
- [ ] Updated Event Date (English, Malay, Numeric)
- [ ] Updated Venue Location & Hashtag
- [ ] Added Couple Avatar & Venue Backdrop into `public/assets/img/`
- [ ] Configured Customer Google Drive Folder ID & Script URL
- [ ] Set Host Admin PIN (Shared with the client/emcee)
- [ ] Ran `npm run build` with 0 errors
- [ ] Pushed to Git & verified live site
