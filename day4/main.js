var ns = ns || {};

ns.view = {};
ns.view.headerObj = {
  init : function(){
    this.registerEvent();
  },

  registerEvent : function(){
    this.$header.addEventListener("click", function(e){
      var target = e.target;
      if(target.closest(".btnMove")){
        this.movePrevAndNextContent(target);
      }
    }.bind(this))
  },

  movePrevAndNextContent : function(target){
    if(target.closest(".left")){
      ns.dispatcher.emit({"type" : "movePrevAndNextContent"}, ["prev"]);
    }else{
      ns.dispatcher.emit({"type" : "movePrevAndNextContent"}, ["next"]);
    }
  }

};
ns.view.Header = function(){
  return {
    $header : ns.util.$("header")
  }
}

ns.view.lnbObj = {
  init : function(){
    this.registerEvent();
  },

  registerEvent : function(){
    this.$lnb.addEventListener("click", function(e){
      var target = e.target;
      if(target.tagName === "LI"){
        this.moveClickedList(target);
      }
    }.bind(this));
  },

  moveClickedList : function(target){
    var index = ns.util.getChildOrder(target);
    ns.dispatcher.emit({"type" : "moveClickedList"}, [index]);
  },

  addSelectClass : function(index){
    var allLi = this.$lnb.children;
    for(var i = 0; i < allLi.length; i = i + 1){
      allLi[i].classList.remove("select");
    }
    allLi[index].classList.add("select");
  },

  showCurrentPage : function(index){
    var currentPage = ns.util.$(".currentPage");
    currentPage.innerHTML = index + 1;
  },

  //총페이지 넘버 출력
  showTotalPage : function(length){
    var totalPage = ns.util.$(".totalPage");
    totalPage.innerHTML = length;
  },

  renderView : function(data){
    var ulHtml = document.querySelector("#ulTemplate").innerHTML,
        result = "";
    for(var i = 0; i < data.length; i = i + 1){
      if(i === 0){
        result += "<li class='select'>"+data[i]+"</li>";
        continue;
      }
      result += "<li>"+data[i]+"</li>";
    }
    ulHtml = ulHtml.replace("{newsTitleList}", result);
    this.$lnb.innerHTML = ulHtml;
  }

};
ns.view.Lnb = function(){
  return {
    $lnb : ns.util.$(".mainArea nav ul")
  }
}

ns.view.contentObj = {
  init :function(){
    this.registerEvent();
  },

  registerEvent : function(){
    this.$content.addEventListener("click", function(e){
      var target = e.target;
      if(target.classList.contains("btnDelNews")){
        ns.dispatcher.emit({"type" : "cancelSubscription"});
      }
    })
  },

  renderView : function(data){
    var newsHtml = document.querySelector("#newsTemplate").innerHTML,
        str = "";

    if(data === undefined){
      this.$content.innerHTML = "";
      return;
    }

    newsHtml = newsHtml.replace("{title}", data.title).replace("{imgurl}", data.imgurl);
    for(var i = 0; i < data.newslist.length; i = i + 1){
      str += "<li>"+data.newslist[i]+"</li>"
    }
    newsHtml = newsHtml.replace("{newsList}", str);
    this.$content.innerHTML = newsHtml;
  }
};

ns.view.Content = function(){
  return {
    $content : ns.util.$(".mainArea .content")
  }
}

ns.modelObj = {
  setListData : function(data){
    this.newsList = data;
  },

  setCurrentContentIndex : function(index){
    this.currentContentIndex = index;
  },

  getCurrentContentIndex : function(){
    return this.currentContentIndex;
  },

  getAllDataLength : function(){
    return this.newsList.length;
  },

  getAllData : function(){
    return this.newsList;
  },

  getTargetData : function(index){
    return this.newsList[index];
  },

  getAllTitleList : function(){
    var titleArr = [];
    this.newsList.forEach(function(item){
      titleArr.push(item.title);
    })
    return titleArr;
  },

/*
  getInitViewData : function(index){
    var titleArr = this.getAllTitleList();
    var targetData = this.getTargetData(index);
    ns.dispatcher.emit({"type" : "lnbContentViewRender"}, [titleArr, targetData]);
  },
*/
  removeData : function(index){
    this.newsList.splice(index, 1);
  }
};

ns.Model = function(){
  return{
    newsList : [],
    currentContentIndex : 0
  }
}

ns.controllerObj = {
  init : function(){
    ns.dispatcher.emit({"type" : "initView"});
  },

  chain : function(){
    ns.dispatcher.register({
      "lnbContentViewRender" : function(titleArr, allData){
        this.lnbView.showCurrentPage(this.model.getCurrentContentIndex());
        this.lnbView.showTotalPage(this.model.getAllDataLength());
        this.lnbView.renderView(titleArr);
        this.contentView.renderView(allData);
      }.bind(this),

      "movePrevAndNextContent" : function(direction){
        var contentIndex = this.model.getCurrentContentIndex();
        var titleDataLength = this.model.getAllTitleList().length;
        var targetData = "";

        if(titleDataLength === 0){
          return;
        }

        if(direction === "prev"){
          contentIndex--;
          if(contentIndex === -1){
            contentIndex = titleDataLength - 1;
          }
        }else{
          contentIndex++;
          if(contentIndex >= titleDataLength){
            contentIndex = 0;
          }
        }
        targetData = this.model.getTargetData(contentIndex);
        this.model.setCurrentContentIndex(contentIndex);
        this.lnbView.showCurrentPage(contentIndex);
        this.lnbView.addSelectClass(contentIndex);
        this.contentView.renderView(targetData);
      }.bind(this),

      "cancelSubscription" : function(){
        var contentIndex = this.model.getCurrentContentIndex();
        this.model.removeData(contentIndex);
        this.model.setCurrentContentIndex(0);
        //this.model.getInitViewData(0);
        ns.dispatcher.emit({"type" : "lnbContentViewRender"}, [this.model.getAllTitleList(), this.model.getTargetData(0)]);
      }.bind(this),

      "moveClickedList" : function(index){
        var targetData = this.model.getTargetData(index);
        this.model.setCurrentContentIndex(index);
        this.lnbView.showCurrentPage(this.model.getCurrentContentIndex());
        this.lnbView.addSelectClass(index);
        this.contentView.renderView(targetData);
      }.bind(this),

      "initView" : function(){
        this.headerView.init();
        this.lnbView.init();
        this.contentView.init();
        //this.model.getInitViewData(this.model.getCurrentContentIndex());
        ns.dispatcher.emit({"type" : "lnbContentViewRender"}, [this.model.getAllTitleList(), this.model.getTargetData(0)]);
      }.bind(this)
    })
  }
};

ns.Controller = function(obj){
  return {
    headerView : obj.headerView,
    lnbView : obj.lnbView,
    contentView : obj.contentView,
    model : obj.model
  }
}

ns.util = {
  $ : function(ele){
    return document.querySelector(ele);
  },

  //ajax호출하기
  runAjax : function(func, method, url){
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", func);
    oReq.open(method, url);
    oReq.send();
  },

  getChildOrder: function(elChild) {
    const elParent = elChild.parentNode;
    let nIndex = Array.prototype.indexOf.call(elParent.children, elChild);
    return nIndex;
  }
};

ns.dispatcher = {
  register: function(fnlist) {
    this.fnlist = fnlist;
  },
  emit: function(o, data) {
    this.fnlist[o.type].apply(null, data);
  }
}

document.addEventListener("DOMContentLoaded", function(){
  var model = ns.Model();
  Object.setPrototypeOf(model, ns.modelObj);

  var headerView = ns.view.Header();
  Object.setPrototypeOf(headerView, ns.view.headerObj);

  var lnbView = ns.view.Lnb();
  Object.setPrototypeOf(lnbView, ns.view.lnbObj);

  var contentView = ns.view.Content();
  Object.setPrototypeOf(contentView, ns.view.contentObj);

  var control = ns.Controller({
    headerView : headerView, lnbView : lnbView, contentView : contentView, model : model
  });
  Object.setPrototypeOf(control, ns.controllerObj);

  control.chain();
  ns.util.runAjax(function(e){
    var data = JSON.parse(e.target.responseText);
    model.setListData(data);
    control.init();
  }, "GET", "newslist.json")
});
