var headerObj = {
  // 이전, 다음 콘텐츠 이동
  moveNextAndPrevCotent : function(model){
    var btnMove = document.querySelector(".btnMove");
    btnMove.addEventListener("click", function(e){
      var target = e.target,
          titleData = model.getTitleData(),
          newsName = utility.$(".content .newsName").innerHTML,
          currentIndex = titleData.indexOf(newsName);

      if(titleData.length === 0){
        return;
      }

      if(target.closest(".left")){
        currentIndex--;
        if(currentIndex === -1){
          currentIndex = titleData.length - 1;
        }
      }else{
        currentIndex++;
        if(currentIndex >= titleData.length){
          currentIndex = 0;
        }
      }
      content.showContent({data : model.getAllData(), index : currentIndex});
      lnb.addSelectClass(currentIndex);
      lnb.showCurrentPage(currentIndex);
    })
  }
}

function Header(){
  return {};
}
//생성자 밖에서 호출하기 고민해보자
///////////////////////////////////////////////////////////////

var lnbObj = {
  //lnb 매체 리스트 생성
  showList : function(data){
    var i,
        ulHtml = reuseObj.ulTemplate.innerHTML,
        result = "";
    for(i = 0; i < data.length; i = i + 1){
      if(i === 0){
        result += "<li class='select'>"+data[i]+"</li>";
        continue;
      }
      result += "<li>"+data[i]+"</li>";
    }
    ulHtml = ulHtml.replace("{newsTitleList}", result);
    reuseObj.ul.innerHTML = ulHtml;
    //setNewsTemplate({index : 0, data : data})
  },
  //lnb 매체 리스트 클릭시 콘텐츠 변경
  moveClickedList : function(model){
    reuseObj.ul.addEventListener("click", function(e){
      var target = e.target,
          titleData = model.getTitleData(),
          index = titleData.indexOf(target.innerHTML);
      content.showContent({data : model.getAllData(), index : index})
      this.addSelectClass(index)
      this.showCurrentPage(index)
    }.bind(this))
  },

  addSelectClass : function(index){
    var allLi = reuseObj.ul.children;
    for(var i = 0; i < allLi.length; i = i + 1){
      allLi[i].classList.remove("select");
    }
    allLi[index].classList.add("select");
  },

  //현재페이지 넘버 출력
  showCurrentPage : function(index){
    var currentPage = utility.$(".currentPage");
    currentPage.innerHTML = index + 1;
  },
  //총페이지 넘버 출력
  showTotalPage : function(data){
    var totalPage = utility.$(".totalPage");
    totalPage.innerHTML = data.length;
  }
}

function Lnb(){
  return {};
}

///////////////////////////////////////////////////////////////

var contentObj = {
  // 콘텐츠 보여주기
  showContent : function(obj){
    var newsHtml = document.querySelector("#newsTemplate").innerHTML,
        str = "";
    if(obj.data.length === 0){
      reuseObj.content.innerHTML = "";
      return;
    }
    newsHtml = newsHtml.replace("{title}", obj.data[obj.index].title).replace("{imgurl}", obj.data[obj.index].imgurl);
    for(var i = 0; i < obj.data[obj.index].newslist.length; i = i + 1){
      str += "<li>"+obj.data[obj.index].newslist[i]+"</li>"
    }
    newsHtml = newsHtml.replace("{newsList}", str);
    reuseObj.content.innerHTML = newsHtml;
    /*
    newsListIndex = obj.index;
    changeCurrentPage(newsListIndex);*/
  },

  //구독취소하기
  cancelSubscription : function(model){
    reuseObj.content.addEventListener("click", function(e){
      var target = e.target,
          titleData = model.getTitleData(),
          newsName = utility.$(".content .newsName").innerHTML,
          currentIndex = titleData.indexOf(newsName);
      //console.log(currentIndex);
      if(target.classList.contains("btnDelNews")){
        model.removeData(currentIndex);
        content.showContent({data : model.getAllData(), index : 0})
        lnb.showList(model.getTitleData());
        lnb.showCurrentPage(0);
        lnb.showTotalPage(model.getTitleData());
      }
    })
  }
}

function Content(){
  return{}
}

///////////////////////////////////////////////////////////////

var controllerObj = {
// 에이작스 호출
  init : function(){
    utility.runAjax(this.getData.bind(this), this.url);
  },
// 에이작스 콜백함수, 받아온 제이슨데이터를 모델에 저장
  getData : function(e){
    var data = JSON.parse(e.target.responseText);

    var newsModel = Model(data);
    Object.setPrototypeOf(newsModel, modelObj);

    this.render(newsModel);
  },
// 처음 로드되었을때 각 화면을 뿌려주는 함수
  render : function(model){
    content.showContent({data : model.getAllData(), index : 0});
    content.cancelSubscription(model);

    lnb.showList(model.getTitleData());
    lnb.moveClickedList(model);

    lnb.showCurrentPage(0);
    lnb.showTotalPage(model.getAllData());

    header.moveNextAndPrevCotent(model);

    //this.workEvent({model : model, content : content, lnb : lnb, header : header});
  },
//이벤트 동작 관련 함수
  workEvent : function(obj){
/*
    reuseObj.ul.addEventListener("click", function(e){
      var target = e.target,
          titleData = obj.model.getTitleData(),
          index = titleData.indexOf(target.innerHTML);
      obj.content.showContent({data : obj.model.getAllData(), index : index})
    })
*/
/*
    var btnMove = document.querySelector(".btnMove");
    btnMove.addEventListener("click", function(e){
      var target = e.target,
          titleData = obj.model.getTitleData(),
          index = titleData.indexOf(target.innerHTML),
          newsName = utility.$(".content .newsName").innerHTML,
          currentIndex = titleData.indexOf(newsName);

      if(titleData.length === 0){
        return;
      }

      if(target.closest(".left")){
        currentIndex--;
        if(currentIndex === -1){
          currentIndex = titleData.length - 1;
        }
        //setClass(newsListIndex, "select");
        obj.content.showContent({data : obj.model.getAllData(), index : currentIndex})
      }else{
        currentIndex++;
        if(currentIndex >= titleData.length){
          currentIndex = 0;
        }
        //setClass(newsListIndex, "select");
        obj.content.showContent({data : obj.model.getAllData(), index : currentIndex})
      }
    })
    */
  }
}

function Controller(url){
  return {
    url : url
  }
}

///////////////////////////////////////////////////////////////

var modelObj = {
  setData : function(data){
    this.data = data;
  },
  //모든 데이터 가져오기
  getAllData : function(){
    return this.data;
  },
  //타이틀만 가져오기
  getTitleData : function(){
    var titleArr = [];
    this.data.forEach(function(item){
      titleArr.push(item.title);
    })
    return titleArr;
  },
  //데이터 삭제하기
  removeData : function(index){
    this.data.splice(index, 1);
  }
}

function Model(data){
  return{
    data : data
  }
}

///////////////////////////////////////////////////////////////
// 재사용되는 엘리멘트 정의
var reuseObj = {
  content : document.querySelector(".content"),
  ulTemplate : document.querySelector("#ulTemplate"),
  ul : document.querySelector(".mainArea > nav > ul"),
  page : document.querySelector(".page")
}

///////////////////////////////////////////////////////////////

var utility = {
  $ : function(ele){
    return document.querySelector(ele);
  },

  //ajax호출하기
  runAjax : function(func, url){
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", func);
    oReq.open("GET", url);
    oReq.send();
  },
}

///////////////////////////////////////////////////////////////

var news = null,
    content = null,
    lnb = null,
    header = null;

document.addEventListener("DOMContentLoaded", function(){
  news = Controller("newslist.json");
  Object.setPrototypeOf(news, controllerObj)

  content = Content();
  Object.setPrototypeOf(content, contentObj);

  lnb = Lnb();
  Object.setPrototypeOf(lnb, lnbObj);

  header = Header();
  Object.setPrototypeOf(header, headerObj);

  news.init();
})
