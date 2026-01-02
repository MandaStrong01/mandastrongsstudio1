# Auth Configuration Required

## Security and Performance Improvements Needed

The following configurations must be set in your Supabase Dashboard to resolve security warnings:

### 1. Enable Leaked Password Protection

**What it does:** Prevents users from using compromised passwords by checking against HaveIBeenPwned.org database.

**How to enable:**
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers** → **Email**
3. Scroll to **Password Protection**
4. Enable **"Check for breached passwords"**
5. Click **Save**

**Benefits:**
- Blocks passwords that have been exposed in data breaches
- Significantly improves account security
- No performance impact on your application

---

### 2. Switch Auth Connection Strategy to Percentage-Based

**What it does:** Allows Auth server connections to scale automatically with your database instance size.

**How to enable:**
1. Go to your Supabase Dashboard
2. Navigate to **Project Settings** → **Database**
3. Find **Connection Pooling** section
4. Under **Auth Server Connection Pool**, change from **Fixed** to **Percentage**
5. Set to **10%** (recommended starting point)
6. Click **Save**

**Benefits:**
- Auth server performance scales with database upgrades
- Better resource utilization
- Prevents connection bottlenecks as your app grows

---

## Database Optimization Completed

✅ **Removed 13 unused indexes** that were consuming storage and slowing down writes:
- `idx_ai_tool_results_user_id`
- `idx_assets_team_id`
- `idx_media_assets_project_id`
- `idx_media_assets_user_id`
- `idx_movie_projects_team_id`
- `idx_page_content_project_id`
- `idx_render_jobs_user_id`
- `idx_render_scenes_render_job_id`
- `idx_team_members_user_id`
- `idx_chat_messages_team_id`
- `idx_projects_user_id`
- `idx_render_jobs_team_id`
- `idx_teams_created_by`

These indexes were not being used by the query planner and were redundant with the automatic foreign key indexes.

---

## Impact Summary

- **Write Performance:** Improved (fewer indexes to maintain)
- **Storage Usage:** Reduced
- **Security:** Will be enhanced once Auth settings are updated
- **Scalability:** Will be improved once connection pooling is configured
