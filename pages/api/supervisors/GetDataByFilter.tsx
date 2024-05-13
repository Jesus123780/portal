import type { NextApiResponse } from 'next/types';
import { connect } from '@/utils/db_config';
import { BACApiRequest } from '../v1/[...all]';

export default async function handler(
  req: BACApiRequest,
  res: NextApiResponse
) {
  // Connection pool
  try {
    let pool = req.pool ? req.pool : await connect();

    // Replace this SQL query with your own query.
    // Make sure your query is secure and not open to SQL injections.

    const query = `sp_GetLoadDataByFilter '${req.body.startDate}','${req.body.endDate}','${req.body.providerSelected}','${req.body.LocalizeSelected}','${req.body.SLASelected}','','${req.body.formalizerSelected}',${req.body.page},${req.body.rowsPerPage},'${req.body.search}','0','asc','${req.body.listStatusSelected}'`;
    let result = await pool.request().query(query);

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
    return res.json([]);
  }
}
