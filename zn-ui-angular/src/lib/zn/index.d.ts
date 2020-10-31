declare interface znUi
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

declare interface zn
{
  ui :znUi
}