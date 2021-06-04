var core = require('./utils/core');
var inquirer = require('inquirer');

let _idx = 0;
let _keyword = '李焕英';
let _id = '257357';
let _page = 1;

// core.testRssNet();
core.setRssNet(0);
inquirer.prompt([{ type: 'input', name: 'tvName', message: '输入搜索名称' }]).then(async ({ tvName }) => {
  let data = await core.findByKeyword(tvName);
  let menu = data.vList.map(o => {
    return {
      value: o.id,
      name: `${o.name} [${o.note}]`,
      short: o.last,
    };
  });
  inquirer.prompt([{ type: 'list', name: 'tvId', message: '选择影片', choices: menu, loop: false }])
    .then(async ({ tvId }) => {
      let vList = await core.findByIds(tvId);
      console.table(vList);
    });
});

// core.setRssNet(_idx);
// core.findByKeyword(_keyword, _page);
// core.findByIds(_id, _page);
// core.testRssNet(0, 0, []);