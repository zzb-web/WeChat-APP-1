var arr = [];
var arr1 = [];
Page({
    data: {
        disabled: false
    },
    onShow:function(){
        arr = [];
        arr1 = [];  
    },
    onLoad: function(options) {
        var that = this;
        wx.request({
            url: 'https://learningx.cn/api/v3/students/me/paperProblems/',
            data: {
                paperID: options.paperID
            },
            header: {
                'Content-Type': 'application/json',
                'cookie': getApp().globalData.cookie
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    for (var i = 0; i < res.data.length; i++) {
                        arr.push({
                            isCorrect: true, // 正确与否
                            problemId: res.data[i].problemId, // 题目识别码
                            subIdx: res.data[i].subIdx // 小问序号
                        })
                        arr1.push({
                            index: res.data[i].idx,
                            subIdx: res.data[i].subIdx // 小问序号
                        })
                    }
                    that.setData({
                        name: options.name,
                        arr1: arr1
                    })
                }
            }
        })
    },
    aa: function(e) {
        var bool;
        if (e.detail.value == 'true') {
            bool = true;
        } else if (e.detail.value == 'false') {
            bool = false;
        }
        arr[e.target.dataset.index].isCorrect = e.detail.value;
    },
    ok: function() {
        var that = this;
        that.setData({
            disabled: true
        })
        wx.showToast({
            title: '提交中',
            icon: 'loading',
            duration: 2000000
        })
        var unix = Date.parse(new Date()) / 1000;
        wx.request({
            url: 'https://learningx.cn/api/v3/students/me/problems/',
            header: {
                'Content-Type': 'application/json',
                'cookie': getApp().globalData.cookie
            },
            method: 'POST',
            data: {
                time: unix,
                type: 4,
                problems: arr
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    wx.showToast({
                        title: '提交成功',
                        success: function(res) {
                            setTimeout(function() {
                                wx.navigateBack({
                                    url: '../../pages/sj_list/sj_list',
                                })
                            }, 1500)
                        }
                    })
                }else{
                    that.setData({
                        disabled: false
                    })
                    wx.showToast({
                        title: '提交失败',
                        image: '../../images/fail.png'
                    })
                }
            }
        })
    }
})