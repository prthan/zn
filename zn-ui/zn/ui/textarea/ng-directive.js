(function(window)
{
  let __package = "zn.ui.components.ng";
  let __name = "textarea";
  
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
      readonly: scope.readonly === "true",
      error: scope.error ? scope.error : "",
      message: scope.message
    }

    let textarea=new zn.ui.components.TextArea(options);

    textarea.on("init", ()=>
    {
      textarea.on("change", (evt)=>
      {
        scope.value=evt.newValue;
        scope.$apply();
      })
  
      scope.$watch("value", (nv, ov)=>textarea.setValue(nv));
      scope.$watch("error", (nv, ov)=>textarea.message(nv ? nv : "", "error"));
      scope.$watch("message", (nv, ov)=>textarea.message(nv, "message"));
    })

    textarea.init();
  }

  directive.tag="znTextarea";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name         : "@",
        label        : "@",
        value        : "=",
        placeholder  : "@",
        readonly     : "@",
        error        : "=",
        message      : "="        
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = directive;
})(window);

