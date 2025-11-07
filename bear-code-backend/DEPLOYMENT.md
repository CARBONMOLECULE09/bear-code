# Bear Code Backend Deployment Guide

## Prerequisites

- Node.js 20+
- MongoDB instance
- Pinecone account
- Domain name (for production)
- SSL certificate (for production)

## Environment Setup

### Development

1. Copy environment file:
```bash
cp .env.example .env
```

2. Configure environment variables:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=bearcode
JWT_SECRET=your-secret-key
PINECONE_API_KEY=your-pinecone-key
```

3. Install dependencies:
```bash
npm install
```

4. Run development server:
```bash
npm run dev
```

### Production

## Docker Deployment

### Build Docker Image

```bash
docker build -t bear-code-backend .
```

### Run with Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017
      - MONGODB_DATABASE=bearcode
      - JWT_SECRET=${JWT_SECRET}
      - PINECONE_API_KEY=${PINECONE_API_KEY}
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
```

Run:
```bash
docker-compose up -d
```

## Cloud Deployment

### AWS (EC2 + MongoDB Atlas)

1. **Setup MongoDB Atlas**:
   - Create cluster at mongodb.com
   - Get connection string
   - Whitelist your EC2 IP

2. **Launch EC2 Instance**:
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Open ports: 22, 80, 443, 3000

3. **Install Node.js**:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Deploy Application**:
```bash
git clone <your-repo>
cd bear-code-backend
npm install
npm run build
```

5. **Setup PM2**:
```bash
sudo npm install -g pm2
pm2 start dist/index.js --name bear-code-api
pm2 startup
pm2 save
```

6. **Setup Nginx**:
```bash
sudo apt install nginx
```

Create `/etc/nginx/sites-available/bear-code`:
```nginx
server {
    listen 80;
    server_name api.bearcode.com;

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

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/bear-code /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Setup SSL with Let's Encrypt**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.bearcode.com
```

### Vercel (Serverless)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. Deploy:
```bash
npm run build
vercel --prod
```

### Railway

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login and deploy:
```bash
railway login
railway init
railway up
```

3. Add environment variables in Railway dashboard

### Render

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: bear-code-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: PINECONE_API_KEY
        sync: false
```

2. Connect GitHub repo to Render
3. Deploy automatically on push

## Monitoring

### Health Checks

```bash
curl http://localhost:3000/api/v1/health
```

### PM2 Monitoring

```bash
pm2 monit
pm2 logs bear-code-api
```

### Application Logs

Logs are stored in `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

## Backup

### MongoDB Backup

```bash
mongodump --uri="mongodb://localhost:27017/bearcode" --out=/backup/$(date +%Y%m%d)
```

### Automated Backups

Add to crontab:
```bash
0 2 * * * /usr/bin/mongodump --uri="mongodb://localhost:27017/bearcode" --out=/backup/$(date +\%Y\%m\%d)
```

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall (UFW/Security Groups)
- [ ] Set up MongoDB authentication
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Keep dependencies updated
- [ ] Set up monitoring/alerts
- [ ] Regular backups
- [ ] Use environment variables for secrets

## Scaling

### Horizontal Scaling

1. Use load balancer (AWS ALB, Nginx)
2. Deploy multiple instances
3. Use Redis for session storage
4. Implement caching layer

### Database Scaling

1. MongoDB replica sets
2. Read replicas
3. Sharding for large datasets

### Pinecone Scaling

1. Use namespaces for multi-tenancy
2. Implement connection pooling
3. Cache frequent queries

## Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs bear-code-api

# Check environment variables
pm2 env 0

# Restart application
pm2 restart bear-code-api
```

### MongoDB connection issues

```bash
# Test connection
mongosh "mongodb://localhost:27017/bearcode"

# Check MongoDB status
sudo systemctl status mongod
```

### High memory usage

```bash
# Check memory
free -h

# Restart application
pm2 restart bear-code-api
```

## Performance Optimization

1. Enable compression
2. Implement caching (Redis)
3. Use CDN for static assets
4. Optimize database queries
5. Implement connection pooling
6. Use clustering for multi-core CPUs

## Support

For issues and questions:
- GitHub Issues: [your-repo]/issues
- Email: support@bearcode.com
- Discord: [your-discord]
