//logs.js
const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");
Page({
  data: {
    logs: [],
    rewardPoint:4000,
    getMoney:[
      {
        ionc:'../../img/shouyi.png',
        title:'富春山居图积分收益',
        money: '+20',
        time:'2018/08/27 21:00'
      },
      {
        ionc: '../../img/shouyi.png',
        title: '富春山居图积分收益',
        money: '+20',
        time: '2018/08/27 21:00'
      },
      {
        ionc: '../../img/shouyi.png',
        title: '富春山居图积分收益',
        money: '+20',
        time: '2018/08/27 21:00'
      },
    ]
  },
  onLoad: function () {
    var that = this
    var userInfo = wx.getStorageSync('user_info').data;
    // 总积分
    Trequest({
      url: 'user/detail',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign
      },
      callback(res) {
        that.setData({
          rewardPoint: res.data.data.userProfile.auction_income,
        })
      }
    })
    // 收益
    Trequest({
      url: 'user_money_log/getlist',
      data: {
        user_id: wx.getStorageSync('user_info').data.id,
        sign: wx.getStorageSync('user_info').data.sign,
        controller: 'AuctionLog',
        action: 'commission'
      },
      callback(res) {
        console.log(res);
        var arr = []
        var obj = {}
        for (let i of res.data.data) {
          obj = {};
          obj.ionc = '../../img/shouyi.png';
          obj.title = i.msg;
          obj.money = '+' + i.amount;
          obj.time = i.create_time;
          arr.push(obj)
        }
        that.setData({
          getMoney: arr,
        })
      }
    })
  }
})
