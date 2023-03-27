/**
 * JsonToModelOnLine
 * @author ZXLee
 * @github https://github.com/SmileZXLee/JsonToModelOnLine
 */

//Json字符串转Json对象
function getJsonObject(str) {
	return JSON.parse(str);
}
//格式化输出Json
function formatJson(str) {
	return JSON.stringify(getJsonObject(str), null, "    ")
}
//字符串格式化
String.prototype.format = function() { 
    if (arguments.length == 0) return this; 
    for(var s = this,i=0;i < arguments.length;i++) 
        s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]); 
    return s; 
};

//点击了github图标，跳转
function githubAction() {
	window.open('https://github.com/SmileZXLee/JsonToModelOnLine');
}

var vm1 = new Vue({
	el: '.main',
	data: {
		inputValue: '',
		outputValue: [],
    languageAliasesMapper: {
      'Java': 'java',
      'PHP': 'php',
      'Objective-C': 'objectivec',
      'Swift': 'swift',
      'C#': 'csharp',
      'Vue': 'javascript',
      'Typescript': 'typescript',
    }
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
         const parser = new Parser(jsonObject);
			   var resultArray = parser.parse();
         resultArray = resultArray.filter(subArr => subArr && subArr.length);
         const outputValue = [];
         this.outputValue = [];
			   for (let i = 0;i < resultArray.length; i++) {
             const formater = FormaterFactory.createFormater(vm2.language, resultArray[i]);
             formater && outputValue.push({
              parent: resultArray[i][0].parent || null,
              data: formater.format()
             });
			   }
			   this.$nextTick(() => {
          this.outputValue = outputValue;
          this.$nextTick(() => {
            hljs.highlightAll();
          })
         })
         
			}
			catch(err){
			    alert('转换失败，错误信息为：' + err);
				this.outputValue = [];
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
		language: localStorage.getItem('language') || 'Java',
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
			'Vue',
      'Typescript'
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




