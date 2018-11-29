const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");
var WxParse = require('../../wxParse/wxParse.js')
var interval = null
Page({
  data: {
   timess:'09:26:54',
   basicMoney: 3000,
   addMoney: 200,
   marketMoney: 6000,
   brokerageMoney: 20,
   baby:false,
   count:'',
   show: true,
   timer: null,
   id:0,
   prodectListInfo:'',
   productListC:'',
   date: '请选择日期',
   fun_id: 1,
   time: "10秒", //倒计时 
   currentTime: 10,
   productDetail:false,
   animationData: {},
   list:[],
   goods_list: [],
    firstPrice:'',
    secondPrice:'',
    thirdPrice:'',
    itemId:'',
    commission:'',
    fnPrice:'',
    pay_title:'竞购中',
    over_add:'#81D8CF',
    types:1
  },
  onLoad: function (option) {
    var that = this;
    var userInfo = wx.getStorageSync('user_info').data;
    if (!userInfo) {
      wx.redirectTo({
        url: "/pages/login/login?id=2"
      });
    }
    console.log(option,'option')
    if (option.types ){
      this.setData({
        types: option.types,
        over_add: '#999',
        timess:'00:00:00'
      })
    }
    this.setData({
      id:option.id,
    })
    let date = new Date();
    var dayTime = date.getTime()
    var that = this
    Trequest({
      url: 'goods_auction/getlist',
      data: { 
        id: option.id
      },
      callback(res) {
        console.log(res)
        var goodsList = []
        var obj = {}
        for (let i of res.data.data) {
          obj = {}
          obj.src = i.goods.pic
          obj.title = i.goods.title
          obj.basicMoney = i.price_start
          obj.addMoney = i.price_step
          obj.marketMoney = i.goods.price
          obj.brokerageMoney = i.commission
          obj.id = i.id
          var productContent = i.goods.content;
          WxParse.wxParse('article', 'html', productContent, that, 5); 
          that.times(i.end_time_timestamp * 1000 - dayTime)
          goodsList.push(obj)
        }
        that.setData({
          goods_list: goodsList
        })

      }
    })
    // 列表
    Trequest({
      url: 'goods_auction_activity/getlist',
      data: {
        ga_id: option.id
      },
      callback(res) {
        console.log(res)
        if (res.data.data.length <= 0) {
          return
        }
        var goodsList = []
        var obj = {}
        for (let i of res.data.data) {
          obj = {}
          obj.name = i.res.nickname
          obj.avatar = i.res.avatar
          obj.money = i.res.price
          obj.price_start = i.res.price_start
          obj.startName = i.name
          obj.id = i.id
          goodsList.push(obj)
        }
        that.setData({
          list: goodsList
        })
      }
    })
    },
  // 点击显示弹窗
  jiaclick:function(e){
    var that = this;
    if( that.data.types == 0 ){
      return
    }
    if (wx.getStorageSync('user_info').data.userProfile.keyid == ''  ){
     
      wx.showModal({
        title: '提示',
        content: '您还未实名认证，是否去实名认证？',
        success: function (res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '../rechargeRecord/rechargeRecord',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            return
          }
        }
      })
      return
    }
    // 请求数据
    Trequest({
      url: 'auction_log/add',
      data: {
        gaa_id: e.currentTarget.dataset.id,
        user_id: wx.getStorageSync('user_info').data.id,
        sign: wx.getStorageSync('user_info').data.sign
      },
      callback(res) {
        console.log(res,'请求数据')
        if( res.data.status == 0){
          wx.showToast({
            title: '他人正在出价，请稍后~，锁定期：15秒',
            icon: 'none',
            duration: 1000
          })
          return
        }else{
          that.setData({
            baby: true
          });
        }
        that.setData({
          itemId: e.currentTarget.dataset.id,
          firstPrice:res.data[0],
          thirdPrice:res.data[2],
          secondPrice:res.data[3],
          commission:res.data[5],
          fnPrice:res.data[1]
        })
      }
    })
    
    var currentTime = 10;
    clearInterval(interval)
    interval = setInterval(function () {
      console.log('定时器')
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          baby: false
        })
      }
    }, 1000)
  },
  jiaclickClose:function(){
    var that = this;
    clearInterval(interval);
    that.setData({
      baby: false,
      time: 10 + '秒'
    });
  },
  // 产品详情弹窗
  productClick: function(option){
    var that = this;
    that.setData({
      productDetail: true
    })
    // Trequest({
    //   url: 'goods_auction/getlist',
    //   data: { 
    //     goods_id:1
    //   },
    //   callback(res) {
    //     console.log(res,'产品详情弹窗')
    //     let prodectListInfo = [];
    //     let productListC = [];
    //     let productContent = res.data.data[0].goods.content;
    //     let producttitle = res.data.data[0].goods.title;
    //     prodectListInfo.push(producttitle);
    //     productListC.push(productContent);
    //     that.setData({
    //       prodectListInfo: producttitle,
    //       productListC: productContent
    //     })
    //   }
    // })
  },
  productCloseClick: function () {
    var that = this;
    that.setData({
      productDetail: false
    })
  },
  // 倒计时
  times(et){
    // clearInterval(Interval);
    var that = this
    let date = new Date();
    var time = et
    var t 
    var Interval = setInterval(function(){
      // console.log(time)
      time = time - 1000
      t = time
      if(t<=0){
        // wx.switchTab({
        //   url: '../orderGoods/orderGoods?page=3',
        // })
        that.setData({ 
          pay_title:'已结束',
          over_add:'#999',
          types:0,
          timess:'00:00:00'
         })
      }
      // console.log(t,'t')
      var hour = Math.floor(t / 1000 / 60 / 60 % 24);
      var min = Math.floor(t / 1000 / 60 % 60);
      var sec = Math.floor(t / 1000 % 60);
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (min < 10) {
        min = "0" + min;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }
      var timez = hour + ": " + min + ": " + sec;
      // console.log(timez)
      that.setData({
        timess: timez
      })
    },1000)
  },
  // 竞价记录
  toBidingRecord(e){
    wx.navigateTo({
      url: '../biddingRecord/biddingRecord?id=' + e.currentTarget.dataset.id,
    })
  },
  requestList(){
    // 列表
    var that = this
    Trequest({
      url: 'goods_auction_activity/getlist',
      data: {
        ga_id: that.data.id
      },
      callback(res) {
        if (res.data.data.length <= 0) {
          return
        }
        var goodsList = []
        var obj = {}
        for (let i of res.data.data) {
          obj = {}
          obj.name = i.res.nickname
          obj.avatar = i.res.avatar
          obj.money = i.res.price
          obj.price_start = i.res.price_start
          obj.startName = i.name
          obj.id = i.id
          goodsList.push(obj)
        }
        that.setData({
          list: goodsList
        })
      }
    })
  },
  // 确认支付
  bidListButton(){
    var that = this
    Trequest({
      url: 'auction_log/add_pay',
      data: {
        gaa_id: that.data.itemId,
        user_id: wx.getStorageSync('user_info').data.id,
        sign: wx.getStorageSync('user_info').data.sign,
        commission: that.data.commission,
        deposit: that.data.secondPrice,
        price: that.data.fnPrice
      },
      callback(res) {
        console.log(res, '竞价结果')
        if (res.data.msg == '余额不足'){
          wx.showToast({
            title: '余额不足',
            icon: 'none',
            duration: 1500
          })
          that.jiaclickClose();
        }else{
          that.jiaclickClose();
          that.requestList();
          wx.showToast({
            title: '加价成功',
            icon: 'success',
            duration: 1500
          })
        }
      }
    })
  },
    onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh()
  }
})
