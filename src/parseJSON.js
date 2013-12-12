// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;
// but you're not, so you'll write it from scratch:
var parseJSON = function (json) {
    log('==========start with: ' + json);
    var current = 0;
    var first = nextToken();
    //check(first, '{[', 'first'); //json should begin as either of these?
    var result;
    log('first token is: ' + first);
    if (first == '{'){
      log(first == '{');
      log('start with obj');
      result = parseObject(); 
    } else if (first == '['){
      log('start with obj');
      result = parseArray();
    } else {
      result = parseValue(first); //only an value is not valid json?
    }

    log('==========final: ' + stringifyJSON(result));
    return result;

    function hasNext(){
      return current < json.length;
    }

    function nextToken(){
      var token = '';
      var inQuote = false;
      var singleToken = '[]{},:';
      log('begin nextToken')
      while(hasNext()){
        log('current: ' + json.charAt(current) + '| so far: ' + token);
        if (!inQuote && singleToken.indexOf(json.charAt(current)) != -1) {
          log('terminating');
          if (token.length > 0){
            log('return token: ' + token);
            return token;
          } else {
            current++;
            log('return terminator: ' + json.charAt(current-1));
            return json.charAt(current-1);
          }
        }
        if (json.charAt(current) == '"'){
          log('quote switch');
          inQuote = !inQuote;
        } else {
          log('add to token');
          token += json.charAt(current);
        }
        current++;
      }
      log('return end of file token: ' + token);
      if (token.length == 0 || inQuote){
        throw('unexpected end of file');
      }
      return token;
    }

    function getParser(token){
      log('--------getParser with: ' + token);
      if (token == '{'){
        log('obj parser');
        return parseObject;
      } 
      if (token == '['){
        log('arr parser');
        return parseArray;
      }
      log('value parser');
      return parseValue;
    }

  	function parseObject(){
      var obj = {};
      var name, colon, value, ending;
      while(hasNext){
        name = nextToken();
        if (name == '}'){
          log('======return object: ' + obj);
          return obj;
        }
        check(nextToken(), ':', 'parseObject');
        value = nextToken();
        obj[name] = getParser(value).apply(null, [value]);
        log('******assign property: ' + name + ':' + obj[name]);
        ending = nextToken();
        check(ending, ',}', 'parseObject');
        if (ending == '}'){
          log('======return object: ' + obj);
          return obj;
        }
      }
      throw('unexpected end of object');
  	}

    function parseArray(){
      var arr = [];
      var value, ending;
      while(hasNext){
        value = nextToken();
        log('[][][] array value is: ' + value);
        if (value == ']'){
          log('======return array: ' + arr);
          return arr;
        }
        arr.push(getParser(value).apply(null, [value]));
        log('******assign array: ' + arr[arr.length-1]);
        ending = nextToken();
        check(ending, ',]', 'parseArray');
        if (ending == ']'){
          log('======return array: ' + arr);
          return arr;
        }
      }
      throw('unexpected end of array');
    }

    function parseValue(value){
      log('parsing value: ' + value);
      if (!isNaN(value)){
        log('number: ' + parseFloat(value));
        return parseFloat(value);
      }
      switch(value){
        case 'null': return null;
        case 'true': return true;
        case 'false': return false;
        default: return value;
      }
    }

    function check(actual, expect, funcName){
      log('%%%checking, expect ' + expect + ' have ' + actual + ' at ' + current + ' executing ' + funcName);
      if (expect.indexOf(actual) == -1){
        throw ('invalid json, expect ' + expect + ' have ' + actual + ' at ' + current + ' executing ' + funcName);
      } else {
        return true;
      }
    }
}


function log(msg) {
  setTimeout(function() {
    if(true) {
      throw new Error(msg);
    }
  }, 0);
}
//===========================
var stringifyJSON = function (obj) {
  switch(typeof obj){
    case 'undefined':
      return 'undefined';
    case 'string':
      return '"' + obj + '"';
    case 'boolean':
      return '' + obj;
    case 'number':
      return '' + obj;
    case 'object':
      var arr = [];
      if (Array.isArray(obj)){
        for (var i = 0; i < obj.length; i++){
          arr[i]= stringifyJSON(obj[i]);
        }
        return '['.concat(arr.join(',')).concat(']');
      } else {//object
        if (obj == null){
          return 'null';
        }
        var keys = Object.keys(obj);
        var offset = 0;
        for (var i = 0; i < keys.length; i++){
          if (typeof obj[keys[i]] == 'object' || obj[keys[i]] != undefined && typeof obj[keys[i]] != 'function'){
            arr[i-offset] = stringifyJSON(keys[i]).concat(':').concat(stringifyJSON(obj[keys[i]]));
          } else {
            offset++;
          }
        }
          return '{'.concat(arr.join(',')).concat('}');
      }//end object
    default:
      return obj;
  }//end switch
};
//===========================

// var parseJSON = function (json) {
//   	switch(jsonType(json)){
// 	  	case 'map':
// 	  		return jsonObject(json);
// 	  		break;
// 	  	case 'array': 
// 	  		return jsonArray(json);
// 	  		break;
// 	  	case 'value': 
// 	  		return jsonValue(json);
// 	  		break;
// 	  	default:
// 	  		throw('bad json string');
// 	  		break;
// 	}
// };

// function jsonType(json){
// 	if (json.charAt(0) == '{' && json.charAt(json.length-1) != '}'){
// 		return 'object';
// 	}
// 	if (json.charAt(0) == '[' && json.charAt(json.length-1) != ']'){
// 		return 'array';
// 	}
// 	return 'value';
// }

// function jsonObject(json){
// 	var obj = {};
// 	var arr = json.slice(1, json.length-1).split(',');
// 	for (var i = 0; i < arr.length; i++){
// 		obj(jsonValue(arr[i].slice(0, arr[i].indexOf(':')))) = parseJson(arr[i].slice(0, arr[i].indexOf(':')));
// 	}
// 	return obj;
// }

// function jsonArray(json){
// 	var result= [];
// 	var arr = json.split(',');
// 	for (var i = 0; i < arr.length; i++){
// 		result[i] = parseJson(arr[i]);
// 	}
// 	return result;
// }

// function jsonValue(json){
// 	if (!isNaN(json)){
// 		return parseFloat(json);
// 	}
// 	switch(json){
// 		case 'null': return null;
// 		case 'true': return true;
// 		case 'false': return false;
// 		default: return json;
// 	}
// }