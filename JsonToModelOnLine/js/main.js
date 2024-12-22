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
  return JSON.stringify(getJsonObject(str), null, new Array(4).join(" "))
}

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
      'Objective-C': 'objc',
      'Swift': 'swift',
      'C#': 'csharp',
      'Vue': 'javascript',
      'Typescript/ArkTs': 'typescript',
      'Flutter': 'dart'
    },
    currentConvertedLanguage: localStorage.getItem('language') || 'Java',
    hasSelect: false
  },
  methods: {
    convertAction() {
      if (!this.inputValue.length) {
        alert('请在左侧输入Json字符串');
        return;
      }
      try {
        var jsonObject = getJsonObject(this.inputValue);
        this.inputValue = formatJson(this.inputValue);
        this.$nextTick(() => {
          const textarea = document.getElementById('input-part-textarea');
          textarea.scrollTop = 0;
        })
        const parser = new Parser(jsonObject);
        var resultArray = parser.parse();
        resultArray = resultArray.filter(subArr => subArr && subArr.length);
        const outputValue = [];
        this.outputValue = [];
        for (let i = 0; i < resultArray.length; i++) {
          const formater = FormaterFactory.createFormater(vm2.language, resultArray[i]);
          formater && outputValue.push({
            highlight: false,
            parent: resultArray[i][0].parent || null,
            level: resultArray[i][0].level || 1,
            data: formater.format()
          });
        }
        this.$nextTick(() => {
          this.outputValue = outputValue;
          this.$nextTick(() => {
            hljs.highlightAll();
          })
          this.currentConvertedLanguage = localStorage.getItem('language') || 'Java';
        })

      } catch (err) {
        alert('转换失败，错误信息为：' + err);
        this.outputValue = [];
      }
    },
    languageClick(value) {
      console.log(value.currentTarget.value);
    },
    handleInputSelectChange() {
      function doSelectNode($this, item, index) {
        $this.$set(item, 'highlight', true);
        $this.hasSelect = true;
        const element = document.getElementById('output-card-id-' + index);
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      this.$nextTick(() => {
        const selectedStr = window.getSelection().toString();
        if (!!selectedStr || this.hasSelect) {
          this.hasSelect = false;
          for (let i = 0; i < this.outputValue.length; i++) {
            const item = this.outputValue[i];
            this.$set(item, 'highlight', false);
            if (item.parent === selectedStr) {
              doSelectNode(this, item, i);
              break;
            }
          }

          if (!!selectedStr && !this.hasSelect) {
            const regex = /"([^"]*)":/g;
            let allSelectedKeys = [];
            let match;
            while ((match = regex.exec(selectedStr)) !== null) {
              allSelectedKeys.push(match[1]);
            }
            if (!allSelectedKeys.length) {
              allSelectedKeys = [selectedStr.replace(/"/g, '')];
            }
            for (let i = 0; i < this.outputValue.length; i++) {
              const item = this.outputValue[i];
              if (allSelectedKeys.every(key => {
                return item.data.indexOf(key + " ") !== -1 || item.data.indexOf(key + ":") !== -1 ||
                  item.data.indexOf(key + ";") !== -1 || item.data.indexOf(key + "?") !== -1;
              })
              ) {
                doSelectNode(this, item, i);
                break;
              }
            }
          }

        }
      })
    },
    copyCodeClick(item) {
      if (item.copied) return;
      this.$set(item, 'copied', true);
      navigator.clipboard.writeText(item.data);
      setTimeout(() => {
        this.$set(item, 'copied', false);
      }, 1500)
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
    allowNullChecked: localStorage.getItem('allowNull') == 'true' ? 1 : 0,
    languages: [
      'Java',
      'PHP',
      'Objective-C',
      'Swift',
      'C#',
      'Vue',
      'Typescript/ArkTs',
      'Flutter'
    ]
  },
  methods: {
    languageClick(value) {
      this.language = value.currentTarget.value;
      localStorage.setItem('language', this.language);
    },
    actionClick(value) {
      localStorage.setItem(value.currentTarget.name, value.currentTarget.checked);
      this[value.currentTarget.name + 'Checked'] = value.currentTarget.checked;
      if (value.currentTarget.name == 'toHump' && value.currentTarget.checked) {
        this.toUnderlineChecked = !value.currentTarget.checked;
        localStorage.setItem('toUnderline', this.toUnderlineChecked);
      }
      if (value.currentTarget.name == 'toUnderline' && value.currentTarget.checked) {
        this.toHumpChecked = !value.currentTarget.checked;
        localStorage.setItem('toHump', this.toHumpChecked);
      }
    }
  }
});




