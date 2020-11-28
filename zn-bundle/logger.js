const moment = require('moment');

let logger = {}

logger.COLORED_ERROR_TEXT="\x1b[31m[Error]\x1b[0m";
logger.COLORED_WARN_TEXT ="\x1b[33m[ Warn]\x1b[0m";
logger.COLORED_INFO_TEXT ="\x1b[36m[ Info]\x1b[0m";
logger.COLORED_DEBUG_TEXT="\x1b[32m[Debug]\x1b[0m";
logger.COLORED_TRACE_TEXT="\x1b[32m[Trace]\x1b[0m";

logger.PLAIN_ERROR_TEXT="[Error]";
logger.PLAIN_WARN_TEXT ="[ Warn]";
logger.PLAIN_INFO_TEXT ="[ Info]";
logger.PLAIN_DEBUG_TEXT="[Debug]";
logger.PLAIN_TRACE_TEXT="[Trace]";

let Log=function(ctxData)
{
  this.ctxData=ctxData;
}

Log.prototype.log=function()
{
  let tsLabel = `[${moment(new Date()).format("MM/DD/YYYY hh:mm:ss.SSS")}]`;
  let args=Object.values(arguments);
  let type=args.shift();
  let levelLabel=logger[`COLORED_${type}_TEXT`];
  let ctxLabel=this.ctxData ? `\x1b[35m[${this.ctxData}]\x1b[0m`:null;
  let logLine=[tsLabel, levelLabel];
  if(ctxLabel) logLine.push(ctxLabel);
  args=logLine.concat(args);
  console.log.apply(console, args);
}

Log.prototype.error=function()
{
  this.log.apply(this, ["ERROR"].concat(Object.values(arguments)));
}

Log.prototype.warn=function()
{
  this.log.apply(this, ["WARN"].concat(Object.values(arguments)));
}

Log.prototype.info=function()
{
  this.log.apply(this, ["INFO"].concat(Object.values(arguments)));
}

Log.prototype.debug=function()
{
  this.log.apply(this, ["DEBUG"].concat(Object.values(arguments)));
}

Log.prototype.trace=function()
{
  this.log.apply(this, ["TRACE"].concat(Object.values(arguments)));
}

logger.createLogger=(ctxData)=>{return new Log(ctxData)};

logger.LOG=new Log();

logger.error = function()
{
  logger.LOG.error.apply(logger.LOG, Object.values(arguments));
};

logger.warn = function()
{
  logger.LOG.warn.apply(logger.LOG, Object.values(arguments));
};
  
logger.info = function()
{
  logger.LOG.info.apply(logger.LOG, Object.values(arguments));
};
  
logger.debug = function()
{
  logger.LOG.debug.apply(logger.LOG, Object.values(arguments));
};

logger.trace = function()
{
  logger.LOG.trace.apply(logger.LOG, Object.values(arguments));
};



module.exports=logger;
