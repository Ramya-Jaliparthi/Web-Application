import {
    UploadsResponseDataModelInterface,
    UploadDataItemInterface,
    UploadedDocInfoRequestModelInterface
} from './interfaces/uploads.interface';
import { CommonDocumentEntity } from './message-center.modal';

export class UploadsResponseDataModel implements UploadsResponseDataModelInterface {
    totalRows: number;
    uploadedData: UploadDataItem[];
}

export class UploadDataItem extends CommonDocumentEntity implements UploadDataItemInterface {
    dateTimeStamp: string;
    isDeleted: boolean;
    dayStamp: string;
}

export class UploadedDocInfoRequestModel implements UploadedDocInfoRequestModelInterface {
    fileId: string;
}



