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

enum ParseStatus {
  ORIGIN = 0,
  PARSING = 1,
  DONE = 2,
}
interface ImageParse {
  originId: string;
  status: ParseStatus;
  contentMD5?: string;
  blobUrl?: string;
  priviewUrl?: string;
  originUrl?: string;
}

export default function Editor() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [codeEditor, setCodeEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [textModel, setTextModel] = useState<monaco.editor.ITextModel | null>(null);
  const [htmlData, setHtmlData] = useState<{ __html: string | TrustedHTML } | undefined>(undefined);
  const [mdData, setMdData] = useState<string>("");
  const [imageList, setImageList] = useState<ImageParse[]>([]);

  const getContentMd5 = async (blob: Blob) => {
    const arraybuffer = await blob.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(Array.from(new Uint8Array(arraybuffer)));
    const md5Digest = CryptoJS.MD5(wordArray);
    // 0123456789 做 128为md5二进制数组做base64编码 => eB5eJF1ptWaXm4bijSPyxw==
    const contentMD5 = CryptoJS.enc.Base64.stringify(md5Digest);
    return contentMD5;
  };

  const uploadBlobToOss = async (originId: string, blob: Blob, contentMD5: string): Promise<string> => {
    const formData = new FormData();
    console.log(contentMD5);
    formData.append("file", blob, originId);
    formData.append("contentMD5", contentMD5);
    formData.append("fileName", "/draft/2023/08/24/test/" + originId);
    const response = await fetch("/api/post/media", {
      method: "post",
      body: formData,
    });
    const { data } = await response.json();
    return data;
    // const priviewUrl = "https://pic3.zhimg.com/v2-d73df22d306f557a0d3d313d78f50f84_1440w.jpg?source=172ae18b";
    // return priviewUrl;
  };
  const uploadImage = async (originId: string) => {
    // TODO：上传文件到oss
    const current = imageList.find((item) => item.originId === originId);
    if (current && current.originUrl) {
      // img 图片转 blob
      const response = await fetch(current.originUrl);
      const blob = await response.blob();
      current.blobUrl = URL.createObjectURL(blob);
      current.contentMD5 = await getContentMd5(blob);
      current.status = ParseStatus.PARSING;

      setImageList(
        imageList.map((item) => {
          return item.originId === originId ? current : item;
        })
      );

      // https://react.dev/learn/updating-arrays-in-state
      setTimeout(async () => {
        const priviewUrl = await uploadBlobToOss(originId, blob, current.contentMD5!);
        current.priviewUrl = priviewUrl;
        current.status = ParseStatus.DONE;
        document.querySelector(`img[origin-id='${originId}']`)?.setAttribute("src", priviewUrl);
        setImageList(
          imageList.map((item) => {
            return item.originId === originId ? current : item;
          })
        );
      }, 200);
    }
  };
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
    md.renderer.rules.image = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      const srcAttr = token.attrGet("src");
      const originImageUrl = new URL("images/banner-12.jpeg", location.origin);
      const originId = CryptoJS.MD5(originImageUrl.href).toString();

      // 非 oss 图片
      if (srcAttr?.indexOf("oss") === -1) {
        // 未解析过图片
        if (!imageList.find((item) => item.originId === originId)) {
          token.attrSet("origin-id", originId);
          imageList.push({ originId, status: ParseStatus.ORIGIN, originUrl: originImageUrl.href });
          setImageList(imageList);
          setTimeout(() => {
            uploadImage(originId);
          }, 1000);
        }
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
        {imageList.map((item, index) => {
          return <div key={index}>{item.status}</div>;
        })}
        <EditorOnline md={mdData} onChange={mdChange} />
      </div>
      <div id="preview" className="basis-1/2 pt-10 px-10">
        <div dangerouslySetInnerHTML={htmlData}></div>
      </div>
    </div>
  );
}
