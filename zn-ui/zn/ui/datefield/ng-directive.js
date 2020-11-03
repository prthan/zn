(function(window)
{
  var directive =
  {
    name: "datefield",
    package: "zn.ui.components.ng"
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
      label: scope.label, 
      value: scope.value, 
      placeholder: scope.placeholder, 
      icon: scope.icon,
      readonly: scope.readonly === "true",
      error: scope.error,
      message: scope.message      
    }

    let datefield=zn.ui.components.datefield.create(options);

    datefield.on("init", ()=>
    {
      datefield.on("change", (evt)=>
      {
        scope.value=evt.newValue;
        scope.$apply();
      })
      datefield.on("action", (evt)=>scope.onaction({$event: evt}));
  
      scope.$watch("value", (nv, ov)=>datefield.setValue(nv));
      scope.$watch("error", (nv, ov)=>datefield.message(nv, "error"));
      scope.$watch("message", (nv, ov)=>datefield.message(nv, "message"));      
    })

    datefield.init();
  }

  directive.tag="znDatefield";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name         : "@",
        label        : "@",
        value        : "=",
        placeholder  : "@",
        icon         : "@",
        readonly     : "@",
        onaction     : "&",
        error        : "=",
        message      : "="        
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  directive.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[directive.name]=directive;
})(window);

