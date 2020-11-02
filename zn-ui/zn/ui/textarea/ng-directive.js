(function(window)
{
  var directive =
  {
    name: "textarea",
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
      readonly: scope.readonly === "true"
    }

    let textarea=zn.ui.textarea.create(options);

    textarea.on("change", (evt)=>
    {
      scope.value=evt.newValue;
      scope.$apply();
    })

    scope.$watch("value", (nv, ov)=>
    {
      textarea.setValue(nv);
    })

    textarea.init();
  }

  directive.tag="znTextarea";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name         : "@",
        label        : "@",
        value        : "=",
        placeholder  : "@",
        readonly     : "@"
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  directive.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[directive.name]=directive;
})(window);

