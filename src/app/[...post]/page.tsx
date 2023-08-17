import Header from "./Header";
import "./post.scss";
import "highlight.js/styles/atom-one-dark.css";
import Category from "./category";
import { useRef } from "react";

export default async function Post({ params }: { params: { post: string } }) {
  const response = await fetch("http://127.0.0.1:3000/api/post/2012/02/03/abc", { cache: "no-store" });
  const { code, data } = await response.json();
  const markup = { __html: data.html };
  return (
    <>
      <div className="flex space-between">
        <Header />
        <div className="grow pb-10 mr-80 mt-16">
          <div id="editor" className="bg-white m-auto max-w-4xl p-10" dangerouslySetInnerHTML={markup} />
          <Category />
        </div>
      </div>
    </>
  );
}
