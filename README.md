# miniprogram-insure-component

## 小程序功能
1. 交易试算模块 calculate

## 快速上手
```js
// 第一步：安装
npm install -S miniprogram-insure-component

// 第二步：引入，需在对应的小程序页面的.json文件增加代码
"usingComponents": {
  "calculate": "miniprogram-insure-component/calculate/calculate"
}

// 第三不：使用自定义组件
<calculate
  productFeatureContentHeight="90%"
  closeable
  title="watson"
  ></calculate>
```

## Attribute
| 参数| 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- |   --- |  --- |
|mode|小程序自定义环境变量，区分development/production，默认development 测试环境|String|development|-|
|uuid|保险师传用户userUuid，中介通传openId，测试使用：153cdcf26b66434e94079bca08666678|String|无|-|
|productId|（必传）产品ID，投保申请时有为空校验，测试使用：101972 / 102157|String|无|-|
|meetingUuid|（必传）直播间的uuid，投保申请时有为空校验|String|无|-|
|wechatToken|（必传）微信token，token + 微信appId 换取 openId，投保申请时有为空校验|String|无|-|
|wechatAppId|（必传）微信appid，token + 微信appId 换取 openId，投保申请时有为空校验|String|无|-|
|preorderId|（必传），投保申请时有为空校验|Number|无|-|
|appId|（必传）邀请人appId，openId + 保险师/中介通appid 换取邀请人的userUuid，投保申请时有为空校验|String|无|-|
|productFeatureShow|产品特色-功能是否展示|Boolean|true|-|
|productFeatureContentHeight|产品特色-浮层高度，productFeatureShow为true是才有效|String|默认90%，当前支持两种格式：px，百分比；|-|
|productFeatureCloseable|产品特色-浮层是否关闭按钮控制|Boolean|false|-|
|showHeader|控制头部内容展示的参数，只有当参数开启，closeable和title才有效，默认关闭|Boolean|false|-|
|closeable|当前页面-关闭按钮控制（showHeader为true时有效）|Boolean|false|-|
|title|当前页面-标题名称（showHeader为true时有效）|String|无|-|
|productFeatureCustom|产品特色浮层是否使用组件自带的，true:使用组件自带的; false:使用自定义展示(需监听onFeatureCustom事件),|String|无|-|

## Event
| 事件名称 | 说明 | 参数 |
| --- | --- | --- |
| closeInsure | 点击当前页 X 按钮触发 | closeable属性为true时有效 |
| applyInsure | 点击投保申请触发 | 事件会进行当前投保状态的保存（api保存），成功返回: detail: {status: 'ok', currentData: '试算因子集合', total_premium: '预计保费'}，失败返回: detail: {status: 'fail', err: '报错对象'} |
| onFeatureCustom | 点击产品特色触发 | productFeatureShow为true是有效 |
