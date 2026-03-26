# Eventure - Event Management Web Application

A modern, responsive web application for discovering and registering for campus events. Eventure helps students explore events across multiple categories including academic seminars, cultural festivals, sports competitions, technical workshops, and fun activities.

## Features

- **Event Discovery**: Browse events across five main categories:
  - Academic Events
  - Technical Events
  - Cultural Events
  - Sports Events
  - Fun Activities

- **User Authentication**: Secure login and registration system using Firebase Authentication
- **Event Registration**: Register for events with user-friendly forms
- **Registered Events Dashboard**: View all events you've registered for
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Modern UI**: Built with Bootstrap 5 for sleek, professional styling
- **Real-time Database**: Firebase Firestore for storing event and user data

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Bootstrap 5.3.0, Custom CSS
- **Icons**: Font Awesome 6.0.0+, Bootstrap Icons
- **Backend**: Firebase (Authentication & Firestore Database)
- **Database**: Cloud Firestore

## Project Structure

```
Event/
├── index.html                    # Home page with carousel and event categories
├── login.html                    # User login page
├── registration.html             # User registration page
├── event.html                    # Main events listing page
├── eventdetails.html             # Detailed event information page
├── eventregistration.html        # Event registration form
├── registered_events.html        # Dashboard of registered events
├── registerevent.html            # Registered event viewing page
├── academic.html                 # Academic events category
├── cultural.html                 # Cultural events category
├── sports.html                   # Sports events category
├── technical.html                # Technical events category
├── fun.html                      # Fun events category
├── contact.html                  # Contact page
├── eventsolution.html            # Event solutions/information page
├── navbar.html                   # Navigation bar component
├── registration_navbar.html      # Navigation for logged-in users
├── footer.html                   # Footer component
├── script.js                     # Main application logic (Firebase integration, auth, CRUD)
├── registered_events.js          # Logic for managing registered events
├── scroll.js                     # Scroll animations and effects
├── style.css                     # Main stylesheet
├── firebase.js                   # Firebase configuration and initialization
└── Images/
    └── techinal_feautured_events.avif  # Featured event images
```

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Firebase services)
- Text editor or IDE (VS Code recommended)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/vijayodedra3400/Event_Management_web-app.git
   cd Event
   ```

2. **Open the Application**
   - Open `index.html` in your web browser, or
   - Use a live server extension in VS Code:
     - Install "Live Server" extension
     - Right-click on `index.html` and select "Open with Live Server"

### Configuration

The Firebase configuration is already set up in [firebase.js](firebase.js). The app uses a pre-configured Firebase project with:
- Authentication enabled
- Firestore database set up
- Storage configured

## Usage

### For Users

1. **Browse Events**
   - Start at the home page to see featured events
   - Navigate to specific categories (Academic, Technical, Cultural, Sports, Fun)
   - View detailed information about each event

2. **Register for Events**
   - Create a new account or log in
   - Click on an event to view details
   - Fill out the event registration form
   - Confirm your registration

3. **View Your Registrations**
   - After logging in, access your dashboard
   - View all events you've registered for
   - Manage your registrations

### For Developers

**Key Functions** (in `script.js`):
- `createUserWithEmailAndPassword()` - User registration
- `signInWithEmailAndPassword()` - User login
- `addDoc()` - Register user for events
- `getDoc()` / `collection()` - Retrieve event and user data
- `signOut()` - User logout

**Firebase Collections**:
- `users` - Store user profile information
- `events` - Store event details
- `registrations` - Store user event registrations

## Features in Detail

### Event Categories
- **Academic**: Seminars, workshops, lectures
- **Technical**: Hackathons, coding competitions, tech talks
- **Cultural**: Music nights, festivals, cultural performances
- **Sports**: Games, tournaments, sports competitions
- **Fun**: Social events, games, entertainment

### Authentication Flow
1. User creates account or logs in
2. Firebase validates credentials
3. User profile is created/retrieved
4. User gains access to event registration

### Event Registration
1. User selects an event
2. Fills in registration details
3. Submission stored in Firestore
4. Confirmation displayed
5. Event appears in user's dashboard

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Firebase Integration

This application uses Firebase for:
- **Authentication**: Email/password-based user authentication
- **Database**: Firestore for storing events, users, and registrations
- **Real-time Updates**: Live data synchronization across sessions

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Contact & Support

- **Project Owner**: vijayodedra3400
- **Repository**: [Event_Management_web-app](https://github.com/vijayodedra3400/Event_Management_web-app)
- **Issues**: Report bugs and feature requests via GitHub Issues

## Future Enhancements

- Event filtering and search functionality
- Email notifications for event updates
- User profile customization
- Event ratings and reviews
- Payment integration for paid events
- Admin dashboard for event management
- Calendar view for events
- Automated email reminders before events

## Acknowledgments

- Bootstrap 5 for responsive design framework
- Firebase for backend infrastructure
- Font Awesome for icons
- The development team and contributors

---

**Happy Event Exploration!** 🎉
