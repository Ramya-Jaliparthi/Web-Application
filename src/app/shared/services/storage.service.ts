
import { AuthService } from '../services/auth.service';
import { EncryptedRequest } from '../models/encryptedRequest.model';
import { CryptoToken } from '../models/token.model';
import { Injectable } from '../../../../node_modules/@angular/core';

@Injectable()
export class StorageService {
    private _data: Object;
    sessionCryptotoken: CryptoToken;

    constructor(private authservice: AuthService) {
        this.sessionCryptotoken = new CryptoToken();
        this.sessionCryptotoken.result = 'test';
        this.sessionCryptotoken.key1id = 'test';
        this.sessionCryptotoken.key1iv = 'test';
        this.sessionCryptotoken.key1salt = 'test';
        this.sessionCryptotoken.key1phrase = 'test';
        this.sessionCryptotoken.key2id = 'test';
        this.sessionCryptotoken.key2iv = 'test';
        this.sessionCryptotoken.key2salt = 'test';
        this.sessionCryptotoken.key2phrase = 'test';
    }

    getvalue(key, encryptedData) {
        this.initData(encryptedData);
        return this._data[key];
    }

    intStorage() {
        const initJson = {a: '1'};
        return  this.encrypt(initJson);
    }

    private initData(encryptedData) {
        this._data = this.decrypt(encryptedData);
    }

    setvalue(key, value, encryptedData) {
        this.initData(encryptedData);
        this._data[key] = value;
        return  this.encrypt(JSON.stringify(this._data));
    }

    private encrypt(src): string {
        const cryptoUtility = new EncryptedRequest();
        cryptoUtility.generateEncryptedMessage(src, this.sessionCryptotoken, false);
        return cryptoUtility.message;
    }

    private decrypt(src): string {
        const cryptoUtility = new EncryptedRequest();
        cryptoUtility.generateDecryptedMessage(src, this.sessionCryptotoken);
        return cryptoUtility.message;
    }
}
