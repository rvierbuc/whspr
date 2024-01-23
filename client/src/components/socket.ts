import { io } from 'socket.io-client';
const socket = io('https://whspr.live');

export default socket;