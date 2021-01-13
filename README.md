# edit-distance

编辑距离（Edit Distance），又称 Levenshtein 距离，是指两个字串之间，由一个转成另一个所需的最少编辑操作次数。 许可的编辑操作包括将一个字符替换成另一个字符，插入一个字符，删除一个字符。 一般来说，编辑距离越小，两个串的相似度越大。

## 特性

- 支持计算最短编辑距离。
- 支持计算最短编辑路径，基于编辑路径可以实现对文本进行 diff 高亮渲染。

## 安装

```js
npm install @tingxin_cy/edit-distance -S
```

or

```js
yarn add @tingxin_cy/edit-distance -S
```

## Function：editDistance

```js
import editDistance from '@tingxin_cy/edit-distance';

const a = 'AABCDE';
const b = 'AB3DEG';
const { distance, path } = editDistance(a, b);

/*
  distance = 3;
  path = [
    {
      type: "del",
      aChar: "A",
      bChar: "",
      aIndex: 1,
      bIndex: 1
    },
    {
      type: "sub",
      aChar: "C",
      bChar: "3",
      aIndex: 3,
      bIndex: 2
    },
    {
      type: "ins",
      aChar: "",
      bChar: "G",
      aIndex: 6,
      bIndex: 5
    }
  ]

  - a文本中 index = 1 的字符 A 被执行了删除操作
  - a文本中 index = 3 的字符 C 被替换为 b文本中 index = 2 的字符 3
  - a文本中 index = 6 的位置插入了字符 G，对应在b文本中 index = 5 
*/
```

### 参数说明

| 参数 | 说明             | 类型   |
| ---- | ---------------- | ------ |
| a    | 文本 a，原始文本 | string |
| b    | 文本 b，目标文本 | string |

### 结果说明：{ distance, path }

| 参数     | 说明                                 | 类型   |
| -------- | ------------------------------------ | ------ |
| distance | 最短编辑距离                         | number |
| path     | 编辑路径，对应最短编辑距离的操作路径 | path[] |

#### path

| 参数   | 说明                                                       | 类型                |
| ------ | ---------------------------------------------------------- | ------------------- |
| type   | 操作类型，插入字符（ins），删除字符（del)，替换字符（sub） | 'ins'\|'del'\|'sub' |
| aChar  | a 文本中的原始字符                                         | string              |
| bChar  | b 文本中的目标字符                                         | string              |
| aIndex | a 文本中原始字符的坐标                                     | number              |
| bIndex | b 文本中原始字符的坐标                                     | number              |
