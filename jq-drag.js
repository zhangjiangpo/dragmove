(function($){
  $.fn.dragMove=function(option){
    var $this=this,
        defaultobj={
          hoverBorder:'1px solid red'//移动元素到达目标区域，该区域border颜色
        }
        ,setting=$.extend(defaultobj,option)
        ,mousedown=false,enter=false,activeContainer=null,activeItem=null
        ,startX=0,startY=0//鼠标起始位置
        ,borderStyle=$(this).eq(0).css('border')//获取容器元素边框border
        ,leftTopArr=[]//获取容器元素位置（不用重复获取offsetLeft和offsetTop值，减少dom操作）
        ,offsetLeft=0,offsetTop=0,offsetWidth=0;//li 相对父容器位置
    initLeftTop();
    $($this).on('mousedown','li',function(e){
      var e=e||window.event,target=e.target||e.srcElement;
      $(target).attr('mousedown','true');
      startX=e.pageX;
      startY=e.pageY;
      offsetLeft=target.offsetLeft;
      offsetTop=target.offsetTop;
      offsetWidth=target.offsetWidth;
      activeItem=target;
    });
    $(document).on('mousemove',function(e){
      var e=e||window.event;
      //stopDefault(e);
      if(activeItem&&$(activeItem).attr('mousedown')=='true'){
        var x=e.pageX-startX+offsetLeft,
          y=e.pageY-startY+offsetTop;
        moveTo($(activeItem),x,y,false);
        panduan(e,true);
      }
    }).on('mouseup',function(e){
      var e=e||window.event;
      panduan(e,false);
      if($(activeItem).attr('mousedown')=='true'){
        if(activeContainer){//进入容器
          activeContainer.append($(activeItem).css({position:'static',transform:'translate(0px,0px)'}));
        }else{
          moveTo($(activeItem),offsetLeft,offsetTop,true);
        }
        $(activeItem).attr('mousedown','false');
        activeContainer=null;
        activeItem=null;
      }
    });
    //判断移动的元素目标区域
    function panduan(e,showBorder){
      for(var i=0;i<leftTopArr.length;i++){
        var lt=leftTopArr[i];
        if(lt.left<e.pageX&&e.pageX<lt.left+lt.width&&lt.top<e.pageY&&e.pageY<lt.top+lt.height){
          if(showBorder){//mouseup:false   mousemove:true
            lt.item.css({border:setting.hoverBorder});
          }else{
            lt.item.css({border:borderStyle});
            activeContainer=lt.item;//记录当前容器jq对象
            break;//跳出循环
          }
        }else{
          lt.item.css({border:borderStyle});
          activeContainer=null;
        }
      }
    }
    /*
    *获取各个容器元素的位置
    * */
    function initLeftTop(){
      $($this).each(function(index,item){
        var lt=getLeftTop($(item)[0],{left:0,top:0});
        lt['width']=$(item).width();
        lt['height']=$(item).height();
        lt['item']=$(item);
        leftTopArr.push(lt);
      })
    }
    //获取元素的坐标位置
    function getLeftTop(obj,lt){
      var left=obj.offsetLeft;
      var top=obj.offsetTop;
      lt['left']+=left;
      lt['top']+=top;
      if(obj.offsetparent){
        getLeftTop(obj.offsetparent,lt);
      }else{
        return lt;
      }
    }
    //元素移动方法
    function moveTo(obj,x,y,isOriginal){
      if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/(8.|9.)/i)){
        isOriginal?obj.css({position:'static',width:'100%',zIndex:0}):obj.css({position:'absolute',left:x,top:y,width:offsetWidth,zIndex:99});
      }else{
        x=isOriginal?0:x-offsetLeft;
        y=isOriginal?0:y-offsetTop;
        var zi=isOriginal?0:99;
        obj.css({transform:'translate('+x+'px,'+y+'px)',zIndex:zi});
      }
    }
    //阻止浏览器默认行为和冒泡
    function stopDefault(event){
      var e=event||window.event;
      if ( e && e.preventDefault ) {
        e.preventDefault(); 
      }else{ 
        window.event.returnValue = false; 
      }
      if (window.event) {
         e.cancelBubble=true;     // ie下阻止冒泡
      } else {
         //e.preventDefault();
         e.stopPropagation();     // 其它浏览器下阻止冒泡
      }
      return false; 
    }
  }
})(jQuery)