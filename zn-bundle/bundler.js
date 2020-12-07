const fs=require('fs');
const path=require('path');
const utils=require('./utils');
const logger=require("./logger");
const CleanCSS=require('clean-css');
const uglifyes=require('uglify-es');
const htmlminifer=require('html-minifier');

let bundle = {};

bundle["g-lib"] = (defn, targetDir, minify)=>
{
  let rval={};

  if(defn.scripts && defn.scripts.length>0)
  {
    let targetFile=`${targetDir}/${defn.name}.js`;
    logger.info(`generating merged scripts file : ${targetFile}`);
    utils.mergeFiles(defn.scripts, targetFile, '/*[merge-start] ==> ${file}*/', '/*[merge-end] <== ${file}*/');
    if(minify=="Y") bundle["minify-js"](targetFile);
    rval.scripts=`${defn.name}.js`;
  }
  
  if(defn.styles && defn.styles.length>0)
  {
    let targetFile=`${targetDir}/${defn.name}.css`;
    logger.info(`generating merged css file : ${targetFile}`);
    utils.mergeFiles(defn.styles, targetFile, "\n/*[merge-start] ==> ${file}*/\n", "\n/*[merge-end] <== ${file}*/\n");
    if(minify=="Y") bundle["minify-css"](targetFile);
    rval.styles=`${defn.name}.css`;
  }

  return rval;
}

bundle["expand-defn"] = (defnFile, c)=>
{
  let defn=utils.jsonProps(defnFile);

  if(defn.imports)
  {
    utils.resolve(defn.imports, defnFile)
         .forEach((e)=>bundle["expand-defn"](e.abs, c));
  }

  c.scripts.push(...utils.resolve(defn.scripts||[], defnFile),
                 ...utils.resolve([defn.script].filter(x=>x), defnFile));
  c.styles.push(...utils.resolve(defn.styles||[], defnFile), 
                ...utils.resolve([defn.style].filter(x=>x), defnFile));
}

bundle["test"] = (defnFile)=>
{
  let c={scripts: [], styles: []};

  bundle["expand-defn"](utils.abs(defnFile), c);

  console.log(c);
}

bundle["lib"] = (defnFile, targetDir, targetName)=>
{
  if(!defnFile)
  {
    logger.error("definition file is missing");
    return;
  }

  if(!targetDir)
  {
    logger.error("target directory is missing");
    return;
  }

  let _defnFile=utils.abs(defnFile);
  let _targetDir=utils.abs(targetDir);

  let defn=utils.jsonProps(_defnFile);

  defn.scripts=utils.resolve(defn.scripts||[], _defnFile);
  defn.styles=utils.resolve(defn.styles||[], _defnFile);

  return bundle["g-lib"](defn, _targetDir, targetName);
}

bundle["minify-css"] = (file)=>
{
  var _file=utils.abs(file);
  logger.info('minify-css',`file : ${_file}`);

  var source=fs.readFileSync(_file).toString();
  var output=new CleanCSS().minify(source);
  fs.writeFileSync(_file, output.styles);
}

bundle["minify-js"] = (file)=>
{
  var _file=utils.abs(file);
  logger.info('minify-js',`file : ${_file}`);

  var source=fs.readFileSync(_file).toString();
  var output=uglifyes.minify(source, {mangle: false});
  if(!output.error) fs.writeFileSync(_file, output.code);
  else logger.error("unable to minify", output.error);
}

bundle["minify-html"] = (file)=>
{
  var _file=utils.abs(file);
  logger.info('minify-html',`file : ${_file}`);

  var source=fs.readFileSync(_file).toString();
  var output=htmlminifer.minify(source, {collapseWhitespace: true, removeComments: true});
  fs.writeFileSync(_file, output);
}

bundle["list-dir"] = (dir)=>
{
  let list=utils.listDir(dir);
  list.forEach((entry)=>
  {
    logger.info("file => ", entry);
  })
}

bundle["gen-app"] = (env, appDefnFile, targetDir)=>
{
  if(!env)
  {
    logger.error("env not specified");
    return;
  }
  if(!appDefnFile) appDefnFile="./zn-app.json";
  if(!targetDir) targetDir=process.env.DIST;

  let _appDefnFile=utils.abs(appDefnFile);
  let _appDefnDir=path.dirname(_appDefnFile);
  let _targetDir=utils.abs(targetDir);

  let appDefn=utils.jsonProps(_appDefnFile);

  let libDefn={name: "app", scripts: [], styles: []};
  bundle["expand-defn"](_appDefnFile, libDefn);

  bundle["g-lib"](libDefn, _targetDir, "Y");

  appDefn.modules.forEach((moduleName)=>
  {
    let moduleDefnFile=`${_appDefnDir}/${moduleName}/zn-module.json`;
    let moduleTargetDir=`${_targetDir}/${moduleName}`;
    if(appDefn.bundled=="Y") moduleTargetDir=`${_targetDir}`;
    
    fs.mkdirSync(moduleTargetDir, {recursive: true});
    bundle["gen-module-includes"](moduleDefnFile, moduleTargetDir, "Y", appDefn.bundled);
    bundle["gen-module-html"](moduleDefnFile, moduleTargetDir, appDefn.bundled, env);
  });

  bundle["copy-resources"](env, appDefnFile, targetDir);
}

bundle["copy-resources"]=(env, appDefnFile, targetDir)=>
{
  if(!env)
  {
    logger.error("env not specified");
    return;
  }
  if(!appDefnFile) appDefnFile="./zn-app.json";
  if(!targetDir) targetDir=process.env.DIST;

  let _appDefnFile=utils.abs(appDefnFile);
  let _appDefnDir=path.dirname(_appDefnFile);
  let _targetDir=utils.abs(targetDir);

  let appDefn=utils.jsonProps(_appDefnFile);

  if(!appDefn.resources) return;
  appDefn.resources.forEach((resDir)=>
  {
    let src=`${_appDefnDir}/${appDefn.resources[0]}`;
    let tgt=`${_targetDir}/${appDefn.resources[0]}`;
    logger.info(`copying resorces`);
    logger.info(`    from : ${src}`);
    logger.info(`      to : ${tgt}`);
    let files=utils.listDir(_appDefnDir+"/"+appDefn.resources[0]);
    files.forEach((f)=>
    {
      logger.info(`         + ${f}`);      
      let srcFile=`${src}/${f}`;
      let tgtFile=`${tgt}/${f}`;
      let tgtFileDir=path.dirname(tgtFile);
      fs.mkdirSync(tgtFileDir, {recursive: true});
      fs.copyFileSync(srcFile, tgtFile);
    })
  })
}

bundle["gen-app-includes"] = (appDefnFile, targetDir, minify)=>
{
  if(!appDefnFile) appDefnFile="./zn-app.json";
  if(!targetDir) targetDir=".";
  if(!minify) minify="N";

  let _appDefnFile=utils.abs(appDefnFile);
  let _targetDir=utils.abs(targetDir);
  
  let libDefn={name: "app", scripts: [], styles: []};
  bundle["expand-defn"](_appDefnFile, libDefn);

  bundle["g-lib"](libDefn, _targetDir, minify);
}

bundle["gen-module-includes"] = (defnFile, targetDir, minify, bundled)=>
{
  if(!defnFile) defnFile="./zn-module.json";
  if(!targetDir) targetDir=".";
  if(!minify) minify="N";
  if(!bundled) bundled="N";

  let _defnFile=utils.abs(defnFile);
  let _targetDir=utils.abs(targetDir);

  logger.info(`generating module includes from ${defnFile}`);

  let defn=utils.jsonProps(_defnFile);

  let libDefn= {name: "module", scripts: [], styles: []};

  bundle["expand-defn"](_defnFile, libDefn);

  Object.values(defn.views)
        .reduce((a, c)=>{
          a.scripts.push(...(c.scripts||[]), ...([c.script].filter(x=>x)));
          a.styles.push(...(c.styles||[]), ...([c.style].filter(x=>x)));
          return a;
        }, libDefn);

  libDefn.scripts=utils.resolve(libDefn.scripts, _defnFile);
  libDefn.styles=utils.resolve(libDefn.styles, _defnFile);

  bundle["g-lib"](libDefn, _targetDir, minify);
}

bundle["gather-templates"]=(list, relativeTo)=>
{
  return Object.values(list)
               .reduce((a, c)=>
               {
                 logger.info(`  + ${c}`);
                 let absTemplateFile=path.resolve(path.dirname(relativeTo), c);
                 a += `<template template="${c}">${fs.readFileSync(absTemplateFile)}</template>\n`;
                 return a;
               }, "");
}

bundle["gen-module-html"] = (defnFile, targetDir, bundled, env)=>
{
  if(!defnFile) defnFile="./zn-module.json";
  if(!targetDir) targetDir=".";
  if(!bundled) bundled="N";
  if(!env) env="dev";

  let _defnFile=utils.abs(defnFile);
  let _targetDir=utils.abs(targetDir);

  logger.info(`generating module index from ${defnFile}`);

  let defn=utils.jsonProps(_defnFile);
  
  let ctx=
  {
    scripts: [], styles: [],
  }
  
  if(bundled=="N")
  {
    if(defn.includes)
    {
      ctx.scripts.push(...(defn.includes.scripts || []));
      ctx.styles.push(...(defn.includes.styles || []));
    }
  
    let libDefn= {scripts:[], styles: []};
    bundle["expand-defn"](_defnFile, libDefn);
    ctx.scripts.push(...libDefn.scripts.map(x=>x.entry));
    ctx.styles.push(...libDefn.styles.map(x=>x.entry));

    Object.values(defn.views).reduce((a, c)=>
    {
      a.scripts.push(...(c.scripts||[]));
      a.scripts.push([c.script].filter(x=>x));
      a.styles.push(...(c.styles||[]));
      a.styles.push([c.style].filter(x=>x));
      return a;
    }, ctx);

  }
  else
  {
    ctx.scripts.push("app.js", "module.js");
    ctx.styles.push("app.css", "module.css");
    logger.info(`adding templates`);
    let templates=Object.values(defn.views).map((view)=>view.template);
    if(defn.template) templates.push(defn.template);
    if(defn.fragments) templates.push(...defn.fragments);
    ctx.templates=bundle["gather-templates"](templates, _defnFile);
  }

  let appDefnFile=path.dirname(_defnFile)+"/../zn-app.json";
  let appDefn=utils.jsonProps(appDefnFile);
  ctx.env=JSON.stringify({...appDefn.environments[env]});
  ctx.title=defn.title;
  ctx.images=appDefn.environments[env].images;

  let views=Object.keys(defn.views).reduce((a, c)=>
  {
    let view=defn.views[c];
    a[c]={class: view.class, template: view.template};
    return a;
  }, {});

  ctx.defn=JSON.stringify({
    routes: defn.routes, 
    views: views, 
    name: defn.name,
    class: defn.class,
    title: defn.title,
    template: defn.template,
    data: defn.data || ""
  });
  fs.writeFileSync(`${_targetDir}/index.html`, bundle.html.index(ctx));

  if(bundled!="N") bundle["minify-html"](`${_targetDir}/index.html`);
}

bundle["gen-module"] = (defnFile, targetDir, env)=>
{
  if(!defnFile) defnFile="./zn-module.json";
  if(!targetDir) targetDir=".";
  if(!env) env="dev";

  let _defnFile=utils.abs(defnFile);
  let _targetDir=utils.abs(targetDir);
  
  bundle["gen-module-includes"](_defnFile, _targetDir, "Y", "Y");
  bundle["gen-module-html"](_defnFile, _targetDir, "Y", env);
}

bundle.html={};

bundle.html.index=(ctx)=>
`<!DOCTYPE html>
<html>
  <head>
    <title>${ctx.title}</title>
    <link rel="icon" type="image/png" href="${ctx.images}/logo/icon.png" />
${bundle.html.styles(ctx.styles)}
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  </head>
  <body>
${bundle.html.scripts(ctx.scripts)}
    <script>zn.env=${ctx.env};zn.defn=${ctx.defn};</script>
${ctx.templates || ''}
    <div class="zn-module"></div>
  </body>
</html>
`

bundle.html.styles=(styles)=>
{
  return styles.reduce((a, c)=>a+=(`    <link rel="stylesheet" type="text/css" href="${c}"/>\n`), "");
}

bundle.html.scripts=(scripts)=>
{
  return scripts.reduce((a, c)=>a+=(`    <script src="${c}"></script>\n`), "");
}

bundle.run = ()=>
{
  var target=bundle[process.argv[2]];
  var params=null;
  if(process.argv.length>3) params=process.argv.slice(3);
  
  if(target!=null) target.apply(bundle, params);
  else console.log("invalid target");
}

bundle.run();