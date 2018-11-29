const app = getApp()
var Trequest = require("../../utils/request.js");
Page({
  data: {
    search: '',
    goods_list: []
  },
  onLoad: function () {
    let date = new Date();
    var dayTime = date.getTime()
    var that = this
    Trequest({
      url: 'collection/getlist',
      data: {
        user_id: wx.getStorageSync('user_info').data.id,
        sign: wx.getStorageSync('user_info').data.sign,
        type:1
      },
      callback(res) {
        console.log(res,'qingqiu收藏')
        if (res.data.data.length<=0){
          wx.showToast({
            title: '暂无收藏商品',
            icon: 'none',
            duration: 1000
          })
          return
        }
        var goodsList = []
        var obj = {}
        for (let i of res.data.data) {
          if(i.res){
            obj = {}
            obj.src = i.res.pic || ''
            obj.title = i.res.title
            obj.basicMoney = i.res.price_start
            obj.addMoney = i.res.price_step
            obj.marketMoney = i.res.price
            obj.brokerageMoney = i.res.commission
            obj.startTime = i.res.start_time
            obj.endTime = i.res.end_time
            obj.id = i.collection_id
            goodsList.push(obj)
          }
        }
        that.setData({
          goods_list: goodsList
        })

      }
    })
  },
  // 点击收藏
  collectionClick(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      url: 'collection/toggle',
      data: {
        user_id: wx.getStorageSync('user_info').data.id,
        sign: wx.getStorageSync('user_info').data.sign,
        type: 1,
        collection_id: id
      },
      callback(res) {
        console.log(res, '收藏返回数据')
        if (res.data.msg == "添加成功" || res.data.msg == "恢复成功") {
          wx.showToast({
            title: '添加收藏成功',
            icon: 'success',
            duration: 1000
          })
        } else if (res.data.msg == "移动到回收站成功") {
          wx.showToast({
            title: '已取消收藏',
            icon: 'none',
            duration: 1000
          })
          wx.navigateBack({
            delta:'2'
          })
        }
      }
    })
  },
})
