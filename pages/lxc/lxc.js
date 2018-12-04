var arr = [];
var arr1 = [];
Page({
    data: {
        disabled: false
    },
    onShow: function() {
        arr = [];
        arr1 = [];
        var that = this;
        wx.getStorage({
            key: 'Data',
            success: function(res) {
                for (var i = 0; i < JSON.parse(res.data.Data).length; i++) {
                    arr.push({
                        isCorrect: true, // 正确与否
                        problemId: JSON.parse(res.data.Data)[i].problemId, // 题目识别码
                        subIdx: JSON.parse(res.data.Data)[i].subIdx // 小问序号
                    })
                    arr1.push({
                        index: JSON.parse(res.data.Data)[i].idx,
                        subIdx: JSON.parse(res.data.Data)[i].subIdx // 小问序号
                    })
                }
                that.setData({
                    bookid: res.data.bookid,
                    name: res.data.name,
                    type: res.data.type,
                    page: res.data.page,
                    arr1: arr1
                })
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
        var array = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].isCorrect == false) {
                array.push(arr[i]);
            }
        }
        wx.request({
            url: 'https://learningx.cn/api/v3/students/me/problems/',
            header: {
                'Content-Type': 'application/json',
                'cookie': getApp().globalData.cookie
            },
            method: 'POST',
            data: {
                time: unix,
                type: parseInt(that.data.type),
                problems: array
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    wx.showToast({
                        title: '提交成功',
                        success: function (res) {
                            setTimeout(function () {
                                wx.navigateBack({})
                            }, 2000)
                        }
                    })
                } else {
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