// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;
// but you're not, so you'll write it from scratch:

var callDepth;
var temp = {};

var log = function(msg, change) {
  change = isNaN(change) ? 0 : change;
  setTimeout(function() {
    if(false) {
      callDepth = callDepth + change;
      msg = ' ' + msg;
      for (var i = 0; i < callDepth; i++){
        msg = '----' + msg;
      }
      throw new Error(msg);
    }
  }, 0);
};

var parseJSON = function (json) {
  var Token = {
    delim: 'delimiterType',
    value: 'valueType',
    string: 'stringType',
    tokenize: function(type, content){
      return {
        'type': type,
        'value': content
      };
    }
  };

  var assert = {
    eq: function (actual, expect){
      log('assert |' + actual + '| to equal |' + expect + '| ' + (expect == actual));
      if (expect != actual){
        throw ('invalid json, expect |' + actual + '| to equal |' + expect + '|');
      } else {
        return true;
      }
    },
    in: function (actual, expect){
      log('assert |' + actual + '| to be in |' + expect + '| ' + (expect.indexOf(actual)));
      if (expect.indexOf(actual) == -1){
        throw ('invalid json, expect |' + actual + '| to be in |' + expect + '|');
      } else {
        return true;
      }
    }
  };

  var stream = {
    current: 0,
    hasNext: function (){
      return stream.current < json.length;
    },
    head: function(){
      return json.charAt(stream.current);
    },
    isDelimiter: function(){
      var delimiter = '[]{},:';
      return delimiter.indexOf(stream.head()) != -1;
    },
    isIgnore: function(){
      var ignore = '\n\t\r ';
      return ignore.indexOf(stream.head()) != -1
    },
    pop: function (){
      log('@ start popping', 1);
      var tokenString = '';
      var inQuote = false; 
      var inEscape = false; 
      var isString = false;
      while(stream.hasNext()){
        log ('head: ' + stream.head());
        if (!inQuote && !inEscape && stream.isDelimiter()) {
          log('head is delimiter');
          if (tokenString.length > 0){
            log('^ a token was being built, return the token : ' + tokenString, -1);
            return Token.tokenize(isString? Token.string : Token.value, tokenString);;
          } else {
            log('^ no token is being built, return delimiter as token : ' + stream.head(), -1);
            tokenString = stream.head();
            stream.current++;
            return Token.tokenize(Token.delim, tokenString);
          }
        } 
        if (!inEscape && stream.head() == '"'){
          log('quote switch to : ' + !inQuote);
          inQuote = !inQuote;
          isString = true;
        } else if (!inEscape && inQuote && stream.head() == '\\'){
          log('escape turn on : ' + !inEscape);
          inEscape = true;
        } else if (!inEscape && !inQuote && stream.isIgnore()){
          log('white space outside of quote, ignore');
        } else {
          if (inEscape){
            log('escape turn off : ' + !inEscape);
            inEscape = false;
          }
          log('building token |' + tokenString + '| + |' + stream.head() + '|');
          tokenString += stream.head();
        }
        stream.current++;
      }//end while
      log('^ end of file, token is |' + tokenString + '|', -1);
      if (inQuote || inEscape){
        throw('unexpected end of file');
      }
      return Token.tokenize(isString? Token.string : Token.value, tokenString);;
    }
  };
  
  var parse = {
    doParse: function(token){
      var map = {
        '{': parse.parseObject,
        '[': parse.parseArray
      }
      log('routing : ' + token.type + ' ' + token.value);
      var result;
      if (token.type === Token.delim) {
        result = map[token.value]();
      } else if (token.type === Token.value || token.type == Token.string) {
        result = parse.parseValue(token);
      } else {
        throw 'bad token';
      }
      log('good token finished : ' + result);
      return result;
    },
  	parseObject: function (){
      log('@ begin object construction', 1);
      var obj = {};
      var name, ending;
      while(stream.hasNext()){
        name = stream.pop();
        if (name.value == '}'){
          assert.eq(Object.keys(obj).length, 0);
          log('^ end of empty object, return : ' + obj, -1);
          return obj;
        }
        assert.eq(stream.pop().value, ':'); //this pop should pop the colon
        obj[name.value] = parse.doParse(stream.pop());
        log('+ assign: ' + name.value + ': ' + obj[name.value]);
        ending = stream.pop();
        assert.in(ending.value, ',}');
        if (ending.value == '}'){
          log('^ end of non empty object, return : ' + obj, -1);
          return obj;
        } //else just carry on
      }
      throw('unexpected end of object');
  	},
    parseArray: function (){
      log('@ begin array construction', 1);
      var arr = [];
      var value, ending;
      while(stream.hasNext()){
        value = stream.pop();
        if (value.value == ']'){
          assert.eq(arr.length, 0);
          log('^ end of empty array, return : ' + arr, -1);
          return arr;
        }
        arr.push(parse.doParse(value));
        log('+ push : ' + arr.length + ' : ' + arr[arr.length-1]);
        ending = stream.pop();
        assert.in(ending.value, ',]');
        if (ending.value == ']'){
          log('^ end of non empty aray, return : ' + arr, -1);
          return arr;
        } 
      }
      throw('unexpected end of array');
    },
    parseValue: function (token){
      log('begin parsing token: ' + token.type + ' : ' +  token.value);
      if (token.type == Token.string){
        return token.value;
      }
      if (!isNaN(token.value)){
        return parseFloat(token.value);
      } 
      switch(token.value){
        case 'null': return null;
        case 'true': return true;
        case 'false': return false;
        default: throw ('unexpected fall through'); //this case is same as first return
      }
    }
  };

  callDepth = 0;
  log('begin parsing of json =======================: ' + json);
  temp.json = json;
  temp.my = parse.doParse(stream.pop());
  temp.sys = JSON.parse(json);
  log('end result of json ==========================: ' + temp.my);
  return temp.my;
}