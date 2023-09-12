import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";

export default function EditorOnline(props: { md: string; onChange: Function }) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [iStandaloneCodeEditor, setIStandaloneCodeEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    // 子组件会的等到父组件加载完毕后运行，即：md 有值
    if (editorRef.current && !iStandaloneCodeEditor) {
      // 设置主题风格
      monaco.editor.setTheme("vs-dark");
      monaco.editor.onDidCreateEditor((iCodeEditor) => {
        // 编辑器加载完毕
        iCodeEditor.focus();
      });
      // 设置 markdown
      const textModel = monaco.editor.createModel(props.md, "markdown");
      // 创建编辑器
      const _iStandaloneCodeEditor = monaco.editor.create(editorRef.current, {
        model: textModel,
        language: "markdown",
        automaticLayout: true,
        fontSize: 18,
        wordWrap: "wordWrapColumn",
        minimap: {
          enabled: true,
        },
      });
      // 内容变更
      _iStandaloneCodeEditor.onDidChangeModelContent(() => {
        const newVal = textModel.getValue();
        props.onChange(newVal);
      });
    }
  }, []);

  return <div id="editor" ref={editorRef} className="basis-1/2 min-h-full"></div>;
}
