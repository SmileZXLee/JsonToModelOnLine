# JsonToModelOnLine
## 在线地址(点击直接访问👉)[http://json.zxlee.cn](http://json.zxlee.cn)
## 主要功能
* 支持语言:Java、PHP、Objective-C、Swift、C#、Vue Data、Typescript
* 支持下划线转驼峰或驼峰转下划线
* 支持添加注释头
* 支持任意层级的Json数据，自动过滤重复数据
* 支持左侧Json与右侧模型联动，选中Json中字段轻松查找对应模型
## 使用示例
### 示例Json数据(来源于聚合数据API文档)
```json
{
    "error_code": 0,
    "success": true,
    "reason": "success",
    "result": {
        "collectCount": "4170000",
        "crawlTime": "2019-01-24 16:43:58",
        "ranks": [
            {
                "rankStr": "1-1",
                "title": "聚合工具 - 聚合数据",
                "url": "http:\/\/tool.chinaz.com\/",
                "xiongzhangId": "聚合数据"
            },
            {
                "rankStr": "1-2",
                "title": "聚合素材-分享综合设计素材的平台",
                "url": "http:\/\/sc.chinaz.com\/",
                "xiongzhangId": ""
            }
        ]
    }
}
```
### 转Java模型类
```java
----- 共3条Model数据 -----
private String collectCount;
private String crawlTime;
private Object[] ranks;
----------------------------
private String rankStr;
private String title;
private String url;
private String xiongzhangId;
----------------------------
private int error_code;
private boolean success;
private String reason;
private Object result;
----------------------------
```
* 驼峰转下划线
```java
----- 共3条Model数据 -----
private String collect_count;
private String crawl_time;
private Object[] ranks;
----------------------------
private String rank_str;
private String title;
private String url;
private String xiongzhang_id;
----------------------------
private int error_code;
private boolean success;
private String reason;
private Object result;
----------------------------
```
### 转PHP模型类
```php
----- 共3条Model数据 -----
public $collectCount;
public $crawlTime;
public $ranks;
----------------------------
public $rankStr;
public $title;
public $url;
public $xiongzhangId;
----------------------------
public $error_code;
public $success;
public $reason;
public $result;
----------------------------
```

### 转Objective-C模型类
```objective-c
----- 共3条Model数据 -----
@property (copy, nonatomic) NSString *collectCount;
@property (copy, nonatomic) NSString *crawlTime;
@property (strong, nonatomic) NSArray *ranks;
----------------------------
@property (copy, nonatomic) NSString *rankStr;
@property (copy, nonatomic) NSString *title;
@property (copy, nonatomic) NSString *url;
@property (copy, nonatomic) NSString *xiongzhangId;
----------------------------
@property (assign, nonatomic) int error_code;
@property (assign, nonatomic) BOOL success;
@property (copy, nonatomic) NSString *reason;
@property (strong, nonatomic) id result;
----------------------------
```

### 转Swift模型类
```swift
----- 共3条Model数据 -----
var collectCount :String?
var crawlTime :String?
var ranks :Array?
----------------------------
var rankStr :String?
var title :String?
var url :String?
var xiongzhangId :String?
----------------------------
var error_code :Int?
var success :Bool?
var reason :String?
var result :any?
----------------------------
```

### 转C#模型类
```c#
----- 共3条Model数据 -----
public string collectCount { get; set;};
public string crawlTime { get; set;};
public List <Object> ranks { get; set;};
----------------------------
public string rankStr { get; set;};
public string title { get; set;};
public string url { get; set;};
public string xiongzhangId { get; set;};
----------------------------
public int error_code { get; set;};
public boolean success { get; set;};
public string reason { get; set;};
public Object result { get; set;};
----------------------------
```

### 转Vue data
```javascript
----- 共3条Model数据 -----
collectCount: '',
crawlTime: '',
ranks: []
----------------------------
rankStr: '',
title: '',
url: '',
xiongzhangId: ''
----------------------------
error_code: 0,
success: false,
reason: '',
result: null
----------------------------
```
