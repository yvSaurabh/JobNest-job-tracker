# JobNest - Personal Job Application Tracker

JobNest is a full-stack MERN web application that helps job seekers track job applications, interviews, offers, rejections, and follow-ups from one centralized dashboard.

## Features

- **User Authentication**: Secure registration and login with JWT
- **Job Tracking**: Add, edit, view, and delete job applications
- **Status Management**: Track applications through multiple stages (applied, shortlisted, interview, offer, rejected)
- **Dashboard Analytics**: Real-time statistics and visual charts of your application pipeline
- **Responsive Design**: Mobile-friendly Bootstrap interface with professional UI

## Tech Stack

- **Frontend**: React.js, React Router, Bootstrap, Axios, Chart.js
- **Backend**: Node.js, Express.js, MongoDB, JWT Authentication
- **Database**: MongoDB Atlas
- **Deployment**: Ready for Render/Vercel

## Project Status

✅ Core Features Implemented
✅ Frontend & Backend Complete
✅ Authentication & Authorization  
✅ Dashboard with Analytics
✅ Job Management (CRUD)
✅ Error Handling & Validation
✅ Password Strength Validation
✅ Error Boundaries

## Security Improvements

- ✅ Input validation on both frontend and backend
- ✅ Password strength requirements (8+ chars, uppercase, lowercase, numbers)
- ✅ Email format validation
- ✅ JWT token-based authentication
- ✅ Error messages without exposing sensitive data
- ✅ CORS configuration for production

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
# or
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install
```

Start frontend:
```bash
npm run dev
```

Access the app at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Jobs
- `GET /api/jobs` - Get all user jobs (protected)
- `POST /api/jobs` - Create new job (protected)
- `GET /api/jobs/:id` - Get specific job (protected)
- `PUT /api/jobs/:id` - Update job (protected)
- `DELETE /api/jobs/:id` - Delete job (protected)
- `GET /api/jobs/stats/summary` - Get job statistics (protected)

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Backend (Render)
1. Create Render account
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Create Vercel account
2. Import repository
3. Set build settings (Vite)
4. Deploy

## Future Enhancements

- Email notifications for deadlines
- Interview scheduling
- Salary tracking and comparison
- Resume management
- Notes and attachments
- Export to CSV/PDF
- Dark mode
- Mobile app

## License

MIT

## Support

For issues and questions, please create an issue in the repository.