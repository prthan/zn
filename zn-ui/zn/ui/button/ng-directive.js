(function(window)
{
  let __package = "zn.ui.components.ng";
  let __name = "button";

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
      text: scope.text, 
      icon: scope.icon,
      action: scope.action,
      type: scope.type
    }

    let button=new zn.ui.components.Button(options);

    button.on("action", (evt)=>
    {
      scope.onaction({$event: evt});
    });
    button.init();
  }

  directive.tag="znButton";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name         : "@",
        text         : "@",
        action       : "=",
        icon         : "@",
        type         : "@",
        onaction     : "&"
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = directive;  

})(window);

