"use client";

import axios from "axios";
import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "../[...post]/post.scss";

export default function Editor() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [codeEditor, setCodeEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [textModel, setTextModel] = useState<monaco.editor.ITextModel | null>(null);
  const [htmlData, setHtmlData] = useState<{ __html: string | TrustedHTML } | undefined>(undefined);

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
  useEffect(() => {
    monaco.editor.setTheme("vs-dark");
    const _textModel = monaco.editor.createModel("", "markdown");
    setTextModel(_textModel);
  }, []);

  // 初始化编辑器，加载编辑器 model
  useEffect(() => {
    if (editorRef.current) {
      // 清空编辑器
      while (editorRef.current.firstChild) {
        editorRef.current.removeChild(editorRef.current.firstChild);
      }
    }
    const _codeEditor = monaco.editor.create(editorRef.current!, {
      model: textModel,
      language: "markdown",
      automaticLayout: true,
      fontSize: 18,
      wordWrap: "wordWrapColumn",
      minimap: {
        enabled: true,
      },
    });
    _codeEditor.onDidChangeModelContent(() => {
      updatePreview();
    });

    
    setCodeEditor(_codeEditor);
  }, [textModel]);

  // 加载草稿md，并转换md2html
  useEffect(() => {
    if (codeEditor && textModel) {
      axios.get("/api/post/2012/02/03/abc").then((res) => {
        const { data } = res.data;
        textModel!.setValue(data.md);
        updatePreview();
      });
    }
  }, [codeEditor]);

  return (
    <div className="flex">
      <div id="editor" ref={editorRef} className="basis-1/2 min-h-full"></div>
      <div id="preview" className="basis-1/2 pt-10 px-10">
        <div dangerouslySetInnerHTML={htmlData}></div>
      </div>
    </div>
  );
}
