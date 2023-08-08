import "./Banner.css";

export default function Banner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 bg-cover bg-fixed bg-[100%_160%] bg-[url('/images/banner.jpeg')] h-80 w-full">
      <div className="text-cyan-700 text-4xl font-bold tracking-wider">前端雨爸的博客</div>
      <div className="text-cyan-700 text-2xl font-bold contrast-80 tracking-widest">与其草率敷衍，不如深究到底</div>
    </div>
  );
}
