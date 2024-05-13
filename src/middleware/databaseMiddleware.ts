// databaseMiddleware.ts
import type { NextApiResponse } from 'next/types';
import { connect, release } from '@/utils/db_config';
import { BACApiRequest } from 'pages/api/v1/[...all]';
import { Apiconfig } from '@/utils/azure_insights_config';
import * as appInsights from 'applicationinsights';

const startApiAppInsights = () => {
  if(!Apiconfig.instrumentationKey) return;

  appInsights.setup(Apiconfig.instrumentationKey).start();
  return appInsights;
}

startApiAppInsights();

export default function databaseMiddleware(handler) {
  return async (req: BACApiRequest, res: NextApiResponse) => {
    req.appInsights = appInsights?.defaultClient;
    try {
      // Almacena el pool de conexiones en la solicitud para que esté disponible en la página
      req.pool = await connect();

      // Llama al siguiente manejador (página o siguiente middleware)
      return handler(req, res);
    } catch (error) {
      req.appInsights?.trackException({ exception: error });
      console.error('Database Error:', error);
      res.status(500).json([]);
    } finally {
      release(req.pool);
    }
  };
}
