(function(window)
{
  let __package = "zn.ui.components.ng";
  let __name = "dropdownfield";
  
  let directive={};

  directive.html=function()
  {
    return "<div></div>";
  };

  directive.linkFn=function(scope, element, attrs)
  {
    scope.$watch("items", (nv, ov)=>
    {
      if(!nv) return;

      let options=
      {
        target: element, 
        name: scope.name, 
        label: scope.label, 
        value: scope.value,
        items: scope.items,
        placeholder: scope.placeholder,
        error: scope.error ? scope.error : "",
        message: scope.message
      }

      let dropdownfield=new zn.ui.components.DropdownField(options);

      dropdownfield.on("init",()=>
      {
        dropdownfield.on("change", (evt)=>
        {
          scope.value=evt.newValue;
          scope.$apply();

          if(scope.onchange) scope.onchange({$event: evt});
        })
    
        scope.$watch("value", (nv, ov)=>dropdownfield.setValue(nv));
        scope.$watch("error", (nv, ov)=>dropdownfield.message(nv ? nv : "", "error"));
        scope.$watch("message", (nv, ov)=>dropdownfield.message(nv, "message"));
      })

      dropdownfield.init();
    })

  }

  directive.tag="znDropdownfield";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name         : "@",
        label        : "@",
        placeholder  : "@",
        value        : "=",
        items        : "=",
        error        : "=",
        message      : "=",
        onchange     : "&",
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = directive;
})(window);

