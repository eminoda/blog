import { NextResponse } from 'next/server'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
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
  const md = MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) { }
      }

      return ''; // use external default escaping
    }
  })
  const mdText = fs.readFileSync('demo.md').toString()
  const html = md.render(mdText)
  return NextResponse.json({ code: 0, data: { html, md: mdText, permalink: [yyyy, mm, dd, title].join('/') } })
}
