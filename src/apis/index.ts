import { wsType } from "interfaces";

const API_URL = 'http://localhost:8000/'

export const ws: wsType = {
  instance: null,
  server: 'ws://localhost:8000',
  init: (onConnection: () => void) => {
    if (ws.instance) {
      // makes it so that init function can be called l
      // liberally to assure that we are maintaining connection
      if (onConnection) { onConnection(); }
    } else {
      ws.instance = new WebSocket(ws.server)
      ws.instance.onopen = () => {
        ws.instance.onmessage = ws.incoming
        ws.instance.onclose = () => {
          ws.instance = null
        }
        if (onConnection) { onConnection() }
      }
    }
  },
  handlers: [{
    action: 'msg',
    func: (req: any) => { console.log(req.msg) }
  }],
  on: (action: string, func: any) => {
    ws.handlers.push({ action: action, func: func });
  },
  incoming: (event: any) => {
    let req = { action: null };
    // if error we don't care there is a default object
    try {
      req = JSON.parse(event.data)
    } catch (error) {
      console.log(error)
    }
    for (let h = 0; h < ws.handlers.length; h++) {
      if (req.action === ws.handlers[h].action) {
        ws.handlers[h].func(req);
        return;
      }
    }
    console.log('no handler ' + event.data);
  },
  send: (msg: string) => {
    try {
      msg = JSON.stringify(msg)
    } catch (error) {
      msg = "{\"action\":\"error\",\"error\":\"failed stringify\"}"
    }
    ws.init(() => { ws.instance.send(msg) });
  },
  msg: (action: string, json: any) => {
    json = json ? json : {};
    json.action = action;
    ws.send(json);
  }
};

export const sendGetRequest = async (endpoint: string) => {
  const fullUrl = (endpoint.indexOf(API_URL) === -1) ? API_URL + endpoint : endpoint;

  const headers = {
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const rawResponse = await fetch(fullUrl, {
      headers,
      method: 'GET',
      mode: 'cors',
    }).then((result) => {
      return result;
    });

    return await rawResponse.json();
  } catch (e) {
    throw e;
  }
};

export const sendPostRequest = async (endpoint: string, data: any) => {
  const fullUrl = (endpoint.indexOf(API_URL) === -1) ? API_URL + endpoint : endpoint;
  const headers = {
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
  try {
    const rawResponse = await fetch(fullUrl, {
      body: JSON.stringify(data),
      headers,
      method: 'POST',
      mode: 'cors',
    }).then((result) => {
      return result;
    });

    return await rawResponse.json();
  } catch (e) {
    throw e;
  }
};
