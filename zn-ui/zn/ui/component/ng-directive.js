(function(window)
{
  var directive =
  {
    name: "component",
    package: "zn.ui.components.ng"
  }

  directive.html=function()
  {
    return "<div></div>";
  };

  directive.linkFn=function(scope, element, attrs)
  {
    let options= {}
    let comp=new zn.ui.components.Component(options);
    comp.on("init", ()=>
    {
    })
    comp.init();
  }

  directive.tag="znComponent";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
    
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  directive.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[directive.name]=directive;
})(window);

