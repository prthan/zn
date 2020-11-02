(function(window)
{
  var directive =
  {
    name: "radiogroup",
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
      label: scope.label, 
      value: scope.value,
      items: scope.items || [],
      layout: scope.layout
    }

    let radiogroup=zn.ui.radiogroup.create(options);

    radiogroup.on("change", (evt)=>
    {
      scope.value=evt.newValue;
      scope.$apply();
    })

    scope.$watch("value", (nv, ov)=>
    {
      radiogroup.setValue(nv);
    })

    scope.$watch("items", (nv, ov)=>
    {
      radiogroup.setItems(nv);
    })

    radiogroup.init();
  }

  directive.tag="znRadiogroup";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name         : "@",
        label        : "@",
        value        : "=",
        items        : "=",
        layout       : "@"
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  directive.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[directive.name]=directive;
})(window);

