//logs.js
const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");
var WxParse = require('../../wxParse/wxParse.js')
Page({
  data: {
    senderName:'',
    senderAdd:'',
    goodsImg:'',
    goodsTitle:'',
    goodsContent:'',
    priceOne:'',
    priceTwo:'',
    priceThree:'',
    orderId:'',
    addid:'',
    lineheight:'',
    bztrue:0,
  },
  onLoad: function (option) {
    var that = this
    console.log(option)
    if(option.addid){
      this.setData({
        orderId: option.id,
        addid: option.addid
      })
      Trequest({
        url: 'goods_auction/before',
        data: {
          user_id: wx.getStorageSync('user_info').data.id,
          sign: wx.getStorageSync('user_info').data.sign,
          order_id: option.id
        },
        callback(res) {
          console.log(res, '确认支付')
          if (res.data[3]) {
            WxParse.wxParse('article', 'html', res.data[7].content, that, 5); 
            that.isCard(res.data[7].title)
            that.setData({
              senderName: res.data[1] + ' ' + res.data[2],
              senderAdd: res.data[3] + res.data[4] + res.data[5] + res.data[6],
              goodsImg: res.data[7].pic,
              goodsTitle: res.data[7].title,
              priceOne: res.data[8],
              priceTwo: res.data[9],
              priceThree: res.data[10],
              lineheight: ''
            })
          } else {
            WxParse.wxParse('article', 'html', res.data[7].content, that, 5); 
            that.isCard(res.data[7].title)
            that.setData({
              goodsImg: res.data[7].pic,
              goodsTitle: res.data[7].title,
              goodsContent: res.data[7].content,
              priceOne: res.data[8],
              priceTwo: res.data[9],
              priceThree: res.data[10],
              lineheight: ''
            })
          }
         
        }
      })
      that.getAddressdata();
    }else{
      this.setData({
        orderId: option.id
      })
      Trequest({
        url: 'goods_auction/before',
        data: {
          user_id: wx.getStorageSync('user_info').data.id,
          sign: wx.getStorageSync('user_info').data.sign,
          order_id: option.id
        },
        callback(res) {
          console.log(res, '确认支付')
          if (res.data[3]) {
            WxParse.wxParse('article', 'html', res.data[7].content, that, 5);
            that.isCard(res.data[7].title) 
            that.setData({
              addid: res.data[0],
              senderName: res.data[1] + ' ' + res.data[2],
              senderAdd: res.data[3] + res.data[4] + res.data[5] + res.data[6],
              goodsImg: res.data[7].pic,
              goodsTitle: res.data[7].title,
              goodsContent: res.data[7].content,
              priceOne: res.data[8],
              priceTwo: res.data[9],
              priceThree: res.data[10],
              lineheight:''
            })
          } else {
            WxParse.wxParse('article', 'html', res.data[7].content, that, 5); 
            that.isCard(res.data[7].title)
            that.setData({
              senderName: '请选择收货地址',
              goodsImg: res.data[7].pic,
              goodsTitle: res.data[7].title,
              goodsContent: res.data[7].content,
              priceOne: res.data[8],
              priceTwo: res.data[9],
              priceThree: res.data[10],
              lineheight:'lineheight'
            })
          }
        }
      })
    }
  },
  catItemClick(e){
    console.log(e)
    var index = e.currentTarget.dataset.index
    var list = this.data.cat_list
    for (var i in list) i == index ? (list[i].active = true) : list[i].active = false;
    this.setData({
      cat_list: list
     })
  },
  // 选择地址
  toaddress(){
    wx.navigateTo({
      url: '../zfaddress/zfaddress?id='+this.data.orderId,
    })
  },
  getAddressdata(){
    var that = this
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      url: 'user_address/getlist',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign
      },
      callback(res) {
        console.log(res)
        for (let i of res.data.data) {
          if (i.id == that.data.addid){
            that.setData({
              senderName: i.consignee + i.mobile,
              senderAdd: i.region_province.region_name + i.region_city.region_name + i.region_district.region_name + i.address
            })
          }
        }
      }
    })
  },
  notes: function (e) {
    this.setData({
      notes: e.detail.value
    })
    console.log(this.data.notes)
  },
  // 确认支付
  payFn(){
    var that = this
    var userInfo = wx.getStorageSync('user_info').data;
    if (that.data.addid == ''){
      wx.showToast({
        title: '请选择地址',
        icon: 'none'
      })
      return
    } else if (that.data.bztrue == 1){
      if (that.data.notes == ''){
        wx.showToast({
          title: '请填写油卡信息',
          icon: 'none'
        })
      }
    }
    Trequest({
      url: 'order/edit',
      data: {
        ua_id: that.data.addid,
        sign: userInfo.sign,
        user_id: userInfo.id,
        order_id: that.data.orderId,
        remark: that.data.notes
      },
      callback(res) {
        console.log(res,'备注信息')
      }
    })
    // 支付
    var data = {}
    data.sign = userInfo.sign;
    data.user_id = userInfo.id;
    data.money = that.data.priceThree;
    data.type = 1
    data.id = 3
    data.ids = []
    data.ids.push(that.data.orderId)
    console.log(data,'data')
    Trequest({
      url: 'order/pay',
      data: data,
      callback(res) {
        console.log(res)
        if(res.data.msg == '余额不足'){
          wx.showToast({
            title: '余额不足',
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
          wx.navigateBack({
            delta:1
          })
        }
      }
    })
  },
  // 判断是否为油卡
  isCard(title){
    console.log(titles.indexOf('油卡'))
    if (title.indexOf('油卡') >= 0){
      this.setData({
        bztrue:1
      })
    }
  }
})
