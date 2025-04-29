# DacrudFrontend

This is the frontend application for a CRUD project built with Angular 19 and Angular Material.

## Features Implemented

### Authentication System

- **Login Page**: Users can log in with email/password and JWT authentication
- **Register Page**: New users can create an account
- **Forgot Password**: Users can request password reset
- **Auth Guard**: Routes are protected with authentication guards
- **Token Management**: JWT tokens are automatically added to API requests
- **Session Management**: User sessions are maintained using local storage
- **Secure Routing**: Unauthorized users are redirected to the login page

### UI Framework

- **Angular Material**: Modern UI components with a consistent design system
- **Responsive Design**: Mobile-friendly layouts
- **Form Validation**: Client-side validation with error messages
- **Snackbar Notifications**: Toast notifications for success/error messages

## Architecture

This application follows a feature-based architecture with clear separation of concerns, emphasizing maintainability, testability, and scalability.

### Directory Structure

```
src/
├── app/
│   ├── core/                    # Singleton services and app-wide functionality
│   │   ├── guards/              # Route guards
│   │   │   └── auth.guard.ts    # Authentication guard
│   │   ├── interceptors/        # HTTP interceptors
│   │   │   └── auth.interceptor.ts # Token interceptor
│   │   ├── config/              # Global configuration
│   │   │   └── api.config.ts    # API endpoints
│   │   ├── layout/              # App-wide layout components
│   │   └── index.ts             # Barrel exports for core module
│   │
│   ├── features/                # Feature modules
│   │   ├── auth/                # Authentication feature
│   │   │   ├── components/      # Login, Register, Forgot Password components
│   │   │   ├── services/        # Auth service
│   │   │   ├── models/          # Auth data models
│   │   │   └── auth.routes.ts   # Auth routes
│   │   │
│   │   └── home/                # Home feature
│   │       └── ...              # Components, services, etc.
│   │
│   ├── shared/                  # Shared components and services
│   │   ├── components/          # Reusable UI components
│   │   ├── directives/          # Custom directives
│   │   ├── pipes/               # Custom pipes
│   │   └── services/            # Shared services (e.g., SnackbarService)
│   │
│   ├── app.component.ts         # Root component
│   ├── app.routes.ts            # Application routes
│   └── app.config.ts            # App configuration
│
└── assets/                      # Static assets
```

### Path Aliases

To avoid using relative paths (`../../`) in imports, the project uses path aliases:

```typescript
// Instead of
import { AuthService } from '../../features/auth/services/auth.service';

// Use
import { AuthService } from '@auth/services/auth.service';
```

Available aliases:

- `@core/*` - Core module imports (`app/core/*`)
- `@shared/*` - Shared module imports (`app/shared/*`)
- `@features/*` - Features module imports (`app/features/*`)
- `@auth/*` - Auth feature imports (`app/features/auth/*`)
- `@env/*` - Environment files (`environments/*`)

### Architectural Principles

1. **Single Responsibility**: Each class has a single responsibility
2. **DRY (Don't Repeat Yourself)**: Code reuse through shared components
3. **Feature Encapsulation**: Features are self-contained with their own components, services, and models
4. **Core Isolation**: Application-wide singleton services are isolated in core
5. **Dependency Injection**: Angular's DI for loose coupling
6. **Signal-based State**: Using Angular signals for state management

### Best Practices

1. **Standalone Components**: Using Angular's standalone API
2. **Injectable Services**: Services follow the `providedIn: 'root'` pattern
3. **Dependency Injection**: Using `inject()` function in components
4. **Typed Interfaces**: Strongly typed models and interfaces
5. **Lazy Loading**: Features can be lazy-loaded for performance

## Authentication Flow

1. User navigates to the login page
2. User enters email and password
3. The application sends credentials to the backend API
4. On successful login, the backend returns a JWT token
5. The token is stored in local storage
6. User is redirected to the home dashboard
7. All subsequent API requests include the token in the Authorization header
8. User can log out, which clears the token and redirects to login

## API Integration

The application connects to a backend API with the following configuration:

```typescript
export const apiConfig = {
  baseUrl: 'http://localhost:3000',
  endpoints: {
    login: '/api/v1/auth/login',
    logout: '/api/v1/auth/logout',
    users: '/api/v1/auth/users',
  },
};
```

## Development server

To start a local development server, run:

```bash
npm start
```

Then navigate to `http://localhost:4200/`. The application will automatically reload when you change any source files.

## Building for production

```bash
npm run build
```

This will create optimized production files in the `dist/` directory.

## Code formatting

The project uses ESLint and Prettier for code formatting:

```bash
npm run format        # Format all code
npm run format:check  # Check if code is formatted
npm run lint          # Run ESLint
```

## Additional Resources

For more information on using Angular, check out these resources:

- [Angular Documentation](https://angular.dev)
- [Angular Material Documentation](https://material.angular.io)
