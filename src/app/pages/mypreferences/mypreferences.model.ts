
export class MessageCategoryItem {
    commChannel: CommChannel;
    checked: boolean;
    disabled: boolean;

    constructor(commch, chked, disable) {
         this.commChannel = commch;
         this.checked = chked;
         this.disabled = disable;
    }
  }

export class MessageCategory {
    rowName: string;
    row: MessageCategoryItem[];
    rowDescription: string;

    constructor(name, items, desc) {
        this.rowName = name;
        this.row = items;
        this.rowDescription = desc;
   }
}

export enum HealthPromosCommChannel {
    All = 1,
    SMS = 2,
    Email = 3
}
export class CommChannel {
    name: string;
    disclaimer: string;
    isVerified: boolean;
    onFile: boolean;
    verifyAccessCodeLabel: string;
    constructor(name, disclaimer, verifyAccessCodeLabel) {
        this.name = name;
        this.disclaimer = disclaimer;
        this.verifyAccessCodeLabel = verifyAccessCodeLabel;
   }
}

export class MyPreferencesModel {
    constructor() {}
}

