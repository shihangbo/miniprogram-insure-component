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
|productFeatureShow|产品特色-功能是否展示|Boolean|true|-|
|productFeatureContentHeight|产品特色-浮层高度，productFeatureShow为true是才有效|String|默认90%，当前支持两种格式：px，百分比；|-|
|productFeatureCloseable|产品特色-浮层是否关闭按钮控制|Boolean|false|-|
|uuid|（必传）用户userUuid|String|无|-|
|productId|（必传）产品ID|String|无|-|
|closeable|当前页面-关闭按钮控制|Boolean|false|-|
|title|当前页面-标题名称|String|无|-|

## Event
| 事件名称 | 说明 | 参数 |
| --- | --- | --- |
| closeInsure | 点击当前页 X 按钮触发 | closeable属性为true时有效 |
| applyInsure | 点击投保申请触发 | 事件会进行当前投保状态的保存（通过接口），并获取当前状态的activeId，进行返回 |
