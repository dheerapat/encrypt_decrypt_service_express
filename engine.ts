import * as openpgp from 'openpgp';
import * as fs from 'fs/promises';

async function importKeyFromFile(filePath: string): Promise<string> {
    try {
        const keyData = await fs.readFile(filePath, 'utf8');
        if (!openpgp.readKey({ armoredKey: keyData })) {
            throw new Error('Invalid PGP key data');
        }
        return keyData;
    } catch (error) {
        console.error('Error importing key from file:', error);
        throw error;
    }
}

export class EncryptionEngine {
    private readonly pubKey: string;

    constructor(_pubKey: string) {
        this.pubKey = _pubKey;
    }

    static async createEncryptionEngine(): Promise<EncryptionEngine> {
        const pubKey = await importKeyFromFile("gac_public.asc");
        const instance = new EncryptionEngine(pubKey);
        return instance;
    }

    private async encodeStringToUtf8Bytes(message: string) {
        const encoder = new TextEncoder();
        return encoder.encode(message);
    }

    async encryptObjectWithPGP(obj: string) {
        try {
            const jsonString = obj;
            const utf8Bytes = await this.encodeStringToUtf8Bytes(jsonString);
            const publicKey = await openpgp.readKey({ armoredKey: this.pubKey });

            const encryptedData = await openpgp.encrypt({
                message: await openpgp.createMessage({ binary: utf8Bytes }),
                encryptionKeys: publicKey
            });

            return encryptedData;
        } catch (error) {
            console.error('Error encrypting object with PGP:', error);
            throw error;
        }
    }
}

export class DecryptionEngine {
    private readonly privKey: string;

    constructor(_privKey: string) {
        this.privKey = _privKey;
    }

    static async createDecryptionEngine(): Promise<DecryptionEngine> {
        const priveKey = await importKeyFromFile("dheeto_s9_private.asc");
        const instance = new DecryptionEngine(priveKey);
        return instance;
    }

    async decryptMessage(encryptedMessage: string): Promise<string> {
        try {
            const msg = `-----BEGIN PGP MESSAGE-----\n\n${encryptedMessage}\n-----END PGP MESSAGE-----`

            // TODO : need secret management
            const passphrase = '"#P@ssw0rd#"'

            const privateKey = await openpgp.decryptKey({
                privateKey: await openpgp.readPrivateKey({ armoredKey: this.privKey }),
                passphrase
            });

            const message = await openpgp.readMessage({
                armoredMessage: msg
            });

            const { data: decrypted } = await openpgp.decrypt({
                message,
                config: {
                    allowInsecureDecryptionWithSigningKeys: true,
                },
                decryptionKeys: privateKey
            });

            return decrypted;
        } catch (error) {
            console.error('Error decrypting object with PGP:', error);
            throw error;
        }
    }
}