import { useEffect, useRef, useState } from "react";
import "../app/[...post]/post.scss";

export default function HtmlRenderer(props: { htmlData: string }) {
  const [html, setHtml] = useState<{ __html: string | TrustedHTML } | undefined>(undefined);

  useEffect(() => {
    setHtml({
      __html: props.htmlData,
    });
  }, [props.htmlData]);

  return <div id="preview" dangerouslySetInnerHTML={html} className="pt-10 px-10 max-h-screen overflow-auto"></div>;
}
