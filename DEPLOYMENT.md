# Deployment Checklist

## Pre-Deployment

- [ ] Update environment variables for production
- [ ] Set strong JWT_SECRET and ADMIN_INVITE_TOKEN
- [ ] Configure production database (MongoDB Atlas recommended)
- [ ] Update CLIENT_URL to production domain
- [ ] Test application locally with production build

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure CORS origins
- [ ] Use environment variables for sensitive data
- [ ] Enable MongoDB authentication
- [ ] Set up proper file upload limits
- [ ] Configure rate limiting (recommended)

## Performance Checklist

- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Set up monitoring and logging

## Database Setup

### MongoDB Atlas (Recommended)

1. Create MongoDB Atlas account
2. Create a new cluster
3. Create database user
4. Whitelist your server IP
5. Get connection string
6. Update MONGO_URI in environment variables

### Local MongoDB

```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongod
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Nginx)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring

### Health Check Endpoint

The application includes a health check at `/test-jwt` for monitoring.

### Logging

Set up application logging:

```bash
# Install PM2 for process management
npm install -g pm2

# Start application with PM2
pm2 start server/server.js --name "task-manager"

# Monitor logs
pm2 logs task-manager

# Auto-restart on failure
pm2 startup
pm2 save
```

## Backup Strategy

### Database Backup

```bash
# MongoDB backup
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/taskmanager" --out=backup/

# Restore
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/taskmanager" backup/taskmanager/
```

### File Uploads Backup

```bash
# Backup uploads directory
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# Restore
tar -xzf uploads-backup-YYYYMMDD.tar.gz
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check CLIENT_URL environment variable
2. **Database Connection**: Verify MONGO_URI and network access
3. **File Uploads**: Check uploads directory permissions
4. **Build Errors**: Ensure all dependencies are installed

### Debug Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs

# Restart application
pm2 restart task-manager

# Check environment variables
pm2 env 0
```
