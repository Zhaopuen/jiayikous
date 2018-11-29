var app = getApp()
var Trequest = require("../../utils/request.js");
Page({
  data: {
    currentTab: 0,
    orderList: [
      {
        img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1535359473354&di=ac59cac5135de74860d58d2b8e111a20&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F15%2F35%2F66%2F49458PICkpX_1024.jpg',
        title:"苹果Macpro",
        content:'这是苹果的内容，苹果核的金额偶记家电节善卷洞京东上京东是的奇偶这是问问Hi好湿湿的'
      }
    ],
    orderListqb: [],
    getDatadfk:[],
    getDataycj:[],
    getDatawcj:[],
    getDatadfh:[],
    getDatadsh:[]
  },
  onLoad: function (options) {
    this.setData({
      currentTab: options.page
    })
    if (options.page == '0' ){
      // 已成交请求数据
      this.getDataycj();
    } else if (options.page == '1'){
      // 未成交请求数据
      this.getDatawcj();
    } else if (options.page == '2'){
      // 待付款请求数据
      this.getDatadfk();
    } else if (options.page == '3'){
      // 待发货
      this.getDatadfh();
    } else if (options.page == '4'){
      // 请求订单
      this.getDatadsh();
    }
    // this.getDataQ();
    var userInfo = wx.getStorageSync('user_info').data;
    // Trequest({
    //   url: 'goods_auction/edit',
    //   data: {
    //     user_id: wx.getStorageSync('user_info').data.id,
    //     sign: wx.getStorageSync('user_info').data.sign
    //   },
    //   callback(res) {
    //     console.log(res, 'order')
    //   }
    // })
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      if (e.target.dataset.current == '0') {
        // 已成交请求数据
        this.getDataycj();
      } else if (e.target.dataset.current == '1') {
        // 未成交请求数据
        this.getDatawcj();
      } else if (e.target.dataset.current == '2') {
        // 待付款请求数据
        this.getDatadfk();
      } else if (e.target.dataset.current == '3') {
        // 待发货
        this.getDatadfh();
      } else if (e.target.dataset.current == '4') {
        // 请求订单
        this.getDatadsh();
      }
    }
  },
  // 请求数据
  // getDataQ(){
  //   var that = this
  //   var userInfo = wx.getStorageSync('user_info').data;
  //   Trequest({
  //     url: 'order/getlist',
  //     data: {
  //       user_id: userInfo.id,
  //       sign: userInfo.sign
  //     },
  //     callback(res) {
  //       if (res.data.data.length <= 0) {
  //         return
  //       }
  //       var myInfo = [];
  //       var obj = {};
  //       for (let i of res.data.data) {
  //         obj = {};
  //         obj.img = i.goods.pic;
  //         obj.title = i.goods.title;
  //         obj.content = i.goods.content;
  //         myInfo.push(obj)
  //       }
  //       that.setData({
  //         orderListqb: myInfo
  //       })
  //     }
  //   })
  // },
  // 待付款
  getDatadfk(){
    var that = this
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      url: 'order/getlist',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign,
        pay_status :0,
        status:0
      },
      callback(res) {
        console.log(res,'待付款')
        if (res.data.data.length <= 0) {
          return
        }
        var myInfo = [];
        var obj = {};
        for (let i of res.data.data) {
          obj = {};
          obj.img ='https://jingpai.fengsh.cn' + i.order_goods[0].goods_info_arr.pic || '';
          obj.title = i.order_goods[0].goods_info_arr.title;
          obj.content = i.price;
          obj.id = i.id
          myInfo.push(obj)
        }
        that.setData({
          getDatadfk: myInfo
        })
        console.log(that.data.getDatadfk)
      }
    })
  },
  // 已成交
  getDataycj(){
    var that = this
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      url: 'order/getlist',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign,
        // status: 1,
        pay_status:1,
        shipping_status:2
      },
      callback(res) {
        console.log(res, '已成交')
        if (res.data.data.length <= 0) {
          return
        }
        var myInfo = [];
        var obj = {};
        for (let i of res.data.data) {
          obj = {};
          obj.img = 'https://jingpai.fengsh.cn' + i.order_goods[0].goods_info_arr.pic || '';
          obj.title = i.order_goods[0].goods_info_arr.title;
          obj.content = i.price;
          obj.id = i.id
          myInfo.push(obj)
        }
        that.setData({
          getDataycj: myInfo
        })
      }
    })
  },
  // 未成交
  getDatawcj() {
    var that = this
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      url: 'order/getlist',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign,
        status: 2
      },
      callback(res) {
        console.log(res, '未成交')
        if (res.data.data.length <= 0) {
          return
        }
        var myInfo = [];
        var obj = {};
        for (let i of res.data.data) {
          obj = {};
          obj.img = 'https://jingpai.fengsh.cn' + i.order_goods[0].goods_info_arr.pic || '';
          obj.title = i.order_goods[0].goods_info_arr.title;
          obj.content = i.price;
          obj.id = i.id
          myInfo.push(obj)
        }
        that.setData({
          getDatawcj: myInfo
        })
      }
    })
  },
  // 待发货
  getDatadfh() {
    var that = this
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      url: 'order/getlist',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign,
        pay_status: 1,
        status:1,
        shipping_status:0
      },
      callback(res) {
        console.log(res, '待发货')
        var myInfo = [];
        var obj = {};
        if (res.data.data.length<=0){
          return
        }
        for (let i of res.data.data) {
          obj = {};
          obj.img = 'https://jingpai.fengsh.cn' + i.order_goods[0].goods_info_arr.pic || '';
          obj.title = i.order_goods[0].goods_info_arr.title;
          obj.content = i.price;
          obj.id = i.id
          myInfo.push(obj)
        }
        that.setData({
          getDatadfh: myInfo
        })
      }
    })
  },
  // 待收货
  getDatadsh() {
    var that = this
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      url: 'order/getlist',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign,
        status: 1,
        pay_status:1,
        shipping_status:1
      },
      callback(res) {
        console.log(res, '待收货')
        var myInfo = [];
        var obj = {};
        if (res.data.data.length <= 0) {
          return
        }
        for (let i of res.data.data) {
          obj = {};
          obj.img = 'https://jingpai.fengsh.cn' + i.order_goods[0].goods_info_arr.pic || '';
          obj.title = i.order_goods[0].goods_info_arr.title;
          obj.content = i.price;
          obj.id = i.id;
          obj.courier = i.tracking_number
          myInfo.push(obj)
        }
        that.setData({
          getDatadsh: myInfo
        })
      }
    })
  },
  // 订单确认
  getGoodsTrue(e){
    var that = this
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      url: 'order/edit',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign,
        id: e.currentTarget.dataset.type,
        status:4
      },
      callback(res) {
        wx.showToast({
          title: res.data.msg,
          icon:'success'
        })
        wx.navigateBack({
          delta:1
        })
      }
    })
  },
  onShow(){
    // 待付款请求数据
    this.getDatadfk();
    // 待发货
    // this.getDatadfh();
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh()
  }
})