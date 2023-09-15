"use client";

import axios from "axios";
import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "../[...post]/post.scss";
import dynamic from "next/dynamic";
import CryptoJS from "crypto-js";

const EditorOnline = dynamic(() => import("@/components/EditorOnline"), { ssr: false });

// https://www.slingacademy.com/article/solving-the-window-is-not-defined-error-in-next-js/
// https://www.learnbestcoding.com/post/61/nextjs-referenceerror-window-is-not-defined
console.log(globalThis.window);

export default function Editor() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [codeEditor, setCodeEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [textModel, setTextModel] = useState<monaco.editor.ITextModel | null>(null);
  const [htmlData, setHtmlData] = useState<{ __html: string | TrustedHTML } | undefined>(undefined);
  const [mdData, setMdData] = useState<string>("");

  const md2Html = (text: string) => {
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
    /**
     * 图片处理逻辑
     * 1. 提取 image 标签的原始 src 内容
     * 非oss预览地址，即：互联网地址
     * 2. 读取图片资源，计算图片 SHA1，转为 Blob 格式文件
     * 3. 以 SHA1 命名，上传 Blob 文件
     * 4. 返回 oss 预览图片地址
     */
    console.log(Object.keys(md.renderer.rules));
    md.renderer.rules.image = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      const srcAttr = token.attrGet("src");
      console.log(srcAttr);
      if (srcAttr?.indexOf("oss") === -1) {
        const originImageUrl = new URL("images/banner-12.jpeg", location.origin);
        token.attrSet("temp-id", originImageUrl.href);
        fetch(originImageUrl)
          .then((response) => response.blob())
          .then(async (blob) => {
            // 36EF566E4B14C63BFCAAAE7196D2C15E
            const arraybuffer = await blob.arrayBuffer();
            const wordArray = CryptoJS.lib.WordArray.create(Array.from(new Uint8Array(arraybuffer)));
            const md5Digest = CryptoJS.MD5(wordArray);
            // 0123456789 做 128为md5二进制数组做base64编码 => eB5eJF1ptWaXm4bijSPyxw==
            const ContentMD5 = CryptoJS.enc.Base64.stringify(md5Digest);
            console.log(ContentMD5);
          });
      }
      return self.renderToken(tokens, idx, options);
    };
    return md.render(text);
  };

  const updatePreview = () => {
    setHtmlData({
      __html: md2Html(textModel!.getValue()),
    });
  };

  // 加载 markdown 文章
  useEffect(() => {
    axios.get("/api/post/2012/02/03/abc").then((res) => {
      const { data } = res.data;
      setMdData(data.md);
      setHtmlData({
        __html: md2Html(data.md),
      });
    });
  }, []);

  const mdChange = (value: string) => {
    setHtmlData({
      __html: md2Html(value),
    });
  };

  return (
    <div className="flex absolute w-full h-full">
      <div className="basis-1/2">
        <EditorOnline md={mdData} onChange={mdChange} />
      </div>
      <div id="preview" className="basis-1/2 pt-10 px-10">
        <div dangerouslySetInnerHTML={htmlData}></div>
      </div>
    </div>
  );
}
