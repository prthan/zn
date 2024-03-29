(function(window)
{
  let __package = "zn.ui.components.ng";
  let __name = "textfield";

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
      password: scope.password === "true",
      readonly: scope.readonly === "true",
      error: scope.error ? scope.error : "",
      message: scope.message
    }

    let textfield=new zn.ui.components.TextField(options);

    textfield.on("init", ()=>
    {
      textfield.on("change", (evt)=>
      {
        scope.value=evt.newValue;
        scope.$apply();

        if(scope["onvaluechange"]) scope["onvaluechange"]({$event: evt});
      })
      textfield.on("action", (evt)=>scope.onaction({$event: evt}));
      
      scope.$watch("value", (nv, ov)=>textfield.setValue(nv))
      scope.$watch("error", (nv, ov)=>textfield.message(nv ? nv : "", "error"));
      scope.$watch("message", (nv, ov)=>textfield.message(nv, "message"));
    })
    textfield.init();
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
        password     : "@",
        readonly     : "@",
        onaction     : "&",
        error        : "=",
        message      : "=",
        onvaluechange  : "&"
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = directive;
})(window);

