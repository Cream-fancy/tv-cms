module.exports.printTable = function (vod) {
  const playList = JSON.parse(JSON.stringify(vod.dd));
  delete vod.dd;
  console.log('\n【影片信息】');
  var keyMap = { name: '影片名称', last: '更新时间', note: '备注', pic: '封面', actor: '演员', director: '导演', des: '简介', type: '类型' };
  vod = Object.keys(vod).reduce((o, k) => {
    o[keyMap[k] || k] = vod[k];
    return o;
  }, {});
  console.table(vod);
  for (let v of playList) {
    console.log(`\n【${v.flag}资源列表】`);
    console.table(v.list);
  }
}