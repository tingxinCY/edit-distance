const TYPE_NONE = 'none'; // 无操作
const TYPE_INS = 'ins'; // 插入操作
const TYPE_DEL = 'del'; // 删除操作
const TYPE_SUB = 'sub'; // 替换操作

type TPath = {
  type: 'sub' | 'ins' | 'del';
  aChar: string;
  bChar: string;
  aIndex: number;
  bIndex: number;
};
/**
 * @param String a 源字符串
 * @param String b 目标字符串
 * @return Object {distance, path}
 */
function editDistance(a: string = '', b: string = ''): { distance: number; path: TPath[] } {
  const distanceMap = [[0]]; // 路径地图，记录从a[i] -> b[j]的编辑距离，[0][0]表示 '' -> '' 的距离。
  const typeMap = [[TYPE_NONE]]; // 操作地图，记录从a[i] -> b[j]的编辑类型，[0][0]表示 '' -> '' 的操作

  // 0行表示 '' -> b[i]的编辑距离，均采用ins操作，distance=i
  for (let i = 1; i < b.length + 1; ++i) {
    distanceMap[0][i] = i;
    typeMap[0][i] = TYPE_INS;
  }

  for (let i = 1; i <= a.length; ++i) {
    distanceMap[i] = [i]; // distanceMap[i][0]表示 a[i] -> '' 的编辑距离，distance = i
    typeMap[i] = [TYPE_DEL]; // typeMap[i][0]表示 a[i] => '' 的编辑类型，type=del

    for (var j = 1; j <= b.length; ++j) {
      const cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1; // 字符替换的成本
      const del = distanceMap[i - 1][j] + 1; // 删除操作
      const ins = distanceMap[i][j - 1] + 1; // 插入操作
      const sub = distanceMap[i - 1][j - 1] + cost; // 替换操作
      distanceMap[i][j] = Math.min(del, ins, sub); // 求最小编辑距离

      // 调整优先级不影响distance，不同优先级会导致path不同
      // 优先级ins > del > sub，例如：1234aaa vs aaa456，path=del/del/del/del/ins/ins/ins，编辑路径效果更佳，
      // 优先级del > ins > sub，例如：1234aaa vs aaa456，path=sub/sub/sub/sub/sub/sub/del
      if (distanceMap[i][j] === ins) {
        typeMap[i][j] = TYPE_INS;
      } else if (distanceMap[i][j] === del) {
        typeMap[i][j] = TYPE_DEL;
      } else if (distanceMap[i][j] === sub) {
        typeMap[i][j] = cost ? TYPE_SUB : TYPE_NONE;
      }
    }
  }

  // 倒推编辑路径
  const pos = { x: a.length, y: b.length }; // 当前位置
  const path: TPath[] = []; // 记录A数据的差异

  while (pos.x > 0 || pos.y > 0) {
    const { x, y } = pos;
    switch (typeMap[x][y]) {
      case TYPE_DEL: // 删除操作
        path.unshift({
          type: 'del',
          aChar: a[x - 1],
          bChar: '',
          aIndex: x - 1,
          bIndex: y,
        });
        pos.x = x - 1;
        break;
      case TYPE_INS: // 插入操作
        path.unshift({
          type: 'ins',
          aChar: '',
          bChar: b[y - 1],
          aIndex: x,
          bIndex: y - 1,
        });
        pos.y = y - 1;
        break;
      case TYPE_SUB: // 判断修改操作
        path.unshift({
          type: 'sub',
          aChar: a[x - 1],
          bChar: b[y - 1],
          aIndex: x - 1,
          bIndex: y - 1,
        });
        pos.x = x - 1;
        pos.y = y - 1;
        break;
      case TYPE_NONE:
        pos.x = x - 1;
        pos.y = y - 1;
        break;
      default:
        break;
    }
  }

  return {
    distance: distanceMap[a.length][b.length],
    path,
  };
}

export default editDistance;
