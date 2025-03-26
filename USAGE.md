# @serverlog/node Usage Guide

This guide provides more detailed information on how to use the ServerLog Node.js library for analytics tracking.

## Installation

Install the package using npm or yarn:

```bash
npm install @serverlog/node
# or
yarn add @serverlog/node
```

## Configuration

First, initialize the ServerLog client with your API key:

```javascript
import { ServerLog } from '@serverlog/node';
// or with CommonJS
// const { ServerLog } = require('@serverlog/node');

const serverlog = new ServerLog({
  apiKey: 'your-api-key'
});
```

## Tracking Events

Events represent user actions or system occurrences that you want to track. Each event has a channel, name, and optional metadata.

### Basic Event Tracking

```javascript
await serverlog.track({
  channel: "payments", // Required - category/group for the event
  event: "Subscription Renewed", // Required - name of the event
  user_id: "user-123", // Optional but recommended - identifies the user
  icon: "💳", // Optional - emoji or icon identifier for the event
  metadata: { // Optional - additional data about the event
    // The metadata structure is completely flexible and customizable!
    plan: "premium",
    amount: 99.99,
    currency: "USD",
    // Add any properties that make sense for your use case
    customerId: "cust_123456",
    isRenewal: true
  }
});
```

### Event Channels

Channels help organize events into logical categories. Some examples:

- `page_views` - For tracking user navigation
- `auth` - Authentication events like logins, logouts
- `payments` - Payment and subscription events
- `user_actions` - General user interactions
- `system` - Backend system events

### Best Practices for Events

1. **Be consistent with naming**: Use past tense for completed actions (e.g., "Order Placed" not "Place Order")
2. **Group related events**: Use the same channel for related events
3. **Include relevant metadata**: Add contextual data that will be useful for analysis
4. **Always include user_id when possible**: This allows for user journey analysis

## User Profiles and Metadata

You can update profile metadata to keep additional information about your users. The metadata structure is completely up to you and can be customized to fit your specific needs.

```javascript
await serverlog.updateProfileMetadata(
  "user-123", // Required - typically your system's user ID
  { // Required - object containing user properties
    // You can include any fields you need
    name: "John Doe",
    email: "john@example.com", 
    subscription: "premium",
    lastLogin: new Date().toISOString(),
    
    // Your custom data fields
    purchases: 27,
    totalSpent: 1249.99,
    tags: ["power-user", "early-adopter"],
    
    // Nested objects are supported
    preferences: {
      theme: "dark",
      notifications: true
    }
  }
);
```

The metadata object can contain any JSON-serializable data, including nested objects, arrays, booleans, numbers, and strings. There are no restrictions on the schema of your metadata, allowing you to adapt it to your specific application needs.

## Error Handling

All methods return promises and can throw errors. It's important to handle these errors gracefully, especially in production:

```javascript
try {
  await serverlog.track({
    channel: "orders",
    event: "Order Placed",
    user_id: "user-789",
    metadata: { orderId: "ORD-12345" }
  });
} catch (error) {
  if (error instanceof ServerLogError) {
    // ServerLogError provides additional context
    console.error(`ServerLog Error (${error.status}): ${error.message}`);
    
    // You may want to retry or log the error, but usually don't want to
    // crash your application due to analytics errors
  } else {
    console.error('Unknown error:', error);
  }
}
```

## TypeScript Support

The library is written in TypeScript and provides full type support while allowing for completely flexible metadata:

```typescript
import { ServerLog, TrackEventParams, UpdateProfileMetadataParams } from '@serverlog/node';

// Define typed event data with your own metadata structure
const eventData: TrackEventParams = {
  channel: 'user_activity',
  event: 'Profile Updated',
  user_id: 'user-123',
  metadata: {
    // Your custom metadata - any structure works!
    changes: ['email', 'avatar'],
    duration: 5.2,
    successful: true
  }
};

// Track with type-safe parameters
await serverlog.track(eventData);

// For advanced use cases, you can create helper functions with generics
async function updateProfileWithMetadata<T extends Record<string, any>>(
  profileId: string, 
  metadata: T
) {
  return serverlog.updateProfileMetadata({
    profileId,
    metadata
  });
}

// Then use your custom typing
interface MyUserData {
  name: string;
  plan: 'free' | 'premium' | 'enterprise';
  visits: number;
}

const result = await updateProfileWithMetadata<MyUserData>('user-123', {
  name: 'Alice Smith',
  plan: 'premium',
  visits: 42
});
```

## Environment Variables

For security, it's recommended to use environment variables for your API key:

```javascript
const serverlog = new ServerLog({
  apiKey: process.env.SERVERLOG_API_KEY
});
```

## Advanced Usage

### Handling High-Volume Events

For high-volume events, consider implementing a batching or queueing mechanism to avoid performance impacts:

```javascript
// Simple example of batched tracking
class BatchedServerLog {
  private serverlog: ServerLog;
  private eventQueue: TrackEventParams[] = [];
  private flushInterval: NodeJS.Timeout;
  
  constructor(config: ServerLogConfig) {
    this.serverlog = new ServerLog(config);
    this.flushInterval = setInterval(() => this.flush(), 5000); // Flush every 5 seconds
  }
  
  track(params: TrackEventParams): void {
    this.eventQueue.push(params);
    
    // Flush if queue gets too large
    if (this.eventQueue.length >= 50) {
      this.flush();
    }
  }
  
  async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;
    
    const events = [...this.eventQueue];
    this.eventQueue = [];
    
    // Process in parallel (adjust concurrency as needed)
    await Promise.all(events.map(event => 
      this.serverlog.track(event).catch(err => 
        console.error('Failed to track event:', err)
      )
    ));
  }
  
  close(): void {
    clearInterval(this.flushInterval);
    this.flush().catch(console.error);
  }
}
```

### Server Middleware

You can easily integrate with Express.js middleware:

```javascript
// Express middleware to track API requests
function analyticsMiddleware(serverlog) {
  return (req, res, next) => {
    const startTime = Date.now();
    
    // Record response
    const originalEnd = res.end;
    res.end = function(...args) {
      const duration = Date.now() - startTime;
      
      serverlog.track({
        channel: 'api',
        event: 'API Request',
        user_id: req.user?.id,
        metadata: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration,
          userAgent: req.headers['user-agent']
        }
      }).catch(err => console.error('Analytics error:', err));
      
      originalEnd.apply(res, args);
    };
    
    next();
  };
}

// Usage
app.use(analyticsMiddleware(serverlog));
```

## Common Issues and Troubleshooting

### API Key Issues

- **Error:** "API key is required" or "Invalid API key"
  - **Solution:** Check that you're providing a valid API key

### Network Issues

- **Error:** "No response received from server"
  - **Solution:** Check your network connection and the baseUrl configuration

### Rate Limiting

- **Error:** "Too many requests" (429 status code)
  - **Solution:** Implement batching or reduce the frequency of tracking calls

### Large Metadata

- **Error:** "Request payload too large" 
  - **Solution:** Reduce the size of your metadata objects

## Need Help?

For additional assistance, please open an issue on the GitHub repository or contact support. 