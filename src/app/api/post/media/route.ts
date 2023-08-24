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
    const filename = formData.get('filename') as string
    if (!filename) {
      throw new Error('文件名不能为空')
    }

    const client = new OssClient();
    // 判断目录文件是否存在
    const exist = await client.isExist(filename)
    if (!exist) {
      throw new Error(`文件 [${filename}] 不存在`)
    }
    const demo = formData.getAll('file') as File[]
    console.log(filename, demo[0]);
    // fs.writeFileSync('./tset.png', demo[0])
    return NextResponse.json({ code: 0, data: { filename } });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ code: -1, msg: error.message });
  }
}
