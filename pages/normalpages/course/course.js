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
        displayItems: {},
        timeList: [],
        timeListIdx: 0,
        periodArray: ["周", "月", "年"],
        periodItemArray: [1, 2, 3, 4, 5, 6, 7],
        recurringRuleArray: [["每"], ["周", "月", "年"], [1, 2, 3, 4, 5, 6, 7], ["次课"]],
        recurringRuleIdx: [0, 0, 0, 0]

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
                // 0
                id: "name",
                name: "课程名字*",
                display: true,
                tip: "请输入",
                component: {
                    name: "input",
                    type: "text",
                    mode: "",
                    value: "",
                    hasValue: false
                },
            },
            {
                // 1
                id: "address",
                name: "上课地址*",
                display: true,
                tip: "请选择",
                component: {
                    name: "picker",
                    type: "text",
                    mode: "region",
                    value: "请选择",
                    hasValue: false
                },
            },
            {
                // 2
                id: "startDate",
                name: "课程开始日期*",
                display: true,
                tip: "请选择",
                component: {
                    name: "picker",
                    type: "text",
                    mode: "date",
                    value: "请选择",
                    hasValue: false
                },
            },
            {
                // 3
                id: "endDate",
                name: "程结束日期*",
                display: true,
                tip: "请选择",
                component: {
                    name: "picker",
                    type: "text",
                    mode: "date",
                    value: "请选择",
                    hasValue: false
                },
            },
            {
                // 4
                id: "recurringRule",
                name: "重复规则*",
                display: true,
                tip: "请选择",
                component: {
                    name: "picker",
                    type: "text",
                    mode: "selector",
                    value: "请选择",
                    hasValue: false
                },
            },
            {
                // 5
                id: "startTime",
                name: "每次课开始时间*",
                display: true,
                tip: "请选择",
                component: {
                    name: "picker",
                    type: "text",
                    mode: "time",
                    value: "请选择",
                    hasValue: false
                },
            },
            {
                // 6
                id: "duration",
                name: "课程时长*",
                display: true,
                tip: "请选择",
                component: {
                    name: "picker",
                    type: "text",
                    mode: "",
                    value: "请选择",
                    hasValue: false
                },
            },
            {
                // 7
                id: "totalStudentNumber",
                name: "上课学生人数上限*",
                display: true,
                tip: "请输入总人数",
                component: {
                    name: "text",
                    type: "number",
                    mode: "",
                    value: "",
                    hasValue: false
                },
            },
            {
                // 8
                id: "description",
                name: "课程描述",
                display: true,
                tip: "请简要介绍一下课程",
                component: {
                    name: "textarea",
                    type: "text",
                    mode: "",
                    value: "",
                    hasValue: false
                },
            },

        ];

        let timeList = [45 + " 分钟", 50 + " 分钟", 55 + " 分钟", 60 + " 分钟", 75 + " 分钟", 90 + " 分钟", 100 + " 分钟", 120 + " 分钟"];

        this.setData({
            displayItems: displayItems,
            timeList: timeList,
            currentCourse: course
        });
    },



    makeArray: function (number) {
        let array = [];
        for (let idx = 1; idx < number + 1; idx++) {
            array.push(idx);
        }

        return array;
    },

    onPeriodPickerColumnChange: function (e) {
        console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        let recurringRuleIdx = this.data.recurringRuleIdx;
        let recurringRuleArray = this.data.recurringRuleArray;
        if (e.detail.column === 1) {
            recurringRuleIdx[1] = e.detail.value;
            switch (e.detail.value) {
                // 周
                case 0:
                    recurringRuleArray[2] = this.makeArray(7);
                    recurringRuleIdx[2] = 1;
                    break;
                // 月
                case 1:
                    recurringRuleArray[2] = this.makeArray(31);
                    recurringRuleIdx[2] = 4;
                    break;
                // 年
                case 2:
                    recurringRuleArray[2] = this.makeArray(365);
                    recurringRuleIdx[2] = 53;
                    break;
                default:
                    break;
            }
        } else if (e.detail.column === 2) {
            recurringRuleIdx[2] = e.detail.value;
        }

        this.setData({
            recurringRuleIdx: recurringRuleIdx,
            recurringRuleArray: recurringRuleArray
        });
    },

    /**
     * 响应Picker选择
     * @param e
     */
    onPickerChange: function (e) {
        console.log(e.currentTarget.id, e.detail.value);
        let displayItems = this.data.displayItems;
        for (let item of displayItems) {
            if (item.id === e.currentTarget.id) {
                if (item.id === "duration") {
                    item.component.value = this.data.timeList[parseInt(e.detail.value)];
                } else if (item.id === "recurringRule") {
                    let recurringRuleArray = this.data.recurringRuleArray;
                    let recurringRuleIdx = this.data.recurringRuleIdx;

                    item.component.value = recurringRuleArray[0][recurringRuleIdx[0]] +
                        recurringRuleArray[1][recurringRuleIdx[1]] +
                        recurringRuleArray[2][recurringRuleIdx[2]] +
                        recurringRuleArray[3][recurringRuleIdx[3]];
                } else {
                    item.component.value = e.detail.value;
                }

            }
        }

        this.setData({
            displayItems: displayItems
        });
    },

    /**
     * 跳转到选择地址页面
     */
    onSelectAddress: function (e) {
        wx.navigateTo({
            url: '../set_location/set_location',
        });
    },

    /**
     * 提交表单
     */
    onFormSubmit: function (e) {
        console.log(e.detail.value);
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