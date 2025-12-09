# Google Drive Integration Setup Guide

This guide will help you set up Google Drive integration for your MandaStrong application.

## Prerequisites

You need a Google Cloud Platform (GCP) account. If you don't have one, create it at [console.cloud.google.com](https://console.cloud.google.com)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "MandaStrong")
5. Click "Create"

## Step 2: Enable Required APIs

1. In your Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable these APIs:
   - **Google Drive API**
   - **Google Picker API**

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields (App name, User support email, Developer email)
   - Add the scope: `https://www.googleapis.com/auth/drive.readonly`
   - Add your email as a test user
   - Click "Save and Continue"

4. Back in Credentials, click "Create Credentials" > "OAuth client ID"
5. Choose "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production domain (e.g., `https://yourdomain.com`)
7. Click "Create"
8. Copy the **Client ID** - you'll need this for your `.env` file

## Step 4: Create an API Key

1. In "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. (Recommended) Click "Restrict Key" and:
   - Under "API restrictions", select "Restrict key"
   - Check "Google Drive API" and "Picker API"
   - Under "Website restrictions", add your domains
   - Click "Save"

## Step 5: Update Your .env File

Open your `.env` file and replace the placeholder values:

```
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your-actual-api-key
```

## Step 6: Test the Integration

1. Start your development server
2. Navigate to Page 11 (Editor Dashboard)
3. In the "Upload Source" dropdown, select "Google Drive"
4. Click "Connect Google Drive"
5. You'll be prompted to sign in with Google and authorize the app
6. Select files from your Google Drive
7. Files will be downloaded and uploaded to your Supabase storage

## Troubleshooting

### "Google Drive is loading" message
Wait a few seconds for the Google APIs to fully load, then try again.

### OAuth consent screen issues
Make sure you've added yourself as a test user in the OAuth consent screen configuration.

### "Access blocked" error
Check that your authorized JavaScript origins match your current domain exactly.

### CORS errors
Ensure your Google API Key is properly restricted and configured for your domain.

## Security Notes

- Never commit your actual API keys to version control
- Keep your `.env` file in `.gitignore`
- For production, use environment-specific credentials
- Consider implementing additional security measures for sensitive applications

## Features

The Google Drive integration allows users to:
- Browse their Google Drive files
- Select multiple files at once
- Import images, videos, and other media files
- Automatically upload selected files to your Supabase storage
- Access their imported files in the Media Box

## Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Verify all API credentials are correct
3. Ensure all required APIs are enabled in Google Cloud Console
4. Check that your OAuth consent screen is properly configured
