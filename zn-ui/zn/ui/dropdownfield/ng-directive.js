(function(window)
{
  var directive =
  {
    name: "dropdownfield",
    package: "zn.ui.ng"
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
        items: scope.items
      }

      let dropdownfield=zn.ui.dropdownfield.create(options);

      dropdownfield.on("change", (evt)=>
      {
        scope.value=evt.newValue;
        scope.$apply();
      })
  
      dropdownfield.init();

      //dropdownfield.setItems(nv);

      scope.$watch("value", (nv, ov)=>
      {
        dropdownfield.setValue(nv);
      })
  
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
        items        : "="
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  directive.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[directive.name]=directive;
})(window);

