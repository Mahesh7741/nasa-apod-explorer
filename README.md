# NASA APOD Explorer - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Architecture](#architecture)
4. [Backend - Spring Boot API](#backend---spring-boot-api)
5. [Frontend - React Application](#frontend---react-application)
6. [Technologies & Dependencies](#technologies--dependencies)
7. [API Endpoints](#api-endpoints)
8. [Setup & Installation](#setup--installation)
9. [Running the Application](#running-the-application)
10. [Features](#features)
11. [Code Organization](#code-organization)

---

## Project Overview

**NASA APOD Explorer** is a full-stack web application that allows users to explore NASA's Astronomy Picture of the Day (APOD) API. The application provides an intuitive interface to view daily astronomical images, search by specific dates, and browse a gallery of recent images.

### Key Information
- **Project Name**: nasa-apod-explorer
- **Backend Framework**: Spring Boot 4.0.1
- **Frontend Framework**: React 19.2.0 with Vite
- **Java Version**: 21
- **Build Tool (Backend)**: Maven
- **Build Tool (Frontend)**: Vite

---

## Project Structure

```
nasa-apod/
├── nasa/                          # Backend Spring Boot Application
│   ├── nasa/                       # Main module folder
│   │   ├── pom.xml               # Maven configuration
│   │   ├── mvnw & mvnw.cmd       # Maven wrapper scripts
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/com/example/nasa/
│   │   │   │   │   ├── NasaApplication.java          # Main Spring Boot application
│   │   │   │   │   ├── controller/
│   │   │   │   │   │   └── ApodController.java       # REST API endpoints
│   │   │   │   │   ├── service/
│   │   │   │   │   │   └── ApodService.java          # Business logic & API calls
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   └── ApodResponse.java         # Data Transfer Object
│   │   │   │   │   └── config/
│   │   │   │   │       └── WebClientConfig.java      # WebClient configuration
│   │   │   │   └── resources/
│   │   │   │       └── application.properties        # Configuration file
│   │   │   └── test/
│   │   │       └── java/com/example/nasa/
│   │   │           └── NasaApplicationTests.java
│   │   └── target/                # Compiled output
│   └── .idea/ & .vscode/         # IDE configuration
│
├── nasa-apod-ui/                  # Frontend React Application
│   ├── package.json              # NPM dependencies & scripts
│   ├── vite.config.js            # Vite configuration
│   ├── eslint.config.js          # ESLint configuration
│   ├── index.html                # HTML entry point
│   ├── src/
│   │   ├── main.jsx              # React app entry
│   │   ├── App.jsx               # Main App component
│   │   ├── App.css               # Styling
│   │   ├── index.css             # Global styles
│   │   ├── assets/               # Static assets
│   │   └── components/
│   │       ├── TodayAPOD.jsx      # Today's APOD display
│   │       ├── DatePicker.jsx     # Date selection component
│   │       ├── RecentGallery.jsx  # Gallery view for recent images
│   │       └── DetailedView.jsx   # Detailed image view
│   └── public/                   # Public static files
│
└── README.md                       # Project readme
```

---

## Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  TodayAPOD   │  │  DatePicker  │  │ RecentGallery│    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              DetailedView Component                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                         App.jsx                            │
└─────────────────────────────────────────────────────────────┘
                          │
                 (HTTP REST Calls)
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│            Spring Boot Backend (Java 21)                    │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         ApodController (/api/apod/*)                 │ │
│  │   - /today      (GET current day's APOD)             │ │
│  │   - /          (GET APOD by date)                    │ │
│  │   - /recent     (GET recent APODs)                   │ │
│  └───────────────────────────────────────────────────────┘ │
│                          │                                  │
│  ┌───────────────────────▼───────────────────────────────┐ │
│  │         ApodService (Business Logic)                 │ │
│  │   - getApod(date)                                    │ │
│  │   - getRecent(count)                                 │ │
│  │   - Caching with Caffeine                            │ │
│  └───────────────────────────────────────────────────────┘ │
│                          │                                  │
│  ┌───────────────────────▼───────────────────────────────┐ │
│  │     WebClient (Spring WebFlux)                       │ │
│  │     Calls NASA API: api.nasa.gov/planetary/apod      │ │
│  └───────────────────────────────────────────────────────┘ │
│                          │                                  │
└─────────────────────────┼────────────────────────────────────┘
                          │
                   (External API Call)
                          │
                          ▼
                   NASA API (api.nasa.gov)
```

---

## Backend - Spring Boot API

### Overview
The backend is a Spring Boot REST API that acts as a proxy to the NASA APOD API, providing caching capabilities and CORS support for the frontend.

### Key Components

#### 1. **NasaApplication.java**
- Main Spring Boot application entry point
- Initializes the application context

```java
@SpringBootApplication
public class NasaApplication {
    public static void main(String[] args) {
        SpringApplication.run(NasaApplication.class, args);
    }
}
```

#### 2. **ApodController.java**
REST controller that defines API endpoints with CORS support for `http://localhost:5173` (Vite dev server).

**Endpoints:**
- `GET /api/apod/today` - Get today's APOD
- `GET /api/apod?date={date}` - Get APOD for specific date (format: YYYY-MM-DD)
- `GET /api/apod/recent?count={count}` - Get N recent APODs (default: 10)

```java
@RestController
@RequestMapping("/api/apod")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ApodController {
    private final ApodService apodService;
    
    @GetMapping("/today")
    public ApodResponse today() { ... }
    
    @GetMapping
    public ApodResponse byDate(@RequestParam String date) { ... }
    
    @GetMapping("/recent")
    public List<ApodResponse> recent(@RequestParam(defaultValue = "10") int count) { ... }
}
```

#### 3. **ApodService.java**
Service class that contains business logic and communicates with NASA API. Features caching to reduce API calls.

**Caching Strategy:**
- Uses Spring Cache abstraction with Caffeine backend
- `@Cacheable` decorator for automatic caching
- Cache keys: `'today'` for current date, or the specific date parameter
- Separate caches for single and recent queries

```java
@Service
@RequiredArgsConstructor
public class ApodService {
    private final WebClient webClient;
    @Value("${nasa.api.key}")
    private String apiKey;

    @Cacheable(value = "apod", key = "#date != null ? #date : 'today'")
    public ApodResponse getApod(String date) { ... }

    @Cacheable(value = "apod-recent", key = "#count")
    public List<ApodResponse> getRecent(int count) { ... }
}
```

#### 4. **ApodResponse.java**
Data Transfer Object (DTO) that maps NASA API response to Java objects.

**Fields:**
- `date` - Date of the APOD (YYYY-MM-DD format)
- `title` - Title of the image
- `explanation` - Description of the image
- `url` - URL of the image
- `media_type` - Type of media (image, video, etc.)
- `copyright` - Copyright information

#### 5. **WebClientConfig.java**
Configuration class that creates a Spring WebClient bean for reactive HTTP requests.

```java
@Configuration
public class WebClientConfig {
    @Bean
    public WebClient webClient() {
        return WebClient.builder().build();
    }
}
```

#### 6. **application.properties**
Configuration file containing application settings and NASA API key.

```properties
spring.application.name=nasa
nasa.api.key=XXXXXXXXX
```

---

## Frontend - React Application

### Overview
A modern React application built with Vite that provides an interactive interface for browsing NASA's APOD images.

### Technology Stack
- **React 19.2.0** - UI framework
- **Vite 7.2.4** - Build tool and dev server
- **React DOM 19.2.0** - DOM rendering

### Key Components

#### 1. **App.jsx** - Main Application Component
Central component that manages application state and routing between different views.

**Features:**
- Tab-based navigation (Today's APOD, Pick a Date, Recent Gallery)
- State management for active tab and selected image
- Header with application title
- Navigation bar with tab buttons

```jsx
function App() {
  const [activeTab, setActiveTab] = useState('today')
  const [selectedImage, setSelectedImage] = useState(null)
  
  // Renders header, navigation, and active tab content
}
```

#### 2. **TodayAPOD.jsx** - Today's Picture Component
Displays the Astronomy Picture of the Day for the current date.

**Features:**
- Auto-fetches current day's APOD on component mount
- Displays image with title and explanation
- Loading and error states

#### 3. **DatePicker.jsx** - Date Selection Component
Allows users to select a specific date and view its APOD.

**Features:**
- Date input field
- Form submission to fetch APOD by date
- Displays selected image with details
- Error handling for invalid dates

#### 4. **RecentGallery.jsx** - Gallery Component
Shows a gallery of recent APOD images.

**Features:**
- Configurable number of images to display
- Grid or list layout
- Click to view detailed information
- Pagination or infinite scroll support

#### 5. **DetailedView.jsx** - Detailed Image Display
Expanded view for a selected image with full information.

**Features:**
- Full-size image display
- Complete metadata (date, title, explanation, copyright)
- Navigation between images
- Close button to return to previous view

### Styling
- **App.css** - Main application styles with responsive design
- **index.css** - Global styles and CSS variables
- Responsive layout for mobile and desktop views
- NASA space-themed design with dark colors and accent highlights

---

## Technologies & Dependencies

### Backend Dependencies (Maven)

| Dependency | Version | Purpose |
|-----------|---------|---------|
| Spring Boot Starter Cache | 4.0.1 | Caching support |
| Spring Boot Starter Validation | 4.0.1 | Data validation |
| Spring Boot Starter WebFlux | 4.0.1 | Reactive web framework |
| Spring Boot Starter WebMVC | 4.0.1 | REST API support |
| Lombok | Latest | Reduce boilerplate code |
| Caffeine | 3.2.2 | High-performance caching library |
| JUnit, Mockito | 4.0.1 | Testing frameworks |

### Frontend Dependencies (NPM)

| Dependency | Version | Purpose |
|-----------|---------|---------|
| React | ^19.2.0 | UI framework |
| React DOM | ^19.2.0 | DOM rendering |
| Vite | ^7.2.4 | Build tool |
| ESLint | ^9.39.1 | Code linting |
| @vitejs/plugin-react | ^5.1.1 | React support for Vite |

---

## API Endpoints

### Base URL
```
http://localhost:8080/api/apod
```

### 1. Get Today's APOD
```
GET /api/apod/today
```
**Parameters:** None

**Response:**
```json
{
  "date": "2026-01-15",
  "title": "Image Title",
  "explanation": "Detailed explanation...",
  "url": "https://example.com/image.jpg",
  "media_type": "image",
  "copyright": "Copyright holder"
}
```

### 2. Get APOD by Date
```
GET /api/apod?date=2026-01-15
```
**Parameters:**
- `date` (required, string): Date in YYYY-MM-DD format

**Response:** Same as above

### 3. Get Recent APODs
```
GET /api/apod/recent?count=10
```
**Parameters:**
- `count` (optional, integer): Number of recent APODs to retrieve (default: 10)

**Response:**
```json
[
  {
    "date": "2026-01-15",
    "title": "...",
    "explanation": "...",
    "url": "...",
    "media_type": "...",
    "copyright": "..."
  },
  ...
]
```

### Error Handling
- Invalid dates return appropriate HTTP error codes
- NASA API errors are propagated with descriptive messages
- CORS errors handled for cross-origin requests

---

## Setup & Installation

### Prerequisites
- **Java 21** or higher
- **Node.js 18** or higher with npm
- **Maven 3.8+** (included via mvnw in project)
- **NASA API Key** (free from [api.nasa.gov](https://api.nasa.gov))

### Step 1: Clone or Extract Project
```bash
cd nasa-apod
```

### Step 2: Backend Setup

#### Navigate to backend folder:
```bash
cd nasa/nasa
```

#### Configure NASA API Key
Edit `src/main/resources/application.properties`:
```properties
spring.application.name=nasa
nasa.api.key=YOUR_NASA_API_KEY_HERE
```

#### Install dependencies and build:
```bash
# Using Maven wrapper
./mvnw clean install

# Or using system Maven
mvn clean install
```

### Step 3: Frontend Setup

#### Navigate to frontend folder:
```bash
cd ../../nasa-apod-ui
```

#### Install dependencies:
```bash
npm install
```

#### Build frontend (optional for development):
```bash
npm run build
```

---

## Running the Application

### Option 1: Development Mode

#### Terminal 1 - Start Backend
```bash
cd nasa/nasa
./mvnw spring-boot:run
```
Backend will be available at `http://localhost:8080`

#### Terminal 2 - Start Frontend
```bash
cd nasa-apod-ui
npm run dev
```
Frontend will be available at `http://localhost:5173`

### Option 2: Production Build

#### Build Backend:
```bash
cd nasa/nasa
./mvnw clean package
java -jar target/nasa-0.0.1-SNAPSHOT.jar
```

#### Build Frontend:
```bash
cd nasa-apod-ui
npm run build
# Serve the dist folder
npm run preview
```

### Available Scripts

#### Frontend Scripts:
```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

---

## Features

### Current Features
✅ View today's Astronomy Picture of the Day  
✅ Search and view APOD for any specific date  
✅ Browse recent APOD images in gallery format  
✅ View detailed information about each image  
✅ Responsive design for mobile and desktop  
✅ Server-side caching to reduce API calls  
✅ CORS-enabled for cross-origin requests  
✅ Clean, intuitive user interface  

### Technical Features
✅ Reactive HTTP client (WebFlux)  
✅ Caching with Caffeine  
✅ Data validation  
✅ Error handling and logging  
✅ Modular component architecture  
✅ ESLint code quality checks  

### Potential Future Enhancements
- User authentication and favorites
- Download images functionality
- Share to social media
- Advanced filtering and search
- Dark/Light theme toggle
- Image comparison tool
- Video support for video APODs
- PWA capabilities
- Offline mode

---

## Code Organization

### Backend Structure (MVC Pattern)

```
src/main/java/com/example/nasa/
├── NasaApplication.java
├── controller/
│   └── ApodController.java        # Request handling
├── service/
│   └── ApodService.java           # Business logic
├── dto/
│   └── ApodResponse.java          # Data models
├── config/
│   └── WebClientConfig.java       # Configuration
└── resources/
    └── application.properties     # Properties
```

### Frontend Structure (Component-Based)

```
src/
├── main.jsx                       # React entry
├── App.jsx                        # Main component
├── App.css                        # Styling
├── index.css                      # Global styles
└── components/
    ├── TodayAPOD.jsx             # Today view
    ├── DatePicker.jsx            # Date search
    ├── RecentGallery.jsx         # Gallery view
    └── DetailedView.jsx          # Detail view
```

### Design Patterns Used

**Backend:**
- **MVC Pattern** - Separation of concerns
- **DTO Pattern** - Data transfer objects
- **Decorator Pattern** - @Cacheable annotations
- **Singleton Pattern** - Spring beans
- **Configuration Pattern** - WebClientConfig

**Frontend:**
- **Component Pattern** - Reusable components
- **State Management** - React hooks (useState, useEffect)
- **Composition Pattern** - Component composition
- **Container/Presentational Pattern** - Smart vs dumb components

---

## API Integration Notes

### NASA APOD API Details
- **Endpoint**: `https://api.nasa.gov/planetary/apod`
- **Authentication**: Query parameter `api_key`
- **Rate Limiting**: Generally 50 requests per hour per IP
- **Response Format**: JSON
- **Documentation**: [NASA Open APIs](https://api.nasa.gov)

### Caching Strategy Benefits
- Reduces NASA API calls and helps stay within rate limits
- Improves response time for frequently accessed images
- Caffeine provides high-performance in-memory caching
- Cache keys prevent duplicate requests for same data

---

## Troubleshooting

### Common Issues

#### 1. CORS Error
**Problem:** Frontend can't reach backend
**Solution:** Ensure backend is running on port 8080 and CORS origin matches frontend URL

#### 2. NASA API Key Invalid
**Problem:** 401 Unauthorized from NASA API
**Solution:** Verify API key in `application.properties` is correct and active

#### 3. Port Already in Use
**Problem:** "Port 8080 is already in use"
**Solution:** Change port in `application.properties` or kill process using port

#### 4. Module Not Found (Frontend)
**Problem:** Dependencies missing
**Solution:** Run `npm install` in `nasa-apod-ui` directory

#### 5. Maven Build Fails
**Problem:** Compilation errors
**Solution:** Ensure Java 21+ is installed: `java -version`

---

## Development Workflow

### Making Changes

#### Backend:
1. Modify service/controller logic
2. Rebuild: `./mvnw clean compile`
3. Restart Spring Boot application
4. Test via `http://localhost:8080/api/apod/today`

#### Frontend:
1. Modify React components
2. Vite dev server auto-reloads
3. Test in browser
4. Run lint: `npm run lint`

### Adding New Features

#### Backend:
- Add new endpoint to `ApodController`
- Add business logic to `ApodService`
- Update `ApodResponse` DTO if needed
- Add caching with `@Cacheable` if appropriate

#### Frontend:
- Create new component in `src/components/`
- Import and integrate in `App.jsx`
- Add styling in respective CSS file
- Update navigation if adding new tab

---

## Performance Considerations

### Backend Optimization
- **Caching**: Caffeine reduces API calls significantly
- **Async Requests**: WebFlux handles async operations efficiently
- **Connection Pooling**: Spring WebClient manages connection pooling

### Frontend Optimization
- **Vite**: Fast build tool with optimized bundling
- **Code Splitting**: Components are modular for better loading
- **React Hooks**: Efficient state management
- **Lazy Loading**: Images can be lazy-loaded for better performance

---

## Security Considerations

### Current Implementation
- ✅ API key stored in properties file (for development)
- ✅ CORS restricted to frontend origin
- ✅ Input validation on date parameters

### Security Best Practices for Production
- Store API key in environment variables
- Use spring-security for authentication
- Implement request rate limiting
- Add HTTPS/TLS
- Validate all user inputs
- Implement CSRF protection
- Use secure headers

---

## License & Attribution

This project uses:
- **NASA APOD API** - NASA's publicly available API
- **Spring Boot** - Apache 2.0 License
- **React** - MIT License
- **Vite** - MIT License

---

## Contact & Support

For issues with the NASA APOD API, visit: [api.nasa.gov](https://api.nasa.gov)

For Spring Boot documentation: [spring.io](https://spring.io)

For React documentation: [react.dev](https://react.dev)

---

**Last Updated:** January 15, 2026  
**Project Status:** Active Development
