// pages/product_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceStatus : '',
    gradationStatus : '',
    depthStatus : '',
    level : '',
    object : '',
    epuStatus : '',
    sameTypeMax : '',
    sameTypeSource : '',
    pageType : '',
    _wrongProblemStatus : '',
    problemType : '',
    problemSource : '',
    columnCount : '',
    borderControl : '',
    serviceType : '',
    serviceLauncher : '',
    _exceptionHandler : '',
    _serviceStartTime :'',
    _serviceEndTime :'',
    price : '',
    subject : '',
    grade : '',
    name : '',
    productID : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this)
    const EPUs = ['EPU1', 'EPU2', 'EPU3'];
    const gradations = ['第1层 题目', '第2层 过程', '第3层 引导'];
    const depths = ['第1代 错题', '第2代 类型', '第3代 考试'];
    const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const errStatus = ['现在仍错的题', '曾经错过的题'];
    const handles = ['全部标记为√再生成', '全部标记为×再生成', '不生成'];
    let detailData = getApp().globalData.detailData;
    let { status, gradation, depth, level, object, epu, sameTypeMax, sameTypeSource,
      pageType, wrongProblemStatus, problemType, problemSource, columnCount, borderControl,
      serviceType, serviceLauncher, exceptionHandler, serviceStartTime, serviceEndTime, price, subject,
      grade, name, productID} = detailData;
    let serviceStatus = status ? '运行': '停止';
    let gradationStatus = gradations[gradation-1];
    let depthStatus = depths[depth-1];
    let epuStatus = EPUs[epu-1];
    let _wrongProblemStatus = errStatus[wrongProblemStatus-1];
    let _exceptionHandler = handles[exceptionHandler-1];
    let _serviceStartTime = this.timestampToTime(serviceStartTime);
    let _serviceEndTime = this.timestampToTime(serviceEndTime);
    this.setData({
      serviceStatus,
      gradationStatus,
      depthStatus,
      level,
      object,
      epuStatus,
      sameTypeMax,
      sameTypeSource,
      pageType,
      _wrongProblemStatus,
      problemType,
      problemSource,
      columnCount,
      borderControl,
      serviceType,
      serviceLauncher,
      _exceptionHandler,
      _serviceStartTime,
      _serviceEndTime,
      price,
      subject,
      grade,
      name,
      productID
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D;
  },
  selectProfuct : function(){
    let { epuStatus, productID} = this.data;
    if(epuStatus === 'EPU1'){
      wx.navigateTo({
        url: '../../pages/wrongproblem_source/index'
      })
    }else if(epuStatus === 'EPU2'){
      wx.navigateTo({
        url: `../../pages/topic_basis/index?productID=${productID}`
      })
    }
  }
})