"use client";
import { useEffect, useState } from "react";
import { useRef } from "react";
interface CategoryNode {
  tag: string;
  title: string;
  active?: boolean;
  children: CategoryNode[];
}

function CategoryNodes(props: { nodes: CategoryNode[]; deep: number }) {
  return (
    <ol className={"space-y-2 ml-" + props.deep * 3}>
      {props.nodes.map((item, index) => {
        return (
          <li key={index}>
            <a href="" className="hover:underline decoration-gray-300 underline-offset-2 cursor-pointer">
              {item.tag == "h2" ? "📚" : "🏷️" + (index + 1).toString() + ". "}
              <span className={item.active ? "text-red-400" : ""}>
                {item.title}---{item.active}
              </span>
            </a>
            {item.children.length > 0 && <CategoryNodes nodes={item.children} deep={props.deep + 1} />}
          </li>
        );
      })}
    </ol>
  );
}

export default function Category() {
  const [categoryFlat, setCategoryFlat] = useState<{ tag: string; title: string }[]>([]);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [titleIndex, setTitleIndex] = useState<number>(0);
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [treeDeep, setTreeDeep] = useState<number>(0);
  const [treeDeepIndex, setTreeDeepIndex] = useState<number>(0);

  // 构建目录结构
  const buildCategoryTree = (nodes: HTMLCollection): CategoryNode[] => {
    const levels = ["h2", "h3"];
    const list = Array.from(nodes)
      .filter((item) => {
        return levels.includes(item.nodeName.toLowerCase());
      })
      .map((item) => {
        return { tag: item.nodeName.toLowerCase(), title: item.innerHTML };
      });

    setCategoryFlat(list);

    const tree: CategoryNode[] = [];
    list.forEach((item) => {
      // 初始化
      if (tree.length == 0) {
        tree.push({ ...item, children: [] });
      } else {
        const lastItem = tree[tree.length - 1];
        // 挂在子元素
        if (item.tag > lastItem.tag) {
          lastItem.children.push({ ...item, children: [] });
        } else {
          tree.push({ ...item, children: [] });
        }
      }
    });
    return tree;
  };

  // 激活目录
  useEffect(() => {
    let count = -1;
    const deepWalk = (list: CategoryNode[]) => {
      for (let i = 0; i < list.length; i++) {
        count++;
        if (count == titleIndex) {
          list[i].active = true;
          count = Infinity;
        } else {
          if (list[i].children.length > 0) {
            deepWalk(list[i].children);
          }
          list[i].active = count == titleIndex;
        }
      }
    };
    deepWalk(tree);
    console.log(tree);
  }, [titleIndex, tree]);

  // 计算当前标题
  useEffect(() => {
    const $rootNode = document.querySelector<HTMLElement>("#editor");
    const $titleNodes = Array.from($rootNode?.children!).filter((node) => {
      return ["h2", "h3"].includes(node.nodeName.toLowerCase());
    });
    let lastTop = Infinity;
    for (let i = 0; i < $titleNodes.length; i++) {
      const top = $titleNodes[i].getBoundingClientRect().top!;

      // 距离顶部距离
      if (top > 0 && top < 150) {
        // 当前最小标题
        if (top <= lastTop) {
          lastTop = top;
          setTitleIndex(i);
          break;
        }
      } else if (top > 150) {
        if (top <= lastTop) {
          lastTop = top;
          setTitleIndex(i);
          break;
        }
      }
    }
  }, [categoryFlat, offsetY]);

  // 监听滚动
  useEffect(() => {
    let canRender = false;

    document.addEventListener("scroll", (event) => {
      if (!canRender) {
        window.requestAnimationFrame(() => {
          canRender = false;
          setOffsetY(window.scrollY);
        });
        canRender = true;
      }
    });
  }, []);

  // 生成目录
  useEffect(() => {
    // 加载文章标题
    const $rootNode = document.querySelector<HTMLElement>("#editor");
    const tree = buildCategoryTree($rootNode!.children);
    setTree(tree);
  }, []);
  return (
    <>
      <div className="pt-16 w-80 bg-sky-950 text-gray-300 p-6 fixed right-0 top-0 z-10 h-full">
        {treeDeep}
        {treeDeepIndex}
        {titleIndex}
        <CategoryNodes nodes={tree} deep={0} />
      </div>
    </>
  );
}
