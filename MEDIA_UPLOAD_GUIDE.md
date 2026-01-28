# Media Upload Guide

Your app now supports comprehensive media uploads from multiple sources and accepts all file types.

## Upload Methods

### 1. Local File Upload
Upload files directly from your computer:
- **Drag & Drop**: Drag files directly into the upload area
- **Click to Browse**: Click the upload area to select files
- **Multiple Files**: Select and upload multiple files at once

### 2. URL Import
Import media from any public URL:
- Enter the direct URL to a media file
- Supports videos, images, audio, documents, and more
- Downloads and stores the file in your library

### 3. Google Drive & Photos
Import from your Google account:
- Access Google Drive files
- Import from Google Photos
- Supports multiple file selection
- Automatically downloads and uploads to your library

## Supported File Types

### Videos
- MP4, MOV, AVI, MKV, WebM, FLV, WMV, M4V, MPG, MPEG

### Images
- JPG, JPEG, PNG, GIF, WebP, SVG, BMP, ICO, TIFF

### Audio
- MP3, WAV, OGG, FLAC, AAC, M4A, WMA, Opus

### Documents
- PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF, CSV

### Other
All other file types are supported and categorized as "other"

## Components

### MediaUploader
Full-featured upload component with:
- Drag & drop support
- URL import
- Google Drive integration
- Real-time upload progress
- Error handling

### AssetLibrary
Browse and manage uploaded files:
- Search by filename
- Filter by type (all, video, image, audio, document, other)
- Preview thumbnails for images
- Download files
- Delete files

### BatchUpload
Process files with AI tools:
- Upload any file type
- Apply AI processing to uploaded content
- Track processing status

## Usage

### In Your Components
```tsx
import MediaUploader from './components/MediaUploader';

<MediaUploader
  onUploadComplete={(results) => {
    console.log('Uploaded files:', results);
  }}
/>
```

### Storage Integration
All uploads are stored in Supabase Storage (`media-assets` bucket) and tracked in the `assets` database table with:
- File metadata (name, size, type)
- Asset type categorization
- User and team access control
- Public URLs for accessing files

## Security

- Row Level Security (RLS) enabled on assets table
- Users can only access their own files or team-shared files
- Storage bucket is configured for authenticated access
- File size limit: 50GB per file
