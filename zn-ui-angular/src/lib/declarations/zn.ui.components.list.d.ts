declare class znListFactory
{
  create(options :znListOptions) :znList;
  get(name :string) :znList;
}

declare class znList
{
  constructor(options :znListOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znListEvent)=>void) :void;
  setItems(value :Array<any>) :void;
  addItems(value :Array<any>) :void;
  trackScroll(track :boolean) :void;
}

declare interface znListOptions
{
  name :string;
  target :any;
  items? :Array<any>;
  itemActions :Array<any>;
  multiSelect :boolean;
  scrollContainer :any;
  trackScroll :boolean;
}

declare interface znListEvent
{
  source :znList;
}
