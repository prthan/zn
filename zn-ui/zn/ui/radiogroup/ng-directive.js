(function(window)
{
  let __package = "zn.ui.components.ng";
  let __name = "radiogroup";

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
        items: nv,
        layout: scope.layout,
        error: scope.error ? scope.error : "",
        message: scope.message        
      }
  
      let radiogroup=new zn.ui.components.RadioGroup(options);
  
      radiogroup.on("init", ()=>
      {
        radiogroup.on("change", (evt)=>
        {
          scope.value=evt.newValue;
          scope.$apply();
        })

        scope.$watch("value", (nv, ov)=>radiogroup.setValue(nv));
        scope.$watch("error", (nv, ov)=>radiogroup.message(nv ? nv : "", "error"));
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

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = directive;
})(window);

