import { NextResponse } from 'next/server'
import MarkdownIt from 'markdown-it'
import fs from 'fs'
import path from 'path'

/**
 * 根据文章路径获取文章详情
 * @param request
 * @param params.permalink YYYY/MM/DD/Title
 * @returns
 */
export async function GET(request: Request, { params }: { params: { permalink: string[] } }) {
  const [yyyy, mm, dd, title] = params.permalink
  const md = MarkdownIt()
  const html = md.render(fs.readFileSync('public/demo.md').toString())
  return NextResponse.json({ code: 0, data: { html, permalink: [yyyy, mm, dd, title].join('/') } })
}
