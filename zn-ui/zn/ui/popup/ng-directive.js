(function(window)
{
  let __package = "zn.ui.components.ng";
  let __name = "popup";

  let directive={};

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

    let popup=new zn.ui.components.Popup(options);
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

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = directive;
})(window);

