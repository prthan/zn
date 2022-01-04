(function(window)
{
  let __package = "zn.ui.components.ng";
  let __name = "chipsfield";

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
      label: scope.label, 
      value: scope.value, 
      placeholder: scope.placeholder, 
      icon: scope.icon, 
      readonly: scope.readonly === "true",
      error: scope.error ? scope.error : "",
      message: scope.message
    }

    let chipsfield=new zn.ui.components.TextField(options);

    chipsfield.on("init", ()=>
    {
      chipsfield.on("change", (evt)=>
      {
        scope.value=evt.newValue;
        scope.$apply();

        if(scope.onchange) scope.onchange({$event: evt});
      })
      chipsfield.on("action", (evt)=>scope.onaction({$event: evt}));
      
      scope.$watch("value", (nv, ov)=>chipsfield.setValue(nv))
      scope.$watch("error", (nv, ov)=>chipsfield.message(nv ? nv : "", "error"));
      scope.$watch("message", (nv, ov)=>chipsfield.message(nv, "message"));
    })
    chipsfield.init();
  }

  directive.tag="znTextfield";
  
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
        message      : "=",
        onchange     : "&"
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = directive;
})(window);

