import {
    FileItemModelInterface, FileSetInterface,
    FolderItemModelInterface, FolderSetInterface
} from './interfaces/documents.interface';

// export class DocumentsComponentResponseModel implements DocumentsComponentResponseModelInterface {
//     pageTitle: string;
//     folderSet: FolderSet;
//     fileSet: FileSet;
// }

export class FolderSet implements FolderSetInterface {
    folders: FolderItemModelInterface[];
    totalRows: number;
}

export class FileSet implements FileSetInterface {
    files: FileItemModelInterface[];
    totalRows: number;
}

// export class FolderItemModel extends CommonDocumentEntity implements FolderItemModelInterface {
//     isDeleted: boolean;
//     icon: string;
//     unReadDocs: number;
//     containsFiles: boolean;
//     isUploadsFolder: boolean;
// }

// export class FileItemModel extends CommonDocumentEntity implements FileItemModelInterface {
//     isDeleted: boolean;
//     messageRead: boolean;
// }

// export class DocumentsComponentRequestModel implements DocumentsComponentRequestModelInteface {
//     folderId: string;
// }

// export class DocumentsListViewComponentRequestModel implements DocumentsListViewComponentRequestModelInterface {
//     folderId: string;
// }
