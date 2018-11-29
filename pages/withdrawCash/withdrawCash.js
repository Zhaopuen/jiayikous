//logs.js
const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");
Page({
  data: {
    logs: [],
    rewardPoint:'',
    rechargeMoney:'',
  },
  onLoad: function (option) {
    var that = this
    that.setData({
      rewardPoint: option.money
    })
  },
  rechargeMoney(event){
    this.setData({
      rechargeMoney: event.detail.value
    })
  },
  rechargeFn(){
    console.log(this.data.rechargeMoney, this.data.rewardPoint)
    if (this.data.rechargeMoney > this.data.rewardPoint){
      wx.showToast({
        title: '余额不足',
        icon: 'none'
      })
      return false
    } else if (this.data.rechargeMoney == ''){
      wx.showToast({
        title: '请输入金额',
        icon:'none'
      })
      return false
    }
    var that = this
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      url: 'withdraw/add',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign,
        amount: that.data.rechargeMoney
      },
      callback(res) {
        console.log(res)
        if(res.data.status == 1){
          wx.showToast({
            title: '提现申请已提交',
            icon: 'none'
          })
        }
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
})
