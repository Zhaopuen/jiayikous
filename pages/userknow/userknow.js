//logs.js
const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");
var WxParse = require('../../wxParse/wxParse.js')
Page({
  data: {
    logs: [],
    guizeInfo: '',
    guizeNeirong:''
  },
  onLoad: function () {
    var that = this;
    Trequest({
      url: 'article/getlist',
      data: {
        id:3
      },
      callback(res) {
        let guizeInfo = [];
        let guizeNeirong = [];
        let guizeContent = res.data.data[0].content;
        WxParse.wxParse('article', 'html', guizeContent, that, 5); 
        let guizeInfobox = res.data.data[0].title;
        guizeInfo.push(guizeInfobox);
        guizeNeirong.push(guizeContent);
        that.setData({
          guizeInfo: guizeInfobox,
          guizeNeirong: guizeContent
        })
        console.log(guizeInfo[0].title)
      }
    })
  }
})
