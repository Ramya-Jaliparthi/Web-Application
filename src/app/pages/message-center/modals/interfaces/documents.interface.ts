import { CommonDocumentEntityInterface } from './message-center.interface';

// export interface DocumentsComponentResponseModelInterface {
//     pageTitle: string;
//     folderSet: FolderSetInterface;
//     fileSet: FileSetInterface;
// }

export interface FolderSetInterface {
    folders: FolderItemModelInterface[];
    totalRows: number;
}

export interface FileSetInterface {
    files: FileItemModelInterface[];
    totalRows: number;
}

export interface FolderItemModelInterface extends CommonDocumentEntityInterface {
    icon: string;
    unReadDocs: number;
    containsFiles: boolean;
    isUploadsFolder: boolean;
}

export interface FileItemModelInterface extends CommonDocumentEntityInterface {
    isDeleted: boolean;
    messageRead: boolean;
}

// export interface DocumentsComponentRequestModelInteface {
//     folderId: string;
// }

// export interface DocumentsListViewComponentRequestModelInterface {
//     folderId: string;
// }
