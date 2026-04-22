import { Handler } from '@netlify/functions';
import webcams from '../../bavaria_webcams.json';

// Netlify Function to serve the webcam data
export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      // Optional: Add CORS headers if you plan to access this from another domain
      // 'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      success: true,
      data: webcams,
      cached_at: new Date().setHours(12, 0, 0, 0)
    }),
  };
};
