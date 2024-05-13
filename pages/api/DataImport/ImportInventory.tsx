import sql2 from 'mssql';
import type { NextApiResponse } from 'next/types';
import { connect } from '@/utils/db_config';
import { BACApiRequest } from '../v1/[...all]';

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

export default async function handle(req: BACApiRequest, res: NextApiResponse) {
  try {
    let pool = req.pool ? req.pool : await connect();

    const tvp_UploadData = new sql2.Table();
    tvp_UploadData.columns.add('custody', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('inventory_status', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('card_number', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('cif', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('owner_name', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('guarantor_name', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('additional_name', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('procedure_type', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('product_name', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('office_phone', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('home_phone', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('mobile_phone', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('BAC_home_phone', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('home_address', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('work_address', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('observations', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add(
      'info_activity_comments',
      sql2.NVarChar(sql2.MAX)
    );
    tvp_UploadData.columns.add(
      'info_activity_description',
      sql2.NVarChar(sql2.MAX)
    );
    tvp_UploadData.columns.add('BAC_address', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add(
      'optional_observations',
      sql2.NVarChar(sql2.MAX)
    );
    tvp_UploadData.columns.add('mail', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('Line_Error', sql2.Int);
    tvp_UploadData.columns.add('Error', sql2.Bit);
    tvp_UploadData.columns.add('Description_Error', sql2.NVarChar(sql2.MAX));

    req.body.excelData.forEach((row) => {
      console.log('row', row);
      tvp_UploadData.rows.add(
        String(row['Custodia'] ?? '').trim(),
        String(row['Estatus'] ?? '').trim(),
        String(row['Tarjeta'] ?? '').trim(),
        String(row['CIF'] ?? '').trim(),
        String(row['Nombre Titular'] ?? '').trim(),
        String(row['Nombre Fiador'] ?? '').trim(),
        String(row['Nombre Adicional'] ?? '').trim(),
        String(row['Tramite'] ?? '').trim(),
        String(row['Producto'] ?? '').trim(),
        String(row['Telefono de Oficina'] ?? '').trim(),
        String(row['Telefono Casa'] ?? '').trim(),
        String(row['Celular'] ?? '').trim(),
        String(row['Tel BAC Casa'] ?? '').trim(),
        String(row['Direccion Casa'] ?? '').trim(),
        String(row['Direccion Trabajo'] ?? '').trim(),
        String(row['Observaciones'] ?? '').trim(),
        String(row['Comentarios Actividad de Datos'] ?? '').trim(),
        String(row['Descripción Actividad de Datos'] ?? '').trim(),
        String(row['Dirección BAC'] ?? '').trim(),
        String(row['Observación'] ?? '').trim(),
        String(row['Mail'] ?? '').trim(),
        0,
        0,
        ' '
      );
    });

    if (tvp_UploadData.rows.length > 0) {
      let result = await pool
        .request()
        .input('InfoTemplate', tvp_UploadData)
        .execute('sp_ValidateInventoryTemplate');

      res.status(200);
      tvp_UploadData.rows.clear();
      return res.json(result.recordsets);
    } else {
      return res.status(500).json({
        error: 'No existen registros para su importación',
        resultset: []
      });
    }
  } catch (error) {
    res.status(500);
    console.log('error', error);
    req.appInsights?.trackException({ exception: error });
    return res.json({ error: error, resultset: [] });
  }
}
