const app = getApp()
var Trequest = require("../../utils/request.js");
Page({
  data: {
    search: '',
    goods_list: [],
    sortId : '',
    nullShow:false
  },
  onLoad: function (option) {
    var sortId = option.id
    if (!option.id){
      nullShow: false
      return
    }
    let date = new Date();
    var dayTime = date.getTime()
    var that = this
    Trequest({
      url: 'goods_auction/getlist',
      data: { 
        gc_id:sortId
      },
      callback(res) {
        console.log(res)
        if(res.data.length<=0){
          that.setData({
            nullShow:true
          })
          return
        }
        // console.log(res.data.data)
        var goodsList = []
        var obj = {}
        for (let i of res.data.data) {
          obj = {}
          obj.src = i.goods.pic_url
          obj.title = i.goods.title
          obj.basicMoney = i.price_start
          obj.addMoney = i.price_step
          obj.marketMoney = i.goods.price
          obj.brokerageMoney = i.commission
          obj.startTime = i.start_time
          obj.endTime = i.end_time
          obj.id = i.id
          if (i.status == 1) {
            obj.status = '竞购中'
            var t = i.newtime * 1000
            console.log(t, 't')
            obj.time = i.status_text;
            obj.type = 1
          } else if (i.status == 2) {
            obj.status = '已结束'
            obj.time = i.status_text
            obj.type = 2
          } else if (i.status == 3) {
            obj.status = '未开始'
            obj.time = i.status_text
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
  inputserch(e){
    this.setData({
      search: e.detail.value,
    })
  },
  search(){
    var that = this
    console.log(that.data.search)
    Trequest({
      url: 'goods_auction/getlist',
      data: {
        title: that.data.search
      },
      callback(res) {
        console.log(res)
        // console.log(res.data.data)
        var goodsList = []
        var obj = {}
        for (let i of res.data.data) {
          obj = {}
          obj.src = i.goods.pic_url
          obj.title = i.goods.title
          obj.basicMoney = i.price_start
          obj.addMoney = i.price_step
          obj.marketMoney = i.goods.price
          obj.brokerageMoney = i.commission
          obj.startTime = i.start_time
          obj.endTime = i.end_time
          obj.id = i.id
          if (i.status == 1) {
            obj.status = '竞购中'
            var t = i.newtime * 1000
            console.log(t, 't')
            obj.time = i.status_text;
            obj.type = 1
          } else if (i.status == 2) {
            obj.status = '已结束'
            obj.time = i.status_text
            obj.type = 2
          } else if (i.status == 3) {
            obj.status = '未开始'
            obj.time = i.status_text
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
  toDetail(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../bidding/bidding?id=' + e.currentTarget.dataset.id,
    }) 
  }
})
