(function(window)
{
  var directive =
  {
    name: "dialog",
    package: "zn.ui.components.ng"
  }

  directive.html=function()
  {
    return `
    <div>
      <div class="zn-dialog-wrapper">
        <div class="zn-dialog-header"></div>
        <div class="zn-dialog-content"><ng-transclude></ng-transclude></div>
        <div class="zn-dialog-footer">
          <div class="zn-actions left-actions"></div>
          <div class="zn-actions right-actions"></div>
        </div>
      </div>
    </div>`;
  };

  directive.linkFn=function(scope, element, attrs)
  {
    let options=
    {
      target: element, 
      name: scope.name,
      wrap: "N",
      title: scope.dialogtitle,
      actions: scope.actions
    }

    let dialog=zn.ui.components.dialog.create(options);
    dialog.on("init", (evt)=>
    {
      dialog.on("action", (evt)=>
      {
        scope.onaction({$event: evt});
      })

      scope.$watch("actions", (nv, ov)=>
      {
        if(!nv) return;
        dialog.setActions(nv);
      })

    })
    dialog.init();
  }

  directive.tag="znDialog";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name         : "@",
        source       : "@",
        dialogtitle  : "@",
        actions      : "=",
        onaction     : "&"
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

