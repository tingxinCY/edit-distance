(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['edit-distance'] = factory());
}(this, (function () { 'use strict';

  var TYPE_NONE = 'none'; // 无操作
  var TYPE_INS = 'ins'; // 插入操作
  var TYPE_DEL = 'del'; // 删除操作
  var TYPE_SUB = 'sub'; // 替换操作
  /**
   * @param String a 源字符串
   * @param String b 目标字符串
   * @return Object {distance, path}
   */
  function editDistance(a, b) {
      if (a === void 0) { a = ''; }
      if (b === void 0) { b = ''; }
      var distanceMap = [[0]]; // 路径地图，记录从a[i] -> b[j]的编辑距离，[0][0]表示 '' -> '' 的距离。
      var typeMap = [[TYPE_NONE]]; // 操作地图，记录从a[i] -> b[j]的编辑类型，[0][0]表示 '' -> '' 的操作
      // 0行表示 '' -> b[i]的编辑距离，均采用ins操作，distance=i
      for (var i = 1; i < b.length + 1; ++i) {
          distanceMap[0][i] = i;
          typeMap[0][i] = TYPE_INS;
      }
      for (var i = 1; i <= a.length; ++i) {
          distanceMap[i] = [i]; // distanceMap[i][0]表示 a[i] -> '' 的编辑距离，distance = i
          typeMap[i] = [TYPE_DEL]; // typeMap[i][0]表示 a[i] => '' 的编辑类型，type=del
          for (var j = 1; j <= b.length; ++j) {
              var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1; // 字符替换的成本
              var del = distanceMap[i - 1][j] + 1; // 删除操作
              var ins = distanceMap[i][j - 1] + 1; // 插入操作
              var sub = distanceMap[i - 1][j - 1] + cost; // 替换操作
              distanceMap[i][j] = Math.min(del, ins, sub); // 求最小编辑距离
              // 调整优先级不影响distance，不同优先级会导致path不同
              // 优先级ins > del > sub，例如：1234aaa vs aaa456，path=del/del/del/del/ins/ins/ins，编辑路径效果更佳，
              // 优先级del > ins > sub，例如：1234aaa vs aaa456，path=sub/sub/sub/sub/sub/sub/del
              if (distanceMap[i][j] === ins) {
                  typeMap[i][j] = TYPE_INS;
              }
              else if (distanceMap[i][j] === del) {
                  typeMap[i][j] = TYPE_DEL;
              }
              else if (distanceMap[i][j] === sub) {
                  typeMap[i][j] = cost ? TYPE_SUB : TYPE_NONE;
              }
          }
      }
      // 倒推编辑路径
      var pos = { x: a.length, y: b.length }; // 当前位置
      var path = []; // 记录A数据的差异
      while (pos.x > 0 || pos.y > 0) {
          var x = pos.x, y = pos.y;
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
          }
      }
      return {
          distance: distanceMap[a.length][b.length],
          path: path,
      };
  }

  return editDistance;

})));
