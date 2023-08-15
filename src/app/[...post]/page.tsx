import Header from '@/components/Header'

export default async function Post({ params }: { params: { post: string } }) {
  const response = await fetch('http://127.0.0.1:3000/api/post/2012/02/03/abc')
  const { code, data } = await response.json()
  const markup = { __html: data.html }
  console.log(markup)
  return (
    <div className="pb-10">
      {/* <Header /> */}
      <div className="flex justify-center pt-20 space-x-10 mr-80">
        <div className="grow flex justify-center bg-white ml-40 max-w-4xl p-10">
          {/* 文章区 */}
          <div dangerouslySetInnerHTML={markup} />
        </div>
        {/* 文章标题 */}
        <ol className="pt-20 w-80 bg-emerald-500 text-white p-6 fixed right-0 top-0 z-10 h-full">
          <li>
            <a href="">
              1.<span>前端为何要解析图片资源</span>
            </a>
          </li>
          <li>
            <a href="">
              1.<span>前端为何要解析图片资源</span>
            </a>
          </li>
          <li>
            <a href="">
              1.<span>前端为何要解析图片资源</span>
            </a>
          </li>
        </ol>
      </div>
    </div>
  )
}
