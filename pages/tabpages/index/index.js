//index.js
//获取应用实例

import DataStructure from '../../../datamodel/DataStructure'
import util from "../../../utils/Util";

const app = getApp();

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        tabData: [],
        currentTabIdx: 0,

        subTabData: [],

        displaySetting: [
            {
                type: "all_course",
                name: "所有课程",
                selected: true,
                display: true
            },
            {
                type: "everyday_lesson",
                name: "每日课程安排",
                selected: false,
                display: true
            },
            {
                type: "add_new",
                name: "创建",
                selected: false,
                display: false
            }
        ]
    },

    /**
     * 生成tab页面
     */
    makeTabData: function () {
        let tabData = [
            {
                type: "course",
                name: "课程",
                data: [],
                selected: true
            },
            {
                type: "notice",
                name: "布告栏",
                data: [],
                selected: false
            },
            {
                type: "homework",
                name: "作业查收",
                data: [],
                selected: false
            }
        ];

        this.setData({
            tabData: tabData
        });
    },

    createNewCourse: function () {
        wx.navigateTo({
            url: '../../normalpages/course/course' + "?model=newCourse",
        });
    },

    /**
     *
     * @param e
     */
    onCourseTabItemSelected: function (e) {
        console.log("selcted:", e.currentTarget.id);
        let displaySetting = this.data.displaySetting;
        for (let item of displaySetting) {
            item.selected = item.type === e.currentTarget.id;
        }

        switch (e.currentTarget.id) {
            case "all_course":
                break;
            case "everyday_lesson":
                break;
            case "add_new":
                this.createNewCourse();
                break;
            default:
                break;
        }

        this.setData({
            displaySetting: displaySetting
        });
    },

    onCreatedNewCourse: function (e) {
        this.createNewCourse();
    },

    //事件处理函数
    onBtn: function () {
        let wechatUser = new DataStructure.WeChatUser();
        let tmpUser = {};
        tmpUser.dateOfBirth = "1982-08-30";  // (Calendar, optional),
        tmpUser.email = "25471915@qq.com";  // (string, optional),
        tmpUser.enName = "JianGe";  // (string, optional),
        tmpUser.enabled = true;  // (boolean, optional),
        tmpUser.gender = "Male";  // (string, optional) = ['Unknown', 'Male', 'Female'],
        tmpUser.weChatInfo = {
            mpOpenId: "1234",// (string, optional),
            oaOpenId: "5678", // (string, optional),
            unionId: "12345678"  // (string, optional)
        };

        wechatUser.cloneDataFrom(tmpUser);
        console.log("wechatUser", wechatUser);
        wechatUser.validate();
    },

    /**
     * 处理切换tab事件
     * @param e
     */
    onNavSwitch: function (e) {
        let currentTabIdx = e.currentTarget.dataset.current;
        let tabData = this.data.tabData;

        for (let idx = 0; idx < tabData.length; idx++) {
            tabData[idx].selected = (idx === currentTabIdx);
        }

        this.setData({
            tabData: tabData,
            currentTabIdx: currentTabIdx
        });
    },

    /**
     * 评价某堂课
     */
    onReviewLesson: function (e) {
        wx.navigateTo({
            url: '../../normalpages/review_performance/review_performance' + '?model=lesson',
        });
    },

    /**
     * 评价某次作业
     */
    onReviewHomework: function (e) {
        wx.navigateTo({
            url: '../../normalpages/review_performance/review_performance' + '?model=homework',
        });
    },

    getUserInfo: function (e) {
        console.log(e);
        app.globalData.userInfoLocal = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfoLocal,
            hasUserInfo: true
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        this.makeTabData();
        let userInfoLocal = app.Util.loadData(app.Settings.Storage.WeChatUser);
        let displaySetting = this.data.displaySetting;
        if (userInfoLocal) {
            if (userInfoLocal.teacherCourseSet.length > 0) {
                for (let item of displaySetting) {
                    if (item.type === "add_new") {
                        item.display = true;
                    }
                }
            }

            this.setData({
                userInfo: userInfoLocal,
                displaySetting: displaySetting,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfoLocal = res.userInfo;
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }

        // let indexPageTitle = '所有课程';
        // wx.setNavigationBarTitle({
        //     title: indexPageTitle,
        // });
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
