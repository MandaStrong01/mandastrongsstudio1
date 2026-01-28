# Auth Security Configuration Guide

## Database Indexing - FIXED ✓

All database indexing issues have been resolved:
- Added indexes for all unindexed foreign keys
- Removed unused indexes to improve write performance
- Query performance significantly improved

## Auth Configuration Required

The following security settings must be configured in your Supabase dashboard. These cannot be automated via migrations.

### 1. Enable Leaked Password Protection

**What it does:** Prevents users from using passwords that have been compromised in data breaches by checking against the HaveIBeenPwned database.

**How to enable:**

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings**
3. Scroll to **Security and Protection**
4. Enable **Check for leaked passwords**
5. Save changes

**Security Impact:** Prevents account takeovers from credential stuffing attacks.

---

### 2. Update Auth DB Connection Strategy

**What it does:** Changes from fixed connection count to percentage-based allocation, allowing your Auth server to scale automatically with your database instance.

**How to configure:**

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **Database**
3. Find **Connection Pooling** section
4. Look for **Auth Server Connections**
5. Change from fixed number (10) to percentage-based allocation
6. Recommended: Set to **10-15%** of total database connections
7. Save changes

**Performance Impact:** Auth server will automatically scale with database capacity upgrades.

---

## Current Security Status

✅ **Fixed:**
- Foreign key indexes added for optimal query performance
- Unused indexes removed for better write performance
- Database structure optimized

⚠️ **Requires Manual Configuration:**
- Leaked password protection (dashboard setting)
- Connection pooling strategy (dashboard setting)

---

## Why Manual Configuration?

These settings are infrastructure-level configurations managed by Supabase's control plane, not database-level settings. They control how the Auth service operates and how it connects to your database, which is why they must be configured through the dashboard rather than SQL migrations.

---

## Additional Security Best Practices

1. **Enable MFA (Multi-Factor Authentication)** for admin accounts
2. **Set up Rate Limiting** in Auth settings to prevent brute force attacks
3. **Configure Password Requirements** (minimum length, complexity)
4. **Enable Email Verification** if not already enabled
5. **Review and Audit RLS Policies** regularly
6. **Monitor Auth Logs** for suspicious activity

---

## Need Help?

If you encounter any issues with these configurations, refer to the [Supabase Auth Documentation](https://supabase.com/docs/guides/auth) or contact Supabase support.
