# How to Get omega.downxtown.com Working - Step by Step

## Overview

To make `omega.downxtown.com` work, you need to:
1. Own the domain `downxtown.com`
2. Configure DNS to allow subdomains
3. Deploy your Next.js app to a hosting service
4. Configure the hosting service to handle wildcard subdomains

## Prerequisites

✅ You own the domain: `downxtown.com`
✅ You have access to DNS settings (Cloudflare, GoDaddy, Namecheap, etc.)
✅ You have a hosting service (Vercel, Netlify, or your own server)

## Step-by-Step Setup

### Step 1: Configure DNS (Wildcard Subdomain)

You need to add a **wildcard DNS record** that points ALL subdomains to your server.

#### Option A: Using Cloudflare (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your domain: `downxtown.com`
3. Go to **DNS** → **Records**
4. Click **Add record**
5. Configure:
   ```
   Type: A
   Name: *
   IPv4 address: Your server IP (or Vercel/Netlify IP)
   Proxy status: Proxied (orange cloud)
   TTL: Auto
   ```
6. Click **Save**

**Result**: `*.downxtown.com` now points to your server
- `omega.downxtown.com` → Your server
- `techstore.downxtown.com` → Your server
- `anything.downxtown.com` → Your server

#### Option B: Using GoDaddy

1. Go to [GoDaddy DNS Management](https://dcc.godaddy.com/)
2. Find your domain: `downxtown.com`
3. Click **DNS** → **Manage Zones**
4. Click **Add** → **A Record**
5. Configure:
   ```
   Host: *
   Points to: Your server IP
   TTL: 1 Hour
   ```
6. Click **Save**

#### Option C: Using Namecheap

1. Go to [Namecheap Dashboard](https://ap.www.namecheap.com/)
2. Find your domain: `downxtown.com`
3. Click **Manage** → **Advanced DNS**
4. Click **Add New Record**
5. Configure:
   ```
   Type: A Record
   Host: *
   Value: Your server IP
   TTL: Automatic
   ```
6. Click **Save**

### Step 2: Deploy to Hosting Service

#### Option A: Deploy to Vercel (Easiest)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add subdomain support"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New** → **Project**
   - Import your GitHub repository
   - Click **Deploy**

3. **Add Custom Domain**
   - Go to your project → **Settings** → **Domains**
   - Add domain: `downxtown.com`
   - Add wildcard domain: `*.downxtown.com`
   - Vercel will show you DNS records to add

4. **Configure DNS to point to Vercel**
   - Vercel will give you an IP or CNAME
   - Update your DNS wildcard record to point to Vercel's IP

**Vercel DNS Configuration:**
```
Type: A
Name: *
Value: 76.76.21.21 (Vercel's IP - check their docs for current IP)
```

Or using CNAME:
```
Type: CNAME
Name: *
Value: cname.vercel-dns.com
```

#### Option B: Deploy to Netlify

1. **Push your code to GitHub**

2. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click **Add new site** → **Import an existing project**
   - Connect your GitHub repository
   - Click **Deploy**

3. **Add Custom Domain**
   - Go to **Site settings** → **Domain management**
   - Click **Add custom domain**
   - Add: `downxtown.com`
   - Add: `*.downxtown.com`

4. **Configure DNS**
   - Netlify will provide DNS records
   - Update your DNS wildcard record

**Netlify DNS Configuration:**
```
Type: A
Name: *
Value: 75.2.60.5 (Netlify's IP - check their docs)
```

#### Option C: Deploy to Your Own Server

If you have your own server (VPS, AWS, etc.):

1. **Deploy Next.js app**
   ```bash
   # On your server
   npm run build
   npm start
   ```

2. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/downxtown.com
   
   server {
       listen 80;
       server_name *.downxtown.com downxtown.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d downxtown.com -d *.downxtown.com
   ```

4. **Point DNS to your server**
   ```
   Type: A
   Name: *
   Value: Your server IP (e.g., 123.45.67.89)
   ```

### Step 3: Verify DNS Propagation

After configuring DNS, wait for propagation (can take 5 minutes to 48 hours).

**Check DNS propagation:**
```bash
# Check if wildcard is working
nslookup omega.downxtown.com
nslookup techstore.downxtown.com
nslookup anything.downxtown.com

# Should all return the same IP address
```

Or use online tools:
- https://www.whatsmydns.net/
- https://dnschecker.org/

### Step 4: Test Your Subdomains

1. **Create a test store** with subdomain "omega"
2. **Visit**: `https://omega.downxtown.com`
3. **Should see**: Omega store page

**If it doesn't work:**
- Check DNS propagation (wait longer)
- Check hosting service configuration
- Check Next.js middleware is deployed
- Check browser console for errors

## Local Development Testing

You can't use real subdomains on localhost, but you can simulate:

### Option 1: Edit Hosts File

**Windows**: `C:\Windows\System32\drivers\etc\hosts`
**Mac/Linux**: `/etc/hosts`

Add:
```
127.0.0.1 omega.localhost
127.0.0.1 techstore.localhost
127.0.0.1 fashion.localhost
```

Then visit: `http://omega.localhost:3000`

### Option 2: Use ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
npm run dev

# In another terminal, start ngrok
ngrok http 3000

# You'll get a URL like: https://abc123.ngrok.io
# You can test with: https://omega-abc123.ngrok.io
```

## Complete Example: Vercel Setup

Here's the complete flow for Vercel (most common):

### 1. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd Webstore/webstore
vercel

# Follow prompts
```

### 2. Add Domains in Vercel Dashboard
- Go to your project
- Settings → Domains
- Add: `downxtown.com`
- Add: `*.downxtown.com`

### 3. Configure DNS (Cloudflare)
```
Type: A
Name: @
Value: 76.76.21.21 (Vercel IP)

Type: A
Name: *
Value: 76.76.21.21 (Vercel IP)
```

### 4. Wait for DNS Propagation
- Usually 5-30 minutes
- Check: https://www.whatsmydns.net/

### 5. Test
- Visit: `https://downxtown.com` (main site)
- Visit: `https://omega.downxtown.com` (store)
- Visit: `https://techstore.downxtown.com` (another store)

## Troubleshooting

### Problem: "This site can't be reached"
**Solution**: DNS not configured or not propagated yet
- Check DNS records are correct
- Wait longer for propagation
- Clear browser DNS cache: `chrome://net-internals/#dns`

### Problem: Shows main site instead of store
**Solution**: Middleware not working
- Check `middleware.ts` is in `src/` folder
- Check middleware is deployed (check Vercel logs)
- Check middleware config matcher is correct

### Problem: SSL certificate error
**Solution**: Wildcard SSL not configured
- Vercel/Netlify handle this automatically
- For own server: Use Let's Encrypt wildcard cert
- Make sure you requested cert for `*.downxtown.com`

### Problem: Works on www but not subdomain
**Solution**: Wildcard DNS not configured
- Make sure you added `*` not `www`
- Check DNS propagation for wildcard

### Problem: Works for one subdomain but not others
**Solution**: Likely working correctly!
- Wildcard means ALL subdomains work
- If one works, all should work
- The subdomain just needs to exist in your database

## DNS Propagation Time

- **Cloudflare**: 5-30 minutes (fastest)
- **GoDaddy**: 1-4 hours
- **Namecheap**: 30 minutes - 2 hours
- **Other providers**: Up to 48 hours

## Cost Considerations

### Free Options:
- ✅ Vercel: Free tier includes custom domains
- ✅ Netlify: Free tier includes custom domains
- ✅ Cloudflare: Free DNS management

### Paid Options:
- Domain registration: $10-15/year
- VPS hosting: $5-20/month
- Cloudflare Pro (optional): $20/month

## Security Considerations

### SSL Certificate
- ✅ Vercel/Netlify: Automatic SSL for wildcard domains
- ✅ Let's Encrypt: Free wildcard SSL
- ✅ Cloudflare: Free SSL proxy

### DNS Security
- ✅ Enable DNSSEC in your DNS provider
- ✅ Use Cloudflare proxy (orange cloud) for DDoS protection
- ✅ Set up CAA records to prevent unauthorized SSL issuance

## Next Steps

After subdomains are working:

1. ✅ Test with multiple stores
2. ✅ Set up analytics per subdomain
3. ✅ Configure SEO for each subdomain
4. ✅ Set up email for subdomains (optional)
5. ✅ Allow stores to add custom domains (advanced)

## Summary

**To get `omega.downxtown.com` working:**

1. **DNS**: Add wildcard A record (`*` → your server IP)
2. **Deploy**: Push to Vercel/Netlify
3. **Configure**: Add `*.downxtown.com` in hosting dashboard
4. **Wait**: DNS propagation (5 mins - 48 hours)
5. **Test**: Visit `omega.downxtown.com`

**That's it!** Once DNS propagates, all subdomains will work automatically.
