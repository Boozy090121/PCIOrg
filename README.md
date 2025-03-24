# Quality Re-Org & Capability Management Platform

A comprehensive platform for managing quality organization across three focus factories: BBV (Bottles, Blisters, Vials), ADD (Advanced Drug Delivery), and ARB (Amgen, Regeneron Biologics).

## Overview

This platform enables scenario planning, team structuring, skills tracking, RACI mapping, and shared resource visibility with persistent, centralized data storage using Firebase.

### Core Features

- **Personnel Management**: Central creation and management of all people
- **Client & Focus Factory Library**: Manage clients and their factory assignments
- **Org Chart Viewer**: Visual, filterable org chart view
- **Scenario Planning**: Build and validate future org structures
- **Team Builder**: Create and manage teams across focus factories
- **Skills Matrix**: Define, track, and analyze skills across the organization
- **RACI Matrix**: Define processes and assign responsibilities
- **Shared Resource Management**: Allocate and track shared resources across factories
- **Dashboards & Reports**: Live dashboards and exportable reports
- **Maintenance Portal**: Track organizational changes over time

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- A Firebase account (for cloud database)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-org/quality-org-hub.git
cd quality-org-hub
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Add a web app to your Firebase project
   - Copy the Firebase configuration to `js/core/firebaseConfig.js`
   - Enable Firestore Database and Authentication in the Firebase console

4. Start the development server
```bash
npm run dev
```

## Project Structure

```
├── js/
│   ├── core/                 # Core application code
│   │   ├── app.js           # Main application logic
│   │   ├── config.js        # Application configuration
│   │   ├── data.js          # Data management (localStorage fallback)
│   │   ├── dataService.js   # Data service layer
│   │   ├── firebaseConfig.js # Firebase configuration
│   │   └── firebaseDataService.js # Firebase data service
│   ├── modules/              # Feature modules
│   │   ├── personnel.js     # Personnel management
│   │   ├── teamBuilder.js   # Team building functionality
│   │   ├── skillsmatrix.js  # Skills matrix functionality
│   │   ├── racimatrix.js    # RACI matrix functionality
│   │   ├── clientFactory.js # Client and factory management
│   │   ├── sharedResources.js # Shared resource management
│   │   ├── planning.js      # Scenario planning
│   │   └── orgchart.js      # Org chart visualization
│   └── utils/                # Utility functions
├── src/
│   ├── css/                  # Stylesheets
│   └── assets/               # Static assets
├── index.html                # Main HTML file
├── server.js                 # Express server
├── firebase-init.js          # Firebase server initialization
└── package.json              # Project dependencies
```

## Data Model

### Personnel
```json
{
  "id": "string",
  "name": "string",
  "title": "string",
  "role": "string",
  "valueStream": "string", // 'bbv', 'add', 'arb', or 'shared'
  "department": "string",
  "manager": "string", // ID of manager
  "email": "string",
  "fteStatus": "string"
}
```

### Teams
```json
{
  "id": "string",
  "name": "string",
  "purpose": "string",
  "stream": "string", // 'bbv', 'add', 'arb'
  "function": "string",
  "members": ["string"], // Array of personnel IDs
  "lead": "string" // ID of team lead
}
```

### Clients
```json
{
  "id": "string",
  "name": "string",
  "stream": "string", // 'bbv', 'add', 'arb'
  "facilities": ["string"],
  "rooms": ["string"],
  "lines": ["string"]
}
```

### Skills
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "category": "string",
  "targetRatingByRole": {
    "roleType": "number" // 1-5 rating
  }
}
```

### Processes (RACI)
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "category": "string",
  "stream": "string" // 'bbv', 'add', 'arb' or 'all'
}
```

### RACI Assignments
```json
{
  "id": "string",
  "processId": "string",
  "personnelId": "string",
  "role": "string", // 'R', 'A', 'C', or 'I'
  "stream": "string"
}
```

### Resource Allocations
```json
{
  "id": "string",
  "personnelId": "string",
  "stream": "string",
  "percentage": "number", // 0-100
  "role": "string"
}
```

### Scenarios
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "stream": "string",
  "isActive": "boolean",
  "assignments": [
    {
      "personnelId": "string",
      "role": "string",
      "function": "string"
    }
  ]
}
```

## Deployment

The application is set up for deployment to Vercel:

```bash
npm run deploy
```

## Firebase Setup Instructions

To set up Firebase for this application, follow these detailed steps:

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the prompts
3. Give your project a name (e.g., "quality-org-hub")
4. Choose whether to enable Google Analytics (recommended)
5. Accept the terms and click "Create Project"

### 2. Set Up Firestore Database

1. In the Firebase console, navigate to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode" and click "Next"
4. Select a location for your database that's closest to your users
5. Click "Enable" to create the database

### 3. Configure Security Rules

1. In the Firestore Database section, go to the "Rules" tab
2. For development, you can use these permissive rules (do not use in production without authentication):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. For production, update with proper authentication rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Create a Web App

1. In the Firebase console, click on the gear icon ⚙️ next to "Project Overview" and select "Project settings"
2. Scroll down to "Your apps" and click the web icon (</>) to add a web app
3. Register your app with a nickname (e.g., "quality-org-hub-web")
4. Optionally enable Firebase Hosting if you plan to host with Firebase
5. Click "Register app"

### 5. Get Configuration Details

After registering your app, you'll see the Firebase configuration. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 6. Update Configuration in the Application

1. Copy the Firebase configuration object
2. Open `js/core/firebaseConfig.js` in your editor
3. Replace the placeholder configuration with your actual Firebase configuration
4. Save the file

### 7. Set Up Authentication (Optional but Recommended)

1. In the Firebase console, navigate to "Authentication" in the left sidebar
2. Click "Get started"
3. Enable the "Anonymous" sign-in method for basic functionality
4. For better security, also enable email/password or Google sign-in methods

### 8. Server-Side Firebase Setup (for API endpoints)

If you're using the server-side Firebase functionality:

1. In the Firebase console, go to Project Settings > Service accounts
2. Click "Generate new private key" 
3. Save the JSON file as `serviceAccountKey.json` in the root of your project
4. Ensure this file is in your .gitignore (already configured)
5. For deployment environments, set the environment variables instead of using the JSON file

### 9. Testing the Firebase Connection

1. Start the application with `npm start` or run `start.bat`
2. Once loaded, check the Firebase status indicator in the top right of the sidebar
3. It should show "Firebase Connected" in green
4. If it shows "Using Local Storage" in red, check your configuration and console for errors

### Troubleshooting

If you encounter issues:

1. Check browser console for any Firebase-related errors
2. Verify your API key and project configuration
3. Ensure your Firestore database has been created
4. Check that security rules are properly configured
5. Verify your internet connection
6. Try the "Sync to Cloud" button in any data module to manually initiate a connection

## Development Guidelines

- All data operations should use the dataService which will automatically handle Firebase or localStorage persistence
- Keep UI modules separate from data logic
- Follow the established code style and patterns
- Test thoroughly before deployment

## License

Copyright (c) 2023 Quality Organization - All Rights Reserved 