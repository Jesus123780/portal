import jsPDF from 'jspdf';
class GeneratePDF {
    
    GeneratePDFReport(data,FileName){
        const pdf = new jsPDF();
        data.forEach((item, _index) => {
            var str  = ''
            
            str = `   Cliente: '${item.owner_name}' \n
                   File: '${item.filename}' \n
                   Formalizador:'${item.officer_name}' \n 
                   Fecha Creacion:'${item.create_date}' \n
                   CIF:'${item.cif}' \n
                   Numero de Tarjeta:'${item.card_number}'`

            pdf.text(str,10,10)   
             const imgData = item.data;
            pdf.addImage(imgData, 'JPEG', 10,  150, 100, 60);
            
            pdf.addPage();
             
         
          });
          pdf.save(FileName);

        }     
};
export default GeneratePDF;