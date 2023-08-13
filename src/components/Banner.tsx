import "./Banner.css";

export default function Banner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 bg-cover bg-no-repeat bg-fixed bg-center bg-[url('/images/banner.jpeg')] h-96 w-full">
      {/* <img src="/images/banner.jpeg" className="scale-50" width="100%" alt="Picture of the author" /> */}
      <h2 className="text-cyan-700 text-4xl font-bold tracking-wider">前端雨爸的博客</h2>
      <h3 className="text-cyan-700 text-2xl font-bold tracking-widest">与其草率敷衍，不如深究到底</h3>
    </div>
  );
}
