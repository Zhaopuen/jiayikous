//logs.js
const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");
Page({
  data: {
    logs: [],
    rewardPoint:4000,
    getMoney:[],
    pageNum:1
  },
  onLoad: function (option) {
    var that = this
    console.log(option.balance)
    that.setData({
      rewardPoint: option.balance
    })
    Trequest({
      url: 'user_money_log/getlist',
      data: {
        user_id: wx.getStorageSync('user_info').data.id,
        sign: wx.getStorageSync('user_info').data.sign,
        controller:'AuctionLog',
        action : 'commission'
      },
      callback(res) {
       console.log(res);
       var arr = []
       var obj ={}
        for (let i of res.data.data) {
          obj = {};
            obj.ionc = '../../img/shouyi.png';
            obj.title = i.msg;
            obj.money = i.amount;
            obj.time = i.create_time;
            arr.push(obj)
        }
        that.setData({
          getMoney: arr,
          rewardPoint: option.balance
        })
      }
    })
  },
  onReachBottom: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var pageNum = this.data.pageNum + 1;
    this.setData({
      pageNum: pageNum
    })
    Trequest({
      url: "user_money_log/getlist",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 
        user_id: wx.getStorageSync('user_info').data.id,
        sign: wx.getStorageSync('user_info').data.sign,
        p: pageNum,
        controller: 'AuctionLog',
        action: 'commission'
      },
      callback(res) {
        console.log(res)
        var arr = that.data.getMoney
        var obj = {}
        for (let i of res.data.data) {
          obj = {};
          if (i.goods_name) {
            obj.ionc = '../../img/shouyi.png';
            obj.title = i.goods_name.title;
            obj.money = i.commission.commission;
            obj.time = i.create_time;
            arr.push(obj)
          }
        }
        that.setData({
          getMoney: arr
        })
        wx.hideLoading();
      }
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})
