# 🐻 Bear Code Frontend - Quick Start

Get your Bear Code frontend running in **2 minutes**!

---

## ⚡ Quick Start

### 1. Install Dependencies (30 seconds)
```bash
cd bear-code-frontend
npm install
```

### 2. Start the App (10 seconds)
```bash
npm start
```

The app will open at `http://localhost:3001`

---

## 🎯 First Steps

### 1. Register an Account
- Click "Sign up" on the login page
- Enter your details
- Get 100 free credits!

### 2. Explore the Dashboard
- View your statistics
- Check your credit balance
- See quick actions

### 3. Try Code Search
- Go to "Search Code"
- Click "Index Code" tab
- Paste some code and index it
- Switch to "Search Code" tab
- Search using natural language!

---

## 🔧 Configuration

The app is pre-configured to connect to:
- Backend API: `http://localhost:3000/api/v1`

To change this, edit `.env`:
```env
REACT_APP_API_URL=http://your-backend-url/api/v1
```

---

## 📱 Features Available

### ✅ Authentication
- Login / Register
- Auto token refresh
- Persistent sessions

### ✅ Dashboard
- Statistics overview
- Quick actions
- Getting started guide

### ✅ Code Search
- Semantic search
- Code indexing
- Multiple languages
- Copy to clipboard

### ✅ Credits
- View balance
- Purchase credits
- Transaction history

### ✅ Profile
- Edit profile
- Change password
- Account overview

---

## 🚀 Usage Examples

### Search for Code
1. Go to "Search Code"
2. Type: "function that sorts an array"
3. Click "Search"
4. View results with relevance scores

### Index Code
1. Go to "Search Code" → "Index Code" tab
2. Paste your code
3. Select language
4. Click "Index Code"
5. Code is now searchable!

### Buy Credits
1. Go to "Credits"
2. Select amount (50, 100, 250, 500)
3. Click "Purchase"
4. Credits added instantly!

---

## 🐛 Troubleshooting

### Backend Connection Error
**Problem**: "Network Error" or "Failed to fetch"

**Solution**:
1. Make sure backend is running on port 3000
2. Check `.env` file has correct API URL
3. Verify CORS is enabled in backend

### Login Issues
**Problem**: Can't login after registration

**Solution**:
1. Check backend logs for errors
2. Verify MongoDB is connected
3. Try clearing browser localStorage

### Port Already in Use
**Problem**: Port 3001 is already in use

**Solution**:
```bash
# Use different port
PORT=3002 npm start
```

---

## 📊 Credit Costs

- **Index Code**: 1 credit
- **Search Code**: 2 credits
- **Code Generation**: 5 credits (future)

---

## 🎨 Screenshots

### Login Page
- Clean, modern design
- Email/password fields
- Link to registration

### Dashboard
- Statistics cards
- Quick actions
- Getting started guide

### Search Page
- Tab interface
- Search and index
- Results with scores

### Credits Page
- Balance display
- Purchase interface
- Transaction history

### Profile Page
- Edit profile
- Change password
- Account stats

---

## 🔐 Security

- JWT tokens stored securely
- Auto token refresh
- Protected routes
- HTTPS ready

---

## 📦 Tech Stack

- React 18 + TypeScript
- React Router v6
- Tailwind CSS
- Axios
- React Hot Toast

---

## 🎯 Next Steps

1. ✅ Frontend is running
2. 📱 Register an account
3. 🔍 Try searching code
4. 💳 Manage your credits
5. 👤 Update your profile

---

## 📞 Need Help?

- Check `README.md` for full documentation
- Check `FRONTEND_SUMMARY.md` for complete overview
- Verify backend is running
- Check browser console for errors

---

## ✅ Checklist

- [ ] Dependencies installed
- [ ] Backend running on port 3000
- [ ] Frontend running on port 3001
- [ ] Account registered
- [ ] Code indexed
- [ ] Search working
- [ ] Credits visible

---

**You're all set! Start building with Bear Code!** 🐻

```bash
# Start backend (in another terminal)
cd bear-code-backend
npm run dev

# Start frontend
cd bear-code-frontend
npm start
```

**Happy coding!** 🚀
