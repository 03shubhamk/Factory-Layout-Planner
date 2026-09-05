# Production Deployment Guide

## 1. Docker Deployment
```bash
docker compose up -d --build
```

## 2. Reverse Proxy (Nginx) Example
```nginx
server {
    listen 80;
    server_name factory.example.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```
