declare class znDraggable
{
  constructor(options :znDraggableOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znDraggableEvent)=>void) :void;
}

declare interface znDraggableOptions
{
  name :string;
  target :any;
  updateTarget :any;
}

declare interface znDraggableEvent
{
  source :znDraggable;
}
