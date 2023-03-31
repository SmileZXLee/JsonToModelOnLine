/**
 * Type
 * @author ZXLee
 * @github https://github.com/SmileZXLee/JsonToModelOnLine
 */

class Type {
  static types = {
    booleanType: 'boolean',
    intType: 'int',
    longType: 'long',
    floatType: 'float',
    numberType: 'number',
    stringType: 'string',
    arrayType: 'array',
    idType: 'id'
  }

  //判断是否是数组
  static isArray(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
  }

  //判断是否是数字
  static isNumber(obj) {
    return typeof obj === 'number' && !isNaN(obj);
  }

  //判断是否是字符串
  static isString(obj) {
    return typeof (obj) === 'string';
  }

  //判断是否是bool
  static isBoolean(obj) {
    return typeof (obj) === 'boolean';
  }

  //获取类型
  static getType(obj) {
    const types = this.types;
    if (this.isArray(obj)) {
      return types.arrayType;
    }
    var outputAllToString = localStorage.getItem('outputAllToString') == 'true' ? 1 : 0;
    if (this.isString(obj)) {
      return types.stringType;
    }
    if (this.isNumber(obj)) {
      if (outputAllToString) {
        return types.stringType;
      }
      if ((obj | 0) === obj) {
        return types.intType;
      } else {
        if (obj.toString().indexOf('.') == -1) {
          return types.longType;
        }
        return types.floatType;
      }
    }
    return types.idType;
  }

  //获取数组中元素的类型
  static getArraContentType(array) {
    if (!array.length) {
      return idType;
    }
    return this.getType(array[0]);
  }
}
