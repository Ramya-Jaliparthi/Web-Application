import { CryptoToken } from './token.model';
import * as CryptoJS from 'crypto-js';

export class EncryptedRequest {
  message = '';
  key1id = '';

  EncryptedRequest() {
  }

  generateEncryptedMessage(requestObj: object, cryptoToken: CryptoToken, isKey2NotReq: boolean) {
    // Step 1
    if (!isKey2NotReq) {
      // console.log('Before adding key2id', requestObj);
      requestObj = { ...requestObj, key2id: cryptoToken.key2id };
    }
    const key = CryptoJS.PBKDF2(cryptoToken.key1phrase, CryptoJS.enc.Hex.parse(cryptoToken.key1salt), {
      keySize: 128 / 32,
      iterations: 10000
    });
    const encryptedMessage = CryptoJS.AES.encrypt(JSON.stringify(requestObj), key, { iv: CryptoJS.enc.Hex.parse(cryptoToken.key1iv) });
    const cipherText = encryptedMessage.ciphertext.toString(CryptoJS.enc.Base64);
    this.message = cipherText;
    this.key1id = cryptoToken.key1id;
  }

  generateDecryptedMessage(msg: string, cryptoToken: CryptoToken): any {

    const key = CryptoJS.PBKDF2(cryptoToken.key2phrase, CryptoJS.enc.Hex.parse(cryptoToken.key2salt), {
      keySize: 128 / 32,
      iterations: 10000
    });
    const encryptedMessage = CryptoJS.AES.decrypt(msg, key, { iv: CryptoJS.enc.Hex.parse(cryptoToken.key2iv) });
    const plaintext = encryptedMessage.toString(CryptoJS.enc.Utf8);
    this.message = JSON.parse(plaintext);
    return this.message;
  }
}
