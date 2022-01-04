(function(window)
{
  let __package = "zn.ui.components.ng";
  let __name = "colorpicker";
  
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
      error: scope.error ? scope.error : "",
      message: scope.message
    }

    let colorpicker=new zn.ui.components.ColorPicker(options);

    colorpicker.on("init",()=>
    {
      colorpicker.on("change", (evt)=>
      {
        scope.value=evt.newValue;
        scope.$apply();

        if(scope.onvaluechange) scope.onvaluechange({$event: evt});
      })
      colorpicker.on("input", (evt)=>
      {
        if(scope.oninput) scope.oninput({$event: evt});
      })
  
      scope.$watch("value", (nv, ov)=>colorpicker.setValue(nv));
      scope.$watch("error", (nv, ov)=>colorpicker.message(nv ? nv : "", "error"));
      scope.$watch("message", (nv, ov)=>colorpicker.message(nv, "message"));
    })

    colorpicker.init();
  }

  directive.tag="znColorpicker";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name         : "@",
        label        : "@",
        placeholder  : "@",
        value        : "=",
        error        : "=",
        message      : "=",
        onvaluechange: "&",
        oninput      : "&",
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = directive;
})(window);

