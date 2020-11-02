(function(window)
{
  var directive =
  {
    name: "textfield",
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
      password: scope.password === "true",
      readonly: scope.readonly === "true"
    }

    let textfield=zn.ui.textfield.create(options);

    textfield.on("change", (evt)=>
    {
      scope.value=evt.newValue;
      scope.$apply();
    })

    scope.$watch("value", (nv, ov)=>
    {
      textfield.setValue(nv);
    })

    textfield.on("action", (evt)=>
    {
      scope.onaction({$event: evt});
    });
    textfield.init();
  }

  directive.tag="znTextfield";
  
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
        password     : "@",
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

