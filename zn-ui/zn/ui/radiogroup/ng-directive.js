(function(window)
{
  var directive =
  {
    name: "radiogroup",
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
        items: nv,
        layout: scope.layout,
        error: scope.error,
        message: scope.message        
      }
  
      let radiogroup=zn.ui.components.radiogroup.create(options);
  
      radiogroup.on("init", ()=>
      {
        radiogroup.on("change", (evt)=>
        {
          scope.value=evt.newValue;
          scope.$apply();
        })

        scope.$watch("value", (nv, ov)=>radiogroup.setValue(nv));
        scope.$watch("error", (nv, ov)=>radiogroup.message(nv, "error"));
        scope.$watch("message", (nv, ov)=>radiogroup.message(nv, "message"));
    
      })
  
      radiogroup.init();

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
        layout       : "@",
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

