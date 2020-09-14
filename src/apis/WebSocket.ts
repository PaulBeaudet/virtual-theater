// WebSockets.ts Copyright 2020 Paul Beaudet
// This file is part of Virtual-Theater.

// Virtual-Theater is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Virtual-Theater is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Virtual-Theater.  If not, see <https://www.gnu.org/licenses/>.

import { wsType } from "interfaces"

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

