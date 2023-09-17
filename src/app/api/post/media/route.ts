import { NextResponse } from "next/server";
import OssClient from "@/libs/oss";
import fs from 'fs'

/**
 * 上传图片
 *
 * 解析上传文件，上传到 OSS，返回 CDN 连接
 * 
 * @param request Request
 * @param {request.form().name} 资源名称
 * @param {request.form().datestamp} 时间戳 YYYY/MM/DD
 *
 * @returns
 */
export async function POST(request: Request) {
  try {
    // console.log(request.form)
    const formData = await request.formData();
    const fileName = formData.get('fileName') as string
    if (!fileName) {
      throw new Error('文件路径不能为空')
    }

    const client = new OssClient();
    // 判断目录文件是否存在
    // const exist = await client.isExist(fileName)
    // if (!exist) {
    //   throw new Error(`文件 [${fileName}] 不存在`)
    // }
    // https://github.com/vercel/next.js/discussions/48164

    const file = formData.get('file') as File
    // const result = await Promise.all(formData.get('file').filter((file): file is File => {
    //   return typeof file == 'object'
    // }).map((file) => {
    if (file) {
      console.log(file)
      const mediaPath = fileName.split('/')
      mediaPath.pop()
      const name = [...mediaPath, file.name].join('/')

      try {
        const buf = await file.arrayBuffer()
        const { name: ossName, url } = await client.put(name, Buffer.from(buf), {
          headers: {
            // https://help.aliyun.com/zh/oss/user-guide/manage-object-metadata-10#concept-lkf-swy-5db
            'Content-Type': file.type,
            'Content-Disposition': 'inline'
          }
        })
        // https://help.aliyun.com/zh/oss/user-guide/add-watermarks
        // https://www.alibabacloud.com/help/en/oss/developer-reference/img-5
        const priviewUrl = await client.signatureUrl(ossName, { process: 'image/watermark,text_5YmN56uv6Zuo54i4,resize,w_300,h_300,color_FFFFFF,size_50,shadow_50,g_se,x_40,y_40' })
        return NextResponse.json({ code: 0, data: priviewUrl });
      } catch (error: any) {
        throw new Error('文件上传失败' + error.message)
      }
    }
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ code: -1, msg: error.message });
  }
}
