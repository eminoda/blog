
import OSS from 'ali-oss'

class OssClient {
    client: OSS
    constructor() {
        this.client = new OSS({
            region: process.env.alioss!.region,
            accessKeyId: process.env.alioss!.accessKeyId,
            accessKeySecret: process.env.alioss!.accessKeySecret,
            bucket: process.env.alioss!.bucket,
        })
    }
    async isExist(name: string, options?: OSS.HeadObjectOptions) {
        try {
            await this.client.head(name, options)
            return true
        } catch (error: any) {
            if (error.code == 'NoSuchKey') {
                return false
            } else {
                throw error
            }
        }
    }
    async put(name: string, file: any, options?: OSS.PutObjectOptions) {
        try {
            return await this.client.put(name, file, options)
        } catch (error: any) {
            throw error
        }
    }
    async signatureUrl(name: string, options?: OSS.SignatureUrlOptions) {
        try {
            return await this.client.signatureUrl(name, options)
        } catch (error: any) {
            throw error
        }
    }
}
export default OssClient