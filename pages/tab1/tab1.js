Page({
    data: {
        n1: true,
        PDF: '',
        showhide1: true,
        showhide2: true
    },
    onShow: function() {
        var that = this;
        wx.request({
            url: 'https://learningx.cn/api/v3/students/me/uploadTasks/',
            header: {
                'Content-Type': 'application/json',
                'cookie': getApp().globalData.cookie
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    if (res.data.length == 0) {
                        that.setData({
                            n1: true
                        })
                    } else {
                        var newDate = new Date(res.data[0].time * 1000);
                        that.setData({
                            date: newDate.getFullYear() + '年' + (newDate.getMonth() + 1) + '月' + newDate.getDate() + '日',
                            n1: false
                        })
                        wx.request({
                            url: 'https://learningx.cn/api/v3/students/me/lastFileURLs/',
                            header: {
                                'Content-Type': 'application/json',
                                'cookie': getApp().globalData.cookie
                            },
                            success: function(res) {
                                if (res.statusCode == 200) {
                                    that.setData({
                                        Data: res.data
                                    })
                                }
                            }
                        })
                    }
                }
            }
        })
    },
    btn1: function () {
        if (this.data.showhide1 == false){
            this.setData({
                showhide1: true
            })
        }else{
            this.setData({
                showhide1: false
            }) 
        }
        this.setData({
            showhide2: true
        })
    },
    btn2: function () {
        if (this.data.showhide2 == false) {
            this.setData({
                showhide2: true
            })
        } else {
            this.setData({
                showhide2: false
            })
        }
        this.setData({
            showhide1: true
        })
    },
    downloadFile: function(e) {
        if (e.currentTarget.dataset.pdf == ''){
            wx.showToast({
                title: '没有文档',
                image: '../../images/fail.png'
            })
        }else{
            this.setData({
                showhide1: true,
                showhide2: true
            })
            wx.showToast({
                title: '下载中',
                icon: 'loading',
                duration: 2000000
            })
            wx.downloadFile({
                url: e.currentTarget.dataset.pdf,
                success: function (res) {
                    var filePath = res.tempFilePath;
                    wx.openDocument({
                        filePath: filePath,
                        fileType: 'pdf',
                        fail: function (res) {
                            wx.showToast({
                                title: '下载失败',
                                image: '../../images/fail.png'
                            }) 
                        }
                    })
                    wx.hideToast();
                },
                fail:function(){
                    wx.showToast({
                        title: '下载失败',
                        image: '../../images/fail.png'
                    })
                }
            })
        }
    },
    Clip: function (e) {
        if (e.currentTarget.dataset.pdf == '') {
            wx.showToast({
                title: '没有文档',
                image: '../../images/fail.png'
            })
        } else {
            this.setData({
                showhide1: true,
                showhide2: true
            })
            wx.setClipboardData({
                data: encodeURI(e.currentTarget.dataset.pdf),
                success: function(res) {
                    wx.hideToast();
                    wx.showModal({
                        title: '复制成功',
                        confirmText: '去粘贴',
                        showCancel: false
                    })
                }
            })
        }
    }
})