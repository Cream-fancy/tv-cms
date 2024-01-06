var core = require('./utils/core');
var cms = require('./utils/cms');
var inquirer = require('inquirer');
var beautify = require('./utils/beautify');

// let _idx = 0;
// let _keyword = '李焕英';
// let _id = '257357';
// let _page = 1;
// core.testRssNet();
// core.setRssNet(_idx);
// core.findByKeyword(_keyword, _page);
// core.findByIds(_id, _page);
// core.testRssNet(0, 0, []);

cms = cms.map((o, i) => {
  o['value'] = i;
  o['name'] = o.name ? o.name : `未知${i}`
  return o;
});
inquirer.prompt([{ type: 'list', name: 'idx', message: '请选择资源频道', choices: cms, loop: false }]).then(({ idx }) => {
  core.setRssNet(idx);
  inquirer.prompt([{ type: 'input', name: 'tvName', message: '输入搜索名称' }]).then(async ({ tvName }) => {
    let data = await core.findByKeyword(tvName);
    let menu = data.vList.map(o => new Object({
      value: o.id,
      name: `${o.name} [${o.note}]`,
      short: o.last,
    }));
    inquirer.prompt([{ type: 'list', name: 'tvId', message: '选择影片', choices: menu, loop: false }])
      .then(async ({ tvId }) => {
        beautify.printTable(await core.findByIds(tvId));
      });
  });
});