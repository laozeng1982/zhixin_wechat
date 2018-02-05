// pages/course/course.js
// 课程设置页

import DataStructure from '../../../datamodel/DataStructure'

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentCourse: {},
        displayItems: {}
    },

    /**
     * 初始化页面数据
     */
    initPageCourse: function (options) {
        let course = {};


        // 创建新课程
        if (options.model === "newCourse") {
            course = new DataStructure.Course();
        } else {
            // 修改已有新课程
            let courseId = parseInt(options.model.split("=")[1]);
            console.log("courseId", courseId);
        }

        let displayItems = [
            {
                id: "name",
                name: "课程名字*",
                display: true,
                tip: "请输入",
                type: "input",
                value: "",
                hasValue: false
            },
            {
                id: "address",
                name: "课程地址*",
                display: true,
                tip: "请选择",
                type: "picker",
                value: "",
                hasValue: false
            },
            {
                id: "startDate",
                name: "课程开始日期*",
                display: true,
                tip: "请选择",
                type: "picker",
                value: "",
                hasValue: false
            },
            {
                id: "endDate",
                name: "程结束日期*",
                display: true,
                tip: "请选择",
                type: "picker",
                value: "",
                hasValue: false
            },
            {
                id: "recurringRule",
                name: "重复规则*",
                display: true,
                tip: "请选择",
                type: "picker",
                value: "",
                hasValue: false
            },
            {
                id: "description",
                name: "课程描述*",
                display: true,
                tip: "请简要介绍一下课程",
                type: "textarea",
                value: "",
                hasValue: false
            },
            {
                id: "startTime",
                name: "课程开始时间*",
                display: true,
                tip: "请选择",
                type: "picker",
                value: "",
                hasValue: false
            },
            {
                id: "duration",
                name: "课程时长*",
                display: true,
                tip: "请选择",
                type: "picker",
                value: "",
                hasValue: false
            },
            {
                id: "totalStudentNumber",
                name: "上课学生人数上限*",
                display: true,
                tip: "请输入",
                type: "input",
                value: "",
                hasValue: false
            }

        ];


        this.setData({
            displayItems: displayItems,
            currentCourse: course
        });
    },

    onFormSubmit: function (e) {
        console.log(e);
    },

    onFormReset: function (e) {
        console.log(e);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 根据入口设置标签栏
        let coursePageTitle = "";
        if (options.model === "newCourse") {
            coursePageTitle = '创建新课程';
        } else {
            coursePageTitle = '修改课程';
        }

        wx.setNavigationBarTitle({
            title: coursePageTitle,
        });

        // 初始化页面
        this.initPageCourse(options);

        this.setData({
            options: options
        });
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