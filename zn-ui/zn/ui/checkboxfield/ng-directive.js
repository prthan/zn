(function(window)
{
  var directive =
  {
    name: "checkboxfield",
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
      text: scope.text, 
      value: scope.value, 
      values: {on: scope.onvalue, off: scope.offvalue},
      error: scope.error,
      message: scope.message
    }

    let checkboxfield=zn.ui.components.checkboxfield.create(options);

    checkboxfield.on("init", ()=>
    {
      checkboxfield.on("change", (evt)=>
      {
        scope.value=evt.newValue;
        scope.$apply();
      })
  
      scope.$watch("value", (nv, ov)=>checkboxfield.setValue(nv));
      scope.$watch("error", (nv, ov)=>checkboxfield.message(nv, "error"));
      scope.$watch("message", (nv, ov)=>checkboxfield.message(nv, "message"));
    })

    checkboxfield.init();
  }

  directive.tag="znCheckboxfield";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name         : "@",
        text         : "@",
        value        : "=",
        onvalue      : "@",
        offvalue     : "@",
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

