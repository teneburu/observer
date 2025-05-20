import { z, ZodIssue } from 'zod';

// Define the schema for the configuration
const ObserverConfigSchema = z.object({
  serviceName: z.string().min(1, 'Service name cannot be empty.'),
  environment: z.string().min(1, 'Environment cannot be empty.'),
  lokiUrl: z.string().url().optional().default('http://localhost:3100'),
  observerApiEndpoint: z.string().url().optional().default('/api/observer'),
  minioEndpoint: z.string().optional(),
  minioBucket: z.string().optional(),
  minioAccessKey: z.string().optional(),
  minioSecretKey: z.string().optional(),
  // Add other configuration options here as needed
});

// Infer the TypeScript type from the Zod schema
export type ObserverConfig = z.infer<typeof ObserverConfigSchema>;

// Define a type for the partial configuration that users can provide
export type PartialObserverConfig = Partial<ObserverConfig>;

// Function to load and validate the configuration
export function loadConfig(userConfig?: PartialObserverConfig): ObserverConfig {
  // Layered configuration:
  // 1. Defaults (defined in schema)
  // 2. Environment variables
  // 3. Programmatic configuration (userConfig)

  const envConfig: PartialObserverConfig = {
    serviceName: process.env.OBSERVER_SERVICE_NAME,
    environment: process.env.OBSERVER_ENVIRONMENT,
    lokiUrl: process.env.OBSERVER_LOKI_URL,
    observerApiEndpoint: process.env.OBSERVER_API_ENDPOINT,
    minioEndpoint: process.env.OBSERVER_MINIO_ENDPOINT,
    minioBucket: process.env.OBSERVER_MINIO_BUCKET,
    minioAccessKey: process.env.OBSERVER_MINIO_ACCESS_KEY,
    minioSecretKey: process.env.OBSERVER_MINIO_SECRET_KEY,
  };

  // Filter out undefined environment variables
  const cleanEnvConfig = Object.fromEntries(
    Object.entries(envConfig).filter(([, value]) => value !== undefined)
  );

  // Merge configurations: userConfig overrides envConfig, which overrides schema defaults
  const mergedConfig = {
    ...cleanEnvConfig, // Environment variables (already filtered for undefined)
    ...userConfig,    // Programmatic overrides
  };
  
  try {
    // The schema's defaults will be applied here if not provided by env or user config
    const validatedConfig = ObserverConfigSchema.parse(mergedConfig);
    return validatedConfig;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      console.error("Configuration validation failed:", error.errors);
      throw new Error("Invalid configuration provided. " + error.errors.map((e: ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', '));
    }
    throw error; // Re-throw other errors
  }
}

// Example of a global config instance (optional, depends on usage pattern)
// let globalConfig: ObserverConfig | undefined;

// export function initializeObserver(config: PartialObserverConfig): ObserverConfig {
//   if (globalConfig) {
//     console.warn("Observer already initialized. Re-initializing with new config.");
//   }
//   globalConfig = loadConfig(config);
//   console.log("Observer initialized with config:", globalConfig);
//   return globalConfig;
// }

// export function getConfig(): ObserverConfig {
//   if (!globalConfig) {
//     throw new Error("Observer not initialized. Call initializeObserver(config) first.");
//   }
//   return globalConfig;
// }
