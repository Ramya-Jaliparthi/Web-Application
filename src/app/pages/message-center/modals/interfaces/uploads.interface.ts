import { CommonDocumentEntityInterface } from './message-center.interface';


export interface UploadsResponseDataModelInterface {
    totalRows: number;
    uploadedData: UploadDataItemInterface[];
}


export interface UploadDataItemInterface extends CommonDocumentEntityInterface {
    dayStamp: string; // Wednesday
}

export interface UploadedDocInfoRequestModelInterface {
    fileId: string;
}



