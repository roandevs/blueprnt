import crypto from 'crypto';

const algorithm = 'aes-256-ctr';

module.exports.encrypt = (buffer, password) => {
    const key = crypto.createHash('sha256').update(password).digest('base64').substr(0, 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
    return result;
}

module.exports.decrypt = (buffer, password) => {
    const key = crypto.createHash('sha256').update(password).digest('base64').substr(0, 32);
    const iv = buffer.slice(0, 16);
    buffer = buffer.slice(16);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const result = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return result;
}