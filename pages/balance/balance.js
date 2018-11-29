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
        title:'竞价收益-富春山居图',
        money: '+20',
        time:'2018/08/27 21:00',
        style:'#E81B32'
      },
      {
        ionc: '../../img/chongzhi.png',
        title: '充值',
        money: '+200000',
        time: '2018/08/27 21:00',
        style: '#E8AA0B'
      },
      {
        ionc: '../../img/tixian.png',
        title: '提现',
        money: '-1111',
        time: '2018/08/27 21:00',
        style: '#2E2E2E'
      },
    ],
    pageNum:1
  },
  onLoad: function (option) {
    var that = this
    that.setData({
      rewardPoint: option.money
    })
    console.log(option.money)
    Trequest({
      url: 'user_money_log/getlist',
      data: {
        user_id: wx.getStorageSync('user_info').data.id,
        sign: wx.getStorageSync('user_info').data.sign
      },
      callback(res) {
        console.log(res,'res');
        var arr = []
        var obj = {}
        for (let i of res.data.data) {
          obj = {};
          obj.title = i.msg;
          obj.time = i.create_time;
          if (i.action == 'add_pay' ){
            obj.money = i.amount;
            obj.style = '#2E2E2E';
            obj.ionc = '../../img/tixian.png';
          } else if (i.action == "commission"){
            obj.money = i.amount;
            obj.style = '#E81B32';
            obj.ionc = '../../img/shouyi.png';
          }else{
            obj.money = i.amount;
            obj.style = '#E8AA0B';
            obj.ionc = '../../img/chongzhi.png';
          }
          //   obj.money = '+' + i.money;
          //   obj.style = '#E81B32';
          //   obj.ionc = '../../img/shouyi.png';
          // } else if (i.status == 2){
          //   obj.money = '-' + i.money;
          //   obj.style = '#2E2E2E';
          //   obj.ionc = '../../img/tixian.png';
          // }
          arr.push(obj)
        }
        that.setData({
          getMoney: arr
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
        p: pageNum
      },
      callback(res) {
        console.log(res)
        var arr = that.data.getMoney
        var obj = {}
        for (let i of res.data.data) {
          obj = {};
          obj.title = i.title[0].title;
          obj.time = i.create_time;
          if (i.status == 1) {
            obj.money = '+' + i.money;
            obj.style = '#E81B32';
            obj.ionc = '../../img/shouyi.png';
          } else if (i.status == 2) {
            obj.money = '-' + i.money;
            obj.style = '#2E2E2E';
            obj.ionc = '../../img/tixian.png';
          }
          arr.push(obj)
        }
        that.setData({
          getMoney: arr
        })
        wx.hideLoading();
      }
    })
  },
})
