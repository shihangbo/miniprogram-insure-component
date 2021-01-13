"use strict";
exports.__esModule = true;
var http_promise_1 = require("../utils/http-promise");
Component({
    properties: {
        // 小程序环境
        mode: {
            type: String,
            value: 'development'
        },
        // 产品特色 是否展示（组件自带）
        productFeatureShow: {
            type: Boolean,
            value: true
        },
        // 产品特色 是否展示（用户提供）
        productFeatureCustom: {
            type: Boolean,
            value: false
        },
        // 产品特色 浮层高度
        productFeatureContentHeight: {
            type: String,
            value: '90%'
        },
        // 产品特色 关闭按钮控制
        productFeatureCloseable: {
            type: Boolean,
            value: false
        },
        // 用户userUuid
        uuid: {
            type: String
        },
        // 产品id
        productId: {
            type: Number,
            optionalTypes: [String],
            required: true
        },
        // 直播间的 uuid
        meetingUuid: {
            type: String,
            optionalTypes: [Number],
            required: true
        },
        // 微信token
        wechatToken: {
            type: String,
            optionalTypes: [Number],
            required: true
        },
        // 微信appId
        wechatAppId: {
            type: String,
            optionalTypes: [Number],
            required: true
        },
        // 邀请人的appId
        appId: {
            type: String,
            optionalTypes: [Number],
            required: true
        },
        // header 整体控制
        showHeader: {
            type: Boolean,
            value: false
        },
        // 关闭按钮控制
        closeable: {
            type: Boolean,
            value: false
        },
        // 标题名称
        title: {
            type: String,
            value: undefined
        }
    },
    data: {
        getCalculateApi: '/api/product/ability/calculate',
        getProductInfoApi: '/api/product/data/getProductInfo',
        getProductContentApi: '/api/product/data/getProductContent',
        submitCalculateApi: '/api/product/ability/submitCalculate',
        widgets: undefined,
        total_premium: 0,
        showPopup: false,
        productInfo: undefined,
        content: undefined,
        customStyle: '',
        observerIndex: 0 // 数据监听器
    },
    observers: {
        observerIndex: function () {
            this.reCalculate();
        }
    },
    lifetimes: {
        attached: function () {
            console.log('insure-component:1:attached');
            // 初始化参数
            this.init();
            var url = '';
            if (this.properties.uuid) {
                url += "?userUuid=" + this.properties.uuid;
            }
            if (this.properties.appId) {
                if (url.indexOf('?') > -1) {
                    url += "&appId=" + this.properties.appId;
                }
                else {
                    url += "?appId=" + this.properties.appId;
                }
            }
            var productInfoParams = {
                url: "" + this.data.getProductInfoApi + url,
                data: {
                    productId: this.properties.productId
                },
                method: 'POST',
                mode: this.properties.mode
            };
            // 获取产品信息
            this.getProductInfo(productInfoParams);
            var params = {
                url: "" + this.data.getCalculateApi + url,
                data: {
                    current_data: null,
                    product_id: this.properties.productId,
                    scenario: 'miniProgram'
                },
                method: 'POST',
                mode: this.properties.mode
            };
            // 获取试算信息
            this.calculate(params);
        }
    },
    methods: {
        init: function () {
            var props = this.properties;
            this.setData({
                customStyle: 'height:' + props.productFeatureContentHeight,
                productId: props.productId
            });
        },
        // 事件处理：投保申请
        applyInsure: function () {
            var currentData = [];
            this.data.widgets.forEach(function (item) {
                if (item.index === undefined) {
                    currentData.push(item.current);
                }
                else if (item.index || Number(item.index) === 0) {
                    var temp = JSON.parse(JSON.stringify(item.current));
                    temp.v = item.opts[item.key][item.index].value;
                    currentData.push(temp);
                }
                else {
                    currentData.push(item.current);
                }
            });
            this.submitCalculate(currentData);
        },
        submitCalculate: function (currentData) {
            var _this = this;
            // if (!this.properties.uuid) {
            //   wx.showToast({
            //     title: '请求参数有误：no uuid',
            //     icon: 'none',
            //     duration: 3000
            //   })
            //   return
            // }
            if (!this.properties.productId) {
                wx.showToast({
                    title: '请求参数有误：no productId',
                    icon: 'none',
                    duration: 3000
                });
                return;
            }
            if (!this.properties.meetingUuid) {
                wx.showToast({
                    title: '请求参数有误：no meetingUuid',
                    icon: 'none',
                    duration: 3000
                });
                return;
            }
            if (!this.properties.wechatToken) {
                wx.showToast({
                    title: '请求参数有误：no wechatToken',
                    icon: 'none',
                    duration: 3000
                });
                return;
            }
            if (!this.properties.wechatAppId) {
                wx.showToast({
                    title: '请求参数有误：no wechatAppId',
                    icon: 'none',
                    duration: 3000
                });
                return;
            }
            if (!this.properties.appId) {
                wx.showToast({
                    title: '请求参数有误：no appId',
                    icon: 'none',
                    duration: 3000
                });
                return;
            }
            var url = '';
            if (this.properties.uuid) {
                url += "?userUuid=" + this.properties.uuid;
            }
            if (this.properties.appId) {
                if (url.indexOf('?') > -1) {
                    url += "&appId=" + this.properties.appId;
                }
                else {
                    url += "?appId=" + this.properties.appId;
                }
            }
            var params = {
                url: "" + this.data.submitCalculateApi + url,
                data: {
                    current_data: currentData,
                    product_id: this.properties.productId,
                    meetingUuid: this.properties.meetingUuid,
                    wechatToken: this.properties.wechatToken,
                    wechatAppId: this.properties.wechatAppId
                },
                method: 'POST',
                mode: this.properties.mode
            };
            http_promise_1["default"].request(params)
                .then(function (res) {
                if (res) {
                    var params_1 = {
                        current_data: currentData,
                        total_premium: _this.data.total_premium,
                        status: 'ok'
                    };
                    _this.triggerEvent('applyInsure', params_1);
                }
                else {
                    var params_2 = {
                        err: res,
                        status: 'fail'
                    };
                    _this.triggerEvent('applyInsure', params_2);
                }
            })["catch"](function (err) {
                wx.showToast({
                    title: (err.data && err.data.msg) || '接口出错',
                    icon: 'none',
                    duration: 3000
                });
            });
        },
        // 防抖 + 监听
        debounce: function (method, context, delay, cpWidgets, currTarget) {
            clearTimeout(method.id);
            method.id = setTimeout(function () {
                method.call(context, cpWidgets, currTarget);
            }, delay || 300);
        },
        observerData: function (cpWidgets, currTarget) {
            if (currTarget === void 0) { currTarget = {}; }
            if (currTarget.cal_key) { // 试算
                this.setData({
                    widgets: cpWidgets,
                    observerIndex: this.data.observerIndex + 1
                });
            }
            else {
                this.setData({
                    widgets: cpWidgets
                });
            }
        },
        // 事件处理：点击选择tab
        bindSelectChange: function (e) {
            // console.log('select发送选择改变，携带值为', e)
            var cpWidgets = JSON.parse(JSON.stringify(this.data.widgets));
            var currTarget = e.currentTarget.dataset.item || e.target.dataset.item;
            var currClickItem = e.currentTarget.dataset.it || e.target.dataset.it;
            var orginTarget;
            if (currTarget.duty) {
                orginTarget = cpWidgets.find(function (item) { return item.riskCode === currTarget.riskCode &&
                    item.key === currTarget.key &&
                    item.duty === currTarget.duty; });
            }
            else {
                orginTarget = cpWidgets.find(function (item) { return item.riskCode === currTarget.riskCode &&
                    item.key === currTarget.key; });
            }
            orginTarget.current.v = currClickItem.value;
            // 试算
            var self = this;
            this.debounce(self.observerData, self, undefined, cpWidgets, currTarget);
        },
        // 事件处理：半浮层选择
        bindPickerChange: function (e) {
            var cpWidgets = JSON.parse(JSON.stringify(this.data.widgets));
            var currTarget = e.currentTarget.dataset.item || e.target.dataset.item;
            var orginTarget = cpWidgets.find(function (item) { return item.riskCode === currTarget.riskCode &&
                item.key === currTarget.key; });
            orginTarget.index = Number(e.detail.value);
            // 试算
            var self = this;
            this.debounce(self.observerData, self, undefined, cpWidgets, currTarget);
        },
        // 事件处理：日期
        bindDateChange: function (e) {
            var cpWidgets = JSON.parse(JSON.stringify(this.data.widgets));
            var currTarget = e.currentTarget.dataset.item || e.target.dataset.item;
            var orginTarget = cpWidgets.find(function (item) { return item.riskCode === currTarget.riskCode &&
                item.key === currTarget.key; });
            orginTarget.current.v = e.detail.value;
            // 试算
            var self = this;
            this.debounce(self.observerData, self, undefined, cpWidgets, currTarget);
        },
        // input 输入框处理
        inputNumberRangeChange: function (e) {
            var value = e.detail.value;
            console.log(value);
        },
        // 事件处理：展示产品特色
        showDetailPopup: function () {
            if (this.properties.productFeatureCustom) {
                this.triggerEvent('onFeatureCustom');
            }
            else {
                this.init();
                var url = '';
                if (this.properties.uuid) {
                    url += "?userUuid=" + this.properties.uuid;
                }
                if (this.properties.appId) {
                    if (url.indexOf('?') > -1) {
                        url += "&appId=" + this.properties.appId;
                    }
                    else {
                        url += "?appId=" + this.properties.appId;
                    }
                }
                var params = {
                    url: "" + this.data.getProductContentApi + url,
                    data: {
                        id: this.properties.productId
                    },
                    method: 'POST',
                    mode: this.properties.mode
                };
                this.getProductContent(params);
            }
        },
        // 事件处理：关闭产品特色
        closeDetailPopup: function () {
            this.setData({
                showPopup: false
            });
        },
        // 事件处理：关闭当前页，showHeader为true时，可以控制
        closeInsure: function () {
            this.triggerEvent('closeInsure');
        },
        // 接口处理
        getProductInfo: function (params) {
            var _this = this;
            console.log('insure-component:2:getProductInfo', params);
            http_promise_1["default"].request(params)
                .then(function (res) {
                console.log('insure-component:3:getProductInfo', res);
                _this.setData({
                    productInfo: res
                });
            })["catch"](function (err) {
                wx.showToast({
                    title: (err.data && err.data.msg) || '接口出错',
                    icon: 'none',
                    duration: 3000
                });
            });
        },
        calculate: function (params) {
            var _this = this;
            console.log('insure-component:4:calculate', params);
            http_promise_1["default"].request(params)
                .then(function (res) {
                var data = _this.translateData(res);
                console.log('insure-component:5:calculate', data);
                _this.setData({
                    widgets: data.widgets,
                    current_data: data.current_data,
                    total_premium: Number(data.total_premium).toFixed(2)
                });
            })["catch"](function (err) {
                wx.showToast({
                    title: (err.data && err.data.msg) || '接口出错',
                    icon: 'none',
                    duration: 3000
                });
            });
        },
        reCalculate: function () {
            var _this = this;
            wx.showLoading({
                title: '加载中'
            });
            var currentData = [];
            this.data.widgets.forEach(function (item) {
                if (item.index === undefined) {
                    currentData.push(item.current);
                }
                else if (item.index || Number(item.index) === 0) {
                    var temp = JSON.parse(JSON.stringify(item.current));
                    temp.v = item.opts[item.key][item.index].value;
                    currentData.push(temp);
                }
                else {
                    currentData.push(item.current);
                }
            });
            var url = '';
            if (this.properties.uuid) {
                url += "?userUuid=" + this.properties.uuid;
            }
            if (this.properties.appId) {
                if (url.indexOf('?') > -1) {
                    url += "&appId=" + this.properties.appId;
                }
                else {
                    url += "?appId=" + this.properties.appId;
                }
            }
            var params = {
                url: "" + this.data.getCalculateApi + url,
                data: {
                    current_data: currentData,
                    product_id: this.properties.productId
                },
                method: 'POST',
                mode: this.properties.mode
            };
            http_promise_1["default"].request(params)
                .then(function (res) {
                var data = _this.translateData(res);
                _this.setData({
                    widgets: data.widgets,
                    currentData: data.current_data,
                    total_premium: Number(data.total_premium).toFixed(2)
                });
                wx.hideLoading();
            })["catch"](function (err) {
                wx.hideLoading();
                wx.showToast({
                    title: (err.data && err.data.msg) || '接口出错',
                    icon: 'none',
                    duration: 3000
                });
            });
        },
        getProductContent: function (params) {
            var _this = this;
            http_promise_1["default"].request(params)
                .then(function (res) {
                var contentOrigin = res.feature.content.replace(/<p>/g, '').replace(/<\/p>/g, '').split('/>');
                var content = '';
                contentOrigin.forEach(function (item) {
                    if (item) {
                        content += (item + '/>');
                    }
                });
                _this.setData({
                    content: content,
                    showPopup: true
                });
            })["catch"](function (err) {
                wx.showToast({
                    title: (err.data && err.data.msg) || '接口出错',
                    icon: 'none',
                    duration: 3000
                });
            });
        },
        // 数据转换
        translateData: function (res) {
            var widgets = res.widgets;
            var currentData = res.current_data;
            this.translateWidgets(widgets, currentData);
            return res;
        },
        translateWidgets: function (widgets, currentData) {
            var _this = this;
            widgets.forEach(function (item) {
                var current;
                // 增加current字段，保存current_data的数据
                if (item.duty) {
                    item.current = current = currentData.find(function (it) { return it.k === item.key &&
                        it.risk === item.riskCode && item.duty === it.d; });
                }
                else {
                    item.current = current = currentData.find(function (it) { return it.k === item.key &&
                        it.risk === item.riskCode; });
                }
                // 自定义输入框
                if (item.type === 'input' && item.opts && item.opts[item.key]) {
                    var isNumberRange = item.opts[item.key].some(function (it) { return it.opt_type === 'number_range'; });
                    if (isNumberRange) {
                        item.type += '_number_range';
                    }
                }
                switch (item.type) {
                    case 'text':
                        _this.translateText(item);
                        break;
                    case 'select':
                        _this.translateSelect(item, current);
                        break;
                    case 'calendar':
                        _this.translateCalendar(item, current);
                        break;
                    case 'input_number_range':
                        _this.translateInputNumberRange(item, current);
                        break;
                    default:
                }
            });
        },
        translateText: function (item) {
            item.name = item.opts[item.key][0].name;
        },
        translateSelect: function (item, current) {
            var len = 0;
            if (item.opts && item.opts[item.key] && item.opts[item.key].length) {
                len = item.opts[item.key].length;
            }
            if (len <= 2) {
                item.type = 'select_checkbox';
            }
            else {
                item.type = 'select_picker';
                var idx_1 = 0;
                if (item.opts && item.opts[item.key] && item.opts[item.key].length) {
                    item.opts[item.key].forEach(function (it, index) {
                        if (it.value === current.v) {
                            idx_1 = index;
                        }
                    });
                }
                // 增加index字段，保存用户选项，同时设置默认值
                item.index = idx_1;
            }
        },
        translateInputNumberRange: function (item, current) {
            var curr = item.opts[item.key].find(function (it) { return it.opt_type === 'number_range'; });
            if (curr) {
                var unit = '份';
                item.showInput = true;
                if (curr.value && curr.value.split('-')) {
                    item.minValue = Number(curr.value.split('-')[0]);
                    item.maxValue = Number(curr.value.split('-')[1]);
                    item.tip = "" + curr.value.split('-')[0] + unit + "\u8D77\u8D2D\uFF0C\u6700\u591A\u8D2D\u4E70" + curr.value.split('-')[1] + unit;
                }
                if (curr.step_length) {
                    item.step = Number(curr.step_length);
                }
                item.unit = unit;
                item.errorMessage = '';
                if (item.current) {
                    item.current.v = current.v;
                }
                else {
                    item.current = {};
                    item.current.v = current.v;
                }
            }
            item.index = 0;
        },
        translateCalendar: function (item, current) {
            // 增加current字段，保存currentData的数据
            item.current = current;
        }
    }
});
