$(()=>
{
  let tags=new zn.ui.components.ChipsField({
      name: "name",
      target: ".chipsfield",
      label: "Tags"
  });
  tags.on("items-changed", evt => console.log("items-changed", evt));
  tags.on("item-added", (evt) =>
  {
    console.log("item-added", evt)
  });
  tags.on("init", evt => console.log("init", evt));
  tags.init();
  tags.setItems([{label: "Tag 1", value: "tag1"}, {label: "Tag 1", value: "tag1"}])

})

