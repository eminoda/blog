import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ code: 0, data: { name: "abc" } });
}

/**
 * 新增文章（草稿）
 *
 * @param request Request
 * @param {request.json().md} 文章内容
 * @param {request.json().title} 文章标题
 * @param {request.json().datestamp} 时间戳 YYYY/MM/DD
 *
 * @returns
 */
export async function POST(request: Request) {
  const r = await request.json();
  console.log(r);
  return NextResponse.json({ code: 0, data: { name: "abc" } });
}
