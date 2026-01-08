# Manual Auth Configuration Required

## ✅ Fixed Automatically (via migration)
- ✅ Added indexes for unindexed foreign keys
- ✅ Removed unused indexes

## ⚠️ Requires Manual Configuration in Supabase Dashboard

You need to configure these settings in your Supabase dashboard:

### 1. Auth DB Connection Strategy

**Issue:** Auth server is using a fixed connection pool (10 connections) instead of percentage-based allocation.

**How to Fix:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/jlvjctzacmzhonsozhvx)
2. Navigate to **Settings** → **Database**
3. Scroll to **Connection pooling**
4. Find **Auth connection pool** settings
5. Change from "Fixed" to "Percentage-based"
6. Set to **10-15%** of total connections
7. Click **Save**

**Why:** This allows Auth to scale automatically with your instance size.

---

### 2. Leaked Password Protection

**Issue:** Protection against compromised passwords is currently disabled.

**How to Fix:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/jlvjctzacmzhonsozhvx)
2. Navigate to **Authentication** → **Policies**
3. Find **Password Protection** section
4. Enable **"Prevent use of leaked passwords"**
5. This integrates with HaveIBeenPwned.org to block compromised passwords
6. Click **Save**

**Why:** This prevents users from using passwords that have been exposed in data breaches.

---

## Next Steps

After making these changes:
1. Test authentication flows to ensure everything works
2. Run the security advisor again to verify all issues are resolved
3. Monitor your Auth connection pool usage

All database-level security issues have been automatically fixed!
