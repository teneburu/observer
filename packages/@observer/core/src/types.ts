// Environment type for specifying development or production
export type ObserverEnvironment = 'development' | 'production';

// Configuration for a specific service (e.g., Loki, MinIO)
export interface ObserverServiceConfig {
  readonly url: string;
  readonly apiKey?: string; // Optional API key
}

// General configuration for the Observer module
export interface ObserverConfig {
  readonly environment: ObserverEnvironment;
  readonly serviceName: string; // Name of the service using Observer
  readonly lokiConfig?: ObserverServiceConfig; // Configuration for Loki
  readonly minioConfig?: ObserverServiceConfig & { bucket?: string }; // Configuration for MinIO, including optional bucket
  readonly observerServerEndpoint: string; // Endpoint for the Observer backend
  readonly debug?: boolean; // Enable debug logging
}

// Base interface for all Observer events
export interface ObserverBaseEvent {
  readonly eventId: string; // Unique identifier for the event (e.g., UUID)
  readonly timestamp: number; // Unix timestamp (milliseconds)
  readonly source: 'client' | 'server'; // Origin of the event
  readonly sessionId?: string; // Optional session identifier
  readonly visitorId?: string; // Optional visitor identifier (long-term)
  readonly userId?: string; // Optional user identifier
  // readonly eventVersion: string; // Future: for versioning event schemas
}

// Specific event type for page views
export interface ObserverPageViewEvent extends ObserverBaseEvent {
  readonly type: 'page_view';
  readonly url: string;
  readonly referrer?: string;
  readonly title?: string;
  readonly screenWidth?: number;
  readonly screenHeight?: number;
  readonly language?: string;
}

// Specific event type for custom application events
export interface ObserverCustomEvent<TProperties extends Record<string, unknown> = Record<string, unknown>> extends ObserverBaseEvent {
  readonly type: 'custom_event';
  readonly name: string; // Name of the custom event
  readonly properties?: Readonly<TProperties>; // Arbitrary properties for the event
}

// Specific event type for errors
export interface ObserverErrorEvent extends ObserverBaseEvent {
  readonly type: 'error';
  readonly error: {
    readonly message: string;
    readonly name?: string; // e.g., 'TypeError', 'ReferenceError'
    readonly stackTrace?: string;
    readonly type?: string; // e.g., 'unhandled_exception', 'unhandled_rejection', 'rendering_error'
  };
  readonly context?: Readonly<Record<string, unknown>>; // Additional context for the error
  readonly url?: string; // URL where the error occurred (client-side)
  readonly userAgent?: string; // User agent (client-side)
  readonly trpcPath?: string; // tRPC path (server-side)
}

// Union type for all possible Observer events
export type ObserverEvent = ObserverPageViewEvent | ObserverCustomEvent | ObserverErrorEvent;

// Utility type for event payloads sent to the backend
export interface ObserverEventPayload {
  readonly config: Pick<ObserverConfig, 'serviceName' | 'environment'>; // Minimal config sent with events
  readonly events: readonly ObserverEvent[];
}

// Configuration for the client-side Observer
export interface ObserverClientConfig extends ObserverConfig {
  // Client-specific configurations can be added here
  readonly automaticPageViews?: boolean; // Enable automatic page view tracking
  readonly sessionReplay?: {
    readonly enabled: boolean;
    readonly samplingRate?: number; // 0 to 1
    // Add more rrweb specific config options here
  };
}

// Configuration for the server-side Observer
export interface ObserverServerConfig extends ObserverConfig {
  // Server-specific configurations can be added here
}

// Generic type for a function that captures an event
export type ObserverCaptureFunction<TEvent extends ObserverBaseEvent> = (eventData: Omit<TEvent, keyof ObserverBaseEvent>) => void;

// Generic type for a function that manually captures an exception
export type ObserverCaptureExceptionFunction = (error: Error, context?: Record<string, unknown>) => void; 