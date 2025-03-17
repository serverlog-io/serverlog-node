import { APIClient } from './api-client';
import { ServerLogConfig, TrackEventParams, ServerLogError } from './types';

export class ServerLog {
  private client: APIClient;

  constructor(config: ServerLogConfig) {
    if (!config.apiKey) {
      throw new ServerLogError('API key is required');
    }
    
    this.client = new APIClient(config);
  }

  /**
   * Track an analytics event
   * @param params Event parameters
   * @returns Promise that resolves when the event is tracked
   */
  async track(params: TrackEventParams): Promise<void> {
    // Validate required parameters
    if (!params.channel) {
      throw new ServerLogError('Channel is required');
    }
    if (!params.event) {
      throw new ServerLogError('Event name is required');
    }

    try {
      await this.client.post('/track', {
        channel: params.channel,
        event: params.event,
        user_id: params.user_id,
        icon: params.icon,
        ...params.metadata
      });
    } catch (error) {
      if (error instanceof ServerLogError) {
        throw error;
      } else {
        throw new ServerLogError(`Failed to track event: ${(error as Error).message}`);
      }
    }
  }

  /**
   * Update user profile metadata
   * @param profileId The ID of the profile to update
   * @param metadata Metadata object containing user properties
   * @returns Promise that resolves with the updated profile
   */
  async updateProfileMetadata(profileId: string, metadata: Record<string, any>): Promise<any> {
    // Validate required parameters
    if (!profileId) {
      throw new ServerLogError('Profile ID is required');
    }
    if (!metadata || typeof metadata !== 'object') {
      throw new ServerLogError('Metadata must be a valid object');
    }

    try {
      const response = await this.client.put(`/profiles/${profileId}/metadata`, metadata);
      return response.data;
    } catch (error) {
      if (error instanceof ServerLogError) {
        throw error;
      } else {
        throw new ServerLogError(`Failed to update profile metadata: ${(error as Error).message}`);
      }
    }
  }
} 