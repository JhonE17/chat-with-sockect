import { Manager } from 'socket.io-client';
import { Socket } from 'socket.io-client';


let socket: Socket;
export const connectToServer = (token: string) => {
  // http://localhost:3000/socket.io/socket.io.js
  const manager = new Manager('https://wiz-shop-mjiv-dev.fl0.io/socket.io/socket.io.js', {
    extraHeaders:{
      hola: 'mundo',
      authentication: token
    }
  });

  socket?.removeAllListeners();
  socket = manager.socket('/');

  addListener();

};

const addListener = () => {
  const clientsUl = document.querySelector('#client-ul')!;
  const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
  const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
  const messagessUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
  const serverStatuslabel = document.querySelector('#server-status')!;

  socket.on('connect', () => {
    serverStatuslabel.innerHTML = 'Connected';
  });
  socket.on('disconnect', () => {
    serverStatuslabel.innerHTML = 'Disconnected';
  });

  socket.on('clients-updated', (clients: string[]) => {
    let clientsHtml = '';
    clients.forEach((clientsId) => {
      clientsHtml += `
        <li>${clientsId}</li>
        `;
    });
    clientsUl.innerHTML = clientsHtml;
  });

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (messageInput.value.trim().length <= 0) return;
    socket.emit('message-form-client', { id: 'YO!', message: messageInput.value });
    messageInput.value = '';
  });

  socket.on('message-form-server', (payload: { fullName: string; message: string }) => {
    const newMessage = `
      <li>
        <strong>${payload.fullName}</strong>
        <span>${payload.message}</span>
      </li>
    `;
    const li = document.createElement('li');
    li.innerHTML = newMessage;
    messagessUl.append(li);
  });
};
