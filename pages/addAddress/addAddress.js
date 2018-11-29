//logs.js
const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");
var app = getApp();
Page({
  data: {
    userInfo:{
      province: 2,
      city: 52,
      district: 500,
    },
    logs: [],
    // senderName: '',
    // senderPhone: '',
    detailAdd: '',
    region: ['浙江省', '杭州市', '西湖区'],
    regionArray: [[], [], []],
    regionOpts: [[], [], []],
    regionIndex: [0, 0, 0],
    prevRegionArray: null,
    prevRegionOpts: null,
    prevRegionIndex: null,
    userName: '',
    mobile: '',
    addressDetail:'',
    defAdd:'../address/address'
  },
  // 输入框的值
  senderName: function (e) {
    this.setData({
      userName: e.detail.value,
    })
  },
  senderPhone: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  addressinput: function(e){
    this.setData({
      addressDetail: e.detail.value
    })
  },
  btnclick: function () {
    // var userName = this.data.userName;
    var mobile = this.data.mobile;
    var phonetel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var name = /^[u4E00-u9FA5]+$/;
    if (mobile == '') {
      wx.showToast({
        icon: 'none',
        title: '手机号不能为空',
      })
      return false
    }
    else if (mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    return true;
  },
  addbtnClick: function(){
    var that = this;
    var userName = that.data.userName;
    var mobile = that.data.mobile;
    var addressDetail = that.data.addressDetail;
    if (userName == ""){
      wx.showToast({
        icon:'none',
        title: '请输入姓名',
      })
      return false;
    } else if (mobile == ""){
      wx.showToast({
        icon: 'none',
        title: '请输入手机号码',
      })
      return false;
    } else if (addressDetail == ""){
      wx.showToast({
        icon: 'none',
        title: '请输入详细地址',
      })
      return false;
    }
    let {
      province,
      city,
      district
    } = this.data.userInfo;
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      url: 'user_address/add',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign,
        consignee: that.data.userName,   //收货人姓名
        mobile: that.data.mobile,   //收货人电话
        province: province,   //省
        city: city,   //市
        district: district,   //区
        address: that.data.addressDetail,   //详细地址
      },
      callback(res) {
        console.log(res)
        wx.navigateTo({
          url: that.data.defAdd,
        })
      }
    })
  },
  onLoad: function (option) {
    if (option.id){
      this.setData({
        defAdd: '../zfaddress/zfaddress?id=' + option.order
      })
    }
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
    this.getRegionOpts(1, getCallBack(0, 2));
    2 && this.getRegionOpts(2, getCallBack(1, 52));
    52 && this.getRegionOpts(52, getCallBack(2, 500));
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
  addFn(){
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
    console.log(province,city,district);
    //打印
  }
})
