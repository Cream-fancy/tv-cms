const request = require('request');
const convert = require('xml-js');

module.exports = {
  getParams(obj) {
    let query = {};
    query['ac'] = obj.ac || 'list';
    query['p'] = obj.p || 1;
    obj.ids = Array.isArray(obj.ids) ? obj.ids.join(',') : obj.ids;
    if (obj.ids) {
      query['ids'] = obj.ids;
    } else {
      query['wd'] = obj.wd || '';
    }
    return Object.keys(query).map((k) => `${k}=${encodeURIComponent(query[k])}`).join("&")
  },
  send(url) {
    console.log(`%c 访问如下链接： ${url}`, 'color:#eee');
    return new Promise(resolve => {
      request.get({
        url: url,
        headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36' },
        timeout: 5000,
      }, (e, res) => {
        if (!e && res.statusCode == 200) {
          resolve(res);
        } else {
          resolve({});
        }
      });
    })
  },
  /**
   * 解析 JSON 数据
   * @param {Object} obj 
   * @param {boolean} isIds 
   */
  parseJson(obj, isIds) {
    let vList;
    if (isIds) {
      let o = obj['list'][0];
      let videolist = [{
        flag: o.vod_play_from,
        list: o.vod_play_url.split("#").map(s => {
          s = s.split("$");
          return {
            label: s[0],
            src: s[1]
          };
        })
      }];
      vList = {
        id: o.vod_id,
        name: o.vod_name,
        last: o.vod_time,
        note: o.vod_remarks,
        pic: o.vod_pic,
        actor: o.vod_actor,
        director: o.vod_director,
        des: o.vod_content,
        dd: videolist
      };
    } else {
      vList = obj['list'].map(o => {
        return {
          id: o.vod_id,
          name: o.vod_name,
          last: o.vod_time,
          note: o.vod_remarks
        }
      });
    }
    return {
      page: obj["page"],
      pageCount: obj["pagecount"],
      recordCount: obj["total"],
      vList: vList
    };
  },
  parseXml(xml, isIds) {
    let doc = JSON.parse(convert.xml2json(xml, {
      compact: true
    }));
    const list = doc["rss"]["list"];
    const $class = doc["rss"]["class"];
    const pInfo = list["_attributes"];
    let vList;
    if (!isIds) {
      vList = [].concat(list["video"] || []).map(o => {
        return {
          id: o.id._text,
          name: o.name._cdata,
          last: o.last._text,
          note: o.note._cdata
        };
      });
    } else {
      const o = list["video"];
      let dd = o.dl.dd;
      let videolist;
      let formatVideoList = (o) => {
        return o._cdata.split("#").map(s => {
          s = s.split("$");
          return {
            label: s[0],
            src: s[1]
          };
        });
      }
      if (dd.length) {
        const len = parseInt(dd.length);
        videolist = [];
        for (let i = 0; i < len; ++i) {
          videolist.push({
            flag: dd[i]._attributes.flag,
            list: formatVideoList(dd[i])
          });
        }
      } else {
        videolist = [{
          flag: dd._attributes.flag,
          list: formatVideoList(dd)
        }];
      }
      vList = {
        id: o.id._text,
        name: o.name._cdata,
        type: o.type._text,
        last: o.last._text,
        note: o.note._cdata,
        pic: o.pic._text,
        actor: o.actor._cdata,
        director: o.director._cdata,
        des: o.des._cdata,
        dd: videolist
      };
    }
    return {
      page: pInfo["page"],
      pageCount: pInfo["pagecount"],
      recordCount: pInfo["recordcount"],
      vList: vList
    };
  }
}