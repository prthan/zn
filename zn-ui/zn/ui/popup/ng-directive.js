(function(window)
{
  var directive =
  {
    name: "popup",
    package: "zn.ui.components.ng"
  }

  directive.html=function()
  {
    return "<div><ng-transclude></ng-transclude></div>";
  };

  directive.linkFn=function(scope, element, attrs)
  {
    let options=
    {
      target: element, 
      name: scope.name,
      source: scope.source,
      snap: scope.snap=="Y",
      showAt: scope.showat
    }

    let popup=zn.ui.components.popup.create(options);
    popup.init();
  }

  directive.tag="znPopup";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name         : "@",
        source       : "@",
        snap         : "@",
        showat       : "@"
      },
      restrict: "A",
      transclude: true,
      template: directive.html(),
      replace : true,
      link: directive.linkFn
    };
  }

  directive.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[directive.name]=directive;
})(window);

