(function(window)
{
  var directive =
  {
    name: "button",
    package: "zn.ui.componentsng"
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
      icon: scope.icon,
      action: scope.action,
      type: scope.type
    }

    let button=zn.ui.componentsbutton.create(options);

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

  directive.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[directive.name]=directive;
})(window);

