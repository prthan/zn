declare class znAnnotator
{
  constructor(options :znAnnotatorOptions);
  name :string;
  init() :void;
  on(eventName :string, eventHandler :(event :znAnnotatorEvent)=>void) :void;
  setValue(value :string|number) :void;
  getValue() :string|number;
  getSelection() :Array<znAnnotationIndex>;
  addAnnotation(from :znAnnotationIndex, to :znAnnotationIndex, text :string) :void;
  get(name :string) :znAnnotator;
}

declare interface znAnnotatorOptions
{
  name :string;
  target :any;
  phrase? :string;
  annotations: Array<znAnnotation>
}

declare interface znAnnotation
{
  from :znAnnotationIndex,
  to :znAnnotation,
  text :string
}

declare interface znAnnotationIndex
{
  w :number;
  l :number
}

declare interface znAnnotatorEvent
{
  source :znAnnotator;
}
