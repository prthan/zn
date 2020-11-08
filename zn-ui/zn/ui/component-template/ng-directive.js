(function(window)
{
  var directive =
  {
    name: "emptycomp",
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
      password: scope.password === "true",
      readonly: scope.readonly === "true",
      error: scope.error,
      message: scope.message
    }

    let emptycomp=zn.ui.components.emptycomp.create(options);

    emptycomp.on("init", ()=>
    {
      emptycomp.on("change", (evt)=>
      {
        scope.value=evt.newValue;
        scope.$apply();
      })
      emptycomp.on("action", (evt)=>scope.onaction({$event: evt}));
      
      scope.$watch("value", (nv, ov)=>emptycomp.setValue(nv))
      scope.$watch("error", (nv, ov)=>emptycomp.message(nv, "error"));
      scope.$watch("message", (nv, ov)=>emptycomp.message(nv, "message"));
    })
    emptycomp.init();
  }

  directive.tag="znEmptycomp";
  
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
        password     : "@",
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

