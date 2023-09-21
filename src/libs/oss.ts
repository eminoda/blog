import OSS from "ali-oss";

class OssClient {
  client: OSS;
  constructor() {
    this.client = new OSS({
      region: process.env.alioss!.region,
      accessKeyId: process.env.alioss!.accessKeyId,
      accessKeySecret: process.env.alioss!.accessKeySecret,
      bucket: process.env.alioss!.bucket,
    });
  }
  async isExist(name: string, options?: OSS.HeadObjectOptions, contentMD5?: string) {
    try {
      const { meta, res } = await this.client.head(name, options);
      if (contentMD5) {
        // Property 'content-md5' does not exist on type '{}'.ts(7053)
        const headers = res.headers as { [key: string]: string };
        console.log(name, headers["content-md5"]);
        return headers["content-md5"] === contentMD5;
      }
      return true;
    } catch (error: any) {
      if (error.code == "NoSuchKey") {
        return false;
      } else {
        throw error;
      }
    }
  }
  async get(name: string, file?: any, options?: OSS.PutObjectOptions) {
    try {
      return await this.client.get(name, file, options);
    } catch (error: any) {
      throw error;
    }
  }
  async put(name: string, file: any, options?: OSS.PutObjectOptions) {
    try {
      return await this.client.put(name, file, options);
    } catch (error: any) {
      throw error;
    }
  }
  async signatureUrl(name: string, options?: OSS.SignatureUrlOptions) {
    try {
      return await this.client.signatureUrl(name, options);
    } catch (error: any) {
      throw error;
    }
  }
}
export default OssClient;
