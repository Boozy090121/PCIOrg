# Quality Org Hub

A comprehensive quality management system for managing teams, personnel, training, and documentation across multiple value streams.

## Features

- **Dashboard**: Real-time overview of key metrics and team performance
- **Analytics**: Detailed charts and metrics for quality tracking
- **Organization Management**: Team and personnel management tools
- **Skills Matrix**: Track and manage team member skills and certifications
- **Training Plans**: Create and monitor training programs
- **Documentation**: Centralized document management
- **Value Stream Support**: Support for BBV, ADD, and ARB value streams

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Project Structure

```
quality-org-hub/
├── index.html              # Main HTML file
├── styles.css             # Global styles
├── team-styles.css        # Team-specific styles
├── js/
│   ├── modules/
│   │   ├── ui-module.js           # Core UI functionality
│   │   ├── analytics-dashboard.js  # Analytics dashboard
│   │   └── ...                    # Other modules
│   ├── fix.js                     # Compatibility fixes
│   ├── tab-compatibility.js       # Tab system compatibility
│   └── minimal-app.js            # Minimal fallback app
└── package.json           # Project dependencies
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 