/**
 * json解析器
 * @author ZXLee
 * @github https://github.com/SmileZXLee/JsonToModelOnLine
 */

class Parser {

  constructor(jsonObj) {
    this.jsonObj = jsonObj;
  }

  // 开始解析
  parse() {
    return this.jsonObj ? this._delRemainSameData(this._handleJsonObject(this.jsonObj, []).reverse()) : null;
  }

  //去除剩余的重复数据
  _delRemainSameData(arr){
    const checkArray = new Array();
    const resultArray = new Array();
    for(let i = 0; i < arr.length; i++) {
      const value = arr[i];
      const keysArray = new Array();
      for(let j = 0; j < value.length; j++) {
        keysArray.push(value[j]['key']);
      }
      const valueStr = keysArray.sort().toString();
      if (checkArray.length == 0 || checkArray.indexOf(valueStr) == -1) {
        checkArray.push(valueStr);
        resultArray.push(value);
      }
    }
    return resultArray;
  }

  //处理Json对象（所有类型）
  _handleJsonObject(jsonObject, resultArray, parent) {
    if (Type.isArray(jsonObject)) {
      jsonObject.forEach(item => {
        if (Type.isArray(item)) {
          const normalArray = new Array();
          normalArray.push({key, value: Type.types.arrayType, arrayType: getArraContentType(item)});
          resultArray.push(normalArray);
          this._handleJsonObject(item, resultArray);
        } else {
          this._handleNoramlObject(item, resultArray, parent);
        }
      })
    } else {
      this._handleNoramlObject(jsonObject,resultArray, parent);
    }
    return resultArray;
  }

  //处理普通的Json对象
  _handleNoramlObject(normalObject, resultArray, parent) {
    if (Type.isString(normalObject) || !normalObject) {
      return;
    }
    const normalArray = new Array();
    Object.getOwnPropertyNames(normalObject).forEach(key => {
      const value = normalObject[key];
      const type = Type.getType(value);
      const types = Type.types;
      if (type == types.arrayType) {
        normalArray.push({parent, key, value: type, arrayType: Type.getArraContentType(value) });
        resultArray.push(normalArray);
        this._handleJsonObject(value, resultArray, key);
      } else if (type == types.stringType) {
        normalArray.push({parent, key, value: types.stringType});
      } else if (Type.isNumber(value)) {
        normalArray.push({parent, key, value: type});
      } else if (Type.isBoolean(value)) {
        normalArray.push({parent, key, value: types.booleanType});
      } else {
        normalArray.push({parent, key, value: types.idType});
        this._handleJsonObject(value, resultArray, key);
      }
    });
    resultArray.push(normalArray);
  }
}