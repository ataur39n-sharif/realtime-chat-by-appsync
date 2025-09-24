import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

// Configure Amplify with AppSync settings
Amplify.configure({
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_APPSYNC_HTTPS_MESSAGE_API_ENDPOINT || process.env.APPSYNC_HTTPS_MESSAGE_API_ENDPOINT || '',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      defaultAuthMode: 'apiKey',
      apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY || process.env.APPSYNC_API_KEY || ''
    }
  }
});

// Create GraphQL client with explicit authMode
export const client = generateClient({
  authMode: 'apiKey'
});

// AppSync configuration for subscriptions
export const appSyncConfig = {
  aws_appsync_graphqlEndpoint: process.env.NEXT_PUBLIC_APPSYNC_HTTPS_MESSAGE_API_ENDPOINT || process.env.APPSYNC_HTTPS_MESSAGE_API_ENDPOINT || '',
  aws_appsync_region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  aws_appsync_authenticationType: 'API_KEY' as const,
  aws_appsync_apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY || process.env.APPSYNC_API_KEY || '',
  aws_appsync_realtimeEndpoint: process.env.NEXT_PUBLIC_APPSYNC_WS_MESSAGE_API_ENDPOINT || process.env.APPSYNC_WS_MESSAGE_API_ENDPOINT || ''
};