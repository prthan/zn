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
    let options=
    {
      target: element,
      updateTarget: scope.target,
      tracker: scope.tracker
    };

    let draggable=new zn.ui.components.Draggable(options);
    draggable.on("init", ()=>
    {
      if(scope.ondragstart) draggable.on("dragstart", evt => scope.ondragstart({$event: evt}));
      if(scope.ondragmove) draggable.on("dragmove", evt => scope.ondragmove({$event: evt}));
      if(scope.ondragend) draggable.on("dragend", evt => scope.ondragend({$event: evt}));
    })
    draggable.init();
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

