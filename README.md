# @serverlog/node

A Node.js library for tracking analytics events from your backend application.

## Installation

```bash
npm install @serverlog/node
# or
yarn add @serverlog/node
```

## Usage

### Initialize the client

```javascript
import { ServerLog } from '@serverlog/node';
// or with CommonJS
// const { ServerLog } = require('@serverlog/node');

const serverlog = new ServerLog({
  apiKey: 'your-api-key',
  // Optional configuration
  baseUrl: 'https://api.yourdomain.com', // defaults to https://api.serverlog.dev
});
```

### Track an event

```javascript
// Async/await
await serverlog.track({
  channel: "payments",
  event: "New Subscription",
  user_id: "user-123", // optional but recommended
  icon: "💰", // optional
  metadata: {
    plan: "premium",
    cycle: "monthly",
    trial: false
    // Add any properties you need - metadata is completely flexible!
  }
});

// Promise
serverlog.track({
  channel: "page_views",
  event: "Home Page View",
  user_id: "user-456"
}).then(() => {
  console.log('Event tracked successfully');
}).catch(error => {
  console.error('Error tracking event:', error);
});
```

### Update user profile metadata

```javascript
// The metadata structure is completely up to you!
await serverlog.updateProfileMetadata(
  "user-123",
  {
    // Define any properties your application needs
    name: "John Doe",
    email: "john@example.com",
    plan: "premium",
    visits: 42,
    tags: ["premium", "early-adopter"],
    preferences: {
      theme: "dark",
      notifications: true
    }
  }
);
```

## Error Handling

The library throws errors for network issues, authentication problems, and invalid parameters. We recommend implementing proper error handling:

```javascript
try {
  await serverlog.track({
    channel: "orders",
    event: "Order Placed",
    user_id: "user-789",
    metadata: { orderId: "ORD-12345" }
  });
} catch (error) {
  console.error('Analytics tracking failed:', error.message);
  // Don't let analytics failures affect your main application flow
}
```

## TypeScript Support

This library includes TypeScript definitions and supports flexible metadata structures while maintaining type safety. 