(function(window)
{
  let __package = "zn.ui.components.ng";
  let __name = "editable";

  let directive={};
  
  directive.html=function()
  {
    return "<div></div>";
  };

  directive.linkFn=function(scope, element, attrs)
  {
    let $target=$(element);
    let targetElement=$target.get()[0];
    
    let ename="click.editable";
    if(scope.doubleclick=="Y") ename="dblclick.editable";
    
    $target.addClass("zn-editable");
    $target.on(ename, (evt)=>
    {
      evt.preventDefault();
      if($target.hasClass("on-edit")) return;
      $target.addClass("on-edit");
      targetElement.currentValue=$target.text();
      $target.html(directive.html.editor());
      let $editor=$target.find("input");
      $editor.val(targetElement.currentValue);
      let updater=()=>
      {
        let newValue=$editor.val();
        $target.text(newValue);
        if(newValue!=targetElement.currentValue && scope.onedit)
        {
          scope.onedit({$event: {name: "oninlineedit", source: $target, oldValue: targetElement.currentValue, newValue: newValue}});
        }
        $target.removeClass("on-edit");
        if(scope.oneditend) scope.oneditend({$event: {name: "oninlineeditstart", source: $target}});
      }
      let resetter=()=>
      {
        $target.removeClass("on-edit");
        $target.text(targetElement.currentValue);
        if(scope.oneditcancel) scope.oneditcancel({$event: {name: "oninlineeditcancel", source: $target}});
      }

      $editor.on("blur", (evt)=> updater());
      $editor.on("keydown", (evt)=>
      {
        if(evt.keyCode==13) updater();
        if(evt.keyCode==27) resetter();
      });
      $editor.focus();
      $editor.select();
      if(scope.oneditstart) scope.oneditstart({$event: {name: "oninlineeditstart", source: $target}});
    });
  }

  directive.html={};

  directive.html.editor=function()
  {
    return `<input type="text"/>`;
  }

  directive.tag="znEditable";
  
  directive.factory=function()
  {
    return {
      scope: 
      {
        onedit: "&",
        oneditstart: "&",
        oneditend: "&",
        oneditcancel: "&",
        doubleclick: "@"
      },
      restrict: "A",
      template: "",
      replace : true,
      link: directive.linkFn
    };
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = directive;  

})(window);

