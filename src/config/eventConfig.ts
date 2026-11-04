/**
 * =========================================================================
 * 👰🤵 CUSTOMER EVENT CONFIGURATION (PANDUAN KONFIGURASI PELANGGAN)
 * =========================================================================
 * 
 * Edit this ONE file for every customer/event!
 * All pages (Cover, Guestbook, Photobooth Studio, Live Wall, and Admin Dashboard)
 * will automatically update with these details.
 * 
 * =========================================================================
 */

export const EVENT_CONFIG = {
  // 1. Couple or Event Main Names (e.g. 'Atif & Isma', 'Aiman & Dahlia')
  title: 'Ismasari & Atif',

  // 2. Event Type / Subtitle (Displayed above the main couple name)
  eventType: {
    en: 'Engagement Celebration', // e.g. 'Wedding Celebration', 'Reception Ceremony'
    ms: 'Majlis Pertunangan',      // e.g. 'Majlis Perkahwinan', 'Majlis Kesyukuran'
  },

  // 3. Event Date
  date: {
    en: '26 December 2026',
    ms: '26 Disember 2026',
    numeric: '26.12.2026',        // Used in photobooth strip taglines & stamps
  },

  // 4. Event Venue / Location
  venue: 'OneTwoKL',

  // 5. Social Media Hashtag
  hashtag: '#AtifoundIsma',

  // 6. Photobooth Studio Strip Customization
  photobooth: {
    // Couple names printed on the photobooth strips (e.g. 'Atif & Isma', 'Fikri & Alya')
    // If left blank or omitted, it automatically uses EVENT_CONFIG.title
    coupleNames: 'Ismasari & Atif',

    // Date printed on photobooth strips (e.g. '26.12.2026' or '26 Dec 2026')
    // If left blank or omitted, it automatically uses EVENT_CONFIG.date.numeric
    date: '26.12.2026',

    // Tagline / Subtitle printed on photobooth strips
    tagline: 'romantic memories',
  },

  // 7. Cover Photos (Save new photos in /public/assets/img/ folder)
  images: {
    // Couple portrait avatar (circular photo on front page cover)
    avatar: '/assets/img/Atif-Isma-Welcome.jpg',
    // Background venue image (full-bleed cinematic cover photo)
    background: '/assets/img/arman-farah-venue.png?v=2',
  },

  // 8. Supabase Cloud Database (For Live Wall & Online Guestbook)
  supabase: {
    // TIP: You can use ONE single Supabase project across ALL your customers!
    url:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      'https://msrdrslqdgqvbdpvfvgi.supabase.co',
    anonKey:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zcmRyc2xxZGdxdmJkcHZmdmdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MTI0NzgsImV4cCI6MjEwNzk4ODQ3OH0.sJvuIyvNUzNjYOASNKFAsnVAB-BbheLXGduGc0GA4qg',
    // Unique ID for this customer so wishes never mix with other events
    eventId: 'atif-isma', // e.g. 'aiman-dahlia', 'sarah-daniel'
  },

  // 9. Google Drive Photo Storage
  googleDrive: {
    // Deployed Web App URL from script.google.com
    scriptUrl:
      process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
      'https://script.google.com/macros/s/AKfycbxmqBSEM_3emvagMiClkb9yN1VNalC7joWLkYymvi8fk14xq1SexXeeIs2JS88zX27-/exec',
    // Direct link to the customer's Google Drive folder (or Folder ID) for the Host Admin button (e.g. 'https://drive.google.com/drive/folders/1a2b3c...')
    folderUrl:
      process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL ||
      'https://drive.google.com/drive/my-drive',
  },

  // 10. Host Admin PIN (Default PIN for /admin moderation page)
  adminPin: '1234',

  // 11. Photo Upload Limit (Total allowed across Gallery, Selfie & Photobooth)
  // Set to 500 or any custom number. Change anytime!
  photoUploadLimit: 5000,
};
