(function(window)
{
  var directive =
  {
    name: "surface",
    package: "zn.designer.ng"
  }

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
      width: scope.width,
      height: scope.height
    }

    let surface=zn.designer.surface.create(options);

    surface.on("rel-create", (evt)=>scope.onrelcreate({$event: evt}));
    surface.on("rel-select", (evt)=>scope.onrelselect({$event: evt}));
    surface.on("obj-select", (evt)=>scope.onobjselect({$event: evt}));
    surface.on("selection-set-change", (evt)=>scope.onselectionchange({$event: evt}));
    surface.on("position", (evt)=>scope.onposition({$event: evt}));
    surface.on("delete", (evt)=>scope.ondelete({$event: evt}));

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
        onrelcreate  : "&",
        onrelselect  : "&",
        onobjselect  : "&",
        onselectionchange  : "&",
        onposition  : "&",
        ondelete  : "&",
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  directive.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[directive.name]=directive;
})(window);

