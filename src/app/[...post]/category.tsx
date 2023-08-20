"use client";
import { useEffect, useState } from "react";
import React, { MouseEvent } from "react";
import { useRef } from "react";
import nonce from "nonce-str";

interface CategoryNode {
  tag: string;
  title: string;
  active?: boolean;
  id: string;
  children: CategoryNode[];
}

function CategoryNodes(props: { nodes: CategoryNode[]; deep: number }) {
  // TODO
  const scrollTo = (e: MouseEvent<HTMLElement>, id: string) => {
    const $title = document.querySelector("#" + id);
    if ($title) {
      console.log(`document.querySelector("#" + ${id})`, $title, $title!.getBoundingClientRect().top);
      window.scrollTo({
        top: $title!.getBoundingClientRect().top + window.scrollY - 80,
      });
    }
  };
  return (
    <ol className={props.deep == 0 ? "space-y-2 " : "space-y-2 ml-4"}>
      {props.nodes.map((item, index) => {
        return (
          <li key={index}>
            <span onClick={(e) => scrollTo(e, item.id)} className="hover:underline decoration-gray-300 underline-offset-2 cursor-pointer">
              {item.tag == "h2" ? "📚" : "🏷️" + (index + 1).toString() + ". "}
              <span className={item.active ? "text-red-400" : ""}>
                {item.title}
              </span>
            </span>
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
    const list = [];
    for (let i = 0; i < nodes.length; i++) {
      const item = nodes[i];
      if (levels.includes(item.nodeName.toLowerCase())) {
        const id = "title_" + nonce(6);
        item.setAttribute("id", id);
        list.push({ id, tag: item.nodeName.toLowerCase(), title: item.innerHTML });
      }
    }

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
    let count = 0;
    const deepWalk = (list: CategoryNode[]) => {
      for (let i = 0; i < list.length; i++) {
        // 当前元素
        list[i].active = count == titleIndex;
        if (list[i].children.length > 0) {
          count++;
          deepWalk(list[i].children);
        }
        count++;
      }
    };
    deepWalk(tree);
  }, [titleIndex, tree]);

  // 计算当前标题
  useEffect(() => {
    const $rootNode = document.querySelector<HTMLElement>("#preview");
    const $titleNodes = Array.from($rootNode?.children!).filter((node) => {
      return ["h2", "h3"].includes(node.nodeName.toLowerCase());
    });
    for (let i = 0; i < $titleNodes.length; i++) {
      const top = $titleNodes[i].getBoundingClientRect().top!;

      // 距离顶部距离
      if (0 < top && top < 360) {
        if (titleIndex >= 0) {
          setTitleIndex(i);
          break;
        }
      } else if (top >= 360) {
        setTitleIndex(i);
        break;
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
    const $rootNode = document.querySelector<HTMLElement>("#preview");
    const tree = buildCategoryTree($rootNode!.children);
    setTree(tree);
  }, []);

  return (
    <>
      <div className="pt-16 w-80 bg-sky-950 text-gray-300 p-6 fixed right-0 top-0 z-10 h-full">
        <CategoryNodes nodes={tree} deep={0} />
      </div>
    </>
  );
}
