Page({
    data: {
        Data: '',
        productData : [],
        showhide: true,
        disabled: true,
        showMore : false,
        showIndex : ''
    },
    onShow: function() {
        var that = this;
        //获取该学生的产品
        wx.request({
          url: 'https://learningx.cn/api/v3/students/me/products/',
          header: {
            'Content-Type': 'application/json',
            'cookie': getApp().globalData.cookie
          },
          success : function(resp){
            console.log(resp)
            if(resp.statusCode === 200){
              let productData = resp.data
              that.setData({
                productData : productData
              })
            }
          }
        })
    },
    showMore : function(event){
      let showMore = this.data.showMore;
      let showIndex = event.currentTarget.dataset.index;
        this.setData({
          showMore : !showMore,
          showIndex: showIndex
        })
    },
  detailHandle : function(event){
    let index = event.currentTarget.dataset.index;
    let {productData} = this.data;
    let detailData = productData[index];
    getApp().globalData.detailData = detailData;
      wx.navigateTo({
        url: '../../pages/product_detail/index'
      })
    },
    selectHandle : function(event){
      let index = event.currentTarget.dataset.index;
      let { productData } = this.data;
      let epu = productData[index].epu;
      if(epu == 1){
        wx.navigateTo({
          url: '../../pages/wrongproblem_source/index'
        })
      }else if(epu == 2){
        let productID = productData[index].productID;
        wx.navigateTo({
          url: `../../pages/topic_basis/index?productID=${productID}`
        })
      }else{

      }
    }
})