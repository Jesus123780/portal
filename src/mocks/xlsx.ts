import * as Excel from 'xlsx';
import { saveAs } from 'file-saver';

class GenerateReport {

    GenExcelReport = (data, type) => {
        const ws = Excel.utils.json_to_sheet(data);
        const wb = Excel.utils.book_new();
        Excel.utils.book_append_sheet(wb, ws, 'Hoja1');
        const excelBuffer = Excel.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, this.GenExcelReportFileName(type));
    }

    GenExcelReportFileName = (type) => {
        const fileNames = {
            101: 'DetailProviderReport.xlsx',
            20: 'SummaryReport.xlsx',
            1: 'ReporteAssignment.xlsx',
            2: 'ReporteDeliveryEffectiveness.xlsx',
            3: 'ReporteDeliveryPerformed.xlsx',
            4: 'ReporteReasons.xlsx',
            5: 'ReporteReturns.xlsx',
            8: 'GeoUbicationReport.xlsx',
            9: 'LogBinnacleReport.xlsx',
            10: 'ActivatorReport.xlsx',
            11: 'SqlReport.xlsx',
            12: 'SurveysReport.xlsx',
            13: 'DevolucionMotivoReport.xlsx',
            14: 'ClientInfoReport.xlsx',
        };

        return fileNames[type] || null;
    }
}

export default GenerateReport;
