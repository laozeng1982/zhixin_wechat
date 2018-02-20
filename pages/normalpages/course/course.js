// pages/course/course.js
// 课程设置页

import DataStructure from '../../../datamodel/DataStructure'
import StorageUtils from '../../../utils/StorageUtils'
import DateTimeUtils from '../../../utils/DateTimeUtils'

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        options: {},
        currentCourse: {},
        currentCourseIdx: 0,
        courseItems: {
            name: {
                // 0
                id: "name",
                name: "课程名字*",
                display: true,
                tip: "请输入",
                value: "",

            },
            location: {
                // 1
                latitude: {
                    id: "latitude",
                    name: "纬度",
                    display: true,
                    tip: "请输入或选择",
                    value: "",
                },
                longitude: {
                    id: "longitude",
                    name: "经度",
                    display: true,
                    tip: "请输入或选择",
                    value: "",
                },
                address: {
                    id: "address",
                    name: "详细地址*",
                    display: true,
                    tip: "请输入或选择",
                    value: "",
                },
                name: {
                    id: "name",
                    name: "上课地址*",
                    display: true,
                    tip: "请输入或选择",
                    value: "",
                },
                room: {
                    id: "room",
                    name: "教室地址*",
                    display: true,
                    tip: "请输入",
                    value: "",
                },
            },
            startDate: {
                // 3
                id: "startDate",
                name: "起止日期*",
                display: true,
                start: "",
                tip: "请选择",
                value: "请选择",
            },
            endDate: {
                // 4
                id: "endDate",
                name: "起止日期*",
                start: "",
                display: true,
                tip: "请选择",
                value: "请选择",
            },
            recurringRule: {
                // 5
                id: "recurringRule",
                name: "重复规则*",
                display: true,
                tip: "请选择",
                value: "请选择",
            },
            startTime: {
                // 6
                id: "startTime",
                name: "每次课开始时间*",
                start: "",
                display: true,
                tip: "请选择",
                value: "请选择",
            },
            duration: {
                // 7
                id: "duration",
                name: "课程时长*",
                display: true,
                tip: "请选择",
                value: "请选择",
            },
            totalStudentNumber: {
                // 8
                id: "totalStudentNumber",
                name: "上课学生人数上限*",
                display: true,
                tip: "请输入总人数",
                value: "",
            },
            description: {
                // 9
                id: "description",
                name: "课程描述",
                display: true,
                tip: "请简要介绍一下课程",
                value: "",
            },

        },

        // 以下用于控件临时显示
        timeList: [],
        timeListIdx: 0,
        selectedLocation: {},

        fromHide: false

    },

    /**
     * 第一次进入该页面时，根据本地数据初始化
     * @param options
     */
    loadCourse: function (options) {
        let currentCourse = {};    // 当前页面要用的课程
        let currentCourseIdx = this.data.currentCourseIdx;   // 当前页面课程的索引

        // 从本地读取数据，用来初始化页面显示课程
        let userInfo = StorageUtils.loadData(app.Settings.Storage.WeChatUser);

        // 1、根据页面进入入口，判断如何初始化，提取当前应该显示的课程
        if (options.model === "newCourse") {
            // 1.1、创建新课程
            if (userInfo.teacherCourseSet.length === 0) {
                // 当前没有课程
                currentCourse = new DataStructure.Course();
            } else {
                // 当前有课程，直接弹出最后一个，保存的时候直接push，始终操作的是最后一个
                // currentCourse = userInfo.teacherCourseSet.pop();
                currentCourse = new DataStructure.Course();
            }
        } else {
            //1.2、修改已有新课程
            // 解析课程id
            console.log(options);
            currentCourseIdx = parseInt(options.model.split("_")[1]);

            // 直接提取
            currentCourse = userInfo.teacherCourseSet[currentCourseIdx];

        }

        console.log("currentCourseIdx:", currentCourseIdx);
        console.log("currentCourse:", currentCourse);

        this.setData({
            userInfo: userInfo,
            currentCourse: currentCourse,
            currentCourseIdx: currentCourseIdx,
        });
    },

    /**
     * 初始化页面数据
     */
    initPageCourse: function () {
        console.log("Course Page onShow call");

        // 如果是由次级页面跳转回来，则不需要重新加载数据
        let courseItems = this.data.courseItems;

        if (!this.data.fromHide) {
            let currentCourse = this.data.currentCourse;

            // 2、根据课程初始化页面数据，需要分别处理上课地址和重复规律
            for (let item in currentCourse) {
                for (let displayItem in courseItems)
                    if (displayItem === item && displayItem !== "location") {
                        courseItems[displayItem].value = currentCourse[item];
                    }
            }

            // 初始化上课地址和教室
            courseItems.location.latitude.value = currentCourse.location.latitude;
            courseItems.location.longitude.value = currentCourse.location.longitude;
            courseItems.location.address.value = currentCourse.location.address;
            courseItems.location.name.value = currentCourse.location.name;
            courseItems.location.room.value = currentCourse.location.room;

            // 初始化重复规则
            app.tempData.recurringRule = currentCourse.recurringRule;
            if (app.tempData.recurringRule.constructor === Array ) {
                if (app.tempData.recurringRule.length > 0) {
                    courseItems.recurringRule.value = "每" + app.tempData.recurringRule.map(DateTimeUtils.transEnDate2ChDate).join("、");
                }
            }

            let timeList = [45, 50, 55, 60, 75, 90, 100, 120];

            this.setData({
                courseItems: courseItems,
                timeList: timeList,
            });
        } else {
            if (app.tempData.recurringRule.constructor === Array ) {
                if (app.tempData.recurringRule.length > 0) {
                    courseItems.recurringRule.value = "每" + app.tempData.recurringRule.map(DateTimeUtils.transEnDate2ChDate).join("、");
                }
            }
            this.setData({
                courseItems: courseItems,
            });
        }

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
        for (let item in courseItems) {
            if (item === e.currentTarget.id) {
                switch (item) {
                    case "duration":
                        courseItems[item].value = this.data.timeList[parseInt(e.detail.value)];
                        timeListIdx = parseInt(e.detail.value);
                        break;
                    case "startDate":
                        courseItems[item].value = e.detail.value;
                        break;
                    case "endDate":
                        courseItems[item].value = e.detail.value;
                        break;
                    default:
                        // console.log("default");
                        courseItems[item].value = e.detail.value;
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

    onInput: function (e) {
        // console.log(e.currentTarget.id, e.detail.value);
        let courseItems = this.data.courseItems;

        if (e.currentTarget.id === "address") {
            courseItems.location.name.value = e.detail.value;
        } else if (e.currentTarget.id === "room") {
            courseItems.location.room.value = e.detail.value;
        } else {
            courseItems[e.currentTarget.id].value = e.detail.value;
        }

        this.setData({
            courseItems: courseItems
        });

        // console.log(courseItems);
    },

    /**
     * 响应选择位置
     */
    onChooseLocation: function () {
        let host = this;
        let courseItems = this.data.courseItems;

        wx.chooseLocation({
            success: function (res) {
                courseItems.location.latitude.value = res.latitude;
                courseItems.location.longitude.value = res.longitude;
                courseItems.location.address.value = res.address;
                courseItems.location.name.value = res.name;

                host.setData({
                    courseItems: courseItems
                });

                console.log("Get Location:", courseItems.location);
            }
        });

    },

    /**
     * 提交表单
     */
    onFormSubmit: function (e) {
        let courseItems = this.data.courseItems;
        console.log(courseItems);

        let course = new DataStructure.Course();

        // 1、先检查信息，直接根据courseItems来判断信息
        for (let item in courseItems) {
            console.log(item, ":", courseItems[item]);
            if (item === "location") {
                if (courseItems.location.name.value === "") {
                    let tips = this.data.courseItems.location.name.name.split("*")[0];
                    wx.showModal({
                        title: '缺少必要信息',
                        content: "请输入" + tips,
                    });
                    return;
                }
                if (courseItems.location.room.value === "") {
                    let tips = this.data.courseItems.location.room.name.split("*")[0];
                    wx.showModal({
                        title: '缺少必要信息',
                        content: "请输入" + tips,
                    });
                    return;
                }
            } else if (item !== "description") {
                if (courseItems[item].value === "" || courseItems[item].value === "请选择") {
                    for (let courseItem in this.data.courseItems) {
                        if (courseItem === item) {
                            let tips = this.data.courseItems[courseItem].name.split("*")[0];
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

        // 2、收集信息，有为空的即弹出信息提示用户
        for (let item in courseItems) {
            // 如果有，直接添加
            if (course.hasOwnProperty(item)) {
                if (item === "location") {
                    // 经纬度直接拷贝
                    course.location.latitude = courseItems[item].latitude.value;
                    course.location.longitude = courseItems[item].longitude.value;
                    course.location.address = courseItems[item].address.value;
                    course.location.name = courseItems[item].name.value;
                    course.location.room = courseItems[item].room.value;

                } else if (item === "recurringRule") {
                    course.recurringRule = app.tempData.recurringRule;
                } else {
                    course[item] = courseItems[item].value;
                }
            }
        }

        console.log(course);

        // 3、根据开课的时间来判断状态
        if (course.status === "") {
            course.status = "Preparing";
        }

        // 4.1、根据页面进入情况整理需要保存的UserInfo
        let userInfo = StorageUtils.loadUserInfo();
        if (this.data.options.model === "newCourse") {
            // userInfo.teacherCourseSet.pop();
            userInfo.teacherCourseSet.push(course);
        } else {
            let currentCourseIdx = this.data.currentCourseIdx;
            userInfo.teacherCourseSet.splice(currentCourseIdx, 1, course);
        }

        // 4.2、保存
        StorageUtils.saveUserInfo(userInfo);

        wx.navigateBack({});
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            options: options
        });

        this.loadCourse(options);
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
        // 1、根据入口设置标签栏
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

        ///2、初始化页面
        this.initPageCourse(options);

        this.setData({
            options: options
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log("onHide");
        this.setData({
            fromHide: true
        });
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