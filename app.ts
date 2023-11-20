import express, { Express, Request, Response } from "express";
import { DecryptionEngine, EncryptionEngine } from "./engine";

const app: Express = express();
const port = 12080;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.json({ app: 'S9 encrypted/decrypted services' });
})

app.post('/encrypt', async (req: Request, res: Response) => {
    try {
        const encEngine = await EncryptionEngine.createEncryptionEngine();
        const jsonString: string = req.body.jsonString;
        let encMsg = await encEngine.encryptObjectWithPGP(jsonString);
        res.json({
            encrypted_data: encMsg
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
})

app.post('/decrypt', async (req: Request, res: Response) => {
    try {
        const encEngine = await DecryptionEngine.createDecryptionEngine()
        const encryptedData: string = req.body.encryptedData;
        let decMsg = await encEngine.decryptMessage(encryptedData);
        res.json({
            decrypted_data: decMsg
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
})

app.listen(port, () => {
    console.log(`🚀 app listening on port ${port}`);
})