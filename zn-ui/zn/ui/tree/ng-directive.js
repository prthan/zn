(function(window)
{
  let __package = "zn.ui.components.ng";
  let __name = "tree";

  let directive={};

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
      readonly: scope.readonly === "true",
      error: scope.error ? scope.error : "",
      message: scope.message
    }

    let tree=new zn.ui.components.TextField(options);

    tree.on("init", ()=>
    {
      tree.on("change", (evt)=>
      {
        scope.value=evt.newValue;
        scope.$apply();

        if(scope.onchange) scope.onchange({$event: evt});
      })
      tree.on("action", (evt)=>scope.onaction({$event: evt}));
      
      scope.$watch("value", (nv, ov)=>tree.setValue(nv))
      scope.$watch("error", (nv, ov)=>tree.message(nv ? nv : "", "error"));
      scope.$watch("message", (nv, ov)=>tree.message(nv, "message"));
    })
    tree.init();
  }

  directive.tag="znTree";
  
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
        onaction     : "&",
        error        : "=",
        message      : "=",
        onchange     : "&"
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = directive;
})(window);

