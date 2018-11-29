var app = getApp()
Page({
  data: {
    currentTab: 0,
    orderList: [
      {
        img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1535359473354&di=ac59cac5135de74860d58d2b8e111a20&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F15%2F35%2F66%2F49458PICkpX_1024.jpg',
        title:"苹果Macpro",
        content:'这是苹果的内容，苹果核的金额偶记家电节善卷洞京东上京东是的奇偶这是问问Hi好湿湿的'
      }
    ]
  },
  onLoad: function (options) {
    
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
    }
  }
})