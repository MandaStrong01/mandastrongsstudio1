# Admin Setup Guide

## Making Your First Admin User

After registering your account, you need to manually grant yourself admin privileges. Here's how:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run this query (replace `your-email@example.com` with your actual email):

```sql
-- Make a user an admin by email
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin', updated_at = now();
```

### Option 2: Using User ID

If you know your user ID:

```sql
-- Make a user an admin by user ID
INSERT INTO user_roles (user_id, role)
VALUES ('your-user-id-here', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin', updated_at = now();
```

### Granting Subscriptions

To grant yourself or another user a subscription tier:

```sql
-- Grant STUDIO tier subscription (highest tier)
INSERT INTO user_subscriptions (user_id, tier_id, status, expires_at)
SELECT
  (SELECT id FROM auth.users WHERE email = 'your-email@example.com'),
  (SELECT id FROM subscription_tiers WHERE name = 'STUDIO'),
  'active',
  (NOW() + INTERVAL '1 year')
ON CONFLICT DO NOTHING;
```

## Admin Capabilities

Once you're an admin, you'll have:

✅ **Full Access**
- View and edit all user projects
- Access all assets in the system
- Unlimited uploads and exports
- No storage or duration limits

✅ **User Management**
- Grant admin access to other users
- Grant subscriptions to users
- View all user data and activity

✅ **Admin Dashboard**
- Click "Admin Panel" button in the header
- View platform statistics
- Manage users and content
- View admin activity logs

## Subscription Tiers

The system has three subscription tiers:

1. **BASIC** ($10/month)
   - 30 minutes max duration
   - 10GB storage
   - Access to all 720 AI tools

2. **PRO** ($20/month)
   - 60 minutes max duration
   - 50GB storage
   - Priority rendering

3. **STUDIO** ($30/month)
   - 150 minutes max duration
   - 200GB storage
   - 4K export capability

**Note:** Admins automatically bypass all limits regardless of subscription tier.

## Verifying Admin Access

After running the SQL command:

1. Sign out of your account
2. Sign back in
3. You should see a yellow "Admin Panel" button in the header
4. Click it to access the admin dashboard

## Security Notes

- Admin access is permanent until manually revoked
- All admin actions are logged in the `admin_logs` table
- Only grant admin access to trusted users
- Regularly review admin activity logs

## Troubleshooting

**Admin button not showing?**
- Clear your browser cache
- Sign out and sign back in
- Verify the SQL command executed successfully
- Check the `user_roles` table to confirm your role is set to 'admin'

**Can't access admin features?**
- Ensure RLS policies are properly configured
- Check browser console for errors
- Verify you're signed in with the admin account
