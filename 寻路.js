'use strict';

const fs = require('fs');
const path = require('path');

function 读图(文本) {
  let 行文 = 文本.split(/\r?\n/);
  if (行文.length > 0 && 行文[行文.length - 1] === '') {
    行文 = 行文.slice(0, -1);
  }
  if (行文.length === 0) {
    return null;
  }
  const 格 = 行文.map((行) => Array.from(行));
  const 宽 = 格[0].length;
  if (宽 === 0) {
    return null;
  }
  const 允许 = new Set(['起', '终', '路', '墙']);
  let 起 = null;
  let 终 = null;
  for (let 行号 = 0; 行号 < 格.length; 行号 += 1) {
    if (格[行号].length !== 宽) {
      return null;
    }
    for (let 列号 = 0; 列号 < 宽; 列号 += 1) {
      const 字 = 格[行号][列号];
      if (!允许.has(字)) {
        return null;
      }
      if (字 === '起') {
        if (起) {
          return null;
        }
        起 = [行号, 列号];
      }
      if (字 === '终') {
        if (终) {
          return null;
        }
        终 = [行号, 列号];
      }
    }
  }
  if (!起 || !终) {
    return null;
  }
  return { 格, 起, 终 };
}

function 能落脚(字) {
  return 字 === '路' || 字 === '起' || 字 === '终';
}

function 走得通(图) {
  const 高 = 图.格.length;
  const 宽 = 图.格[0].length;
  const 看过 = new Set();
  const 队 = [图.起];
  看过.add(图.起[0] + ',' + 图.起[1]);
  const 步伐 = [
    [0, 1],
    [1, 0],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];
  while (队.length > 0) {
    const 当前 = 队.shift();
    if (当前[0] === 图.终[0] && 当前[1] === 图.终[1]) {
      return true;
    }
    for (let i = 0; i < 步伐.length; i += 1) {
      const 行号 = 当前[0] + 步伐[i][0];
      const 列号 = 当前[1] + 步伐[i][1];
      if (行号 < 0 || 列号 < 0 || 行号 >= 高 || 列号 >= 宽) {
        continue;
      }
      const 键 = 行号 + ',' + 列号;
      if (看过.has(键)) {
        continue;
      }
      if (!能落脚(图.格[行号][列号])) {
        continue;
      }
      看过.add(键);
      队.push([行号, 列号]);
    }
  }
  return false;
}

function 入口() {
  const 路径 = path.join(process.cwd(), '地图');
  let 文本 = '';
  try {
    文本 = fs.readFileSync(路径, 'utf8');
  } catch (err) {
    process.stderr.write('找不到地图\n');
    process.exit(1);
  }
  const 图 = 读图(文本);
  if (!图) {
    process.stderr.write('地图不对\n');
    process.exit(1);
  }
  process.stdout.write(走得通(图) ? '走得通\n' : '走不通\n');
}

入口();
