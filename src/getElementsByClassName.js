// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But in stead we're going to implement it from scratch:
var getElementsByClassName = function (className) {
  var elementList = [];
  getElements(document.body, className, elementList);
  return elementList;
};

function getElements(element, className, elementList){
	if (hasClass(element, className)){
		elementList.push(element);
	}
	for (var i = 0; i < element.childNodes.length; i++){
		getElements(element.childNodes[i], className, elementList);
	}
}


function hasClass(element, className){
	if (element.classList == undefined){
		return false;
	}
	for (var i = 0; i < element.classList.length; i++){
		if (element.classList[i] == className){
			return true;
		}
	}
	return false;
}