declare class znSurface
{
  constructor();
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znSurfaceEvent)=>void) :void;
  addShape(type :string, rect :znRect, ctx :any) :void;
  exportData() :any;
  exportToJson() :string;
  importFromJson(data :string) :void;
  importData(data :any) :void;
  setMode(mode :string) :void;
  downloadAsImage() :void;
  getImageData() :string;
  get(name :string) :znSurface;
  reset() :void;
  setSize(width :number, height :number) :void;

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