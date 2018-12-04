Page({
  data: {
    Data: '',
    showhide: true,
    disabled: true,
  },
  onShow: function () {
    var that = this;

    wx.request({
      url: 'https://learningx.cn/api/v3/students/me/uploadTasks/',
      header: {
        'Content-Type': 'application/json',
        'cookie': getApp().globalData.cookie
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.length == 0) {
            var arr = [];
            for (var i = 0; i < getApp().globalData.Data.length; i++) {
              arr.push('0');
            }
            that.setData({
              showhide: true,
              Data: getApp().globalData.Data,
              Left: arr
            })
            if (that.data.Data == '') {
              that.setData({
                disabled: true
              })
            } else {
              that.setData({
                disabled: false
              })
            }
          } else {
            wx.showToast({
              title: '纠错本未标记',
              image: '../../images/fail.png'
            })
            that.setData({
              showhide: false
            })
          }
        }
      }
    })
  },
  jcb_list: function () {
    wx.navigateTo({
      url: '../../pages/jcb_list/jcb_list',
    })
  },
  add: function () {
    wx.navigateTo({
      url: '../../pages/add/add',
    })
  },
  del: function (e) {
    getApp().globalData.Data.splice(e.currentTarget.dataset.index, 1);
    getApp().globalData.bookPage.splice(e.currentTarget.dataset.index, 1);
    if (getApp().globalData.Data.length == 0) {
      this.setData({
        disabled: true
      })
    }
    this.setData({
      Data: getApp().globalData.Data
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
    wx.request({
      url: 'https://learningx.cn/api/v3/students/me/newestWrongProblems/',
      header: {
        'Content-Type': 'application/json',
        'cookie': getApp().globalData.cookie
      },
      method: 'POST',
      data: {
        sort: 1,
        max: 10,
        bookPage: getApp().globalData.bookPage
      },
      success: function (res) {
        console.log("请稍后")
        console.log(res)
        var wrongProblems = res.data;
        if (res.statusCode == 200) {
          // 题目arr
          var arr = [];
          for (var i = 0; i < res.data.wrongProblems.length; i++) {
            arr.push({
              type: res.data.wrongProblems[i].problems[0].book + '/P' + res.data.wrongProblems[i].problems[0].page + '/' + res.data.wrongProblems[i].problems[0].idx,
              problems: []
            })
          }
          for (var i = 0; i < res.data.wrongProblems.length; i++) {
            for (var j = 0; j < res.data.wrongProblems[i].problems.length; j++) {
              arr[i].problems.push({
                problemId: res.data.wrongProblems[i].problems[j].problemId,
                subIdx: res.data.wrongProblems[i].problems[j].subIdx,
                index: res.data.wrongProblems[i].problems[j].index,
                full: res.data.wrongProblems[i].problems[j].full,
              })
            }
          }
          // 答案arr
          var arr1 = [];
          for (var i = 0; i < res.data.wrongProblems.length; i++) {
            for (var j = 0; j < res.data.wrongProblems[i].problems.length; j++) {
              arr1.push({
                problemId: res.data.wrongProblems[i].problems[j].problemId,
                location: res.data.wrongProblems[i].problems[j].book + '/P' + res.data.wrongProblems[i].problems[j].page + '/' + res.data.wrongProblems[i].problems[j].idx,
                index: res.data.wrongProblems[i].problems[j].index
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
          // 生成题目
          wx.request({
            url: 'https://learningx.cn/api/v3/students/me/getProblemsFile/',
            header: {
              'Content-Type': 'application/json',
              'cookie': getApp().globalData.cookie
            },
            method: 'POST',
            data: {
              pageType: "A4",
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
        } else {
          that.setData({
            disabled: false
          })
          wx.showToast({
            title: '没有错题',
            image: '../../images/fail.png'
          })
        }
      }
    })
  }
})