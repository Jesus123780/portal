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
    tvp_UploadData.columns.add('card_number', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('cif', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('owner_name', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('guarantor_name', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('additional_name', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('procedure_type', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('product_name', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('officer_code', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('office_phone', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('home_phone', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('mobile_phone', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('BAC_office_phone', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('BAC_home_phone', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('BAC_phone_1', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('BAC_phone_2', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('siebel_home_phone', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('siebel_mobile_phone', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('siebel_phone', sql2.NVarChar(sql2.MAX));
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
    tvp_UploadData.columns.add('routing_comments', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('BAC_address', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add(
      'optional_observations',
      sql2.NVarChar(sql2.MAX)
    );
    tvp_UploadData.columns.add('optional_1', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('optional_2', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('create_by', sql2.NVarChar(50));
    tvp_UploadData.columns.add('provider_name', sql2.NVarChar(50));
    tvp_UploadData.columns.add('provider_zone_name', sql2.NVarChar(50));
    tvp_UploadData.columns.add(
      'card_number_encrypted',
      sql2.NVarChar(sql2.MAX)
    );
    tvp_UploadData.columns.add('optional_3', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('optional_4', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('optional_5', sql2.NVarChar(sql2.MAX));
    tvp_UploadData.columns.add('Line_Error', sql2.Int);
    tvp_UploadData.columns.add('Error', sql2.Bit);
    tvp_UploadData.columns.add('Description_Error', sql2.NVarChar(sql2.MAX));

    req.body.excelData.forEach((row) => {
      tvp_UploadData.rows.add(
        String(row['Tarjeta'] ?? '').trim(),
        String(row['CIF'] ?? '').trim(),
        String(row['Nombre Titular'] ?? '').trim(),
        String(row['Nombre Fiador'] ?? '').trim(),
        String(row['Nombre Adicional'] ?? '').trim(),
        String(row['Tramite'] ?? '').trim(),
        String(row['Producto'] ?? '').trim(),
        String(row['Trasiego'] ?? '').trim(),
        String(row['Telefono de Oficina'] ?? '').trim(),
        String(row['Telefono Casa'] ?? '').trim(),
        String(row['Celular'] ?? '').trim(),
        String(row['Tel BAC Casa'] ?? '').trim(),
        String(row['Tel BAC Oficina'] ?? '').trim(),
        String(row['Tel BAC '] ?? '').trim(),
        String(row['Tel BAC2'] ?? '').trim(),
        String(row['Tel Siebel Casa'] ?? '').trim(),
        String(row['Tel Celular Siebel'] ?? '').trim(),
        String(row['Tel Siebel'] ?? '').trim(),
        String(row['Direccion Casa'] ?? '').trim(),
        String(row['Direccion Trabajo'] ?? '').trim(),
        String(row['Observaciones'] ?? '').trim(),
        String(row['Comentarios ACtividad de Datos'] ?? '').trim(),
        String(row['Descripción Actividad de Datos'] ?? '').trim(),
        String(row['Comentarios Ruteo y Redestino'] ?? '').trim(),
        String(row['Dirección BAC'] ?? '').trim(),
        String(row['Observación'] ?? '').trim(),
        String(row['Opcional 1'] ?? '').trim(),
        String(row['Opcional 2'] ?? '').trim(),
        String(req.body.user ?? '').trim(),
        String(row['Proveedor'] ?? '').trim(),
        String(row['Zona'] ?? '').trim(),
        String(row['Número de Tarjeta'] ?? '').trim(),
        String(row['Mail'] ?? '').trim(),
        String(row['Opcional 4'] ?? '').trim(),
        String(row['Opcional 5'] ?? '').trim(),
        0,
        0,
        ' '
      );
    });

    if (tvp_UploadData.rows.length > 0) {
      let result = await pool
        .request()
        .input('InfoTemplate', tvp_UploadData)
        .execute('sp_ValidateDataTemplateNew');

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
    req.appInsights?.trackException({ exception: error });
    return res.json({ error: error, resultset: [] });
  }
}
