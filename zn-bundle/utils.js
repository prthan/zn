const fs=require('fs');
const path=require('path');
const logger=require('./logger');
//const fse=require('fs-extra');

var utils = {}

utils.appendFile = (tgt, src, prefix, suffix)=>
{
  fs.appendFileSync(tgt, `${prefix||''}${fs.readFileSync(src).toString()}${suffix||''}`);
}

utils.file2Array=(files)=>
{
  var lines=fs.readFileSync(files)
              .toString()
              .split("\n")
              .map((line)=>line.charAt(rval.length-1)=="\r" ? line.substring(0, line.length-1) : line)
  return lines;
}

utils.props= (file)=>
{
  var lines=utils.file2Array(file);
  var rval={};
  lines.forEach((line)=>
  {
    var parts=line.split("=");
    rval[parts[0]]=parts[1];
  })

  return rval;
}

utils.jsonProps= (file)=> JSON.parse(fs.readFileSync(file).toString());

utils.abs = (file)=> path.resolve(process.cwd(), file);

utils.listDir = (dir, prefix)=>
{
  var absolutedir=utils.abs(dir);
  var basedir=path.basename(dir);
  var rval=[];

  var l=[absolutedir];
  while(l.length>0)
  {
    var d=l.shift();
    fs.readdirSync(d, {withFileTypes: true}).forEach((entry)=>
    {
      var absoluteEntry=d+"/"+entry.name;
      var stats=fs.statSync(absoluteEntry);
      if(stats.isDirectory()) l.push(absoluteEntry);
      else
      {
        if(prefix=="F") name = absoluteEntry;
        else if(prefix=="B") name = basedir + "/" + path.relative(absolutedir, d + "/" +entry);
        else name = path.relative(absolutedir, d + "/" +entry.name);
        rval.push(name.replace(/\\/g,"/"));
      }
    });
  }
  return rval;
}

utils.mergeFiles = (listOfFiles, mergedFile, prefix, suffix)=>
{
  var _mergedFile=utils.abs(mergedFile);

  logger.info('merge files',`  to : ${mergedFile}`);
  fs.writeFileSync(_mergedFile, "");
  listOfFiles.forEach((file,i)=>
  {
    let f=file;
    let fname=file;
    if(typeof(file)=="object")
    {
      f=file.abs;
      fname=file.entry;
    }
    else fname=path.basename(f);

    logger.info('merge files',`     + ${fname}`);
    utils.appendFile(_mergedFile, f, prefix ? prefix.replace("${file}", fname): null
                                   , suffix ? suffix.replace("${file}", fname): null);
  })
}

utils.resolve = (entries, relativeToFile)=>
{
  let dir=path.dirname(relativeToFile);
  return entries.map((e)=>{ return {abs: path.resolve(dir, e.entry || e), relTo: relativeToFile, entry: e.entry || e}});
}

utils.copyFiles = (src, tgt)=>
{
  var srcAbsolutePath=path.resolve(process.cwd(), src);
  var tgtAbsolutePath=path.resolve(process.cwd(), tgt);
  utils.log('copyFiles',`srcFile : ${srcAbsolutePath}`);
  utils.log('copyFiles',`tgtFile : ${tgtAbsolutePath}`);
  fse.copySync(src, tgt);
}

utils.deleteDir = (src)=>
{
  var srcAbsolutePath=path.resolve(process.cwd(), src);
  utils.log('deleteDir',`srcFile : ${srcAbsolutePath}`);
  fse.removeSync(src);
}

module.exports=utils;