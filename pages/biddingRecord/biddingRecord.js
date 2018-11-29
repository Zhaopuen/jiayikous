//logs.js
const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");
Page({
  data: {
    logs: [],
    rewardPoint:4000,
    getMoney:[
      // {
      //   ionc:'../../img/avatar.png',
      //   title:'随风而逝',
      //   money: '领先',
      //   time:'2018/08/27 21:00',
      //   price:'2300',
      //   shouyi:'获得20元竞价收益',
      //   style:'#81D8CF'
      // },
      // {
      //   ionc: '../../img/avatar.png',
      //   title: '碎花裙的夏天',
      //   money: '被超越',
      //   time: '2018/08/27 21:00',
      //   price: '2600',
      //   shouyi: '获得60元竞价收益',
      //   style: '#C7C7C7'
      // },
      // {
      //   ionc: '../../img/avatar.png',
      //   title: '小南国龙',
      //   money: '被超越',
      //   time: '2018/08/27 21:00',
      //   price: '2400',
      //   shouyi: '获得40元竞价收益',
      //   style: '#C7C7C7'
      // },
    ]
  },
  onLoad: function (option) {
    console.log(option.id)
    var that = this
    Trequest({
      url: 'auction_log/getlist',
      data: {
        gaa_id: option.id
      },
      callback(res) {
        console.log(res, 'list')
        var goodsList = []
        var obj = {}
        var requestdata = res.data.data
        console.log(requestdata.length,'length')
        for (let i = 0; i < requestdata.length;i++) {
          obj = {}
          obj.ionc = requestdata[i].user.avatar
          obj.title = requestdata[i].user.nickname
          obj.time = requestdata[i].create_time
          obj.price = requestdata[i].price
          if( i == 0 ){
            obj.money = '领先'
            obj.style = '#81D8CF'
            obj.shouyi=''
            obj.titleStyle = '#3A3A3A'
            obj.priceStyle = '#FA0200'
          }else{
            obj.money = '被超越'
            obj.style = '#C7C7C7'
            obj.shouyi = '获得' + requestdata[i].commission.commission +'元收益'
          }
          goodsList.push(obj)
        }
        that.setData({
          getMoney: goodsList
        })
      }
    })
  },

})
