import { AccountDetailsRequestModelInterface } from './interfaces/account.interface';

export class AccountDetailsRequestModel implements AccountDetailsRequestModelInterface {
    public participantId: number;
    public flexaccountkey: number;
    public accttypecode: string;
    public planyear: number;
    public useridin: string;
}
