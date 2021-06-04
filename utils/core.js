const rss = require('./rss');
const cms = require('./cms');
const DEBUG = false;

module.exports = {
  baseObj: null,
  funcName: null,

  /**
   * 设置CMS站点
   * @param {Number} index 
   */
  setRssNet(index) {
    this.baseObj = cms[index];
    this.funcName = 'parse' + this.baseObj.type.toLowerCase().replace(/^[a-z]/, w => w.toUpperCase());
  },

  /**
   * 测试CMS站点有效性
   * @param {Number} start 
   * @param {Number} end 
   * @param {Array} cmsArr 
   */
  async testRssNet(start, end, cmsArr) {
    start = start || 0;
    end = end || cms.length;
    cmsArr = cmsArr || cms.slice(start, end).map((o) => o.url);
    let result = [];
    for (let url of cmsArr) {
      const res = await rss.send(url);
      result.push({
        'code': res.statusCode,
        'url': url
      });
    }
    console.table(result);
  },

  /**
   * 根据名称查找
   * @param {String} keyword 
   * @param {Number} page 
   */
  findByKeyword(keyword, page) {
    return new Promise(async resolve => {
      const queryString = rss.getParams({
        ac: 'list',
        wd: keyword,
        p: page,
      });
      const url = this.baseObj.url + '?' + queryString;
      DEBUG && console.log(url);
      const res = await rss.send(url);
      let data = rss[this.funcName](res.body);
      resolve(data);
    })
  },

  /**
   * 根据id查找
   * @param {String|Array} ids 
   * @param {Number} page 
   */
  async findByIds(ids, page) {
    return new Promise(async resolve => {
      const queryString = rss.getParams({
        ac: 'videolist',
        ids: ids,
        page: page,
      });
      const url = this.baseObj.url + '?' + queryString;
      DEBUG && console.log(url);
      const res = await rss.send(url);
      let data = rss[this.funcName](res.body);
      resolve(data.vList.list);
    });
  },
};