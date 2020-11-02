(function(window)
{
  var directive =
  {
    name: "datefield",
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
      placeholder: scope.placeholder, 
      icon: scope.icon,
      readonly: scope.readonly === "true"
    }

    let datefield=zn.ui.datefield.create(options);

    datefield.on("change", (evt)=>
    {
      scope.value=evt.newValue;
      scope.$apply();
    })

    scope.$watch("value", (nv, ov)=>
    {
      datefield.setValue(nv);
    })

    datefield.on("action", (evt)=>
    {
      scope.onaction({$event: evt});
    });

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
        onaction     : "&"
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  directive.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[directive.name]=directive;
})(window);

