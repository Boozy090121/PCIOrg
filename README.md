# Quality Re-Org & Capability Management Platform

A comprehensive platform for managing quality organization resources, capabilities, and personnel across different value streams.

## Project Structure

```
quality-org-hub/
├── public/                # Static files served by the web server
│   ├── index.html         # Main application HTML
│   ├── index-fixed.html   # Fixed version of the main application
│   ├── css/               # CSS stylesheets
│   ├── js/                # JavaScript files
│   │   ├── main.js        # Main application script
│   │   ├── core/          # Core modules (config, data, etc.)
│   │   ├── modules/       # Feature modules (UI, RACI, org chart, etc.)
│   │   └── utils/         # Utility functions
│   └── recovery/          # Recovery and diagnostic tools
│       ├── auto-fix.html  # Automatic repair tool
│       ├── basic.html     # Basic mode with minimal dependencies
│       ├── diagnose.html  # Diagnostic tool for troubleshooting
│       └── scripts/       # Recovery scripts
│           ├── diagnose.js        # Diagnostic script
│           ├── fixed-modules.js   # Module fixing script
│           └── fix-case.js        # Case sensitivity fixing script
├── server.js              # Express server for serving the application
├── firebase-init.js       # Firebase initialization and routes
├── package.json           # Node.js dependencies and scripts
├── tools/                 # Launcher and utility scripts
│   ├── startup.bat        # Main application launcher
│   ├── basic-mode.bat     # Recovery mode launcher
│   └── start-fixed.bat    # Fixed version launcher
├── start.bat              # Simple starter script
└── vercel.json            # Vercel deployment configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

There are several ways to run the application:

1. **Normal Start**:
   ```
   npm start
   ```
   or
   ```
   node server.js
   ```

2. **Development Mode** (with hot reload):
   ```
   npm run dev
   ```

3. **Recovery Mode** (if you encounter issues):
   ```
   npm run recovery
   ```
   or
   ```
   start.bat
   ```
   and select recovery mode

### Recovery Tools

If you encounter issues with the application, several recovery tools are available:

1. **Diagnostic Tool**: Analyzes module loading issues and provides recommendations
2. **Auto-Fix Tool**: Automatically repairs common module issues
3. **Basic Mode**: Runs the application with minimal dependencies
4. **Fixed Version**: Pre-fixed version of the application

Access these tools via:
- `npm run recovery`
- `tools/basic-mode.bat`
- `http://localhost:3000/recovery/diagnose.html`

## Features

- **Personnel Management**: Track personnel across value streams
- **Team Builder**: Create and manage teams
- **Skills Matrix**: Track capabilities and skills
- **RACI Matrix**: Define responsibilities for processes and activities
- **Organization Chart**: Visualize organizational structure
- **Scenario Planning**: Plan for different organizational scenarios
- **Shared Resources**: Manage shared resources across value streams

## Value Streams

The platform supports multiple value streams:
- BBV - Bottles, Blisters, Vials
- ADD - Advanced Drug Delivery
- ARB - Amgen, Regeneron Biologics

## Deployment

To deploy to Vercel:
```
npm run deploy
```

## Troubleshooting

If you encounter issues:

1. Try running in recovery mode: `npm run recovery`
2. Use the diagnostic tool to identify problems
3. Apply recommended fixes or use the auto-fix tool
4. If issues persist, try the basic mode which has minimal dependencies

## License

This project is licensed under the terms of the license included in the repository. 