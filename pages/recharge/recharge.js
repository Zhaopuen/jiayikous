//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    rewardPoint:'125325.00',
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
    var that = this
    console.log('确认支付')
    if (this.data.rechargeMoney == ''){
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
      return false
    }
    var userInfo = wx.getStorageSync('user_info').data;
    wx.request({
      url: 'https://jingpai.fengsh.cn/api/pay_log/add',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign,
        id:1,
        type:4,
        price: that.data.rechargeMoney
      },
      method:'post',
      success: function (data) {
        console.log(data);
        wx.requestPayment({
          timeStamp: data.data.timeStamp,
          nonceStr: data.data.nonceStr,
          package: data.data.package,
          signType: 'MD5',
          paySign: data.data.paySign,
          success: function (res) {
            console.log(res)
            wx.showToast({
              title: '支付成功！',
              icon: 'success',
              duration: 5000
            })
            wx.navigateBack({
              delta: 1
            })
          },
          fail: function (res) {
            console.log(res)
            wx.showToast({
              title: '支付失败！',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  }
})
