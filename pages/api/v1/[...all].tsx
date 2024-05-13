import type { NextApiRequest, NextApiResponse } from 'next/types';
import databaseMiddleware from '@/middleware/databaseMiddleware';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '200mb'
    },
    responseLimit: false
  },
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  maxDuration: 5
};

export interface BACApiRequest extends NextApiRequest {
  pool?: any;
  appInsights?: any;
}

export default databaseMiddleware(
  async (req: BACApiRequest, res: NextApiResponse) => {
    try {
      const { all } = req.query;
      const controllerRoute = all as string[];
      const endpoint = (all as string[]).join('/');

      let apiFileName = "";
      if (endpoint.includes("connection") && controllerRoute.length > 1) {
        apiFileName = 'connection';
        // Build stored procedure and name and params
        req.body.sql = `exec [${req.body.isRaw === true ? '' : 'sp_'}${controllerRoute[controllerRoute.length - 1].replace('sp_', '')}] ${req.body.params}`;
        delete req.body.params;
      } else { // load from existing api file
        apiFileName = endpoint;
      }

      const { default: apiHandler } = await import(`../${apiFileName}.tsx`);
      return apiHandler(req, res);

    } catch (error) {
      console.log('Route not found:', error.message);
      req.appInsights?.trackException({ exception: error });
      // Set the response status
      res.status(404);
      // Send the error message
      return res.json([]);
    }
  }
);
