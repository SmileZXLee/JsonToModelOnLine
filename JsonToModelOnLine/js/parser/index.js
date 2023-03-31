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
    return this.jsonObj ? this._delSameData(this._handleJsonObject(this.jsonObj, [])) : null;
  }

  //去除剩余的重复数据
  _delSameData(arr) {
    const checkArray = new Array();
    const resultArray = new Array();
    for (let i = 0; i < arr.length; i++) {
      const value = arr[i];
      const keysArray = new Array();
      const parent = value.length ? (value[0].parent || '') : '';
      for (let j = 0; j < value.length; j++) {
        keysArray.push(value[j]['key']);
      }
      const valueStr = parent + keysArray.sort().toString();
      if (checkArray.length == 0 || checkArray.indexOf(valueStr) == -1) {
        checkArray.push(valueStr);
        resultArray.push(value);
      }
    }

    return resultArray;
  }

  //处理Json对象（所有类型）
  _handleJsonObject(jsonObject, resultArray, parent, level = 0) {
    level++;
    if (Type.isArray(jsonObject)) {
      jsonObject.forEach(item => {
        if (Type.isArray(item)) {
          resultArray.push([{ key, value: Type.types.arrayType, arrayType: getArraContentType(item) }]);
          this._handleJsonObject(item, resultArray, parent, level);
        } else {
          this._handleNoramlObject(item, resultArray, parent, level);
        }
      })
    } else {
      this._handleNoramlObject(jsonObject, resultArray, parent, level);
    }
    return resultArray;
  }

  //处理普通的Json对象
  _handleNoramlObject(normalObject, resultArray, parent, level = 0) {
    if (Type.isString(normalObject) || !normalObject) {
      return;
    }
    const normalArray = new Array();
    Object.getOwnPropertyNames(normalObject).forEach(key => {
      const value = normalObject[key];
      const type = Type.getType(value);
      const types = Type.types;
      const baseInfo = { parent, level, key };
      if (type == types.arrayType) {
        normalArray.push({ ...baseInfo, value: type, arrayType: Type.getArraContentType(value) });
        resultArray.push(normalArray);
        this._handleJsonObject(value, resultArray, key, level);
      } else if (type == types.stringType) {
        normalArray.push({ ...baseInfo, value: types.stringType });
      } else if (Type.isNumber(value)) {
        normalArray.push({ ...baseInfo, value: type });
      } else if (Type.isBoolean(value)) {
        normalArray.push({ ...baseInfo, value: types.booleanType });
      } else {
        normalArray.push({ ...baseInfo, value: types.idType });
        resultArray.push(normalArray);
        this._handleJsonObject(value, resultArray, key, level);
      }
    });
    resultArray.push(normalArray);
  }
}