# Aura - Health Management Application

A modern, minimalist web application for chronic disease management.

## Features

- **Clean, Modern UI**: Minimalist design with a focus on usability
- **Four Main Actions**:
  - Add New Record
  - Record Doctor's Instructions
  - View Health Profile
  - Generate Visit Summary
- **Privacy-First**: All data stored locally (as indicated in the UI)

## Getting Started

Simply open `index.html` in a web browser to view the application.

### Local Development

You can use any local web server to run the application:

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js (http-server):**
```bash
npx http-server
```

**Using PHP:**
```bash
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## File Structure

```
app/
├── index.html      # Main HTML structure
├── styles.css      # Styling and layout
├── script.js       # JavaScript interactivity
└── README.md       # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Customization

The application uses CSS custom properties (variables) defined in `styles.css` for easy theming:

- `--bg-primary`: Primary background color
- `--bg-secondary`: Secondary background color
- `--accent-blue`: Primary accent color
- `--text-primary`: Primary text color
- `--border-radius`: Border radius for rounded corners

Modify these variables to customize the appearance of the application.

