export default function Header() {
  return (
    // <div className="flex justify-between py-2 px-6 fixed top-0 z-50 w-full bg-sky-100/[0.2] text-white">
    <div className="flex justify-between py-2 px-6 fixed mr-80 top-0 left-0 right-0 z-50 bg-white text-black">
      <div className="text-lg font-bold">前端雨爸的博客</div>
      <div className="flex justify-between space-x-4 text-base">
        <span>搜索</span>
        <span>标签</span>
        <span>分类</span>
        <span>时间轴</span>
      </div>
    </div>
  );
}
