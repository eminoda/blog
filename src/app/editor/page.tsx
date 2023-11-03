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
  const [htmlData, setHtmlData] = useState<string>("");
  const [imageQueue, setImageQueue] = useState<ImageParse[]>([]);
  const [permalink, setPermalink] = useState<string>("");
  const [mdData, setMdData] = useState<string>("");
  const [editorIsReady, setEditorIsReady] = useState<Boolean>(false);

  const [post, setPost] = useState({
    permalink: "",
    mdData: "",
  });

  useEffect(() => {
    return () => {
      console.log("clear1");
      setPermalink("");
    };
  }, []);

  const updatePermalink = (permalink: string) => {
    setPermalink(permalink);
  };

  // 生成文件 md5
  const _contentMD5 = async (blob: Blob) => {
    const arraybuffer = await blob.arrayBuffer();

    const typedArray = new Uint8Array(arraybuffer);
    var typedArrayByteLength = typedArray.byteLength;
    // Extract bytes
    var words: number[] = [];
    for (var i = 0; i < typedArrayByteLength; i++) {
      words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
    }

    const wordArray = CryptoJS.lib.WordArray.create(words, typedArrayByteLength);
    const md5Digest = CryptoJS.MD5(wordArray);
    // const wordArray = CryptoJS.enc.Utf8.parse('0123456789')
    // 0123456789 做 128为md5二进制数组做base64编码 => eB5eJF1ptWaXm4bijSPyxw==
    return md5Digest.toString(CryptoJS.enc.Base64);
  };

  const buildImageParseItem = async (id: string, imageURL: URL) => {
    // https://react.dev/learn/updating-arrays-in-state
    const current = imageQueue.find((item) => item.id === id);

    if (current) {
      // 获取 blob
      const imageResponse = await fetch(imageURL.href);
      const blob = await imageResponse.blob();
      current.blob = blob;
      current.contentMD5 = await _contentMD5(blob);
    }
  };

  const markdown2Html = (mdData: string) => {
    md.renderer.rules.image = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      const srcAttr = token.attrGet("src");

      if (srcAttr) {
        // 计算图片唯一标识
        const imageURL = new URL(srcAttr, location.origin);
        const id = CryptoJS.MD5(imageURL.href).toString();

        const current = {
          id,
          blob: undefined,
          src: imageURL.href,
          status: ParseStatus.INIT,
          priviewUrl: "",
        };
        console.log(current, imageQueue);
        if (!imageQueue.find((item) => item.id === id)) {
          imageQueue.push(current);
          // 构建图片预览队列
          buildImageParseItem(id, imageURL);
        }

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
  const uploadBlobToOss = async (id: string): Promise<ImageParse> => {
    const current = imageQueue.find((item) => item.id === id);
    if (current && current.status !== ParseStatus.DONE) {
      const formData = new FormData();
      formData.append("file", current.blob!, id);
      formData.append("contentMD5", current.contentMD5!);
      formData.append("fileName", permalink + "/" + id);
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
    await Promise.all(
      imageQueue.map((item) => {
        return new Promise(async (resolve, reject) => {
          const imageParseItem = await uploadBlobToOss(item.id);
          const list = imageQueue.map((_item) => (_item.id === item.id ? imageParseItem : _item));
          setImageQueue(list);
        });
      })
    );
  };

  const onLoaded = (editorIsReady: boolean) => {
    setEditorIsReady(editorIsReady);
  };
  return (
    <div className="flex absolute w-full h-full overflow-hidden">
      <div className="basis-1/2">
        <MonacoEditor onChange={onEditorChange} onLoaded={onLoaded} permalink={permalink} />
      </div>
      <div className="basis-1/2">
        <HtmlRenderer htmlData={htmlData} />
      </div>
      <div className="fixed right-4 bottom-3.5">
        <PostButton buildPreviewImage={buildPreviewImage} imageQueue={imageQueue} updatePermalink={updatePermalink} permalink={permalink} mdData={mdData} />
      </div>
    </div>
  );
}
