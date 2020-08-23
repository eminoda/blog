const data = `
---
title: 探索 webpack-dev-server 的 HMR
tags:
  - webpack
  - hmr
categories:
  - 开发
  - 前端开发
thumb_img: webpack.png
date: 2019-10-11 00:23:12
---`;

const parseHeader = data.match(/^\n*-{3}([\.\-:：()（）\w\s\u4e00-\u9fa5]+)-{3}/)[1];
var lineRe = /(\n+)([^\n]*)/g;
var parse = {};
while (1 == 1) {
  const lineResult = lineRe.exec(parseHeader);
  if (!lineResult || !lineResult[2]) {
    break;
  }
  const line = lineResult[2];
  const lineParse = /(title|tags|categories|thumb_img|date):\s+([^\n]*)/g.exec(line);
  if (lineParse) {
    parse[lineParse[1]] = lineParse[2];
  } else {
    const mulitpleKey = /(tags|categories)/.exec(line);
    if (mulitpleKey) {
      keyParse = mulitpleKey[1];
      parse[keyParse] = [];
    } else {
      const mulitpleVal = /^\s+-\s*([^\n]*)/.exec(line);
      valParse = mulitpleVal[1];
      parse[keyParse].push(valParse);
    }
  }
}

console.log(parse);
