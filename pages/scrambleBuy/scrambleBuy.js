const app = getApp()
var Trequest = require("../../utils/request.js");
Page({
  data: {
    search: '',
    basicMoney: 3000,
    addMoney: 200,
    marketMoney: 6000,
    brokerageMoney: 20,
    goods_list: [],
    pageNum:1
  },
  onLoad: function () {
    let date = new Date();
    var dayTime = date.getTime()
    var that = this
    Trequest({
      url: 'goods_auction/getlist',
      data: {
        jinggou:1
      },
      callback(res) {
        console.log(res)
        console.log(res.data.data)
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
          if(i.status == 1){
            obj.status = '竞购中'
            var t = i.newtime * 1000
            console.log(t, 't')
            obj.time = i.status_text;
            obj.id = i.id
            obj.type = 1
          } else if (i.status == 2){
            obj.id = i.id
            obj.status = '已结束'
            obj.time = i.status_text
            obj.id = i.id
            obj.type = 2
          } else if (i.status == 3){
            obj.status = '未开始'
            obj.time = i.status_text
            obj.id = i.id
            obj.type = 3
          }
          goodsList.push(obj)
        }
        that.setData({
          goods_list: goodsList
        })

      }
    })
  },
  getBannerList() {
    Trequest({
      url: 'goods_auction/getlist',
      data: { time: dayTime },
      callback(res) {

      }
    })
  },
  toBidding(e){
    var id = e.currentTarget.dataset.id;
    var types = e.currentTarget.dataset.type;
    if(types == 1){
      wx.navigateTo({
        url: '../bidding/bidding?id=' + id,
      })
    } else if (types == 2){
      wx.navigateTo({
        url: '../bidding/bidding?id=' + id +'&types=0&over_add="#999"',
      })
    } else if (types == 3){
      wx.showToast({
        title: '未开始',
        icon: 'none'
      })
    }
  },
  tosearch() {
    wx.navigateTo({
      url: '../sortList/sortList',
    })
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh()
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
      url: "goods_auction/getlist",
      method: 'POST',
      data: {
        jinggou: 1,
        p: pageNum
      },
      callback(res) {
        console.log(res)
        var goodsList = that.data.goods_list
        var obj = {}
        for (let i of res.data.data) {
          obj = {}
          obj.src = i.goods.pic
          obj.title = i.goods.title
          obj.basicMoney = i.price_start
          obj.addMoney = i.price_step
          obj.marketMoney = i.goods.price
          obj.brokerageMoney = i.commission
          if (i.status == 1) {
            obj.status = '竞购中'
            var t = i.newtime * 1000
            console.log(t, 't')
            obj.time = i.status_text;
            obj.id = i.id
            obj.type = 1
          } else if (i.status == 2) {
            obj.id = i.id
            obj.status = '已结束'
            obj.time = i.status_text
            obj.id = i.id
            obj.type = 2
          } else if (i.status == 3) {
            obj.status = '未开始'
            obj.time = i.status_text
            obj.id = i.id
            obj.type = 3
          }
          goodsList.push(obj)
        }
        that.setData({
          goods_list: goodsList
        })
        wx.hideLoading();
      }
    })
  },
})
