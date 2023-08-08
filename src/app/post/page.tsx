import Link from "next/link";

// 文章列表页
// 主 banner：https://molunerfinn.com/
// 列表：https://ppoffice.github.io/hexo-theme-icarus/
export default function Post() {
  return (
    <div className="post-list p-3 flex flex-col space-y-4">
      <div className="post-item">
        <Link className="post-title text-lg font-bold" href="/post/2023/05/07/helloworld">
          Next.js 怎么学习
        </Link>
        <div></div>
        <a className="post-title text-lg font-bold" href="/post/2023/05/07/helloworld">
          Next.js 怎么学习 a
        </a>
        <div className="post-tip text-xs text-slate-400">2023-8-6 13:14:55</div>
        <div className="post-simple-text text-sm ">
          To effectively use Next.js, it helps to be familiar with JavaScript, React, and related web development concepts. But JavaScript and React are vast topics. How do you know when you’re ready
          to learn Next.js?
        </div>
      </div>
      <div className="post-item">
        <div className="post-title">Next.js 怎么学习</div>
        <div className="post-tip">2023-8-6 13:14:55</div>
        <div className="post-simple-text">
          To effectively use Next.js, it helps to be familiar with JavaScript, React, and related web development concepts. But JavaScript and React are vast topics. How do you know when you’re ready
          to learn Next.js?
        </div>
      </div>
      <div className="post-item">
        <div className="post-title">Next.js 怎么学习</div>
        <div className="post-tip">2023-8-6 13:14:55</div>
        <div className="post-simple-text">
          To effectively use Next.js, it helps to be familiar with JavaScript, React, and related web development concepts. But JavaScript and React are vast topics. How do you know when you’re ready
          to learn Next.js?
        </div>
      </div>
    </div>
  );
}
