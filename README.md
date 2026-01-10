# MandaStrong Video Editor Studio

A professional AI-powered video editing studio for creating full-length movies with advanced tools and features.

## Features

- **Professional Video Editor**: Full-featured timeline editor with multi-track support
- **AI Tools Integration**: Access to AI-powered content generation tools
- **Asset Management**: Organize and manage your media library with 50GB cloud storage
- **Project Dashboard**: Create, edit, and manage multiple movie projects
- **Cloud Rendering**: Fast cloud-based video rendering up to 4K quality
- **Team Collaboration**: Share projects and assets with team members
- **Universal Media Import**: Support for uploads, Google Drive, and AI-generated content

## Getting Started

1. **Start the development server**:
   ```bash
   npm install
   npm run dev
   ```

2. **Sign In/Register**: Click "Get Started" on the landing page and create an account

3. **Start Creating**: Access the Studio to create projects, edit videos, and export your work

## Project Structure

- `src/components/` - UI components (Studio, VideoEditor, Timeline, etc.)
- `src/lib/` - Utility functions and integrations (Supabase, storage, video processing)
- `src/contexts/` - React contexts for authentication and state management
- `supabase/migrations/` - Database schema and migrations

## Authentication

The app uses Supabase authentication with email/password. All user data and projects are securely stored in Supabase with Row Level Security enabled.

## Documentation

- `START_HERE.md` - Quick setup for Google Drive integration
- `USER_GUIDE.md` - Complete user guide for all features
- `QUICK_START_GUIDE.md` - Step-by-step getting started guide

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (Database + Auth + Storage)
- Lucide React (Icons)
