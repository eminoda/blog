"use client";

import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import CryptoJS from "crypto-js";

import { useEffect, useRef, useState, createRef } from "react";
import HtmlRenderer from "@/components/HtmlRenderer";
import PostButton from "@/components/PostButton";
import dynamic from "next/dynamic";

import { ParseStatus } from "@/libs/enums";

// monaco-editor 有客户端 document api，无法在 ssr 预渲染
// https://www.slingacademy.com/article/solving-the-window-is-not-defined-error-in-next-js/
const MonacoEditor = dynamic(() => import("@/components/MonacoEditor"), { ssr: false });

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
  const [mdData, setMdData] = useState<string>("");
  const [imageQueue, setImageQueue] = useState<ImageParse[]>([]);

  // 生成文件 md5
  const _getContentMd5 = async (blob: Blob) => {
    const arraybuffer = await blob.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(Array.from(new Uint8Array(arraybuffer)));
    const md5Digest = CryptoJS.MD5(wordArray);
    // 0123456789 做 128为md5二进制数组做base64编码 => eB5eJF1ptWaXm4bijSPyxw==
    return CryptoJS.enc.Base64.stringify(md5Digest);
  };

  const getBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    return response.blob();
  };

  const buildImageParseItem = async (id: string, imageURL: URL) => {
    if (!imageQueue.find((item) => item.id === id)) {
      // 获取 blob
      const imageResponse = await fetch(imageURL.href);
      const blob = await imageResponse.blob();
      const contentMd5 = await _getContentMd5(blob);
      const current = {
        id,
        src: imageURL.href,
        contentMd5,
        blob,
        status: ParseStatus.INIT,
        priviewUrl: "",
      };

      // https://react.dev/learn/updating-arrays-in-state
      imageQueue.push(current);
    }
  };

  const convertPreviewImageUrl = () => {};

  const markdown2Html = (mdData: string) => {
    md.renderer.rules.image = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      const srcAttr = token.attrGet("src");

      if (srcAttr) {
        // 计算图片唯一标识
        const imageURL = new URL(srcAttr, location.origin);
        const id = CryptoJS.MD5(imageURL.href).toString();
        // 构建图片预览队列
        buildImageParseItem(id, imageURL);

        token.attrSet("id", id);
      }

      return self.renderToken(tokens, idx, options);
    };
    return md.render(mdData);
  };

  const onEditorChange = async (mdData: string) => {
    setMdData(mdData);
    const _htmlData = markdown2Html(mdData);
    setHtmlData(_htmlData);
  };

  // https://react.dev/learn/updating-arrays-in-state
  const uploadBlobToOss = async (id: string, draftDirtory: string): Promise<ImageParse> => {
    const current = imageQueue.find((item) => item.id === id);
    if (current && current.status !== ParseStatus.DONE) {
      const formData = new FormData();
      formData.append("file", current.blob!, id);
      formData.append("contentMD5", current.contentMD5!);
      formData.append("fileName", draftDirtory + id);
      const response = await fetch("/api/post/media", {
        method: "post",
        body: formData,
      });
      const { data: priviewUrl } = await response.json();
      current.priviewUrl = priviewUrl;
      current.status = ParseStatus.DONE;
      document.querySelector(`img[id='${id}']`)?.setAttribute("src", current.priviewUrl!);

      // const priviewUrl = "https://pic3.zhimg.com/v2-d73df22d306f557a0d3d313d78f50f84_1440w.jpg?source=172ae18b";
      // return priviewUrl;

      return current;
    } else {
      throw new Error("图片未解析完毕");
    }
  };

  const buildPreviewImage = async () => {
    debugger
    await Promise.all(
      imageQueue.map((item) => {
        return new Promise(async (resolve, reject) => {
          const imageParseItem = await uploadBlobToOss(item.id, "/draft/2023/08/24/test/");
          const list = imageQueue.map((_item) => (_item.id === item.id ? imageParseItem : _item));
          setImageQueue(list);
        });
      })
    );
  };

  return (
    <div className="flex absolute w-full h-full">
      <div className="basis-1/2">
        <MonacoEditor onChange={onEditorChange} postUrl="/2012/02/03/abc" />
      </div>
      <div className="basis-1/2">
        <HtmlRenderer htmlData={htmlData} />
      </div>
      <div className="fixed right-4 bottom-3.5">
        <PostButton buildPreviewImage={buildPreviewImage} imageQueue={imageQueue} permalink="/draft/2012/02/03/abc" mdData={mdData} isPublish="draft" />
      </div>
    </div>
  );
}
