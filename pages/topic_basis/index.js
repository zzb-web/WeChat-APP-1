// pages/topic_basis/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productID : '',
    topicData : [],
    wrongProblems : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {productID} = options;
    this.setData({
      productID
    })
  },
  onShow: function () {
    let { productID } = this.data;
    var that = this;
    //获取待生成纠错本的错题信息
    wx.request({
      url: `https://learningx.cn/api/v3/students/me/wrongProblems/?sort=1&productID=${productID}`,
      header: {
        'Content-Type': 'application/json',
        'cookie': getApp().globalData.cookie
      },
      success: function (resp) {
        if (resp.statusCode === 200) {
          let wrongProblems = resp.data.wrongProblems;
          let topicData = [];
          wrongProblems.map((item, index) => {
            item.problems.map((item2, index2) => {
              topicData.push({
                topicIndex: item2.index,
                topicSource: item2.subIdx === -1 ? `${item2.book}/P${item2.page}/${item2.idx}` : `${item2.book}/P${item2.page}/${item2.idx}/(${item2.subIdx})`,
                topicReason: item2.reason
              })
            })
          })
          that.setData({
            topicData,
            wrongProblems
          })
        }
      }
    })
  },
  ok: function () {
    var that = this;
    that.setData({
      disabled: true
    })
    wx.showToast({
      title: '请稍后',
      icon: 'loading',
      duration: 2000000
    })
    // 获取所欲的错题数据
    var { wrongProblems, productID} = this.data;
          // 题目arr
          var arr = [];
          for (var i = 0; i < wrongProblems.length; i++) {
            arr.push({
              type: wrongProblems[i].problems[0].book + '/P' + wrongProblems[i].problems[0].page + '/' + wrongProblems[i].problems[0].idx,
              problems: []
            })
          }
          for (var i = 0; i < wrongProblems.length; i++) {
            for (var j = 0; j < wrongProblems[i].problems.length; j++) {
              arr[i].problems.push({
                problemId: wrongProblems[i].problems[j].problemId,
                subIdx: wrongProblems[i].problems[j].subIdx,
                index: wrongProblems[i].problems[j].index,
                full: wrongProblems[i].problems[j].full,
              })
            }
          }
          // 答案arr
          var arr1 = [];
          for (var i = 0; i < wrongProblems.length; i++) {
            for (var j = 0; j < wrongProblems[i].problems.length; j++) {
              arr1.push({
                problemId: wrongProblems[i].problems[j].problemId,
                location: wrongProblems[i].problems[j].book + '/P' + wrongProblems[i].problems[j].page + '/' + wrongProblems[i].problems[j].idx,
                index: wrongProblems[i].problems[j].index
              })
            }
          }
          var resultArr = [];
          for (i = 0; i < arr1.length; i++) {
            for (j = 0; j < resultArr.length; j++) {
              if (resultArr[j].problemId == arr1[i].problemId) {
                break;
              }
            }
            if (j == resultArr.length) {
              resultArr.push({
                problemId: arr1[i].problemId,
                location: arr1[i].location,
                index: arr1[i].index
              })
            }
          }
          
          wx.showToast({
            title: '题目生成中',
            icon: 'loading',
            duration: 2000000
          })
          //生成题目
          wx.request({
            url: 'https://learningx.cn/api/v3/students/me/getProblemsFile/',
            header: {
              'Content-Type': 'application/json',
              'cookie': getApp().globalData.cookie
            },
            method: 'POST',
            data: {
              productID: productID,
              problems: arr
            },
            success: function (res) {
              console.log("生成题目")
              console.log(res)
              if (res.statusCode == 200) {
                wx.showToast({
                  title: '答案生成中',
                  icon: 'loading',
                  duration: 2000000
                })
                // 生成答案
                wx.request({
                  url: 'https://learningx.cn/api/v3/students/me/getAnswersFile/',
                  header: {
                    'Content-Type': 'application/json',
                    'cookie': getApp().globalData.cookie
                  },
                  method: 'POST',
                  data: {
                    pageType: "A4",
                    problems: resultArr
                  },
                  success: function (res) {
                    console.log("生成答案")
                    console.log(res)
                    if (res.statusCode == 200) {
                      wx.showToast({
                        title: '生成纠错本标记任务',
                        icon: 'loading',
                        duration: 2000000
                      })
                      // 生成纠错本标记任务
                      wx.request({
                        url: 'https://learningx.cn/api/v3/students/me/uploadTasks/',
                        header: {
                          'Content-Type': 'application/json',
                          'cookie': getApp().globalData.cookie
                        },
                        method: 'POST',
                        data: {
                          time: Date.parse(new Date()) / 1000,
                          type: 1,
                          detail: JSON.stringify(wrongProblems)
                        },
                        success: function (res) {
                          console.log("成功")
                          console.log(res)
                          wx.showToast({
                            title: '成功'
                          })
                          getApp().globalData.Data = [];
                          getApp().globalData.bookPage = [];
                          setTimeout(function () {
                            wx.switchTab({
                              url: '../../pages/tab1/tab1',
                            })
                          }, 1500)
                        }
                      })
                    }
                  }
                })
              }
            }
          })
  }
})