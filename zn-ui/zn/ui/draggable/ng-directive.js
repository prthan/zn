(function(window)
{
  let __package = "zn.ui.components.ng";
  let __name = "draggable";

  let directive={};
  
  directive.html=function()
  {
    return "<div></div>";
  };

  directive.linkFn=function(scope, element, attrs)
  {
    let $target=$(element);
    let $updateTarget=$target;
    if(scope.target!=null) $updateTarget=$(scope.target);

    $target.addClass("zn-draggable");
    $target.on("mousedown", (evt)=>
    {
      evt.preventDefault();
      let dragState=
      {
        anchor: {x: evt.pageX, y: evt.pageY},
        source: $target,
        position: $updateTarget.position(),
        $updateTarget: $updateTarget
      };
      $target.get()[0].dragState=dragState;
      $target.addClass("on-drag");

      scope.ondragstart({$event: {name: "dragstart", source: dragState.source, anchor: dragState.anchor}});
      directive.setupDragTrackingEventHandlers($target, scope);
    });
  }

  directive.setupDragTrackingEventHandlers=function($target, scope)
  {
    $('body').on("mousemove.dragtracking", function(evt)
    {
      evt.preventDefault();
      let dragState=$target.get()[0].dragState;
      if(dragState==null) return;
      
      var dx=evt.pageX-dragState.anchor.x;
      var dy=evt.pageY-dragState.anchor.y;
      dragState.by={x: dx, y: dy};
      
      scope.ondragmove({$event: {name: "dragmove", source: dragState.source, from: dragState.anchor, by: dragState.by}});
      if(scope.tracker!="true") directive.updateTarget($target);
    });
    
    $('body').on("mouseup.dragtracking", function(evt)
    {
      evt.preventDefault();
      let dragState=$target.get()[0].dragState;
      if(dragState==null) return;
      
      var dx=evt.pageX-dragState.anchor.x;
      var dy=evt.pageY-dragState.anchor.y;
      dragState.by={x: dx, y: dy};

      scope.ondragend({$event: {name: "dragend", source: dragState.source, from: dragState.anchor, by: dragState.by}});
      $target.removeClass("on-drag");

      $('body').off("mousemove.dragtracking");
      $('body').off("mouseup.dragtracking");
      if(scope.tracker!="true") directive.updateTarget($target);
    });
  }

  directive.updateTarget=function($target)
  {
    let dragState=$target.get()[0].dragState;
    let x=dragState.position.left + dragState.by.x;
    let y=dragState.position.top + dragState.by.y;

    dragState.$updateTarget.css("left", x).css("top", y);
  }

  directive.tag="znDraggable";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name        : "@",
        target      : "@",
        tracker     : "@",
        ondragstart : "&",
        ondragend   : "&",
        ondragmove  : "&"
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = directive;  

})(window);

