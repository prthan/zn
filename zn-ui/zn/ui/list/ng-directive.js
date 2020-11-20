(function(window)
{
  let __package = "zn.ui.components.ng";
  let __name = "list";

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
      name: scope.name, 
      items: scope.items,
      itemActions: scope.itemactions,
      multiSelect: scope.multiselect == "true",
      trackScroll: scope.trackscroll == "true",
      scrollContainer: scope.scrollcontainer
    }

    let list=new zn.ui.components.List(options);

    list.on("init", ()=>
    {
      list.on("select", (evt)=>scope.onselect({$event: evt}));
      list.on("selection-change", (evt)=>scope.onselectionchange({$event: evt}));
      list.on("item-action", (evt)=>scope.onitemaction({$event: evt}));
      list.on("scroll-end", (evt)=>scope.onscrollend({$event: evt}));

      scope.$watch("items", (nv, ov) =>
      {
        if(nv) list.setItems(nv)
      });
      scope.$watch("itemactions", (nv, ov) =>
      {
        if(nv) list.setItemActions(nv)
      });

    })
    list.init();
  }

  directive.tag="znList";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name         : "@",
        items        : "=",
        itemactions  : "=",
        multiselect  : "@",
        trackscroll  : "@",
        scrollcontainer : "@",
        onselect     : "&",
        onselectionchange : "&",
        onitemaction      : "&",
        onscrollend       : "&",
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = directive;
})(window);

