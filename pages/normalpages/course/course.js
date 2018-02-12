// pages/course/course.js
// 课程设置页

import DataStructure from '../../../datamodel/DataStructure'

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        options: {},
        currentCourse: {},
        courseItems: [
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
                id: "room",
                name: "教室地址*",
                display: true,
                tip: "请输入或选择",
                component: {
                    name: "picker",
                    type: "text",
                    mode: "region",
                    value: "请输入或选择",
                    hasValue: false
                },
            },
            {
                // 3
                id: "startDate",
                name: "起止日期*",
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
                id: "endDate",
                name: "起止日期*",
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
                // 5
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
                // 6
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
                // 7
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
                // 8
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
                // 9
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

        ],
        timeList: [],
        timeListIdx: 0,
        selectedLocation: new DataStructure.Location()

    },

    /**
     * 初始化页面数据
     */
    initPageCourse: function (options) {
        let course = {};
        let courseItems = this.data.courseItems;
        let userInfo = app.Util.loadData(app.Settings.Storage.WeChatUser);

        if (userInfo.teacherCourseSet.length === 0) {

        }

        // 创建新课程
        if (options.model === "newCourse") {
            course = new DataStructure.Course();
        } else {
            // 修改已有新课程
            let courseId = parseInt(options.model.split("=")[1]);

            console.log(userInfo);
            console.log("courseId", courseId);
        }

        let timeList = [45, 50, 55, 60, 75, 90, 100, 120];

        this.setData({
            courseItems: courseItems,
            timeList: timeList,
            currentCourse: course
        });
    },

    onSetRecurringRules: function (e) {
        wx.navigateTo({
            url: '../set_recurring/set_recurring',
        });
    },

    /**
     * 响应Picker选择
     * @param e
     */
    onPickerChange: function (e) {
        console.log(e.currentTarget.id, e.detail.value);
        let courseItems = this.data.courseItems;
        let timeListIdx = this.data.timeListIdx;
        for (let item of courseItems) {
            if (item.id === e.currentTarget.id) {
                switch (item.id === "duration") {
                    case "duration":
                        item.component.value = this.data.timeList[parseInt(e.detail.value)];
                        timeListIdx = parseInt(e.detail.value);
                        break;
                    case "startDate":

                        break;
                    case "endDate":
                        break;
                    default:
                        item.component.value = e.detail.value;
                        break;

                }

                break;
            }
        }

        this.setData({
            timeListIdx: timeListIdx,
            courseItems: courseItems
        });
    },

    /**
     * 响应选择位置
     */
    onChooseLocation: function () {
        let host = this;
        let courseItems = this.data.courseItems;

        wx.chooseLocation({
            success: function (res) {
                console.log(res);
                let selectedLocation = new DataStructure.Location();
                selectedLocation.latitude = res.latitude;
                selectedLocation.longitude = res.longitude;
                selectedLocation.address = res.address;
                selectedLocation.name = res.name;

                host.setData({
                    selectedLocation: selectedLocation
                });

                console.log(host.data.selectedLocation);
            }
        });

    },


    /**
     * 提交表单
     */
    onFormSubmit: function (e) {
        console.log(e.detail.value);
        let course = new DataStructure.Course();

        // 先收集信息，因为重复规则用的view控件，无法在e.detail.value中体现
        for (let item in e.detail.value) {
            console.log(item, ":", e.detail.value[item]);

            // 如果有，直接添加
            if (course.hasOwnProperty(item)) {
                course[item] = e.detail.value[item];
            } else if (item === "address") {
                // 经纬度直接拷贝
                let selectedLocation = this.data.selectedLocation;
                course.location.latitude = selectedLocation.latitude;
                course.location.longitude = selectedLocation.longitude;

                // 如果用户手动输入，则需要拷贝输入的内容
                if (selectedLocation.address === "") {
                    course.location.address = e.detail.value[item];
                } else {
                    course.location.address = selectedLocation.address;
                }

                if (selectedLocation.name === "") {
                    course.location.name = e.detail.value[item];
                } else {
                    course.location.name = selectedLocation.name;
                }

            } else if (item === "room") {
                course.location.room = e.detail.value[item];
            }

            if (item !== "description") {

            }
        }

        console.log(course);

        // 先检查信息，有为空的即弹出信息提示用户
        for (let item in e.detail.value) {
            console.log(item, ":", e.detail.value[item]);
            if (item !== "description") {
                if (e.detail.value[item] === "") {
                    for (let courseItem of this.data.courseItems) {
                        if (courseItem.id === item) {
                            let tips = courseItem.name.split("*")[0];
                            wx.showModal({
                                title: '缺少必要信息',
                                content: "请输入" + tips,
                            });
                            return;
                        }
                    }
                }
            }
        }

        if (course.status === "") {
            course.status = "Preparing";
        }

        // 根据页面进入情况保存
        if (this.data.options.model === "newCourse") {
            let userInfo = wx.getStorageSync("WeChatUser");
            userInfo.teacherCourseSet.push(course);
            app.Util.saveData(app.Settings.Storage.WeChatUser, userInfo);
        } else {

        }

        wx.navigateBack({});
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        // 根据入口设置标签栏
        let options = this.data.options;
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