(function(window)
{
  var directive =
  {
    name: "table",
    package: "zn.ui.ng"
  }

  directive.html=function()
  {
    return "<div></div>";
  };

  directive.linkFn=function(scope, element, attrs)
  {
    console.log(scope);
    scope.$watch("columns",function(nv,ov)
    {
      if(!nv) return;
      let options=
      {
        target: element, 
        name: scope.name, 
        columns: nv, 
        rows: scope.rows,
        multiSelect: (scope.multiselect==="true")
      };
      if(scope.headerheight) options.headerHeight=scope.headerheight;
      if(scope.rowheight) options.rowHeight=scope.rowheight;
      if(scope.rowactions) options.rowActions=scope.rowactions;
      if(scope.actions) options.actions=scope.actions;

      let table=zn.ui.table.create(options);

      table.on("row-select", (evt)=>{scope.onrowselect({$event: evt})});
      table.on("row-action", (evt)=>{scope.onrowaction({$event: evt})});
      table.on("row-selection-change", (evt)=>{scope.onrowselectionchange({$event: evt})});
      table.on("action", (evt)=>{scope.onaction({$event: evt})});
      
      table.on("init", ()=>
      {
        scope.$watch("rows",function(nv,ov)
        {
          if(nv) table.setRows(nv);
        });
    
        scope.$watch("rowactions",function(nv,ov)
        {
          if(nv) table.setRowActions(nv);
        });
      })

      table.init();
  
    });

  }

  directive.tag="znTable";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        name         : "@",
        headerheight : "@",
        rowheight    : "@",
        fill         : "@",
        columns      : "=",
        rows         : "=",
        rowactions   : "=",
        actions      : "=",
        multiselect  : "@",
        onrowselect  : "&",
        onrowaction  : "&",
        onrowselectionchange : "&",
        onaction     : "&"
      },
      restrict: "A",
      template: directive.html(),
      replace : true,
      link: directive.linkFn
    };
  }

  directive.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[directive.name]=directive;
})(window);




