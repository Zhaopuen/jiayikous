//logs.js
const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    // Trequest({
    //   url: 'goods/getlist',
    //   data: { gc_id:1},
    //   callback(res) {
    //     console.log('11111')
    //   }
    // })
    console.log(this.getTime())
    // this.timestamp(this.getTime())
  },
  getTime() {
    let date = new Date();
    console.log(date.getTime(),'111111111')
    let myDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + " " + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return myDate;
  },
  // 倒计时
})
