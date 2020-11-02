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
    scope.$watch("items", (nv, ov)=>
    {
      if(!nv) return;

      let options=
      {
        target: element, 
        name: scope.name, 
        label: scope.label, 
        value: scope.value,
        items: nv,
        layout: scope.layout
      }
  
      let radiogroup=zn.ui.radiogroup.create(options);
  
      radiogroup.on("change", (evt)=>
      {
        scope.value=evt.newValue;
        scope.$apply();
      })
  
      radiogroup.init();

      scope.$watch("value", (nv, ov)=>
      {
        radiogroup.setValue(nv);
      })

    })
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

