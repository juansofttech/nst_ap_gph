import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class CryptoService {
    private readonly algorithm = 'aes-256-ctr';
    private readonly salt = 'salt'; // Use a secure salt in production

    async encrypt(text: string, password: string): Promise<string> {
        const iv = randomBytes(16);
        const key = (await promisify(scrypt)(password, this.salt, 32)) as Buffer;
        const cipher = createCipheriv(this.algorithm, key, iv);
        const encryptedText = Buffer.concat([
            cipher.update(text),
            cipher.final(),
        ]);
        // Return iv and encrypted text as base64
        return `${iv.toString('hex')}:${encryptedText.toString('hex')}`;
    }

    async decrypt(encryptedText: string, password: string): Promise<string> {
        const [ivHex, contentHex] = encryptedText.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedBuffer = Buffer.from(contentHex, 'hex');
        const key = (await promisify(scrypt)(password, this.salt, 32)) as Buffer;
        const decipher = createDecipheriv(this.algorithm, key, iv);
        const decryptedText = Buffer.concat([
            decipher.update(encryptedBuffer),
            decipher.final(),
        ]);
        return decryptedText.toString();
    }

    async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}