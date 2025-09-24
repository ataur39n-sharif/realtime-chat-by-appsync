import { client } from './appsync';
import { listTeamMessages } from './graphql';

// Test function to verify AppSync connection
export const testAppSyncConnection = async () => {
  try {
    // Use alert to ensure function is called
    if (typeof window !== 'undefined') {
      console.log('🔍 TEST CONNECTION FUNCTION CALLED');
    }
    
    console.log('🔍 Testing AppSync connection...');
    console.warn('🔍 Environment variables check:');
    console.warn('- Endpoint:', process.env.NEXT_PUBLIC_APPSYNC_HTTPS_MESSAGE_API_ENDPOINT);
    console.warn('- Region:', process.env.NEXT_PUBLIC_AWS_REGION);
    console.warn('- API Key:', process.env.NEXT_PUBLIC_APPSYNC_API_KEY ? 'Set' : 'Not set');
    
    // Add alert to make sure function is called
    console.warn('🚀 About to make GraphQL request...');
    
    const response = await client.graphql({
      query: listTeamMessages,
      variables: {
        limit: 1
      },
      authMode: 'apiKey'
    });
    
    console.log('AppSync connection successful!');
    console.log('Response:', response);
    return response;
  } catch (error) {
    console.error('AppSync connection failed:');
    console.error('Error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
};