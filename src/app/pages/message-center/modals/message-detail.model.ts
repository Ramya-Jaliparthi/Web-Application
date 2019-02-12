import {
    MessageDetailResponseDataModelInterface,
    HeaderSectionModelInterface,
    SectionContentModelInterface,
    MessageDetailRequestDataModelInterface,
    MessageDetailModelInterface
} from './interfaces/message-detail.interface';

export class MessageDetailRequestDataModel implements MessageDetailRequestDataModelInterface {
    useridin: string;
    messageId: string;
    memberId: string;
}

export class MessageDetailResponseDataModel implements MessageDetailResponseDataModelInterface {
    messageDetailResponse: MessageDetailModel;
    result?: number;
    displaymessage?: string;
}
export class MessageDetailModel implements MessageDetailModelInterface {
    title: string;
    body: string;
    messageId: string;
    messageUpdatedDateTime: string;
}

export class HeaderSectionModel implements HeaderSectionModelInterface {
    title: string;
    ctaButtonText?: string;
    sectionContents: SectionContentModel[];
}

export class SectionContentModel implements SectionContentModelInterface {
    content: string;
}
