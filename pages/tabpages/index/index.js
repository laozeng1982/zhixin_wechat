//index.js
//获取应用实例

import DataStructure from '../../../datamodel/DataStructure'
import DateTimeUtils from '../../../utils/DateTimeUtils'
import StorageUtils from '../../../utils/StorageUtils'

const app = getApp();

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        // 首页Tab
        indexTabData: [
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

        // 课程页面的Tab
        courseTabData: [
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
        ],

        // 以下是控制每日课程的显示
        showMonthView: true,

        today: '',
        todayMonth: '',
        todayYear: '',
        selectedDate: '',
        selectedWeek: '',
        currentYear: '',
        currentMonth: '',
        currentDate: '',


        // 保存当月的日期
        dateList: [],

        // 日历滑动
        calendars: [1, 2, 3],
        lastCalendarId: 0,
        duration: 1000,
    },

    /**
     * 生成tab页面
     */
    makeTabData: function (role) {

        let indexTabData = this.data.indexTabData;

        if (role !== "teacher") {
            indexTabData[1].name = "通知";
            indexTabData[2].name = "作业回复";
        }

        let userInfo = StorageUtils.loadUserInfo();

        let today = new Date();
        let currentYear = today.getFullYear();
        let currentMonth = today.getMonth() + 1;
        let currentDate = today.getDate();

        let dateList = DateTimeUtils.getDateList(currentYear, currentMonth);

        this.setData({
            today: today,
            currentYear: currentYear,
            currentMonth: currentMonth,
            currentDate: currentDate,
            dateList: dateList,
            indexTabData: indexTabData
        });
    },

    createNewCourse: function () {
        wx.navigateTo({
            url: '../../normalpages/course/course' + "?model=newCourse",
        });
    },

    /**
     * 处理切换主Tab事件
     * @param e
     */
    onIndexTabSwitch: function (e) {
        let currentTabIdx = e.currentTarget.dataset.current;
        let indexTabData = this.data.indexTabData;

        for (let idx = 0; idx < indexTabData.length; idx++) {
            indexTabData[idx].selected = (idx === currentTabIdx);
        }

        this.setData({
            indexTabData: indexTabData,
            currentTabIdx: currentTabIdx
        });
    },

    /**
     *
     * @param e
     */
    onCourseTabItemSelected: function (e) {
        console.log("selected:", e.currentTarget.id);
        let courseTabData = this.data.courseTabData;
        for (let item of courseTabData) {
            if (item.type === "add_new") {
                item.selected = true;
            } else {
                item.selected = item.type === e.currentTarget.id;
            }
        }

        switch (e.currentTarget.id) {
            case "all_course":
                app.tempData.currentCourseSubTab = "all_course";
                break;
            case "everyday_lesson":
                app.tempData.currentCourseSubTab = "everyday_lesson";
                break;
            case "add_new":
                app.tempData.currentCourseSubTab = "all_course";
                this.createNewCourse();
                break;
            default:
                break;
        }

        this.setData({
            courseTabData: courseTabData
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
        // console.log(e);
        let url = '../../normalpages/course/course' + "?model=modifyCourseId_" + e.currentTarget.id;

        wx.navigateTo({
            url: url,
        });
    },

    /**
     * 日历控制的核心函数
     * @param e
     */
    selectDate: function (e) {
        console.log(e.currentTarget.dataset.date);

        let selectedDate = e.currentTarget.dataset.date;
        let selectedWeek = [];

        for (let week of this.data.dateList) {
            for (let day of week) {
                if (day.value === selectedDate.value) {
                    selectedWeek = week;
                    break;
                }
            }
        }

        let selectedDateCourse = [];

        // 读取每个课程，如果这个课程包含了当前选中日期，则显示
        // 这里需要使用重组后Course

        let userInfo = StorageUtils.loadUserInfo();

        for (let course of userInfo.teacherCourseSet) {
            if (DateTimeUtils.checkDate(course.startDate, selectedDate.value, course.endDate)) {
                selectedDateCourse.push(course);
            }
        }

        console.log("Selected Date's CourseSet: ", selectedDate.value, selectedDateCourse);

        this.setData({
            selectedDateCourse: selectedDateCourse,
            selectedDate: selectedDate.value,
            selectedWeek: selectedWeek,
            showMonthView: selectedDateCourse.length <= 0
        });

    },

    /**
     * 移动月的操作，整月移动
     * @param direction
     * @param toDate
     */
    moveMonth: function (direction, toDate) {

        let currentYear = '';
        let currentMonth = '';
        let currentDate = '';

        switch (direction) {
            case "next":
                currentYear = this.data.currentMonth + 1 === 13 ? this.data.currentYear + 1 : this.data.currentYear;
                currentMonth = this.data.currentMonth + 1 === 13 ? 1 : this.data.currentMonth + 1;
                currentDate = 1;
                break;
            case "last":
                currentYear = this.data.currentMonth - 1 ? this.data.currentYear : this.data.currentYear - 1;
                currentMonth = this.data.currentMonth - 1 ? this.data.currentMonth - 1 : 12;
                currentDate = 1;
                break;
            case "selected":
                currentYear = toDate.getFullYear();
                currentMonth = toDate.getMonth() + 1;
                currentDate = toDate.getDate();
                break;
            default:
                break;
        }

        console.log("move to: ", currentYear, "年", currentMonth, "月", currentDate, "日");

        let dateList = DateTimeUtils.getDateList(currentYear, currentMonth);

        this.setData({
            currentYear: currentYear,
            currentMonth: currentMonth,
            currentDate: currentDate,
            showMonthView: true,
            dateList: dateList,
            // selectedDate: DateTimeUtils.formatDateToString(new Date())
        });

    },

    /**
     * 响应日历上选中日期
     * @param e
     */
    onSelectDateItem: function (e) {
        this.selectDate(e);

    },

    /**
     * 响应日期选择器，跳转到选择的月份
     * @param e
     */
    onSelectMonthYear: function (e) {
        let toDate = DateTimeUtils.getDateFromString(e.detail.value, "-");
        this.moveMonth("selected", toDate);

    },

    /**
     * 响应到今天按钮
     */
    onToThisMonth: function () {
        let toDate = new Date();
        this.moveMonth("selected", toDate);

    },

    /**
     * 响应日历头部点击，重新显示日历
     * @param e
     */
    onCalendarHead: function (e) {
        this.setData({
            showMonthView: true
        });

    },

    /**
     * 响应日历上下滑动
     */
    onVerticalSwiperChange: function (e) {
        let current = parseInt(e.detail.current);
        let lastCalenderId = this.data.lastCalendarId;

        let isNextMonth = false;

        // 判断是左滑还是右划，左滑表示上个月
        switch (lastCalenderId) {
            case 0:
                if (current === 1)
                    isNextMonth = true;
                else if (current === 2)
                    isNextMonth = false;
                break;
            case 1:
                if (current === 0)
                    isNextMonth = false;
                else if (current === 2)
                    isNextMonth = true;
                break;
            case 2:
                if (current === 0)
                    isNextMonth = true;
                else if (current === 1)
                    isNextMonth = false;
                break;
            default:
                console.log("what the fuck!!!!!");
                break;
        }

        if (isNextMonth) {
            this.moveMonth("next");
        } else {
            this.moveMonth("last");
        }

        this.setData({
            lastCalendarId: current
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
        let courseTabData = this.data.courseTabData;
        if (userInfoLocal.teacherCourseSet.length > 0) {

            // 其他页面跳转回来时，当前显示哪一个次级Tab
            if (app.tempData.currentCourseSubTab === "all_course") {
                courseTabData[0].selected = true;
                courseTabData[1].selected = false;
            } else if (app.tempData.currentCourseSubTab === "everyday_lesson") {
                courseTabData[0].selected = false;
                courseTabData[1].selected = true;
            }
            courseTabData[2].display = true;

        }

        this.setData({
            userInfo: userInfoLocal,
            userInfoLocal: userInfoLocal,
            courseTabData: courseTabData,
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
