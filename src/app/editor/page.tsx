"use client";

import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import CryptoJS from "crypto-js";

import { useEffect, useRef, useState, createRef } from "react";
import HtmlRenderer from "@/components/HtmlRenderer";
import dynamic from "next/dynamic";

// monaco-editor 有客户端 document api，无法在 ssr 预渲染
// https://www.slingacademy.com/article/solving-the-window-is-not-defined-error-in-next-js/
const MonacoEditor = dynamic(() => import("@/components/MonacoEditor"), { ssr: false });

enum ParseStatus {
  INIT = 0,
  PARSING = 1,
  DONE = 2,
  ERROR = -1,
}
interface ImageParse {
  id: string;
  src: string;
  status: ParseStatus;
  contentMD5?: string;
  blob: Blob;
  priviewUrl?: string;
}

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

export default function Editor() {
  const HtmlRendererRef = createRef<HTMLDivElement>();
  const [htmlData, setHtmlData] = useState<string>("");
  const [imageQueue, setImageQueue] = useState<ImageParse[]>([]);

  // 生成文件 md5
  const getContentMd5 = async (blob: Blob) => {
    const arraybuffer = await blob.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(Array.from(new Uint8Array(arraybuffer)));
    const md5Digest = CryptoJS.MD5(wordArray);
    // 0123456789 做 128为md5二进制数组做base64编码 => eB5eJF1ptWaXm4bijSPyxw==
    const contentMD5 = CryptoJS.enc.Base64.stringify(md5Digest);
    return contentMD5;
  };

  const getBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  };

  const buildImageParseItem = async (srcAttr: string): Promise<ImageParse> => {
    const imageURL = new URL(srcAttr!, location.origin);
    const id = CryptoJS.MD5(imageURL.href).toString();
    const blob = await getBlob(imageURL.href);
    const contentMd5 = await getContentMd5(blob);
    const current = {
      id,
      src: imageURL.href,
      contentMd5,
      blob,
      status: ParseStatus.INIT,
      priviewUrl: "",
    };
    setImageQueue((oldVal) => {
      oldVal.push(current);
      return oldVal;
    });
    return current;
  };

  const convertPreviewImageUrl = () => {};

  const markdown2Html = (mdData: string) => {
    md.renderer.rules.image = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      const srcAttr = token.attrGet("src");

      const current = buildImageParseItem(srcAttr!);

      token.attrSet("id", current.id);

      return self.renderToken(tokens, idx, options);
    };
    return md.render(mdData);
  };

  const onEditorChange = (mdData: string) => {
    const _htmlData = markdown2Html(mdData);
    setHtmlData(_htmlData);
  };

  return (
    <div className="flex absolute w-full h-full">
      <div className="basis-1/2">
        <MonacoEditor onChange={onEditorChange} postUrl="/2012/02/03/abc" />
      </div>
      <div className="basis-1/2">
        <HtmlRenderer htmlData={htmlData} />
      </div>
      {imageQueue.map((item) => {
        return JSON.stringify(item);
      })}
    </div>
  );
}
