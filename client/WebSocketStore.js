import {
  action,
  observable,
  runInAction,
} from 'mobx';
import { observer } from 'mobx-react/native';

export default class WebSocketStore {
  @observable connected = false;
  socket = null;
  timer = null;

  connect = (uri) => {
    if (this.connected) return;
    try {
      this.socket = new WebSocket(uri);
    } catch (error) {
      alert('Error creating websocket: ' + error.message);
      console.log('Error creating websocket');
      return;
    }
    this.socket.onopen = () => {
      console.log('Connected to server');
      runInAction(() => { this.connected = true; });
    };
    this.socket.onerror = (event) => {
      console.log('Websocket error');
    };
    this.socket.onclose = () => {
      console.log('Connection closed');
      runInAction(() => { this.connected = false; });
      clearTimeout(this.timer);
      this.timer = setTimeout(() => { this.connect(uri); }, 1000);
    };
  }

  disconnect() {
    this.socket.close();
    clearTimeout(this.timer);
  }

  send(message) {
    if (this.socket !== null) {
      this.socket.send(message);
    }
  }
}
