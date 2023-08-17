import Header from '@/components/Header'
import './post.scss'
import 'highlight.js/styles/atom-one-dark.css'
import Category from './category'

export default async function Post({ params }: { params: { post: string } }) {
  const response = await fetch('http://127.0.0.1:3000/api/post/2012/02/03/abc', { cache: 'no-store' })
  const { code, data } = await response.json()
  const markup = { __html: data.html }
  return (
    <div className="pb-10">
      <Header />
      <div className="flex justify-center pt-20 space-x-10 mr-80">
        <div className="grow bg-white ml-40 max-w-4xl p-10">
          {/* 文章区 */}
          <div id="editor" dangerouslySetInnerHTML={markup} />
        </div>
        {/* 文章标题 */}
        <Category />
      </div>
    </div>
  )
}
