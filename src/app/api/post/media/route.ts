import { NextResponse } from "next/server";

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
  const r = await request.json();
  console.log(r);
  return NextResponse.json({ code: 0, data: { name: "abc" } });
}
