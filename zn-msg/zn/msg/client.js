(function(window)
{
  let __package = "zn.msg";
  let __name = "Client";

  class Client extends zn.Base
  {
    constructor(options)
    {
      super(options);      
    }

    connect()
    {
      let client=this;
      client.socket=io(`${client.options.location || window.origin}`,{
        path: client.options.ctx,
        withCredentials: true,
        autoConnect: false
      });
      client.socket.on("connect", ()=>
      {
        console.info("[MSG Client]", `connected to msg server at ${client.options.location}/${client.options.ctx}`);
        console.info("[MSG Client]", `announcing to server`);
        let msg={};
        if(client.options.identity) msg.identity=client.options.identity;
        else msg.from={userid: client.options.userid};
        client.socket.emit("/zn/announce", msg);
      })
      client.socket.on("/zn/announce/ack", (socmsg)=>client.fireEvent('connected', socmsg));
      client.socket.on("/zn/message",(socmsg)=>
      {
        if(socmsg.topic) client.fireEvent(socmsg.topic, socmsg)
        client.fireEvent('message', socmsg)
      });
      client.socket.on("/zn/error", (socmsg)=>client.fireEvent('error', socmsg));
      client.socket.connect()
    }

    disconnect()
    {
      let client=this;
      client.socket.disconnect();
    }

    sendMessage(msg)
    {
      let client=this;
      console.log(msg);
      client.socket.emit("/zn/message", msg);
    }
    
    publishEvent(evt)
    {
      let client=this;
      client.socket.emit("/zn/event", evt);
    }
    
  }
  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = Client;  
  
})(window);