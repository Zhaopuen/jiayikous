const app = getApp()
var Trequest = require("../../utils/request.js");
Page({
  data: {
    search: '',
    goods_list: [],
    currentTab:1,
    day:''
  },
  onLoad: function () {
    let date = new Date();
    var dayTime = date.getTime()
    var that = this
    that.timestampToTime(dayTime + 86400000*2)
    that.getTimeList(1)
    // Trequest({
    //   url: 'goods_auction/getlist',
    //   data: { 
    //     status:1
    //   },
    //   callback(res) {
    //     console.log(res)
    //     var goodsList = []
    //     var obj = {}
    //     for (let i of res.data.data) {
    //       obj = {}
    //       obj.src = i.goods.pic
    //       obj.title = i.goods.title
    //       obj.basicMoney = i.price_start
    //       obj.addMoney = i.price_step
    //       obj.marketMoney = i.goods.price
    //       obj.brokerageMoney = i.commission
    //       obj.time = i.status_text
    //       obj.id = i.id
    //       goodsList.push(obj)
    //     }
    //     that.setData({
    //       goods_list: goodsList
    //     })

    //   }
    // })
  },
  // 点击收藏
  collectionClick(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      url: 'collection/toggle',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign,
        type:1,
        collection_id: id
      },
      callback(res) {
        console.log(res,'收藏返回数据')
        if (res.data.msg == "添加成功" || res.data.msg == "恢复成功"){
          wx.showToast({
            title: '添加收藏成功',
            icon: 'success',
            duration: 1000
          })
        } else if (res.data.msg == "移动到回收站成功"){
          wx.showToast({
            title: '已取消收藏',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
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
      that.getTimeList(e.target.dataset.current)
    }
  },
  timestampToTime(timestamp) {
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    console.log(D)
    this.setData({
      day: M + D
    })
    return Y + M + D + h + m + s;
  },
  getTimeList(time){
    var that = this
    Trequest({
      url: 'goods_auction/getlist',
      data: {
        time: time
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
          obj.time = i.status_text
          obj.id = i.id
          goodsList.push(obj)
        }
        that.setData({
          goods_list: goodsList
        })
      }
    })
  }
})
