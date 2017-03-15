var singletone = (function(){
  var count = 0;

  function countDash(item, index){
    var tagName = item.className,
        regExp = /\w*\-\w*|\w*\_\w*/g;

    //console.log(tagName)
    /*if(tagName.indexOf("_") > 0 || tagName.indexOf("-") > 0){
      count++;
    }*/

    if(regExp.test(tagName) === true){
      count++;
    }
  }

  function showDashCount(tagName){
    var allEle = document.querySelectorAll(tagName);
      allEle.forEach(countDash);
      console.log(count);
      allEle.forEach(removeDashClass);
      count = 0;
  }

  function removeDashClass(item, index){
    var tagName = item.className,
        regExp = /\w*\-\w*|\w*\_\w*/g;
    if(regExp.test(tagName) === true){
      var result = tagName.replace(regExp, "");
      console.log(regExp)
      //item.classList.remove(regExp);
      //item.classList.toggle(result);
      //item.classList.add(changeClass)
    }
  }

  return showDashCount;
  
})();

singletone("div");
singletone("section");

