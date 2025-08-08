# CloudVault Pro Backend

## CORS Configuration for Production

To fix CORS issues between the frontend and backend deployments, especially for the login endpoint, follow these steps:

### 1. Environment Variables

Make sure to set the following environment variables in your Render dashboard for the backend service:

```
ENVIRONMENT=production
FRONTEND_URL=https://cloudvault-b3bf.onrender.com
PORT=8080
SERVE_STATIC=false
STATIC_DIR=/path/to/static/files  # Only needed if SERVE_STATIC=true
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 2. Redeployment

After pushing the updated code to your repository:

1. Go to your Render dashboard
2. Select your backend service
3. Navigate to the "Environment" tab
4. Add/update the environment variables as listed above
5. Click "Manual Deploy" > "Deploy latest commit"

### 3. Verification

To verify that CORS is properly configured:

1. Open your browser's developer tools (F12)
2. Go to the Network tab
3. Access your frontend application
4. Look for API requests to the backend
5. Check that they complete successfully without CORS errors

### 4. Troubleshooting

If you still encounter CORS issues:

- Verify that the `FRONTEND_URL` exactly matches your frontend's URL (including https://)
- Check the backend logs in Render for any CORS-related messages
- Ensure your frontend is making requests to the correct backend URL
- Clear your browser cache and try again
- Try using incognito/private browsing mode
- Check that the preflight OPTIONS requests are being handled correctly

### 5. Static File Serving Configuration

The backend can be configured to serve static files (like the frontend build) or operate in API-only mode:

- **API-Only Mode** (recommended for production): Set `SERVE_STATIC=false` in your environment variables. The backend will only serve API endpoints.

- **Static File Serving Mode**: Set `SERVE_STATIC=true` and optionally set `STATIC_DIR` to the path of your static files. If `STATIC_DIR` is not set, it will default to `../../../ClientSide/dist`.

For production deployments, it's recommended to use API-only mode and deploy the frontend separately.

### 6. Recent CORS Fixes

The following improvements have been made to fix CORS issues:

1. **Custom CORS Middleware**: A dedicated middleware that properly handles all CORS headers and preflight requests

2. **Special Login Endpoint Handling**: The login endpoint now has special CORS handling with additional logging

3. **OPTIONS Method Support**: All API routes now explicitly support the OPTIONS method for preflight requests

4. **Improved Logging**: Added detailed logging for CORS-related operations to help with debugging

## Local Development

For local development, the backend allows requests from:
- http://localhost:3000
- http://localhost:5173
- http://localhost:5174
- http://127.0.0.1:3000
- http://127.0.0.1:5173
- http://127.0.0.1:5174

To run locally:

1. Create a `.env` file with the required environment variables
2. Run `go run cmd/main/main.go`