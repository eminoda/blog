import { NextResponse } from "next/server";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import fs from "fs";
import path from "path";
import OssClient from "@/libs/oss";

/**
 * 根据文章路径获取文章详情
 * @param request
 * @param params.permalink [draft|post]/YYYY/MM/DD/Title
 * @returns
 */
export async function GET(request: Request, { params }: { params: { permalink: string[] } }) {
  const client = new OssClient();
  const ossName = params.permalink.join("/") + "/index.md";

  try {
    const isExist = await client.isExist(ossName);
    if (!isExist) {
      throw new Error(`文件路径：[${ossName}] 不存在`);
    }
    const { content } = await client.get(ossName);
    const mdData = content.toString();

    try {
      const md = MarkdownIt({
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(str, { language: lang }).value;
            } catch (__) {}
          }

          return ""; // use external default escaping
        },
      });
      // const mdText = fs.readFileSync("demo.md").toString();
      return NextResponse.json({ code: 0, data: { htmlData: md.render(mdData), mdData: mdData } });
    } catch (err: any) {
      throw new Error("MarkdownIt 解析失败：" + err.message);
    }
  } catch (err: any) {
    return NextResponse.json({ code: -1, data: err.message });
  }
}
