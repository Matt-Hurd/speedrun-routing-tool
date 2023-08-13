class LiveSplitWebSocket {
  private static instance: LiveSplitWebSocket;

  private socket: WebSocket | null = null;
  private readonly url: string = "ws://localhost:16835/livesplit";

  private pendingRequests: {
    [id: string]: {
      resolve: (value: string | PromiseLike<string>) => void;
      reject: (reason?: any) => void;
    };
  } = {};

  private constructor() {}

  public static getInstance(): LiveSplitWebSocket {
    if (!LiveSplitWebSocket.instance) {
      LiveSplitWebSocket.instance = new LiveSplitWebSocket();
    }
    return LiveSplitWebSocket.instance;
  }

  isConnected(): boolean {
    return process.env.NODE_ENV !== "production" && this.socket?.readyState === WebSocket.OPEN;
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = (event) => {
      console.log("WebSocket Connected:", event);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket Closed:", event);
      this.socket = null;
    };

    this.socket.onmessage = (event) => {
      console.log("WebSocket Message Received:", event.data);
      const response = JSON.parse(event.data);

      if (this.pendingRequests[response.name]) {
        const { resolve } = this.pendingRequests[response.name];
        resolve(response.data);
        delete this.pendingRequests[response.name];
      }
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  send(data: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(data);
    } else {
      console.error("WebSocket is not open. Unable to send data.");
    }
  }

  split() {
    this.send("split");
  }

  unsplit() {
    this.send("unsplit");
  }
  getCurrentSplitName(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.pendingRequests["getcurrentsplitname"] = { resolve, reject };

      this.send("getcurrentsplitname");

      setTimeout(() => {
        if (this.pendingRequests["getcurrentsplitname"]) {
          resolve("");
          delete this.pendingRequests["getcurrentsplitname"];
        }
      }, 100);
    });
  }

  getPreviousSplitName(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.pendingRequests["getprevioussplitname"] = { resolve, reject };

      this.send("getprevioussplitname");

      setTimeout(() => {
        if (this.pendingRequests["getprevioussplitname"]) {
          resolve("");
          delete this.pendingRequests["getprevioussplitname"];
        }
      }, 100);
    });
  }
}

const liveSplitService = LiveSplitWebSocket.getInstance();

export default liveSplitService;
