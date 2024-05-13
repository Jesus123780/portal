import type { NextApiResponse } from 'next/types';
import { connect } from '@/utils/db_config';
import { BACApiRequest } from '../v1/[...all]';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '200mb',
    },
    responseLimit: false
  },
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  maxDuration: 5,
}
// Reemplaza estos valores con tus propias credenciales de base de datos.

export default async function handler(
  req: BACApiRequest,
  res: NextApiResponse
) {
  try {
    let pool = req.pool ? req.pool : await connect();

    // Replace this SQL query with your own query.
    // Make sure your query is secure and not open to SQL injections.

    let result = await pool
      .request()
      .query(
        `sp_GetInfoLoadDataByFilter '${req.body.StartDate}','${req.body.EndDate}',null,'','${req.body.Month}' ,'${req.body.Find}',null,null,null,null,null,${req.body.Page},${req.body.RowsPerPage},0,'desc','1'`
      );

    //usar req.body.parameters
    // Set the response status
    res.status(200);

    // Send the response
    return res.json(result.recordset);
  } catch (error) {
    // Set the response status
    res.status(500);
    console.log(error);
    req.appInsights?.trackException({ exception: error });
    // Send the error message
    return res.json({ error: error });
  } 
}
