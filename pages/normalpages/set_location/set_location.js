// pages/normalpages/set_location/set_location.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        markers: [{
            iconPath: "/resources/others.png",
            id: 0,
            latitude: 0,
            longitude: 0,
            width: 50,
            height: 50
        }],
        polyline: [{
            points: [{
                longitude: 0,
                latitude: 0
            }, {
                longitude: 0,
                latitude: 0
            }],
            color: "#FF0000DD",
            width: 2,
            dottedLine: true
        }],
        controls: [{
            id: 1,
            // iconPath: '/resources/location.png',
            position: {
                left: 0,
                top: 300 - 50,
                width: 50,
                height: 50
            },
            clickable: true
        }]
    },
    regionchange(e) {
        console.log(e.type)
    },
    markertap(e) {
        console.log(e.markerId)
    },
    controltap(e) {
        console.log(e.controlId)
    },

    /**
     * 根据用户信息初始化
     */
    initLocation: function () {
        let markers = this.data.markers;
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                console.log(res);
                markers[0].latitude = res.latitude;
                markers[0].longitude = res.longitude;
                wx.openLocation({
                    latitude: res.latitude,
                    longitude: res.longitude,
                })
            },
        });
        this.setData({
            markers: markers
        });
    },

    bindRegionChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            region: e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initLocation();
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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})