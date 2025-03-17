// Note: This example assumes you have built the library
// Run `npm run build` before executing this example

const { ServerLog } = require('../dist');

// Initialize the client
const serverlog = new ServerLog({
  apiKey: 'your-api-key-here',
  // baseUrl: 'http://localhost:3000' // Uncomment to use a custom API URL
});

// Example: Track an event
async function trackEvent() {
  try {
    await serverlog.track({
      channel: 'orders',
      event: 'Order Placed',
      user_id: 'user-123',
      icon: '🛍️',
      metadata: {
        orderId: 'ORD-12345',
        total: 99.99,
        items: 3,
        shippingMethod: 'express'
      }
    });
    
    console.log('Event tracked successfully!');
  } catch (error) {
    console.error('Error tracking event:', error.message);
  }
}

// Example: Update profile metadata
async function updateProfile() {
  try {
    const profile = await serverlog.updateProfileMetadata(
      'user-123',
      {
        name: 'John Doe',
        email: 'john@example.com',
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'dark',
          notifications: true
        }
      }
    );
    
    console.log('Profile updated successfully:', profile);
  } catch (error) {
    console.error('Error updating profile:', error.message);
  }
}

// Run examples
async function runExamples() {
  await trackEvent();
  await updateProfile();
}

runExamples().catch(console.error); 