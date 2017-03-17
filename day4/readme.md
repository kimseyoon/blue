좋은 커밋이란
=========

2017년 3월 16일
---------
고민거리

MVC패턴을 어떻게 적용할 것인가에 대해 고민을 많이 하였다.
model은 데이터를 처리하는 부분만 다루는 것이 명확하였으나, 나머지 view와 Controller의 작동을 어떻게 분배할 것인가 명확하지 않았다.
처음에는 view는 화면을 뿌려주는 부분만 넣는 것이 당연하다고 생각하였다. 그래서 그 외 동작들은 모두 Controller에 넣어 두었다.
그랬더니 Controller의 비중이 점점 커지기 시작했다. 이런식으로 계속 한다면 MVC를 나눈 의미가 없다고 생각하였다. 세부분으로 나눈 이유는
기능들을 적절하게 분배하기 위해 나눈것이라 생각했기 때문이다.

해결방법

view의 정의를 다시 생각해본 결과 view는 화면을 뿌려주는 부분뿐 만 아니라 해당 범위에 들어가는 기능들도 함께 넣어두기로 했다.
그래서 Controller의 비중을 줄이고 view에 나머지 기능들을 넣어 두었다. 예를 들어 예전에는 Controller에 모든 뷰에 이벤트 핸들러에
관한 내용을 넣어 두었다. 그러나 이제는 이벤트 핸들러를 각 view에 맞게 나누어 관리하기로 했다. 그 결과 Controller의 비중이 줄어들고 추후
해당하는 view에 있는 기능을 수정할 경우 좀더 명확하게 수정할수 있을것 같다.

해결전
---------
<pre><code>
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
    header.data = newsModel;
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
    this.workEvent({model : model, content : content, lnb : lnb, header : header});
  },
//이벤트 동작 관련 함수
  workEvent : function(obj){

    reuseObj.ul.addEventListener("click", function(e){
      var target = e.target,
          titleData = obj.model.getTitleData(),
          index = titleData.indexOf(target.innerHTML);
      obj.content.showContent({data : obj.model.getAllData(), index : index})
    })
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

  }
}
</code></pre>

해결후
---------
컨트롤러의 workevent 함수안에 있는 기능들을 각 view에 걸맞게 분배하였다.
