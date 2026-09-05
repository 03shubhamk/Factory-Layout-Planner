# Troubleshooting & FAQ

### 1. Port 5000 Already in Use
If port 5000 is occupied, set `PORT=5001` in `server/.env` and update `VITE_API_URL` in `client/.env`.

### 2. MongoDB Connection Failure
Ensure MongoDB is running locally:
```bash
mongod --dbpath <data-directory>
```
Or provide a remote MongoDB Atlas URI in `server/.env`.

### 3. Socket.io Connection Drops
Ensure WebSocket headers are permitted by firewalls and reverse proxies.
