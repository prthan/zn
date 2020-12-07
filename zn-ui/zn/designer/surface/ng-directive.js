(function(window)
{
  let __package = "zn.designer.ng";
  let __name = "surface";

  let directive = {}

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
      width: parseInt(scope.width),
      height: parseInt(scope.height),
      lanes: scope.lanes,
      lanesPosition: scope.lanespos
    }

    let surface=new zn.designer.Surface(options);

    surface.on("rel-create", (evt)=>scope.onrelcreate({$event: evt}));
    surface.on("rel-select", (evt)=>scope.onrelselect({$event: evt}));
    surface.on("obj-create", (evt)=>scope.onobjcreate({$event: evt}));
    surface.on("obj-select", (evt)=>scope.onobjselect({$event: evt}));
    surface.on("selection-set-change", (evt)=>scope.onselectionchange({$event: evt}));
    surface.on("position", (evt)=>scope.onposition({$event: evt}));
    surface.on("draw-object", (evt)=>scope.ondrawobj({$event: evt}));
    surface.on("delete", (evt)=>scope.ondelete({$event: evt}));
    surface.on("stage-select", (evt)=>scope.onstageselect({$event: evt}));
    surface.on("obj-rect-update", (evt)=>scope.onobjrectupdate({$event: evt}));

    surface.init();
  }

  directive.tag="znSurface";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name         : "@",
        width        : "@",
        height       : "@",
        lanes        : "@",
        lanespos     : "@",
        onrelcreate  : "&",
        onrelselect  : "&",
        onobjcreate  : "&",
        onobjselect  : "&",
        onselectionchange  : "&",
        onposition   : "&",
        ondrawobj    : "&",
        ondelete     : "&",
        onstageselect   : "&",
        onobjrectupdate : "&",
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = directive;  
  
})(window);

