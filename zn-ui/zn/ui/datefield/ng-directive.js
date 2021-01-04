(function(window)
{
  let __package = "zn.ui.components.ng";
  let __name = "datefield";

  let directive={};
  
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

    let datefield=new zn.ui.components.DateField(options);

    datefield.on("init", ()=>
    {
      datefield.on("change", (evt)=>
      {
        scope.value=evt.newValue;
        scope.$apply();

        if(scope.onchange) scope.onchange({$event: evt});
      })
      datefield.on("action", (evt)=>scope.onaction({$event: evt}));
  
      scope.$watch("value", (nv, ov)=>datefield.setValue(nv));
      scope.$watch("error", (nv, ov)=>datefield.message(nv ? nv : "", "error"));
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
        message      : "=" ,
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

