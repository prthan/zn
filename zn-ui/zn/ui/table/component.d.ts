declare interface znTableOptions
{
  name :string;
  target :any;
  columns :Array<znTableColumn>;
  rowHeight? :number;
  headerHeight? :number;
  multiSelect? :boolean;
  fill? :string;
  containerScroll? :boolean;
  rowActions? :Array<any>;
  rows? :Array<any>,
  paging? :boolean,
  pageSize? :number
}

declare class znTable
{
  constructor(options :znTableOptions);
  name :string;
  init() :void;
  getSelectedRows() :znTableSelection;
  on(eventName :string, eventHandler :(event :znTableEvent)=>void) :void;
  //getLovs(ctx :znTableCallbackContext, $$ :(lovs :znTableColumnLovs)=>void) :void;
  //getData(ctx :znTableCallbackContext, $$ :(rows :Array<any>)=>void) :void;
}

declare class znTableFactory
{
  create(options :znTableOptions) :znTable;
  get(name :string) :znTable;
}

declare interface znTableColumn
{
  field :string;
  label :string;
  type :string;
  format? :string;
  width? :number;
  fixed? :boolean;
  sortable? :boolean;
  sorted? :boolean;
  sortOrder? :boolean;
  filterable? :boolean;
  filtered? :boolean;
  selectedValues :Array<any>;
}

declare interface znTableDataOptions
{
  filters :Array<znTableDataFilter>;
  sort :znTableDataSort;
  page :number;
  pageSize :number;
}

declare interface znTableDataFilter
{
  index :number;
  field :string;
  selectedValues :Array<any>;
  includesBlank :boolean;
}

declare interface znTableDataSort
{
  index :number;
  field :string;
  order :string;
}

declare interface znTableEvent
{
  source :znTable;
  index? :number;
  row? :any;
  selection? :any;
}

declare interface znTableSelection
{
  data :Array<any>;
  indexes :Array<any>;
}

/*declare interface znTableCallbackContext
{
  index? :number;
  column? :znTableColumn;
  filters? :Array<znTableDataFilter>;
  transforms? :Array<znTableDataTransform>;
}

declare interface znTableDataTransform
{
  filters :Array<znTableDataFilter>;
  sort :znTableDataSort;
}

declare interface znTableColumnLovs
{
  list :Array<any>;
  hasBlanks :boolean;
}*/