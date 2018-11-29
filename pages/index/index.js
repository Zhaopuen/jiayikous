const app = getApp()
var Trequest = require("../../utils/request.js");
Page({
  data: {
    search:'',
    basicMoney: 3000,
    addMoney: 200,
    marketMoney: 6000,
    brokerageMoney: 20,
    banner_list:[],
    goods_list:[],
    lunbo:[]
  },
  onLoad: function () {
    let date = new Date();
    var dayTime = date.getTime()
    var that = this
    Trequest({
      url: 'goods_auction/getlist',
      // data: { time: dayTime },
      callback(res) { 
        console.log(res)
        var goodsList = []
        var obj = {}
        for (let i of res.data.data) {
          obj={}
          obj.src = i.goods.pic
          obj.title = i.goods.title
          obj.basicMoney = i.price_start
          obj.addMoney = i.price_step
          obj.marketMoney = i.goods.price
          obj.brokerageMoney = i.commission
          obj.id = i.id
          var t = i.newtime*1000;
          var hour = Math.floor(t / 1000 / 60 / 60 % 24);
          var min = Math.floor(t / 1000 / 60 % 60);
          var sec = Math.floor(t / 1000 % 60);
          obj.time = i.status_text;
          if (hour < 10) {
            hour = "0" + hour;
          }
          if (min < 10) {
            min = "0" + min;
          }
          if (sec < 10) {
            sec = "0" + sec;
          }
          goodsList.push(obj)
       }
       that.setData({
         goods_list: goodsList
       })

      }
    }),
    Trequest({
      url: 'adv/getlist',
      data: { 
        type:1
       },
      callback(res) {
        let lunbopic = [];
        let obj = {};
        for(let j of res.data.data){
          obj = {};
          obj.pic_url = j.pic_url;
          obj.id = j.gc_id
          lunbopic.push(obj)
        }
        that.setData({
          lunbo: lunbopic
        })
      }
    })
  },
  tosearch(){
    wx.navigateTo({
      url: '../sortList/sortList',
    })
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh()
  }
})
