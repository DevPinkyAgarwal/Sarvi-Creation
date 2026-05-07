# Deployment Guide: Sarvi Creation (Hostinger VPS)

This guide provides a professional, step-by-step walkthrough for deploying the Sarvi Creation platform on a Hostinger VPS running Ubuntu 22.04 or 24.04.

---

## Prerequisites

1. **Hostinger VPS**: Ubuntu 22.04+ recommended.
2. **Domain Name**: Pointed to your VPS IP address (via A record).
3. **SSH Access**: Ensure you can login to your VPS via SSH (`ssh root@your_ip`).

---

## Phase 1: Server Preparation

Login to your VPS and run the following commands:

### 1. Update System Packages
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js (Version 20+)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v # Verify version
```

### 3. Install Essential Tools
```bash
sudo apt install -y git build-essential nginx
```

### 4. Install MongoDB (Official Repository)
Ubuntu's default repositories often lack MongoDB. Follow these steps to install the official MongoDB 7.0 Community Edition:

```bash
# Install dependencies
sudo apt-get install -y gnupg curl

# Add MongoDB GPG Key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Add MongoDB Repository (Jammy 22.04)
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start and Enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 5. Configure Firewall (UFW)
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## Phase 2: Application Setup

### 1. Clone the Repository
```bash
cd ~
git clone https://github.com/DevPinkyAgarwal/Sarvi-Creation.git SarviCreation
cd ~/SarviCreation
```

### 2. Fix Permissions for Nginx
Since the code is in the home directory, we must allow Nginx to access it:
```bash
sudo chmod +x ~
sudo chmod -R 755 ~/SarviCreation
```

### 2. Backend Configuration
```bash
cd backend
npm install
cp .env.example .env
nano .env # Paste production credentials (see below)
npm run build
```

**Backend .env Template:**
```env
PORT=5151
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/sarvi-creation
JWT_SECRET=your_random_string
FRONTEND_URL=https://sarvicreation.com
ADMIN_URL=https://sarvicreation.com
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
```

### 3. Frontend Configuration
```bash
cd ../frontend
npm install
cp .env.example .env
nano .env # Update API URL (see below)
npm run build
```

**Frontend .env Template:**
```env
VITE_API_URL=https://sarvicreation.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_xxx
```

---

## Phase 3: Process Management (PM2)

PM2 keeps your backend running in the background and restarts it if it crashes.

### 1. Install PM2
```bash
sudo npm install -g pm2
```

### 2. Start Backend
```bash
cd ~/SarviCreation/backend
pm2 start ecosystem.config.js --env production
```

### 3. Persistence
```bash
pm2 save
pm2 startup # Follow the instructions printed in the terminal
```

---

## Phase 4: Nginx Reverse Proxy

Nginx will serve your frontend and route API requests to the backend.

### 1. Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/sarvi
```

**Paste the following configuration (replace `yourdomain.com`):**

```nginx
server {
    listen 80;
    server_name sarvicreation.com www.sarvicreation.com api.sarvicreation.com;

    # Frontend (Update path to match your home directory)
    location / {
        root /root/SarviCreation/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5151;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:5151;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

### 2. Enable Configuration
```bash
sudo ln -s /etc/nginx/sites-available/sarvi /etc/nginx/sites-enabled/
sudo nginx -t # Test config
sudo systemctl restart nginx
```

---

## Phase 5: SSL (Let's Encrypt)

Secure your site with HTTPS.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d sarvicreation.com -d www.sarvicreation.com -d api.sarvicreation.com
```

Follow the prompts to enable redirection to HTTPS.

---

## Troubleshooting & Logs

- **Backend Logs**: `pm2 logs sarvi-backend`
- **Nginx Error Logs**: `sudo tail -f /var/log/nginx/error.log`
- **Health Check**: Visit `https://sarvicreation.com/api/health`

---

## Summary Checklist
- [ ] Domain A records updated.
- [ ] `.env` files configured correctly.
- [ ] `npm run build` executed for both.
- [ ] PM2 status is `online`.
- [ ] Nginx status is `active`.
- [ ] HTTPS is active.
