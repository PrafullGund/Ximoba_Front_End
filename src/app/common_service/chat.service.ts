import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_END_POINTS } from '../constants/api-endpoints-constant';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket!: Socket;

  constructor(private http: HttpClient) {
    this.initializeSocket();
  }

  private initializeSocket() {
    this.socket = io('http://localhost:1000/api/message', {  // Use correct namespace
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });
    

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from WebSocket:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('⚠️ WebSocket Connection Error:');
    });
  }

  sendMessageSocket(data: any) {
    if (this.socket.connected) {
      this.socket.emit('send_message', data);  // Use 'send_message' instead of 'sendMessage'
      console.log('📤 Message sent via WebSocket:', data);
    } else {
      console.error('❌ WebSocket not connected, message not sent');
    }
  }
  receiveMessages(): Observable<any> {
    return new Observable(observer => {
      this.socket.on("new_message", (message) => {  // Use 'new_message' instead of 'newMessage'
        console.log("📩 WebSocket Message Received:", message);
        observer.next(message);
      });
  
      return () => {
        this.socket.off("new_message"); // Cleanup on destroy
      };
    });
  }
  

  // API Calls
  getAllchat(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.chat.getAllchat);
  }

  Addchat(): Observable<any> {
    return this.http.post<any>(API_END_POINTS.chat.Addchat, {});
  }

  getmessage(id: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.chat.getmessage(id), {});
  }

  sendmessage(data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.chat.sendmessage, data, { responseType: 'text' as 'json' });
  }
  searchStudent_byName(name: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.search.searchStudentByName(name));
  }
  searchTrainer_byName(name: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.search.searchTrainer_Institute_ByName(name));
  }
}
 
 