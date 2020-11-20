declare class znSurfaceFactory
{
  create(options :znSurfaceOptions) :znSurface;
  get(name :string) :znSurface;
}

declare class znSurface
{
  constructor();
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znSurfaceEvent)=>void) :void;
  addShape(type :string, rect :znRect, ctx :any) :void;
  exportToJson() :string;
  importFromJson(data :string) :void;
  setMode(mode :string) :void;
  downloadAsImage() :void;
}

declare interface znSurfaceOptions
{
  name :string;
  target :any,
  width?: number;
  height?: number;
}

declare interface znSurfaceEvent
{
  source :znSurface;
  x? :number;
  y? :number;
  obj? :any;
  rel? :any;
  selection? :Array<any>;
  objs? :Array<any>;
  rels? :Array<any>;
}

declare interface znRect
{
  x :number;
  y :number;
  width: number;
  height: number;
}