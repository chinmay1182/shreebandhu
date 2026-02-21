# Why Uploaded Images Return 404 (Root Cause & Permanent Fix)

## Root Cause

Your app uses **Next.js standalone mode** (`output: "standalone"`) with **Docker**. In this setup:

1. **Next.js standalone** expects static files in the `public` folder and serves them automatically
2. **Docker volumes** mount `./public/banners`, `./public/products`, etc. from the host
3. **Nginx** (in front of your app) proxies all requests to Next.js

The 404 happens because **Next.js treats `/banners/xyz.jpg` as a page route** (no matching page → 404) instead of falling through to static file serving. This is a known behavior with the App Router and standalone mode.

## You Don't Need to Add Handlers "Every Time"

The route handlers we added use **dynamic segments** (`[filename]`):

- `/banners/[filename]` → serves **any** file in `public/banners/`
- `/uploads/[filename]` → serves **any** file in `public/uploads/`
- `/products/[filename]` → serves **any** file in `public/products/`
- `/reviews/[filename]` → serves **any** file in `public/reviews/`

**Any new file** you upload to these folders will work automatically. You only need a new route handler if you add a **new upload directory** (e.g. `public/promos/`).

---

## Permanent Fix Options

### Option A: Nginx Serves Static Files (Recommended)

Have Nginx serve images directly instead of proxying to Next.js. This is faster and more reliable.

Add to your Nginx config (before the proxy to Next.js):

```nginx
# Serve uploaded static files directly
location ~ ^/(banners|products|uploads|reviews)/ {
    alias /path/to/shreebandhu.com/public$uri;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

Replace `/path/to/shreebandhu.com` with your actual project path on the server.

### Option B: Keep the Route Handlers (Current Solution)

The route handlers in `app/banners/`, `app/uploads/`, `app/products/`, `app/reviews/` are a one-time setup. They will serve all current and future files in those directories. No further changes needed unless you add a new upload folder.

### Option C: Remove Standalone Mode

Switch to `output: "export"` or remove the `output` option and use the default Next.js server. This may affect your Docker/deployment setup.

---

## Summary

| Question | Answer |
|----------|--------|
| Why does it happen? | Next.js standalone + App Router treats image paths as page routes |
| Do I add handlers for each new image? | **No** – `[filename]` handles all files in that folder |
| Do I add handlers for new folders? | **Yes** – only when you create a new upload directory |
| Best long-term fix? | Configure Nginx to serve static files (Option A) |
