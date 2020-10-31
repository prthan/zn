import { Component, OnInit } from '@angular/core';

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
  
  typesOfNetwork :Array<znDropdownItem>=
  [
    {value: "PAN", label: "Personal Area Network"},
    {value: "LAN", label: "Local Area Network"},
    {value: "WLAN", label: "Wireless Local Area Network"},
    {value: "CAN", label: "Campus Area Network"},
    {value: "MAN", label: "Metropolitan Area Network"},
    {value: "WAN", label: "Wide Area Network"}
  ];

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
  }

  onStartDateSelect($evt: znCalendarEvent)
  {
    console.log("selected start date:", $evt);
  }

  onEndDateSelect($evt: znCalendarEvent)
  {
    console.log("selected end date:", $evt);
  }
}
