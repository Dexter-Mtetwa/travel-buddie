# Travel Buddie - React Native Frontend

A premium mobile app for AI-powered trip planning, built with Expo SDK 52.

## Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Language**: TypeScript
- **State Management**: Zustand
- **Server State**: TanStack React Query
- **HTTP Client**: Axios
- **Navigation**: Expo Router (file-based)
- **Styling**: StyleSheet with custom design system

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app on your phone (for testing)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```

### Running on Device

1. Scan the QR code with Expo Go (Android) or Camera app (iOS)
2. The app will load on your device

### Environment Variables

Create a `.env` file or set in `app.config.ts`:

```
API_BASE_URL=http://your-backend-url:8000
USE_MOCKS=false
```

For local development with backend:
```
API_BASE_URL=http://10.0.2.2:8000  # Android emulator
# or
API_BASE_URL=http://localhost:8000  # iOS simulator
```

## Project Structure

```
frontend/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with providers
│   └── index.tsx          # Main chat screen
├── src/
│   ├── api/               # API client and types
│   │   ├── client.ts      # Axios setup + API calls
│   │   └── types.ts       # TypeScript interfaces
│   ├── components/
│   │   ├── chat/          # Chat-specific components
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── RecommendationCard.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── TypingIndicator.tsx
│   │   └── ui/            # Reusable UI components
│   │       ├── Header.tsx
│   │       └── GradientBackground.tsx
│   ├── hooks/
│   │   └── useChat.ts     # Main chat logic hook
│   ├── store/
│   │   └── chatStore.ts   # Zustand state management
│   └── theme/
│       └── colors.ts      # Design tokens
├── assets/                # Images and fonts
├── app.config.ts          # Expo configuration
└── package.json
```

## Features

- 💬 **Conversational Interface**: Natural language trip planning
- ✈️ **Flight Recommendations**: Compare options with pricing
- 🏨 **Hotel Suggestions**: Rated accommodations
- 🚗 **Car Rentals**: Optional rental car options
- 🛂 **Visa Info**: Automatic visa requirement checks
- 🌙 **Dark Theme**: Premium dark UI with animations
- 📱 **Mobile First**: Optimized for phone screens

## Development

### Mock Mode

Enable mock mode to develop without backend:

```typescript
// In app.config.ts
extra: {
  USE_MOCKS: true,
}
```

### Backend Integration

The app expects a FastAPI backend running at `/chat` endpoint.

Expected request:
```json
{
  "message": "I want to go to Paris from Addis Ababa next month"
}
```

Expected response:
```json
{
  "message": "Found 3 options for you!",
  "recommendations": [...],
  "extracted_data": {...},
  "visa_info": {...}
}
```

## Building for Production

```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios

# Or use EAS Build
npx eas build --platform all
```

## License

MIT
