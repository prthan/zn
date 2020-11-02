(function(window)
{
  var directive =
  {
    name: "checkboxfield",
    package: "zn.ui.ng"
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
      values: {on: scope.onvalue, off: scope.offvalue}
    }

    let checkboxfield=zn.ui.checkboxfield.create(options);

    checkboxfield.on("change", (evt)=>
    {
      scope.value=evt.newValue;
      scope.$apply();
    })

    scope.$watch("value", (nv, ov)=>
    {
      checkboxfield.setValue(nv);
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
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  directive.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[directive.name]=directive;
})(window);

