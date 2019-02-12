export interface MessageDetailRequestDataModelInterface {
    useridin: string;
    messageId: string;
    memberId: string;
}

export interface MessageDetailResponseDataModelInterface {
    messageDetailResponse: MessageDetailModelInterface;
    result?: number;
    displaymessage?: string;
}

export interface MessageDetailModelInterface {
    title: string;
    body: string;
    messageId: string;
    messageUpdatedDateTime: string;
}

export interface HeaderSectionModelInterface {
    title: string;
    ctaButtonText?: string;
    sectionContents: SectionContentModelInterface[];
}

export interface SectionContentModelInterface {
    content: string;
}
