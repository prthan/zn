(function(window)
{
  var directive =
  {
    name: "dropdownfield",
    package: "zn.ui.components.ng"
  }

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
        error: scope.error,
        message: scope.message
      }

      let dropdownfield=zn.ui.components.dropdownfield.create(options);

      dropdownfield.on("init",()=>
      {
        dropdownfield.on("change", (evt)=>
        {
          scope.value=evt.newValue;
          scope.$apply();
        })
    
        scope.$watch("value", (nv, ov)=>dropdownfield.setValue(nv));
        scope.$watch("error", (nv, ov)=>dropdownfield.message(nv, "error"));
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
        value        : "=",
        items        : "=",
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

