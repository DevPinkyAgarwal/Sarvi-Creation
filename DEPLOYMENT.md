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
cd /var/www
sudo git clone <your-repo-url> sarvi
sudo chown -R $USER:$USER /var/www/sarvi
cd /var/www/sarvi
```

### 2. Backend Configuration
```bash
cd backend
npm install
cp .env.example .env
nano .env # Edit with your production credentials
npm run build
```

### 3. Frontend Configuration
```bash
cd ../frontend
npm install
cp .env.example .env
nano .env # Set VITE_API_URL to https://api.yourdomain.com/api
npm run build
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
cd /var/www/sarvi/backend
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
    server_name yourdomain.com www.yourdomain.com api.yourdomain.com;

    # Frontend
    location / {
        root /var/www/sarvi/frontend/dist;
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
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

Follow the prompts to enable redirection to HTTPS.

---

## Troubleshooting & Logs

- **Backend Logs**: `pm2 logs sarvi-backend`
- **Nginx Error Logs**: `sudo tail -f /var/var/log/nginx/error.log`
- **Health Check**: Visit `https://api.yourdomain.com/api/health`

---

## Summary Checklist
- [ ] Domain A records updated.
- [ ] `.env` files configured correctly.
- [ ] `npm run build` executed for both.
- [ ] PM2 status is `online`.
- [ ] Nginx status is `active`.
- [ ] HTTPS is active.
