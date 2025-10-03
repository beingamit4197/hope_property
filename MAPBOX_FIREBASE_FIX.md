# Mapbox Firebase Hosting Fix

## 🚨 Problem

Map view not working on Firebase hosted URL due to Mapbox configuration issues.

## 🔧 Solutions

### 1. **Mapbox Token Domain Restrictions** (Most Common)

**Issue**: Mapbox token is restricted to localhost only.

**Solution**:

1. Go to [Mapbox Account Dashboard](https://account.mapbox.com/)
2. Navigate to "Access Tokens"
3. Click on your token: `pk.eyJ1IjoiZmVycm91c2Rlc2lnbmVyIiwiYSI6ImNtOWk0aG1iajBjbzAybXNqcXg4NHBuOHcifQ.lBacD_20jyvmO5ucakJH1g`
4. In "URL restrictions" section, add your Firebase domains:
   - `https://your-project-id.web.app`
   - `https://your-project-id.firebaseapp.com`
   - Or use `*` for all domains (less secure)

### 2. **Environment Variables for Production**

**Issue**: Environment variables not available in Firebase hosting.

**Solution A - Using Vite Environment Variables**:

1. Create `.env.production` file:

```bash
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiZmVycm91c2Rlc2lnbmVyIiwiYSI6ImNtOWk0aG1iajBjbzAybXNqcXg4NHBuOHcifQ.lBacD_20jyvmO5ucakJH1g
```

2. Rebuild and redeploy:

```bash
npm run build
firebase deploy
```

**Solution B - Using Firebase Hosting Environment Variables**:

1. Set environment variable in Firebase:

```bash
firebase functions:config:set mapbox.token="pk.eyJ1IjoiZmVycm91c2Rlc2lnbmVyIiwiYSI6ImNtOWk0aG1iajBjbzAybXNqcXg4NHBuOHcifQ.lBacD_20jyvmO5ucakJH1g"
```

### 3. **CORS Issues**

**Issue**: Cross-Origin Resource Sharing blocked by Mapbox.

**Solution**: Add CORS headers to Firebase hosting configuration.

Update `firebase.json`:

```json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 4. **Debugging Steps**

1. **Check Browser Console**:

   - Open Developer Tools (F12)
   - Look for Mapbox-related errors
   - Check if token is present and valid

2. **Check Network Tab**:

   - Look for failed requests to Mapbox API
   - Check for 401/403 errors (token issues)
   - Check for CORS errors

3. **Test Token Manually**:
   - Visit: `https://api.mapbox.com/styles/v1/mapbox/streets-v12?access_token=YOUR_TOKEN`
   - Should return map style data, not an error

### 5. **Quick Fix Commands**

```bash
# 1. Set environment variable
echo "VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiZmVycm91c2Rlc2lnbmVyIiwiYSI6ImNtOWk0aG1iajBjbzAybXNqcXg4NHBuOHcifQ.lBacD_20jyvmO5ucakJH1g" > .env.production

# 2. Rebuild
npm run build

# 3. Deploy
firebase deploy
```

### 6. **Alternative: Use Public Token with No Restrictions**

If you want to test quickly:

1. Go to Mapbox Account Dashboard
2. Create a new token
3. Set URL restrictions to `*` (allows all domains)
4. Update the token in `src/lib/mapbox.ts`

## 🔍 Verification

After implementing fixes:

1. Check browser console for "Map loaded successfully"
2. Verify map tiles load properly
3. Test marker interactions
4. Check for any remaining errors

## 📞 Support

If issues persist:

1. Check Mapbox account for token usage limits
2. Verify Firebase hosting configuration
3. Test with a fresh Mapbox token
4. Check browser compatibility
