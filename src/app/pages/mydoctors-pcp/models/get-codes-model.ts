import { GetCodesRequestModelInterface, GetCodeResponseModelInterface } from './interfaces/get-code-model-interface';

export class GetCodesRequestModel implements GetCodesRequestModelInterface {
    useridin: string; // pattern: ^[\w-]+@([\w-]+\.)+[\w-]+$|^\d{10}$ example: foo@gmail.com email id or phone number or alpha-numeric id
    name: string; // example: PCPChangeMSS1 Codes Table Name
    sortOrder: string; // example: T Sort Order
}

export class GetCodeResponseModel implements GetCodeResponseModelInterface {
    codes: GetCodesValue;
}
export class GetCodesValue {
    order: number; //     example: 0     Order
    code: string; //     example: K     Code
    text: string; //     example: Language/Facility Barriers     Text
}
