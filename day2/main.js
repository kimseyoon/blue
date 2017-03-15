/*
DOM객체를 따로 만들어 쓸수도있다
콜백안에서 생성된 데이터를 이용할수 밖에 없다. 그래서 해당 데이터를 사용하려면 안에 종속된 함수에 인자로 계속
넘겨줄 수 밖에 없다.
*/

(function(){
  var newsListIndex = 0;
  var ajaxData;

  document.addEventListener("DOMContentLoaded", function(){
    ajax(init);
  })

  var content = document.querySelector(".content");
  content.addEventListener("click", function(e){
    var target = e.target;
    if(target.classList.contains("btnDelNews")){
      deleteNews(ajaxData);
    }
  })

  function init(){
    var data = JSON.parse(this.responseText);
    ajaxData = data;
    createLiElement(data);
    initPage(data.length);

    var nav = document.querySelector("nav");
    nav.addEventListener("click", function(e){
      var target = e.target;
      var ul  = document.querySelector(".mainArea nav ul");
          allLi = ul.querySelectorAll("li");
      var targetIndex = [].indexOf.call(allLi, target);

      toggle(target, "select");
      changeCurrentPage(targetIndex);
      setNewsTemplate({data : data, index : targetIndex});
    })

    var btn = document.querySelector(".btn");
    btn.addEventListener("click", function(e){
      var target = e.target;
      var content = document.querySelector(".content");

      if(target.closest(".left")){
        newsListIndex--;
        if(newsListIndex === -1){
          newsListIndex = data.length - 1;
        }
        setClass(newsListIndex, "select");
        changeCurrentPage(newsListIndex);
        setNewsTemplate({data : data, index : newsListIndex});
      }else{
        newsListIndex++;
        if(newsListIndex >= data.length){
          newsListIndex = 0;
        }
        setClass(newsListIndex, "select");
        changeCurrentPage(newsListIndex);
        setNewsTemplate({data : data, index : newsListIndex});
      }
    })
  }

  function initPage(dataLength){
    var pageEle = document.querySelector(".page"),
        currentPage = pageEle.querySelector(".currentPage"),
        totalPage = pageEle.querySelector(".totalPage");
    totalPage.innerHTML = dataLength;
    currentPage.innerHTML = newsListIndex + 1;
  }

  function changeCurrentPage(index){
    var pageEle = document.querySelector(".page"),
        currentPage = pageEle.querySelector(".currentPage");
    currentPage.innerHTML = index + 1;
  }

  function toggle(ele, className){
    var ulEle = ele.parentElement;
    var liList = ulEle.children;
    for(var i=0;i<liList.length;i++){
      liList[i].classList.remove(className);
    }
    ele.classList.add(className);
  }

  function setClass(index, className){
    var ulEle = document.querySelector("section.mainArea > nav > ul");
    var liList = ulEle.children;
    for(var i=0;i<liList.length;i++){
      liList[i].classList.remove(className);
    }
    liList[index].classList.add(className);
  }

  function ajax(func){
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", func)
    oReq.open("GET", "newslist.json");
    oReq.send();
  };

  function createLiElement(data){
    var li,
        i,
        ul = document.querySelector(".mainArea nav ul");
    for(i = 0; i < data.length; i = i + 1){
      li = document.createElement("LI");
      li.innerHTML = data[i].title;
      li.setAttribute("data-id", i);
      ul.appendChild(li);
      if(i === 0){
        li.classList.add("select");
      }
    }
    showContent(data);
  }

  function showContent(data){
    var ul  = document.querySelector(".mainArea nav ul");
        allLi = ul.querySelectorAll("li"),
        i;
    for(var i = 0; i < allLi.length; i = i + 1){
      if(allLi[i].classList.contains("select")){
        setNewsTemplate({index : i, data : data});
      }
    }
  }

  function deleteNews(data){
    var ulEle = document.querySelector("section.mainArea > nav > ul");
    if(newsListIndex === 0){
      ulEle.removeChild(ulEle.childNodes[newsListIndex]);
      setClass(0, "select")
      setNewsTemplate({data : data,});
    }
  }

  function setNewsTemplate(obj){
    var newsTemplate = document.querySelector("#newsTemplate"),
        newsHtml = newsTemplate.innerHTML,
        content = document.querySelector(".content"),
        str = "";
    newsHtml = newsHtml.replace("{title}", obj.data[obj.index].title).replace("{imgurl}", obj.data[obj.index].imgurl);
    for(var i = 0; i < obj.data[obj.index].newslist.length; i = i + 1){
      str += "<li>"+obj.data[obj.index].newslist[i]+"</li>"
    }
    newsHtml = newsHtml.replace("{newsList}", str);
    newsListIndex = obj.index;
    content.innerHTML = newsHtml;
  }
})();
