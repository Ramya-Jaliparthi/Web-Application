import { FadMedicalIndexRequestModalInterface } from './interfaces/fad-medical-index.interface';

export class FadMedicalIndexRequestModal implements FadMedicalIndexRequestModalInterface {
    public type: string;

    public setType(type: string): FadMedicalIndexRequestModal {
        this.type = type;
        return this;
    }
}
