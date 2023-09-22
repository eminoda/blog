import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import axios from "axios";
import { message } from "antd";

export default function MonacoEditor(props: { permalink?: string; onChange: Function; onLoaded: Function }) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [textModel, setTextModel] = useState<monaco.editor.ITextModel | null>(null);
  const [editorLoaded, setEditorLoaded] = useState<Boolean>(false);

  // 查询文章内容
  const queryPostMarkdown = async () => {
    const { data } = await axios.get("/api/" + props.permalink);
    if (data.code === 0) {
      return data.data.mdData;
    } else {
      throw new Error(data.data);
    }
  };

  // DOM 首次加载完毕
  useEffect(() => {
    // monaco.editor.setTheme("vs-dark");
    monaco.editor.onDidCreateModel((model) => {
      console.log("textModal loaded");
      setTextModel(model);
    });

    monaco.editor.onDidCreateEditor((editor) => {
      console.log("editor loader");
      props.onLoaded(true);
    });

    monaco.editor.onWillDisposeModel(() => {
      setTextModel(null);
    });

    const textModel = monaco.editor.createModel("", "markdown");

    // 创建 editor 编辑器
    const editor = monaco.editor.create(editorRef.current!, {
      model: textModel,
      theme: "vs-dark",
      language: "markdown",
      fontSize: 18,
      // automaticLayout: true,
      wordWrap: "on",
      minimap: {
        enabled: true,
      },
    });

    editor.onDidChangeModelContent(() => {
      console.log("编辑器内容变更");
      props.onChange(textModel.getValue());
    });

    return () => {
      editor.dispose();
    };
  }, []);

  useEffect(() => {
    if (props.permalink) {
      queryPostMarkdown().then((_mdData) => {
        textModel?.setValue(_mdData);
        props.onChange(_mdData);
      });
    }
  }, [props.permalink]);

  return <div id="editor" ref={editorRef} className="min-h-full"></div>;
}
