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
            key: 'unix',
            success: function(res) {
                var newDate = new Date(res.data * 1000);
                var date = newDate.getFullYear() + '年' + (newDate.getMonth() + 1) + '月' + newDate.getDate() + '日';
                that.setData({
                    time: date,
                    unix: res.data
                })
                wx.request({
                    url: 'https://learningx.cn/api/v3/students/me/uploadTasks/' + res.data + '/',
                    header: {
                        'Content-Type': 'application/json',
                        'cookie': getApp().globalData.cookie
                    },
                    success: function(res) {
                        if (res.statusCode == 200) {
                            for (var i = 0; i < res.data.wrongProblems.length; i++) {
                                for (var j = 0; j < res.data.wrongProblems[i].problems.length; j++) {
                                    arr.push({
                                        isCorrect: true, // 正确与否
                                        problemId: res.data.wrongProblems[i].problems[j].problemId, // 题目识别码
                                        subIdx: res.data.wrongProblems[i].problems[j].subIdx // 小问序号
                                    })
                                    arr1.push({
                                        index: res.data.wrongProblems[i].problems[j].index,
                                        subIdx: res.data.wrongProblems[i].problems[j].subIdx // 小问序号
                                    })
                                }
                            }
                            that.setData({
                                arr1: arr1
                            })
                        }
                    }
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
        wx.request({
            url: 'https://learningx.cn/api/v3/students/me/problems/',
            header: {
                'Content-Type': 'application/json',
                'cookie': getApp().globalData.cookie
            },
            method: 'POST',
            data: {
                time: parseInt(that.data.unix),
                type: 5,
                problems: arr
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    wx.request({
                        url: 'https://learningx.cn/api/v3/students/me/uploadTasks/' + parseInt(that.data.unix) + '/',
                        header: {
                            'Content-Type': 'application/json',
                            'cookie': getApp().globalData.cookie
                        },
                        method: 'delete',
                        success: function(res) {
                            if (res.statusCode == 200) {
                                wx.showToast({
                                    title: '提交成功',
                                    success: function(res) {
                                        setTimeout(function() {
                                            wx.navigateBack({
                                                url: '../../pages/jab_list/jab_list',
                                            })
                                        }, 1500)
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
                        title: '提交失败',
                        image: '../../images/fail.png'
                    })
                }
            }
        })
    }
})