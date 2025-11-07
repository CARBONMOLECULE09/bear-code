# 🐻 Bear Code Frontend

Modern React frontend for Bear Code - An AI-powered code assistant.

## Features

- ✅ User Authentication (Login/Register)
- ✅ Dashboard with Statistics
- ✅ Semantic Code Search
- ✅ Code Indexing
- ✅ Credit Management
- ✅ User Profile Management
- ✅ Transaction History
- ✅ Responsive Design
- ✅ Toast Notifications
- ✅ Protected Routes

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js 16+
- Bear Code Backend running on `http://localhost:3000`

### Installation

```bash
cd bear-code-frontend
npm install
```

### Configuration

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:3000/api/v1
```

### Development

```bash
npm start
```

Runs on `http://localhost:3001`

### Build

```bash
npm run build
```

### Production

```bash
npm install -g serve
serve -s build -p 3001
```

## Project Structure

```
bear-code-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── SearchPage.tsx
│   │   ├── CreditsPage.tsx
│   │   └── ProfilePage.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── config/
│   │   └── api.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── .env
├── package.json
└── tailwind.config.js
```

## Features Overview

### Authentication
- JWT-based authentication
- Automatic token refresh
- Protected routes
- Persistent login

### Dashboard
- User statistics
- Quick actions
- Credit balance
- Getting started guide

### Code Search
- Semantic search with natural language
- Code indexing
- Multiple language support
- Copy to clipboard
- Search results with relevance scores

### Credits
- Purchase credits
- Transaction history
- Credit balance tracking
- Usage breakdown

### Profile
- Update profile information
- Change password
- Account overview
- Member since date

## API Integration

The frontend connects to the Bear Code Backend API:

- Base URL: `http://localhost:3000/api/v1`
- Authentication: Bearer token
- Auto token refresh on 401

## Styling

Uses Tailwind CSS with custom Bear Code theme:

- Primary color: Bear brown (#bfa094)
- Custom components: buttons, inputs, cards
- Responsive design
- Dark mode code blocks

## Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from CRA

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT

---

**Built with ❤️ for the Bear Code community**
