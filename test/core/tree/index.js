$(()=>
{
  let roots=
  [
    {text: "first", children: 
    [
      {text: "f1 child"}, {text: "f2 child", children: [{text: "11111"}, {text: "22222"}, {text: "33333"}]}, {text: "f3 child"}, {text: "f4 child"}
    ]},
    {text: "second", children: 
    [
      {text: "s1 child"}, {text: "s2 child"}, {text: "s3 child"}, {text: "s4 child"}
    ]},
    {text: "third", children: 
    [
      {text: "t1 child"}, {text: "t2 child"}, {text: "t3 child"}, {text: "t4 child"}
    ]},
    {text: "fourth", children: 
    [
      {text: "ff1 child"}, {text: "ff2 child"}, {text: "ff3 child"}, {text: "ff4 child"}
    ]}
  ]
  let tree=new zn.ui.components.Tree({
      name: "tree",
      target: ".tree",
      label: "Tree",
      roots: roots
  });
  tree.on("items-changed", evt => console.log("items-changed", evt));
  tree.on("item-added", (evt) =>
  {
    console.log("item-added", evt)
  });
  tree.on("init", evt => console.log("init", evt));
  tree.init();

  let $panel=$(".panel");
  $panel.on("dragover", (evt)=>
  {
    evt.preventDefault();
    evt.originalEvent.dataTransfer.dropEffect = "move";
  }).on("drop", (evt)=>
  {
    evt.preventDefault();
    let path=evt.originalEvent.dataTransfer.getData("text/plain");
    $panel.text(path);
  })
  
})

