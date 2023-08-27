import { NextResponse } from "next/server";
import moment from 'moment'
import OssClient from "@/libs/oss";

export async function GET(request: Request) {
  return NextResponse.json({ code: 0, data: { name: "abc" } });
}

/**
 * 新增文章（草稿）
 *
 * @param request Request
 * @param {request.json().md} 文章内容
 * @param {request.json().title} 文章标题
 * @param {request.json().date} 时间戳 YYYY/MM/DD
 *
 * @returns
 */
export async function POST(request: Request) {
  try {
    const currentDate = moment().format('YYYY/MM/DD')
    const { md, title, date = currentDate, isPublish } = await request.json();
    if (!title) {
      throw new Error('文章标题不存在')
    }
    if (!md) {
      throw new Error('文章内容不存在')
    }
    const filename = [isPublish ? 'post' : 'draft', date, title, 'index.md'].join('/')

    const client = new OssClient();

    const { name, url } = await client.put(filename, Buffer.from(md))
    return NextResponse.json({ code: 0, data: { md, title, date, name } });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ code: -1, msg: error.message });
  }
}
