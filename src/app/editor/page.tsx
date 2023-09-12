"use client";

import axios from "axios";
import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "../[...post]/post.scss";
import dynamic from "next/dynamic";

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
    return md.render(text);
  };

  const updatePreview = () => {
    setHtmlData({
      __html: md2Html(textModel!.getValue()),
    });
  };
  // 准备编辑器环境，初始化编辑器 model
  // useEffect(() => {
  //   import("monaco-editor").then((monaco) => {
  //     monaco.editor.setTheme("vs-dark");
  //     const _textModel = monaco.editor.createModel("", "markdown");
  //     setTextModel(_textModel);
  //   });
  // }, []);

  // 初始化编辑器，加载编辑器 model
  // useEffect(() => {
  //   if (editorRef.current) {
  //     // 清空编辑器
  //     while (editorRef.current.firstChild) {
  //       editorRef.current.removeChild(editorRef.current.firstChild);
  //     }
  //   }
  //   import("monaco-editor").then((monaco) => {
  //     const _codeEditor = monaco.editor.create(editorRef.current!, {
  //       model: textModel,
  //       language: "markdown",
  //       automaticLayout: true,
  //       fontSize: 18,
  //       wordWrap: "wordWrapColumn",
  //       minimap: {
  //         enabled: true,
  //       },
  //     });
  //     _codeEditor.onDidChangeModelContent(() => {
  //       updatePreview();
  //     });

  //     setCodeEditor(_codeEditor);
  //   });
  // }, [textModel]);

  // 加载草稿md，并转换md2html
  // useEffect(() => {
  //   if (codeEditor && textModel) {
  //     axios.get("/api/post/2012/02/03/abc").then((res) => {
  //       const { data } = res.data;
  //       textModel!.setValue(data.md);
  //       updatePreview();
  //     });
  //   }
  // }, [codeEditor]);

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
      <EditorOnline md={mdData} onChange={mdChange} />
      <div id="preview" className="basis-1/2 pt-10 px-10">
        <div dangerouslySetInnerHTML={htmlData}></div>
      </div>
    </div>
  );
}
