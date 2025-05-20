import { coreFunction } from '@observer/core';

// Server-side utilities for Fastify/tRPC will go here
export const serverFunction = () => {
  coreFunction();
  console.log("Hello from @observer/server");
}; 