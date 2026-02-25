# Student Wellness Application

A professional React-based wellness check-in application for students to track their mental and physical wellbeing.

## Features

- 🔐 **User Authentication** - Sign up and sign in functionality
- 📊 **Wellness Assessment** - 6-question evaluation covering mood, stress, sleep, motivation, social connections, and workload
- 📈 **Visual Analytics** - Color-coded results dashboard with progress bars
- 💡 **Personalized Insights** - AI-driven recommendations based on responses
- 💾 **Data Persistence** - Local storage to save user accounts and assessment history
- 🎨 **Professional UI** - Modern design with Tailwind CSS and smooth animations

## Tech Stack

- React 18
- Tailwind CSS
- Lucide React (icons)
- Local Storage API

## Installation & Setup

### Prerequisites

Make sure you have Node.js installed (version 14 or higher)
- Download from: https://nodejs.org/

### Step 1: Extract the Project

Unzip the project folder to your desired location.

### Step 2: Install Dependencies

Open your terminal/command prompt and navigate to the project folder:

```bash
cd student-wellness-project
```

Install all dependencies:

```bash
npm install
```

This will install:
- React and React DOM
- Tailwind CSS
- Lucide React icons
- All necessary build tools

### Step 3: Install Tailwind CSS

Install Tailwind and its dependencies:

```bash
npm install -D tailwindcss postcss autoprefixer
```

### Step 4: Start the Development Server

Run the application:

```bash
npm start
```

### Access Modes

The app now supports two local access modes:

- **General Access**: select school + class and view class-level daily/weekly charts.
- **Personal Access**: select school + class and log personal emotions/tasks.

Personal entries are also accumulated into class aggregates, so they appear in General Access class charts.

The app will automatically open in your browser at `http://localhost:3000`

If it doesn't open automatically, manually navigate to `http://localhost:3000`

## How to Use

1. **Sign Up**: Create a new account with your name, email, and password
2. **Sign In**: Log in with your credentials
3. **Take Assessment**: Answer 6 questions about your wellbeing
4. **View Results**: See your wellness score, visual analytics, and personalized insights
5. **Track Progress**: Take multiple assessments to track changes over time

## Project Structure

```
student-wellness-project/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Main application component
│   ├── index.js            # React entry point
│   └── index.css           # Global styles with Tailwind
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs tests
- `npm run eject` - Ejects from Create React App (one-way operation)

## Build for Production

To create an optimized production build:

```bash
npm run build
```

This creates a `build` folder with production-ready files that can be deployed to any static hosting service.

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can:
- Stop the other application using port 3000
- Or the app will prompt you to run on a different port (press 'Y')

### Dependencies Installation Issues

If you encounter issues installing dependencies:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Tailwind Styles Not Showing

Make sure you've installed Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
```

## Data Storage

User data is stored in the browser's localStorage. This means:
- Data persists across sessions
- Data is specific to each browser
- Clearing browser data will delete stored information
- Data is not synced across devices

## Future Enhancements

- Backend API integration
- Real database storage
- Multi-device sync
- Historical trend charts
- Export assessment reports
- Mood tracking calendar
- Push notifications for daily check-ins

## Support

For issues or questions, please create an issue in the project repository.

## License

This project is open source and available for educational purposes.
