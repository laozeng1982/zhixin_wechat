//index.js
//获取应用实例

import DataStructure from '../../../datamodel/DataStructure'

const app = getApp();

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        tabData: [
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
        ],
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
                name: "每日课程",
                selected: false,
                display: true
            },
            {
                type: "add_new",
                name: "创建课程",
                selected: true,
                display: false
            }
        ]
    },

    /**
     * 生成tab页面
     */
    makeTabData: function (role) {

        let tabData = this.data.tabData;

        if (role !== "teacher") {
            tabData[1].name = "通知";
            tabData[2].name = "作业回复";
        }

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
     * 处理切换tab事件
     * @param e
     */
    onTabSwitch: function (e) {
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
     *
     * @param e
     */
    onCourseTabItemSelected: function (e) {
        console.log("selcted:", e.currentTarget.id);
        let displaySetting = this.data.displaySetting;
        for (let item of displaySetting) {
            if (item.type === "add_new") {
                item.selected = true;
            } else {
                item.selected = item.type === e.currentTarget.id;
            }
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

    /**
     * 课程页面，选择课程，带入课程的索引，跳转课程修改页面
     * @param e
     */
    onCourseSelected: function (e) {
        let url = '../../normalpages/course/course' + "?model=modifyCourseId_" + e.target.id;

        wx.navigateTo({
            url: url,
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {

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
        let userInfoLocal = app.Util.loadData(app.Settings.Storage.WeChatUser);
        app.currentAuth = userInfoLocal.currentAuth;
        let roleName = "";

        switch (userInfoLocal.currentAuth) {
            case "teacher":
                roleName = "老师";
                break;
            case "parent":
                roleName = "家长";
                break;
            case "student":
                roleName = "学生";
                break;
            default:
                break;
        }

        this.makeTabData(userInfoLocal.currentAuth);

        let indexPageTitle = roleName + '首页';
        wx.setNavigationBarTitle({
            title: indexPageTitle,
        });

        // 判断是否需要显示新建课程
        let displaySetting = this.data.displaySetting;
        if (userInfoLocal.teacherCourseSet.length > 0) {
            for (let item of displaySetting) {
                if (item.type === "add_new") {
                    item.display = true;
                }
                // 其他页面跳转回来时，当前显示哪一个次级Tab
                if (item.type === "all_course" && app.tempData.currentCourseSubTab === "all_course") {
                    item.selected = true;
                } else if (item.type === "everyday_lesson" && app.tempData.currentCourseSubTab === "everyday_lesson") {
                    item.selected = true;
                }
            }
        }

        this.setData({
            userInfo: userInfoLocal,
            userInfoLocal: userInfoLocal,
            displaySetting: displaySetting,
            hasUserInfo: true
        });

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
