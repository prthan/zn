(function(window)
{
  var directive =
  {
    name: "calendar",
    package: "zn.ui.components.ng"
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
      date: scope.date || new Date()
    }

    let calendar=zn.ui.components.calendar.create(options);

    scope.$watch("date", (nv, ov)=>
    {
      calendar.setValue(nv);
    });

    calendar.on("date-select", (evt)=>
    {
      if(scope.date) scope.date=evt.date;
      scope.$apply();
    });

    calendar.on("date-select", (evt)=>
    {
      scope.ondateselect({$event: evt});
    });

    calendar.init();
  }

  directive.tag="znCalendar";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name         : "@",
        date         : "=",
        ondateselect : "&"
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  directive.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[directive.name]=directive;
})(window);

