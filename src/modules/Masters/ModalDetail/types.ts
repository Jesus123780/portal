import { ChangeEvent } from 'react';
import { DropResult } from 'react-beautiful-dnd';

export interface IDataDocument {
  value: string;
  text: string;
  id: string;
}
export interface ModalDetailProps {
    data: IDataDocument[];
    distinctDocuments: IDataDocument[];
    isLoadingDataDocument: boolean;
    loadingSave?: boolean;
    open?: boolean;
    selectDocument: IDataDocument;
    title?: string;
    valueSearch?: string;
    handleClose?: () => void;
    handleSaveDocuments: () => void;
    handleSelectDocument: (document: IDataDocument) => void;
    onChangeSearch?: (event: ChangeEvent<HTMLInputElement>) => void;
    onDragEnd: (result: DropResult) => void;
    sendAllDocumentsDiscardToSendDocument: () => void;
    sendAllDocumentsToDiscardDocument: () => void;
    sendOneDocumentToDiscardDocument: () => void;
    sendOneDocumentToSendDocumentDiscard: () => void;
}
