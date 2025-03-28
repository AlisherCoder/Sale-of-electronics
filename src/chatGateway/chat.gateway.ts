// import {
//   ConnectedSocket,
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway()
// export class ChatGateway {
//   @WebSocketServer()
//   public server: Server;
//   private users = new Map();

//   handleConnection(client: Socket) {
//     console.log(client.id, 'connected');
//   }

//   handleDisconnect(client: Socket) {
//     console.log(client.id, 'disconnected');
//   }

//   @SubscribeMessage('newOrder')
//   handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
//     // let user_id = data.user_id;
//     // let socket_id = client.id;
//     // this.users.set(user_id, socket_id);
//     client.broadcast.emit('new', { message: 'Ordered', data });
//   }

//   @SubscribeMessage('private')
//   handlePrivateMessage(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() data: any,
//   ) {
//     let to = data.user_id;
//     let socket_id = this.users.get(to);
//     if (to) {
//       this.server.to(socket_id).emit('new', { ...data, from: client.id });
//     }
//   }

//   @SubscribeMessage('join')
//   joinGr(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
//     client.join(data.group);
//   }

//   @SubscribeMessage('group-message')
//   handleGroupMessage(
//     @MessageBody() data: any,
//     @ConnectedSocket() client: Socket,
//   ) {
//     this.server.to(data.group).emit('new', data);
//   }
// }
