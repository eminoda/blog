
import OSS from 'ali-oss'

class OssClient {
    // client: OSS
    constructor() {
        return new OSS({
            region: process.env.alioss!.region,
            accessKeyId: process.env.alioss!.accessKeyId,
            accessKeySecret: process.env.alioss!.accessKeySecret,
            bucket: process.env.alioss!.bucket,
        })
    }
}
export default OssClient