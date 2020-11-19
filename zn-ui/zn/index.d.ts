declare interface znUiComponents
{
  table :znTableFactory;
  textfield :znTextFieldFactory;
  textarea :znTextAreaFactory;
  checkboxfield :znCheckboxFieldFactory;
  dropdownfield :znDropdownFieldFactory;
  calendar :znCalendarFactory;
  datefield :znDateFieldFactory;
  radiogroup :znRadioGroupFactory;
  button :znButtonFactory;
  list :znListFactory;
  popup :znPopupFactory;
  dialog :znDialogFactory;
}

declare interface znUi
{
  components :znUiComponents
}

declare interface znDesigner
{
  surface :znSurfaceFactory
}

declare interface zn
{
  ui :znUi,
  designer: znDesigner
}

