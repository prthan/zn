$(()=>
{
  
  let $ctrl=$("[ng-controller='ctrl']");

  let module=angular.module("test-form", []);
  module.controller("ctrl", [ "$scope", function($scope){}]);
  module.directive(zn.ui.ng.textfield.tag, zn.ui.ng.textfield.factory);
  module.directive(zn.ui.ng.textarea.tag, zn.ui.ng.textarea.factory);
  module.directive(zn.ui.ng.button.tag, zn.ui.ng.button.factory);
  module.directive(zn.ui.ng.calendar.tag, zn.ui.ng.calendar.factory);
  module.directive(zn.ui.ng.checkboxfield.tag, zn.ui.ng.checkboxfield.factory);
  module.directive(zn.ui.ng.datefield.tag, zn.ui.ng.datefield.factory);
  module.directive(zn.ui.ng.dropdownfield.tag, zn.ui.ng.dropdownfield.factory);
  module.directive(zn.ui.ng.radiogroup.tag, zn.ui.ng.radiogroup.factory);

  angular.bootstrap($ctrl,["test-form"]);


  let model=
  {
    form: 
    {
      name: "Abraham",
      descr: "",
      startDate: new Date(),
      endDate: new Date(),
      agreement: "Y",
      network: "CAN",
      networkOpt: "CAN"
    },
    networkItems: 
    [
      {value: "PAN", label: "Personal Area Network"},
      {value: "LAN", label: "Local Area Network"},
      {value: "WLAN", label: "Wireless Local Area Network"},
      {value: "CAN", label: "Campus Area Network"},
      {value: "MAN", label: "Metropolitan Area Network"},
      {value: "WAN", label: "Wide Area Network"}
    ]
  }

  $scope = angular.element($ctrl).scope();
  $scope.model=model;
  $scope.dump=function(m)
  {
    console.log("current form", JSON.parse(JSON.stringify(m)));
    console.log("modifying form")
    m.form.name="Abraham Lincoln";
    m.form.descr="This is a sample description";
    m.form.agreement="Y";
    m.form.startDate=new Date();
    m.form.endDate=new Date();
    m.form.activeOn=new Date();
    m.form.network="CAN";
    m.form.networkOpt="CAN";

    $scope.$apply();
  }

  $scope.$apply();
  
})


