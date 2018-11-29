//logs.js
const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");
Page({
  data: {
    name:'大明',
    avatar:'../../img/avatar.png',
    sy:'300.00',
    ye:'3000.00',
    myInfoBox:[],
    balance:'',
    money:'',
      order:[
          {
            img:'../../img/ywc.png',
            title:'已成交',
            href:'../orderGoods/orderGoods?page=0'
          },
          {
            img:'../../img/wcj.png',
            title:'未完成',
            href: '../orderGoods/orderGoods?page=1'
          },
          {
            img:'../../img/dfk.png',
            title:'待付款',
            href: '../orderGoods/orderGoods?page=2'
          },
          {
            img:'../../img/dfh.png',
            title:'待发货',
            href: '../orderGoods/orderGoods?page=3'
          },
          {
            img:'../../img/dsh.png',
            title:'待收货',
            href: '../orderGoods/orderGoods?page=4'
          },
      ],
    tools: [
      {
        img: '../../img/jifen.png',
        title: '积分',
        href: '../rewardPoints/rewardPoints'
      },
      {
        img: '../../img/shoucang.png',
        title: '收藏',
        href: '../collectRecord/collectRecord'
      },
      {
        img: '../../img/dizhi.png',
        title: '收货地址',
        href: '../address/address'
      },
      {
        img: '../../img/xuzhi.png',
        title: '用户须知',
        href: '../userknow/userknow'
      },
      {
        img: '../../img/kefu3.png',
        title: '客服',
        href: '#'
      },
      {
        img: '../../img/shouhou.png',
        title: '售后',
        href: '../service/service'
      },
    ],

  },
  onLoad: function () {
    console.log('执行了onLoad');
    var that = this;
    // 判断是否登录
    var userInfo = wx.getStorageSync('user_info').data;
    if (!userInfo) {
      wx.redirectTo({
        url: "/pages/login/login?id=1"
      });
    }
    Trequest({
      url: 'user/detail',
      data: { 
        user_id: userInfo.id,
        sign: userInfo.sign
      },
      callback(res) {
        console.log(res)
        that.setData({
          balance: res.data.data.userProfile.auction_income,
          money: res.data.data.money
        })
        var myInfo = [];
        var obj = {};
        obj.nickname = res.data.data.nickname;
        obj.avatar = res.data.data.avatar;
        obj.yue = res.data.data.money;
        obj.shouyi = res.data.data.userProfile.auction_income;
        myInfo.push(obj)
        that.setData({
          myInfoBox: myInfo
        })
      }
    })
  },
  toBalance(){
    wx.navigateTo({
      url: '../balance/balance?money='+ this.data.money,
    })
  },
  toGetMoney(){
    console.log(this.data.balance,' this.data.balance')
    wx.navigateTo({
      url: '../getMoney/getMoney?balance=' + this.data.balance,
    })
  },
  onPullDownRefresh: function () {
    this.onShow();
    wx.stopPullDownRefresh()
  },
  onShow(){
    var that = this;
    var userInfo = wx.getStorageSync('user_info').data;
    // console.log('执行了onshow');
    Trequest({
      url: 'user/detail',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign
      },
      callback(res) {
        console.log(res)
        that.setData({
          balance: res.data.data.userProfile.auction_income,
          money: res.data.data.money
        })
        var myInfo = [];
        var obj = {};
        obj.nickname = res.data.data.nickname;
        obj.avatar = res.data.data.avatar;
        obj.yue = res.data.data.money;
        obj.shouyi = res.data.data.userProfile.auction_income;
        myInfo.push(obj)
        that.setData({
          myInfoBox: myInfo
        })
      }
    })
  }
})
