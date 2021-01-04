(function (window)
{
  let __package = "zn.ui.components";
  let __name = "Draggable";

  class Draggable
  {
    constructor(options)
    {
      this.options = options;
      this.eventHandlers = {};
    }
    
    init()
    {
      let draggable = this;

      draggable.$target = $(draggable.options.target);
      draggable.$updateTarget=draggable.$target;
      if(draggable.options.updateTarget) draggable.$updateTarget=$(draggable.options.updateTarget);

      draggable.$target.addClass("zn-draggable");

      draggable.setupUI();
      draggable.setupEventHandlers();

      draggable.$target.get()[0].znc = draggable;
      draggable.fireEvent("init");
    }
    
    on(eventName, eventHandler)
    {
      let draggable = this;
      (draggable.eventHandlers[eventName] = draggable.eventHandlers[eventName] || []).push(eventHandler);
    }
    
    fireEvent(eventName, event)
    {
      let draggable = this;
      let evt = event || {};
      evt.source = draggable;
      evt.name = eventName;
      (draggable.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }
    
    setupUI()
    {
      let draggable = this;
    }

    setupEventHandlers()
    {
      let draggable = this;
      draggable.$target.on("mousedown", (evt)=>
      {
        evt.preventDefault();
        let dragState=
        {
          anchor: {x: evt.pageX, y: evt.pageY},
          source: draggable.$target,
          position: draggable.$updateTarget.position(),
          $updateTarget: draggable.$updateTarget
        };
        draggable.dragState=dragState;
        draggable.$target.addClass("on-drag");

        draggable.fireEvent("dragstart", {source: dragState.source, anchor: dragState.anchor})
        draggable.setupDragTrackingEventHandlers();
      });
    }
    
    setupDragTrackingEventHandlers()
    {
      let draggable=this;
      $('body').on("mousemove.dragtracking", function(evt)
      {
        evt.preventDefault();
        let dragState=draggable.dragState;
        if(dragState==null) return;
        
        var dx=evt.pageX-dragState.anchor.x;
        var dy=evt.pageY-dragState.anchor.y;
        dragState.by={x: dx, y: dy};
        
        draggable.fireEvent("dragmove", {source: dragState.source, from: dragState.anchor, by: dragState.by})
        if(draggable.options.tracer!="true") draggable.updateTarget();
      });
      
      $('body').on("mouseup.dragtracking", function(evt)
      {
        evt.preventDefault();
        let dragState=draggable.dragState;
        if(dragState==null) return;
        
        var dx=evt.pageX-dragState.anchor.x;
        var dy=evt.pageY-dragState.anchor.y;
        dragState.by={x: dx, y: dy};
  
        draggable.fireEvent("dragend", {source: dragState.source, from: dragState.anchor, by: dragState.by})
        draggable.$target.removeClass("on-drag");
  
        $('body').off("mousemove.dragtracking");
        $('body').off("mouseup.dragtracking");
        if(draggable.options.tracer!="true") draggable.updateTarget();
      });
    }

    updateTarget()
    {
      let draggable=this;
      let dragState=draggable.dragState;
      let x=dragState.position.left + dragState.by.x;
      let y=dragState.position.top + dragState.by.y;
  
      dragState.$updateTarget.css("left", x).css("top", y).css("bottom", "unset").css("right", "unset");
    }
    
    static get(name)
    {
      return $(`[zn-draggable='${name}']`).get()[0].znc;
    }

  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = Draggable;

})(window);

