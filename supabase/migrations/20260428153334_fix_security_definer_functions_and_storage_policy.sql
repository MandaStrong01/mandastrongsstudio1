
/*
  # Fix Security Issues

  1. Revoke public/anon EXECUTE on SECURITY DEFINER functions
     - calculate_processing_time()
     - handle_new_user()
     - update_updated_at_column()
     These are internal trigger/utility functions — no role should call them directly via RPC.

  2. Remove broad SELECT policy on storage.objects that allows listing all files in media-assets bucket.
     Public buckets allow direct URL access without needing a listing policy.
*/

-- ─── REVOKE EXECUTE ON SECURITY DEFINER FUNCTIONS ────────────────────────────

REVOKE EXECUTE ON FUNCTION public.calculate_processing_time() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;

-- ─── REMOVE BROAD STORAGE LISTING POLICY ─────────────────────────────────────

DROP POLICY IF EXISTS "Public can view media-assets files" ON storage.objects;
