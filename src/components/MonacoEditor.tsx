import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import axios from "axios";

export default function MonacoEditor(props: { postUrl?: string; onChange: Function }) {
  const [mdData, setMdData] = useState<string>("# 文章标题\n## 就和写Markdown一样");
  const editorRef = useRef<HTMLDivElement | null>(null);

  // DOM 首次加载完毕
  useEffect(() => {
    // 初始化 Monaco
    // monaco.editor.setTheme("vs-dark");
    // 首次加载完毕 Monaco
    monaco.editor.onDidCreateEditor((iCodeEditor) => {
      console.log("monaco.editor.onDidCreateEditor");
      props.onChange(mdData);
    });
    // 定义 text 模块
    const textModel = monaco.editor.createModel(mdData, "markdown");
    // 创建 editor 编辑器
    const editor = monaco.editor.create(editorRef.current!, {
      model: textModel,
      theme: "vs-dark",
      language: "markdown",
      fontSize: 18,
      //   automaticLayout: true,
      wordWrap: "on",
      minimap: {
        enabled: true,
      },
    });
    editor.onDidChangeModelContent(() => {
      console.log("editor.onDidChangeModelContent");
      props.onChange(textModel.getValue());
    });

    if (props.postUrl) {
      // 请求 markdown
      axios.get("/api/post" + props.postUrl).then((res) => {
        const { data } = res.data;
        textModel.setValue(data.md);
      });
    }
    return () => {
      editor.dispose();
    };
  }, [props.postUrl]);

  return <div id="editor" ref={editorRef} className="min-h-full"></div>;
}
