// TypeScript example
import { ServerLog, ServerLogError, TrackEventParams, UpdateProfileMetadataParams } from '../src';

// Initialize the client
const serverlog = new ServerLog({
  apiKey: process.env.SERVERLOG_API_KEY || 'your-api-key-here',
});

// Type-safe event tracking
async function trackTypedEvent() {
  const eventData: TrackEventParams = {
    channel: 'user_activity',
    event: 'Login',
    user_id: 'user-456',
    icon: '🔑',
    metadata: {
      browser: 'Chrome',
      device: 'desktop',
      location: 'New York',
      timestamp: Date.now()
    }
  };

  try {
    await serverlog.track(eventData);
    console.log('Event tracked with TypeScript!');
  } catch (error) {
    if (error instanceof ServerLogError) {
      console.error(`ServerLog Error (${error.status}): ${error.message}`);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

// Type-safe profile update
async function updateTypedProfile() {

  // Example using a generic to allow for flexible metadata
  // You can define any structure you need for your specific use case
  async function updateProfileWithMetadata<T extends Record<string, any>>(profileId: string, metadata: T) {
    return serverlog.updateProfileMetadata(profileId, metadata);
  }

  try {
    // Example 1: Using the generic function with a custom type
    const result1 = await updateProfileWithMetadata('user-456', {
      name: 'Jane Smith',
      lastSeen: Date.now(),
      preferences: {
        theme: 'light' as const,
        notifications: true,
        language: 'en-US'
      }
    });
    console.log('Profile updated with custom metadata!', result1);

    // Example 2: Direct use with any metadata structure
    const result2 = await serverlog.updateProfileMetadata(
      'user-789',
      {
        // Any structure the user wants can go here
        visits: 42,
        tags: ['premium', 'early-adopter'],
        lastPurchase: {
          date: new Date().toISOString(),
          amount: 99.99,
          items: ['product-1', 'product-2']
        }
      }
    );
    console.log('Profile updated with flexible metadata!', result2);
  } catch (error) {
    if (error instanceof ServerLogError) {
      console.error(`ServerLog Error (${error.status}): ${error.message}`);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

// Run examples
async function main() {
  await trackTypedEvent();
  await updateTypedProfile();
}

main().catch(console.error); 