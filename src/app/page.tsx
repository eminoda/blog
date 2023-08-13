import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Banner from "@/components/Banner";

export default function Home() {
  const blogList = [1, 2, 3, 4, 5, 6];
  return (
    <div className="bg-gray-100 pb-10">
      <Header />
      <Banner />
      {/* 主内容区 */}
      <div className="flex justify-center items-start px-10 mt-10 space-x-20">
        {/* 个人介绍 */}
        <div className="sticky top-14 w-80 rounded-md shadow-lg p-6 bg-white flex items-center flex-col">
          <Image className="rounded-full" src="/images/logo.jpg" width={70} height={70} alt="logo" />
          <div className="text-base font-bold mt-4">前端雨爸</div>
          <div className="text-sm mt-2">Frontend Developer</div>
          <div className="flex space-x-6 mt-4">
            <Image className="cursor-pointer" src="/images/icon/github.png" width={26} height={26} alt="logo" />
            <Image className="cursor-pointer" src="/images/icon/mp.png" width={26} height={26} alt="logo" />
            <Image className="cursor-pointer" src="/images/icon/toutiao.png" width={26} height={26} alt="logo" />
          </div>
        </div>
        {/* 博客列表 */}
        <div className="grow max-w-3xl flex flex-col space-y-10">
          {blogList.map((item) => {
            return (
              <div className="rounded-md shadow-lg shadow-slate-200 px-6 pt-6 pb-4 bg-white">
                <Link className="text-2xl font-bold" href="/2023/05/07/helloworld">
                  只写样式名的 css —— tailwindcss
                </Link>
                <div className="text-base text-slate-400 my-2.5">2023-8-6 13:14:55</div>
                <div className="text-base ">
                  做梦也不会想到，前端开发里最意会的 css 居然能公式化出来。简简单单的 flex justify-between 就能代替原来书写多行的样式。你知道：text-cyan-700 text-2xl font-bold tracking-widest
                  什么意思吗？
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-60">博客推荐列表</div>
      </div>
      {/* 博客列表 */}
    </div>
  );
}
