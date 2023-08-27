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
    const exist = await client.isExist(fileName)
    if (!exist) {
      throw new Error(`文件 [${fileName}] 不存在`)
    }
    // https://github.com/vercel/next.js/discussions/48164

    const result = await Promise.all(formData.getAll('file').filter((file): file is File => {
      return typeof file == 'object'
    }).map((file) => {
      const mediaPath = fileName.split('/')
      mediaPath.pop()
      const name = [...mediaPath, file.name].join('/')
      return new Promise(async (resolve, reject) => {
        try {
          const buf = await file.arrayBuffer()
          const { name: ossName, url } = await client.put(name, Buffer.from(buf))
          resolve(ossName)
        } catch (error: any) {
          reject(new Error('文件上传失败' + error.message))
        }
      })
    }))

    return NextResponse.json({ code: 0, data: result });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ code: -1, msg: error.message });
  }
}
