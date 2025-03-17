export interface ServerLogConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface TrackEventParams {
  channel: string;
  event: string;
  user_id?: string;
  icon?: string;
  /**
   * Metadata is a flexible object that can contain any JSON-serializable data.
   * You can define any structure that fits your needs.
   */
  metadata?: Record<string, any>;
}

export interface APIResponse<T = any> {
  data: T;
  status: number;
}

export class ServerLogError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ServerLogError';
    this.status = status;
    this.code = code;
  }
} 