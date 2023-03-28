/**
 * 所有语言格式化工厂
 * @author ZXLee
 * @github https://github.com/SmileZXLee/JsonToModelOnLine
 */

class FormaterFactory{
  static createFormater(language, data) {
    let formater = null;
    switch (language) {
      case 'Java': {
        formater = new JavaFormater(data);
        break;
      }
      case 'PHP': {
        formater = new PHPFormater(data);
        break;
      } 
      case 'Objective-C': {
        formater = new OCFormater(data);
        break;
      }
      case 'Swift': {
        formater = new SwiftFormater(data);
        break;
      }
      case 'C#': {
        formater = new CSharpFormater(data);
        break;
      }
      case 'Vue': {
        formater = new VueFormater(data);
        break;
      }
      case 'Typescript': {
        formater = new TypescriptFormater(data);
        break;
      }
      default:
        break;
    }
    return formater;
  }
}

class Formater {

  constructor(jsonObj) {
    this.jsonObj = jsonObj;
  }

  format() {
    
  };


  _handleFormat(handler) {
    if (!this.jsonObj) return null;
    let propertyFormat = '';
    const types = Type.types;
    this.jsonObj.forEach((item, index, array) => {
      let key = this._handleKeyConvert(item.key);
      let value = item.value;
      propertyFormat += handler({types, item, index, array, key, value});
    })
    return propertyFormat;
  }

  //下划线转驼峰
  _toHumpFunc(value) {
    return value.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
  }

  //驼峰转下划线
  _toUnderLineFunc(value) {
    return value.replace(/([A-Z])/g,"_$1").toLowerCase();
  }

  //获取注释头内容
  _getAnnotation(){
    return localStorage.getItem('addComment') == 'true' ? '/**\n*\n*/\n' : '';
  }

  //key值转换（驼峰转下划线或下划线转驼峰或都不进行）
  _handleKeyConvert(key) {
    const toHump = localStorage.getItem('toHump') == 'true' ? 1 : 0;
    const toUnderline = localStorage.getItem('toUnderline') == 'true' ? 1 : 0;
    if (toHump) {
      return this._toHumpFunc(key);
    } else if (toUnderline){
      return this._toUnderLineFunc(key);
    }
    return key;
  }
}

class JavaFormater extends Formater {
  format() {
    return this._handleFormat(params => {
      let { types, item, key, value } = params;
      function formatValue(tempValue){
        if (tempValue == types.stringType) {
          tempValue = 'String';
        } else if (tempValue == types.booleanType) {
          tempValue = 'Boolean';
        } else if (tempValue == types.intType) {
          tempValue = 'Integer';
        } else if (tempValue == types.floatType) {
          tempValue = 'Float';
        } else if (tempValue == types.idType) {
          tempValue = 'Object';
        }
        return tempValue;
      }

      value = formatValue(value);

      if (value == types.arrayType) {
        let itemArrayType = item.arrayType;
        itemArrayType = formatValue(itemArrayType);
        value = `List<${itemArrayType}>`;
      }

      return `${this._getAnnotation()}private ${value} ${key};\n`;
    });
  }
}

class PHPFormater extends Formater {
  format() {
    return this._handleFormat(params => {
      const { key } = params;
      return this._getAnnotation() + 'public' + ' $' + key +';\n';
    });
  }
}

class OCFormater extends Formater {
  format() {
    return this._handleFormat(params => {
      let { types, key, value } = params;

      var valueType = 'strong';
      if (value == types.stringType) {
        value = 'NSString *';
        valueType = 'copy';
      } else if(value == types.arrayType) {
        value = 'NSArray *';
      } else if(value == types.booleanType) {
        value = 'BOOL ';
        valueType = 'assign';
      } else if(value == types.floatType) {
        value = 'CGFloat ';
        valueType = 'assign';
      } else {
        value += ' ';
      }
      if (value == types.intType + ' ' || value == types.longType + ' ') {
        valueType = 'assign';
      }
      const annotation = localStorage.getItem('addComment') == 'true' ? '///\n' : '';
      return `${annotation}@property (${valueType}, nonatomic) ${value}${key};\n`;
    });
  }
}

class SwiftFormater extends Formater {
  format() {
    return this._handleFormat(params => {
      let { types, item, key, value } = params;
      
      function formatValue(tempValue){
        if (tempValue == types.booleanType) {
          tempValue = 'Bool';
        } else if(tempValue == types.floatType) {
          tempValue = 'CGFloat ';
        } else if (tempValue == types.idType) {
          tempValue = 'any';
        } else {
          if (tempValue.length) {
            tempValue = tempValue.slice(0, 1).toUpperCase() + tempValue.slice(1);
          }
        }
        return tempValue;
      }
      value = formatValue(value);
      if (value == types.arrayType) {
        let itemArrayType = item.arrayType;
        itemArrayType = formatValue(itemArrayType);
        value = `[${itemArrayType}]`;
      }
      const annotation = localStorage.getItem('addComment') == 'true' ? '///\n' : '';
      return `${annotation}var ${key} :${value}?\n`;
    });
  }
}

class CSharpFormater extends Formater {
  format() {
    return this._handleFormat(params => {
      let { types, item, key, value } = params;
      function formatValue(tempValue) {
        if (tempValue == types.idType) {
          tempValue = 'Object';
        }
        return tempValue;
      }
      value = formatValue(value);

      if(value == types.arrayType){
        let itemArrayType = item.arrayType;
        itemArrayType = formatValue(itemArrayType);
        value = `List ${itemArrayType}`;
      }

      return `${this._getAnnotation()}public ${value} ${key} { get; set;};\n`;
    });
  }
}

class VueFormater extends Formater {
  format() {
    return this._handleFormat(params => {
      let { types, index, array, key, value } = params;
      if (value == types.stringType) {
        value = '\'\'';
      } else if(value == types.idType) {
        value = 'null';
      } else if(value == types.arrayType) {
        value = '[]' ;
      } else if(value == types.booleanType) {
        value = 'false' ;
      } else {
        value = '0'
      }
      var annotation = localStorage.getItem('addComment') == 'true' ? '//\n' : '';
      return annotation + key + ': ' + value + (index == array.length - 1 ? '\n' : ',\n');
    });
  }
}

class TypescriptFormater extends Formater {
  format() {
    return this._handleFormat(params => {
      let { types, item, key, value } = params;
      
      function formatValue(tempValue) {
        if ([types.floatTyp, types.intType, types.longType].indexOf(tempValue) !==-1) {
          tempValue = 'number';
        } else if(tempValue == types.idType) {
          tempValue = 'any';
        }
        return tempValue;
      }

      value = formatValue(value);

      if (value == types.arrayType) {
        let itemArrayType = item.arrayType;
        if (itemArrayType == types.idType) {
          itemArrayType = 'any';
        } else if ([types.floatTyp, types.intType, types.longType].indexOf(itemArrayType) !==-1) {
          itemArrayType = 'number';
        }
        itemArrayType = formatValue(itemArrayType);
        value = `<${itemArrayType}>[]`;
      }
      const annotation = localStorage.getItem('addComment') == 'true' ? '//\n' : '';
      return `${annotation}${key}?: ${value};\n`;
    });
  }
}