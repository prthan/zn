import { Component, OnInit } from '@angular/core';
import { znDialogComponent } from 'src/lib/components/dialog/component';

declare global
{
  var zn :zn;
}

@Component({
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
  styleUrls: ['./view-form.component.css']
})
export class ViewFormComponent implements OnInit {

  form :any=
  {
    associateName: "",
    userid: "",
    password: "",
    descr: "",
    agreement: "",
    startDateCal: new Date(),
    endDateCal: new Date(),
    network: "",
    networkopts: "LAN",
    activeDate: null,
  }
  
  validationErrors :any=
  {
    associateName: "",
    userid: "",
    password: "",
    descr: "",
    agreement: "",
    network: "",
    networkopts: "",
    activeDate: "",
  }

  typesOfNetwork :Array<znDropdownItem>=
  [
    {value: "PAN", label: "Personal Area Network"},
    {value: "LAN", label: "Local Area Network"},
    {value: "WLAN", label: "Wireless Local Area Network"},
    {value: "CAN", label: "Campus Area Network"},
    {value: "MAN", label: "Metropolitan Area Network"},
    {value: "WAN", label: "Wide Area Network"}
  ];

  dialogActions :Array<any>=
  [
    {action: "ok", label: "OK", autohide: false}, 
    {action: "cancel", label: "Cancel"}, 
    {action: "clear", label: "Clear", slot: "left"}
  ]  

  constructor() { }

  ngOnInit(): void 
  {
  }

  onUpdateFormData($evt: znButtonEvent)
  {
    console.log(this.form);
    this.form.associateName="Abraham";
    this.form.userid="abe";
    this.form.password="this is a random password";
    this.form.descr="The first president of the country";
    this.form.agreement="Y";
    this.form.startDateCal=new Date();
    this.form.endDateCal=new Date();
    this.form.network="WLAN";
    this.form.networkopts="MAN";
    this.form.activeDate=new Date();
    //this.validationErrors.associateName="This is an invalid name";
    //this.validationErrors.descr="This is an invalid descr";
    //this.validationErrors.agreement="Please check 0";
    this.validationErrors.network="Please check 1";
    //this.validationErrors.networkopts="Please check 2 ";
    this.validationErrors.activeDate="Please check 3";
  }

  onStartDateSelect($evt: znCalendarEvent)
  {
    console.log("selected start date:", $evt);
  }

  onEndDateSelect($evt: znCalendarEvent)
  {
    console.log("selected end date:", $evt);
  }

  onShowPopupCal($evt: znButtonEvent)
  {
    let popup=zn.ui.components.Popup.get("popup-cal");
    console.log(popup);
    popup.show();
  }

  onShowDialogCal($evt: znButtonEvent)
  {
    let dialog=zn.ui.components.Dialog.get("dialog-cal");
    dialog.show();
  }

  onDialogAction($evt: znDialogEvent)
  {
    console.log($evt);
    $evt.source.hide();
  }
}
