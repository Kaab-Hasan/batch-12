# Troubleshooting Guide for ShoeStyle E-commerce Site

## Recent Issues Fixed

1. **Dashboard 404 Errors**
   - Added missing dashboard controller and routes
   - Server now properly responds to `/api/dashboard/stats` requests

2. **Related Product Filter Errors**
   - Created a new utility function `safeFilter` in `frontend/src/utils/productUtils.js`
   - This function safely handles cases where relatedData is not an array
   - To use in your ProductDetailsPage: `import { safeFilter } from '../utils/productUtils'`

3. **Image Upload Errors**
   - Increased request payload limits to 50MB
   - Added proper CORS configuration

4. **Server Configuration**
   - Fixed port configuration to consistently use port 5000
   - Added debug endpoint at `/api/debug` to verify server health

## Steps to Fully Resolve

1. **For the "relatedData.filter is not a function" error**:
   - Find all files using relatedData.filter (ProductDetailsPage, etc.)
   - Replace instances of `relatedData.filter(...)` with `safeFilter(relatedData, ...)`

2. **For order processing issues**:
   - Verify order data structure in frontend matches backend expectations
   - Check browser console for detailed error messages on form submit
   - Test with a minimal order to see specific error responses

3. **For connection issues**:
   - Clear browser cache completely
   - Verify both backend (port 5000) and frontend servers are running
   - Test the debug endpoint: http://localhost:5000/api/debug

4. **Check MongoDB connection**:
   - Verify database connection string in .env file
   - Check console logs for any database connection errors

## Quick Commands

```bash
# Start backend server
cd backend && node src/server.js

# Start frontend
cd frontend && npm run dev

# Check server status
curl http://localhost:5000/api/debug
``` 