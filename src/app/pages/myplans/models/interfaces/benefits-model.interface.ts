
export interface WordSearchRequestInterface {
    useridin: string;
    planName: string;
    coveragePackageCode: string;
    searchWord: string;
}

export interface WordSearchResponseInterface {
    wordSearchReply: WordSearchItemInterface[];
}

export interface WordSearchItemInterface {
    benefitCategoryName: string;
    relationshipCode: string;
}

export enum NetworkType {
    inNetwork= 'inNetwork',
    outOfNetwork = 'outOfNetwork',
    inNetworkAndOutOfNetworkCombined = 'inNetworkAndOutOfNetworkCombined',
    noNetwork = 'noNetwork'
}
