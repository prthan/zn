declare interface znUiComponents
{
  table :znTableFactory,
  textfield :znTextFieldFactory,
  textarea :znTextAreaFactory,
  checkboxfield :znCheckboxFieldFactory,
  dropdownfield :znDropdownFieldFactory,
  calendar :znCalendarFactory,
  datefield: znDateFieldFactory,
  radiogroup: znRadioGroupFactory,
  button: znButtonFactory
}

declare interface znUi
{
  components :znUiComponents
}

declare interface zn
{
  ui :znUi
}

