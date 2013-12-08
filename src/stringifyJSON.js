// this is what you would do if you liked things to be easy:
 var nativeStringifyJSON = JSON.stringify;

// but you don't so you're going to have to write it from scratch:
var stringifyJSON = function (obj) {
	switch(typeof obj){
		case 'undefined':
			return 'undefined';
		case 'string':
			return '\"' + obj + '\"';
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
			  	return  '{'.concat(arr.join(',')).concat('}');
			}//end object
		default:
			return obj;
	}//end switch
};
//==============================
var logsOn = true;
function log(msg) {
  setTimeout(function() {
    if(logsOn) {
      throw new Error(msg);
    }
  }, 0);
}