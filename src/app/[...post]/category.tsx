'use client'
import { useEffect } from 'react'
import { useRef } from 'react'
interface CategoryNode {
  tag: string
  title: string
  children: CategoryNode[]
}
export default function Category() {
  const categoryTreeRef = useRef<HTMLOListElement | null>(null)

  // 构建目录结构
  const buildCategoryTree = (nodes: HTMLCollection): CategoryNode[] => {
    const levels = ['h2', 'h3']
    const list = Array.from(nodes)
      .filter((item) => {
        return levels.includes(item.nodeName.toLowerCase())
      })
      .map((item) => {
        return { tag: item.nodeName.toLowerCase(), title: item.innerHTML }
      })

    const tree: CategoryNode[] = []
    list.forEach((item) => {
      // 初始化
      if (tree.length == 0) {
        tree.push({ ...item, children: [] })
      } else {
        const lastItem = tree[tree.length - 1]
        // 挂在子元素
        if (item.tag > lastItem.tag) {
          lastItem.children.push({ ...item, children: [] })
        } else {
          tree.push({ ...item, children: [] })
        }
      }
    })
    return tree
  }
  useEffect(() => {
    const $rootNode = document.querySelector<HTMLElement>('#editor')
    const tree = buildCategoryTree($rootNode!.children)

    const createNode = (item: CategoryNode, index: number): HTMLElement => {
      const $li = document.createElement('li')
      const $a = document.createElement('a')
      $a.setAttribute('class', 'hover:underline decoration-gray-300 underline-offset-4 cursor-pointer')
      const $span = document.createElement('span')
      $span.innerHTML = item.title
      $a.appendChild(document.createTextNode(item.tag == 'h2' ? '📚' : '🏷️' + (index + 1).toString() + '. '))
      $a.appendChild($span)
      $li.appendChild($a)
      if (item.children.length > 0) {
        if (['h1', 'h2', 'h3', 'h4'].includes(item.tag)) {
          $li.appendChild(createParentNode(item))
        }
      }
      return $li
    }

    const createParentNode = (item: CategoryNode): HTMLElement => {
      const $ul = document.createElement('ol')
      $ul.setAttribute('class', item.tag == 'h2' ? 'ml-3' : item.tag == 'h3' ? 'ml-6' : '')
      item.children.forEach((item, index) => {
        $ul.append(createNode(item, index))
      })
      return $ul
    }
    console.log(tree)
    tree.forEach((item, index) => {
      categoryTreeRef.current!.appendChild(createNode(item, index))
    })
  }, [])
  return <ol ref={categoryTreeRef} className="pt-20 w-80 bg-sky-950 text-gray-300 p-6 fixed right-0 top-0 z-10 h-full space-y-2"></ol>
}
