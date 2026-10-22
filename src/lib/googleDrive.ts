/**
 * Google Drive Photo Storage Integration
 * 
 * Uploads guest photos and photobooth strips directly to a specified Google Drive folder
 * via a free, lightweight Google Apps Script Web App.
 */

const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';
const GOOGLE_DRIVE_FOLDER_URL = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL || '';

export function isGoogleDriveConfigured(): boolean {
  return typeof GOOGLE_SCRIPT_URL === 'string' && GOOGLE_SCRIPT_URL.trim().length > 0;
}

export function getGoogleDriveFolderUrl(): string {
  return GOOGLE_DRIVE_FOLDER_URL;
}

export interface GoogleDriveUploadParams {
  photoBase64: string;
  guestName: string;
  message?: string;
  filename?: string;
}

export interface GoogleDriveUploadResult {
  success: boolean;
  fileUrl?: string;
  error?: string;
}

/**
 * Uploads a photo to Google Drive via the Google Apps Script Web App endpoint.
 */
export async function uploadPhotoToGoogleDrive({
  photoBase64,
  guestName,
  message = '',
  filename,
}: GoogleDriveUploadParams): Promise<GoogleDriveUploadResult> {
  if (!isGoogleDriveConfigured()) {
    // Graceful no-op if Google Drive webhook is not yet configured
    return { success: true };
  }

  try {
    const cleanName = (guestName || 'Tetamu').replace(/[^a-zA-Z0-9_\-\s]/g, '').trim() || 'Tetamu';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultFilename = `AtifIsma_${cleanName}_${timestamp}.jpg`;

    const payload = {
      image: photoBase64,
      filename: filename || defaultFilename,
      guestName: guestName.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Note: Use text/plain to avoid CORS preflight OPTIONS failure on Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn('Google Drive script responded with non-200 status:', response.status);
    }

    try {
      const data = await response.json();
      if (data && data.status === 'success') {
        return {
          success: true,
          fileUrl: data.fileUrl,
        };
      }
    } catch {
      // If response is opaque or CORS redirects, assume success if network request completed
      return { success: true };
    }

    return { success: true };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown upload error';
    console.error('Failed to upload to Google Drive:', errorMsg);
    // Don't fail the entire guest submission if Google Drive upload encounters an error
    return { success: false, error: errorMsg };
  }
}
