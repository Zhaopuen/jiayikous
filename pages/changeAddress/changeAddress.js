//logs.js
const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");

Page({
  data: {
    userInfo: {
      province: 2,
      city: 52,
      district: 500,
    },
    addressid:'',
    regionArray: [[], [], []],
    regionOpts: [[], [], []],
    regionIndex: [0, 0, 0],
    prevRegionArray: null,
    prevRegionOpts: null,
    prevRegionIndex: null,
    senderName: '',
    senderPhone: '',
    detailAdd: '',
    addressDetail:'',
    region: ['浙江省', '杭州市', '西湖区'],
    editInfo: []
  },
  onLoad: function (option) {
    var that = this;
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      url: 'user_address/getlist',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign
      },
      callback(res) {
        console.log(res.data.data)
        let addressList = [];
        let obj = {};
        for (let i of res.data.data) {
          i.id == option.id ? (
            obj.province = i.province,
            obj.city = i.city,
            obj.district = i.district,
          that.setData({
            senderName: i.consignee,
            senderPhone: i.mobile,
            userInfo : obj,
            detailAdd: i.address,
            addressid:option.id
          }),
            that.getAddress()
          ):''
        }
      }
    })
    
  },
  getAddress(){
    // 请求地址
    let getCallBack = (_regionIndex, initRegionId) => {
      return (opts, array) => {
        for (let index in opts) {
          let opt = opts[index];
          if (opt.region_id == initRegionId) {
            let regionIndex = this.data.regionIndex;
            regionIndex[_regionIndex] = index;
            this.setData({ regionIndex });
          }
        }
        this.changeRegionOpt(_regionIndex, opts, array);
      }
    };
    let p = this.data.userInfo.province
    let c = this.data.userInfo.city
    let d = this.data.userInfo.district
    this.getRegionOpts(1, getCallBack(0, p));
    p && this.getRegionOpts(p, getCallBack(1, c));
    c && this.getRegionOpts(c, getCallBack(2, d));
  },
  senderName: function (e) {
    this.setData({
      senderName: e.detail.value,
    })
  },
  senderPhone: function (e) {
    this.setData({
      senderPhone: e.detail.value
    })
  },
  detailAdd: function (e) {
    this.setData({
      detailAdd: e.detail.value
    })
  },
  checkClick: function(option){
    var that = this;
    var userName = that.data.senderName;
    var mobile = that.data.senderPhone;
    var addressDetail = that.data.detailAdd;
    var userInfo = wx.getStorageSync('user_info').data;
    if (userName == "") {
      wx.showToast({
        title: '请输入姓名',
      })
      return false;
    } else if (mobile == "") {
      wx.showToast({
        title: '请输入手机号码',
      })
      return false;
    } else if (addressDetail == "") {
      wx.showToast({
        title: '请输入详细地址',
      })
      return false;
    }
    Trequest({
      url: 'user_address/edit',
      data: { 
        user_id:userInfo.id,
        id: that.data.addressid,
        consignee: that.data.senderName,   //收货人姓名
        mobile: that.data.senderPhone,   //收货人电话
        province: that.data.userInfo.province,   //省
        city: that.data.userInfo.city,   //市
        district: that.data.userInfo.district,   //区
        address: that.data.detailAdd,   //详细地址
      },
      
      callback(res) {
        wx.navigateTo({
          url: '../address/address',
        })
        console.log(res)
        console.log(that.data.mobile,'2222');
        console.log(that.mobile, '111');
      }
    })
  },
    btnclick: function () {
    // var userName = this.data.userName;
    var mobile = this.data.senderPhone;
    var phonetel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var name = /^[u4E00-u9FA5]+$/;
    if (mobile == '') {
      wx.showToast({
        title: '手机号不能为空',
      })
      return false
    }
    else if (mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'error',
        duration: 1500
      })
      return false;
    }
    return true;
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  /*省市区联动*/
  getRegionOpts(regionId, callBack) {
    Trequest({
      url: "region/children",
      method: 'post',
      data: {
        m: 'area',
        a: 'get_area',
        parent_id: regionId
      },
      callback({ data: r }) {
        if (!Array.isArray(r))
          return;
        var opts = [];
        var regionArray = [];
        r.forEach(({ region_id, region_name }, index) => {
          opts.push({ region_id, region_name });
          regionArray.push(region_name);
        });
        callBack(opts, regionArray);
      }
    })
    //你哪里要取点击添加要函数

  },

  changeRegionOpt(index, regionOpts, regionArray) {
    let { regionArray: mArray, regionOpts: mOpts } = this.data;
    mArray[index] = regionArray;
    mOpts[index] = regionOpts;
    this.setData({
      regionArray: mArray,
      regionOpts: mOpts
    });
  },

  regionFocus() {
    let {
      regionArray, regionOpts, regionIndex
    } = this.data;
    this.setData({
      prevRegionArray: JSON.parse(JSON.stringify(regionArray)),
      prevRegionOpts: JSON.parse(JSON.stringify(regionOpts)),
      prevRegionIndex: JSON.parse(JSON.stringify(regionIndex))
    });
  },

  regionCancel() {
    let {
      prevRegionArray, prevRegionOpts, prevRegionIndex
    } = this.data;
    this.setData({
      regionArray: prevRegionArray,
      regionOpts: prevRegionOpts,
      regionIndex: prevRegionIndex
    });
  },

  regionPickerChange({ detail: { value: regionIndex } }) {
    let opts = this.data.regionOpts;
    let userInfo = this.data.userInfo;
    /*获取对应的省市区*/
    userInfo.province = (opts[0][regionIndex[0]] || {}).region_id;
    userInfo.city = (opts[1][regionIndex[1]] || {}).region_id;
    userInfo.district = (opts[2][regionIndex[2]] || {}).region_id;
    /*保存到用户信息*/
    this.setData({ userInfo, regionIndex });
  },

  regionPickerColumnChange({ detail: { value: index, column: col } }) {
    let region = this.data.regionOpts[col][index];
    /*如果改变了省或者市，则获取对应的市或区的子集*/
    if (col === 0)
      /*获取市列表*/
      this.getRegionOpts(region.region_id, (opts, array) => {
        /*更新市列表*/
        this.changeRegionOpt(1, opts, array);
        /*获取第一个市对应的区列表并更新*/
        this.getRegionOpts(opts[0].region_id, this.changeRegionOpt.bind(this, 2))
      }
      );
    else if (col === 1)
      /*获取区列表并更新*/
      this.getRegionOpts(region.region_id, this.changeRegionOpt.bind(this, 2))


  },
  addFn() {
    let {
      name,
      nickname,
      job_nature,
      province,
      city,
      district,
      company,
      address,
      gender,
      income_monthly,
      marital_status: ms,
      apple_id_status
    } = this.data.userInfo;
    console.log(province, city, district);
    //打印
  }
})
