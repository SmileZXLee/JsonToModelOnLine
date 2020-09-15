/**
 * JsonToModelOnLine
 * @author ZXLee
 * @github https://github.com/SmileZXLee/JsonToModelOnLine
 */

const booleanType = 'boolean';
const intType = 'int';
const longType = 'long';
const floatType = 'float';
const numberType = 'number';
const stringType = 'string';
const arrayType = 'array';
const idType = 'id';

//Json字符串转Json对象
function getJsonObject(str){
	return JSON.parse(str);
}
//格式化输出Json
function formatJson(str){
	return JSON.stringify(getJsonObject(str), null, "\t")
}
//字符串格式化
String.prototype.format=function() { 
    if(arguments.length==0) return this; 
    for(var s = this,i=0;i < arguments.length;i++) 
        s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]); 
    return s; 
};

//处理Json对象（所有类型）
function handleJsonObject(jsonObject,resultArray){
	if(isArray(jsonObject)){
		jsonObject.forEach((item,index,array)=>{
			if(isArray(item)){
				var normalArray = new Array();
				normalArray.push({key:key,value:arrayType,arrayType:getArraContentType(item)});
				addToArray(resultArray,normalArray);
				handleJsonObject(item,resultArray);
			}else{
				handleNoramlObject(item,resultArray);
			}
		})
	}else{
		handleNoramlObject(jsonObject,resultArray);
	}
	return resultArray;
}

//处理普通的Json对象
function handleNoramlObject(normalObject,resultArray){
	if(isString(normalObject) || !normalObject){
		return;
	}
	var normalArray = new Array();
	Object.getOwnPropertyNames(normalObject).forEach(function(key){
		var value = normalObject[key];
		let type = this.getType(value);
		if(type == arrayType){
			normalArray.push({key:key,value:arrayType,arrayType:getArraContentType(value)});
			addToArray(resultArray,normalArray);
			handleJsonObject(value,resultArray);
		}else if(type == stringType){
			normalArray.push({key:key,value:stringType});
		}else if(isNumber(value)){
			normalArray.push({key:key,value:type});
		}else if(isBoolean(value)){
			normalArray.push({key:key,value:booleanType});
		}else{
			normalArray.push({key:key,value:idType});
			handleJsonObject(value,resultArray);
		}
	});
	addToArray(resultArray,normalArray);
}

//在结果数组中添加新数组的元素
function addToArray(arr1,arr2){
	arr1.push(arr2);
}

//去除剩余的重复数据
function delRemainSameData(arr){
	var checkArray = new Array();
	var resultArray = new Array();
	for(var i = 0;i < arr.length;i++){
		var value = arr[i];
		var keysArray = new Array();
		for(var j = 0;j < value.length;j++){
			keysArray.push(value[j]['key']);
		}
		var valueStr = keysArray.sort().toString();
		if(checkArray.length == 0 || checkArray.indexOf(valueStr) == -1){
			checkArray.push(valueStr);
			resultArray.push(value);
		}
	}
	return resultArray;
}

//判断是否是数组
function isArray(obj){
	return Object.prototype.toString.call(obj)== '[object Array]';
}

//判断是否是数字
function isNumber(obj){
	return typeof obj === 'number' && !isNaN(obj);
}

//判断是否是字符串
function isString(obj){
	return typeof(obj) === 'string';
}

//判断是否是bool
function isBoolean(obj){
	return typeof(obj) === 'boolean';
}

//获取类型
function getType(obj){
	if(isArray(obj)){
		return arrayType;
	}
	var outputAllToString = localStorage.getItem('outputAllToString') == 'true' ? 1 : 0;
	if(isString(obj)){
		return stringType;
	}
	if(isNumber(obj)){
		if(outputAllToString){
			return stringType;
		}
		if((obj | 0) === obj){
			return intType;
		}else{
			if(obj.toString().indexOf('.') == -1){
				return longType;
			}
			return floatType;
		}
	}
	return idType;
	
}

//获取数组中元素的类型
function getArraContentType(array){
	if(!array.length){
		return idType;
	}
	var firstObj = array[0];
	return getType(firstObj);
}

//下划线转驼峰
function toHumpFunc(value) {
    return value.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}

//驼峰转下划线
function toUnderLineFunc(value) {
  return value.replace(/([A-Z])/g,"_$1").toLowerCase();
}

//获取注释头内容
function getAnnotation(){
	return localStorage.getItem('addComment') == 'true' ? '/**\n*\n*/\n' : '';
}

//key值转换（驼峰转下划线或下划线转驼峰或都不进行）
function handleKeyConvert(key){
	var toHump = localStorage.getItem('toHump') == 'true' ? 1 : 0;
	var toUnderline = localStorage.getItem('toUnderline') == 'true' ? 1 : 0;
	if(toHump){
		return toHumpFunc(key);
	}else if(toUnderline){
		return toUnderLineFunc(key);
	}
	return key;
}

//java模型的格式化
function javaFormat(handledObj){
	var propertyFormat = '';
	handledObj.forEach((item,index,array)=>{
		var key = handleKeyConvert(item.key);
		var value = item.value;
		if(value == stringType){
			value = 'String';
		}
		if(value == idType){
			value = 'Object';
		}
		if(value == arrayType){
			var itemArrayType = item.arrayType;
			if(itemArrayType == stringType){
				itemArrayType = 'String';
			}
			if(itemArrayType == idType){
				itemArrayType = 'Object';
			}
			value = itemArrayType + '[]' ;
		}
		propertyFormat += getAnnotation() + 'private' + ' ' + value + ' ' + key + ';\n';
	})
	return propertyFormat;
}

//objective-c模型的格式化
function ocFormat(handledObj){
	var propertyFormat = '';
	handledObj.forEach((item,index,array)=>{
		var key = handleKeyConvert(item.key);
		var value = item.value;
		var valueType = 'strong';
		if(value == stringType){
			value = 'NSString *';
			valueType = 'copy';
		}else if(value == arrayType){
			value = 'NSArray *';
		}else if(value == booleanType){
			value = 'BOOL ';
		}else if(value == floatType){
			value = 'CGFloat ';
		}else{
			value += ' ';
		}
		if(value == intType + ' ' || value == longType + ' ' || value == floatType + ' ' || value == 'BOOL '){
			valueType = 'assign';
		}
		var str = "@property ({0}, nonatomic) {1}{2};\n".format(valueType, value,key);
		var annotation = localStorage.getItem('addComment') == 'true' ? '///\n' : '';
		propertyFormat += annotation + str;
	})
	return propertyFormat;
}

//swift模型的格式化
function swiftFormat(handledObj){
	var propertyFormat = '';
	handledObj.forEach((item,index,array)=>{
		var key = handleKeyConvert(item.key);
		var value = item.value;
		if(value == booleanType){
			value = 'Bool';
		}else if(value == floatType){
			value = 'CGFloat ';
		}else if(value == idType){
			value = 'any';
		}else{
			if(value.length){
				value = value.slice(0, 1).toUpperCase() + value.slice(1);
			}
		}
		if(value == arrayType){
			var itemArrayType = item.arrayType;
			if(itemArrayType == booleanType){
				itemArrayType = 'Bool';
			}else if(itemArrayType == idType){
				itemArrayType = 'any';
			}else{
				if(itemArrayType.length){
					itemArrayType = itemArrayType.slice(0, 1).toUpperCase() + itemArrayType.slice(1);
				}
			}
			value = '[{0}]'.format(itemArrayType);
		}
		var annotation = localStorage.getItem('addComment') == 'true' ? '///\n' : '';
		propertyFormat += annotation + 'var {0} :{1}?\n'.format(key,value);
	})
	return propertyFormat;
}

//C#模型的格式化
function cSharpFormat(handledObj){
	var propertyFormat = '';
	handledObj.forEach((item,index,array)=>{
		var key = handleKeyConvert(item.key);
		var value = item.value;
		if(value == idType){
			value = 'Object';
		}
		if(value == arrayType){
			var itemArrayType = item.arrayType;
			if(itemArrayType == idType){
				itemArrayType = 'Object';
			}
			value = "List <{0}>".format(itemArrayType);
		}
		propertyFormat += getAnnotation() + 'public' + ' ' + value + ' ' + key + ' ' + '{ get; set;}' + ';\n';
	})
	return propertyFormat;
}

//php模型的格式化
function phpFormat(handledObj){
	var propertyFormat = '';
	handledObj.forEach((item,index,array)=>{
		var key = handleKeyConvert(item.key);
		var value = item.value;
		propertyFormat += getAnnotation() + 'public' + ' $' + key +';\n';
	})
	return propertyFormat;
}

//Vue data的格式化
function VueFormat(handledObj){
	var propertyFormat = '';
	handledObj.forEach((item,index,array)=>{
		var key = handleKeyConvert(item.key);
		var value = item.value;
		if(value == stringType){
			value = '\'\'';
		}else if(value == idType){
			value = 'null';
		}else if(value == arrayType){
			value = '[]' ;
		}else if(value == booleanType){
			value = 'false' ;
		}else{
			value = '0'
		}
		var annotation = localStorage.getItem('addComment') == 'true' ? '//\n' : '';
		propertyFormat += annotation + key + ': ' + value + (index == array.length - 1 ? '\n' : ',\n');
	})
	return propertyFormat;
}

//点击了github图标，跳转
function githubAction(){
	window.open('https://github.com/SmileZXLee/JsonToModelOnLine');
}

var vm1 = new Vue({
	el: '.main',
	data: {
		inputValue: '',
		outputValue: '',
	},	
	methods:{
		convertAction(){
			if(!this.inputValue.length){
				alert('请在左侧输入Json字符串');
				return;
			}
			try {
			   var jsonObject = getJsonObject(this.inputValue);
			   this.inputValue = formatJson(this.inputValue);
			   var resultArray = delRemainSameData(handleJsonObject(jsonObject,new Array()));
			   var resStr = '----- 共' + resultArray.length + '条Model数据 -----\n';
			   for(var i = 0;i < resultArray.length;i++){
			       var formatStr = ';'
			       if(vm2.language == 'Java'){
			           formatStr = javaFormat(resultArray[i]);
			       }else if(vm2.language == 'PHP'){
			           formatStr = phpFormat(resultArray[i]);
			       }else if(vm2.language == 'Objective-C'){
			           formatStr = ocFormat(resultArray[i]);
			       }else if(vm2.language == 'Swift'){
			           formatStr = swiftFormat(resultArray[i]);
			       }else if(vm2.language == 'C#'){
			           formatStr = cSharpFormat(resultArray[i]);
			       }else if(vm2.language == 'Vue'){
			           formatStr = VueFormat(resultArray[i]);
			       }
			       resStr += formatStr + '----------------------------\n';
			   }
			   this.outputValue = resStr;
			}
			catch(err){
			    alert('转换失败，错误信息为：' + err);
				this.outputValue = '';
			}
		},
		languageClick(value){
			console.log(value.currentTarget.value);
		}
	}		
});

var vm2 = new Vue({
	el: '.function-part',
	data: {
		language: localStorage.getItem('language') ? localStorage.getItem('language') : 'Java',
		addCommentChecked: localStorage.getItem('addComment') == 'true' ? 1 : 0,
		toHumpChecked: localStorage.getItem('toHump') == 'true' ? 1 : 0,
		toUnderlineChecked: localStorage.getItem('toUnderline') == 'true' ? 1 : 0,
		outputAllToStringChecked: localStorage.getItem('outputAllToString') == 'true' ? 1 : 0,
		languages: [
			'Java',
			'PHP',
			'Objective-C',
			'Swift',
			'C#',
			'Vue'
		]
	},	
	methods:{
		languageClick(value){
			this.language = value.currentTarget.value;
			localStorage.setItem('language',this.language);
		},
		actionClick(value){
			localStorage.setItem(value.currentTarget.name,value.currentTarget.checked);
			this[value.currentTarget.name + 'Checked'] = value.currentTarget.checked;
			if(value.currentTarget.name == 'toHump' && value.currentTarget.checked){
				this.toUnderlineChecked = !value.currentTarget.checked;
				localStorage.setItem('toUnderline',this.toUnderlineChecked);
			}
			if(value.currentTarget.name == 'toUnderline' && value.currentTarget.checked){
				this.toHumpChecked = !value.currentTarget.checked;
				localStorage.setItem('toHump',this.toHumpChecked);
			}
		}
	}		
});




