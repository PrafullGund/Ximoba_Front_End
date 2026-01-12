import { Component, EventEmitter, Input } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { Output } from '@angular/core';
import { AuthServiceService } from '../common_service/auth-service.service';
import { ChatService } from '../common_service/chat.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent {
  chatOpen = false; // Track if the chat is open
  selectedChat: any = null;
  chats: any[] = [];
  messageData: any[] = [];
  audioUrl: string | null = null;
  isSidebarOpen = true;
  newMessage: string = '';
  showReplyBox: boolean = false;
  replynewMessage: string = '';
  showEmojiPicker = false;
  messageInput: string = '';
  loginUserId: any;
  filteredChats: any[] = [];
  searchTerm: string = '';
  selectedFilter: string = 'all'; // Default filter
  isRecording: boolean = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  audioBlob: Blob | null = null;
  chatActive: boolean = false;
  currentchatDate: any;
  Role: any;
  constructor( private authService: AuthServiceService, private chatService: ChatService) { }



  @Input() icon: string = 'add'; // Default icon
  @Input() top: string = 'auto';
  @Input() right: string = 'auto';
  @Input() bottom: string = 'auto';
  @Input() left: string = 'auto';
  @Input() color: string = '#fff';
  @Input() background: string = '#007bff';

  @Output() clicked = new EventEmitter<void>();



  handleClick() {
    this.clicked.emit();
  }
  ngOnInit(): void {
    this.Role = this.authService.getUserRole();
    console.log('User Role:', this.Role);
    this.loginUserId = this.authService.getUserId();
    this.getAllChat();
    this.listenForMessages();
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  listenForMessages() {
    this.chatService.receiveMessages().subscribe((message) => {  // Expecting a message object
      console.log('📩 New message received via WebSocket:', message);
      if (this.selectedChat && message.chat === this.selectedChat._id) {
        this.messageData.push({ ...message });
        console.log("✅ Updated messageData:", this.messageData);
      }

    });
  }

  getAllChat() {
    this.chatService.getAllchat().subscribe(data => {
      console.log("Chat Data:", data);
      this.chats = data.map((chat: any) => ({
        ...chat,
        latestMessage: chat.latestMessage || { content: "No messages yet", createdAt: new Date() },
      }));
      this.filteredChats = this.chats; // Initially, show all chats
      this.applyFilter();
    });
  }
  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  selectChat(chat: any) {
    this.selectedChat = chat; // Store selected chat
    this.currentchatDate = chat.latestMessage?.createdAt
    if (window.innerWidth <= 768) {
      this.chatActive = true;
    }
  }
  //display messages In Date group
  get groupedMessages() {
    const grouped: { [key: string]: any[] } = {};
    this.messageData.forEach(msg => {
      const msgDate = new Date(msg.createdAt).toDateString(); // Convert date format
      if (!grouped[msgDate]) {
        grouped[msgDate] = [];
      }
      grouped[msgDate].push(msg);
    });
    return Object.entries(grouped).map(([date, messages]) => ({ date, messages }));
  }

// button visible in Mobile Screen
  backToChatList() {
    this.chatActive = false; // Show chat list again
  }

  //search filter
  applyFilter() {
    this.filteredChats = this.chats.filter(chat => {
      const fullName = `${chat.users[0]?.f_Name} ${chat.users[0]?.l_Name}`.toLowerCase();
      const matchesSearch = this.searchTerm ? fullName.includes(this.searchTerm.toLowerCase()) : true;

      if (this.selectedFilter === 'unread') {
        return matchesSearch && chat.latestMessage.isRead === false;
      }
      return matchesSearch;
    });
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
    this.applyFilter();
  }
  filterChats() {
    if (!this.searchTerm.trim()) {
      this.filteredChats = [...this.chats]; // Reset to original chat list
      return;
    }
    const search = this.searchTerm.toLowerCase().trim();
    this.filteredChats = this.chats.filter(chat => {
      const fullName = `${chat.users[0]?.f_Name} ${chat.users[0]?.l_Name}`.toLowerCase().trim();
      return fullName.includes(search);
    });
  }

  getmessage(id: any) {
    this.chatService.getmessage(id).subscribe(data => {
      console.log("Fetched messages:", data);
      this.messageData = Array.isArray(data) ? data : [data];
      this.groupedMessages
    });
  }

  // for emoji picker
  onFocus() {
    this.showEmojiPicker = false;
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker; // Toggle emoji picker
  }

  addEmoji(event: any) {
    this.messageInput += event.emoji.native; // Add emoji to input field
  }


  //to send messages to chat
  sendMessage() {
    if (!this.selectedChat || !this.selectedChat._id) {
      console.error("No chat selected or chat ID missing.");
      return;
    }
    if (this.messageInput.trim() === '') return; // Prevent empty messages
    const newMessage = {
      chat: this.selectedChat._id,
      sender: this.loginUserId, // Ensure using `_id`
      content: this.messageInput
    };
    this.chatService.sendMessageSocket(newMessage);
    this.messageInput = ''; // Clear input field


  }


// upload image
  selectedFile: File | null = null;
  filePreview: string | null = null;
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      // Check if the selected file is an image
      if (this.selectedFile && this.selectedFile.type.startsWith('image/')) {
        console.log("Selected File:", this.selectedFile);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreview = e.target.result;
          console.log("File Preview (after reading):", this.filePreview); // Now it has the correct value
        };
        if (this.selectedFile) {
          reader.readAsDataURL(this.selectedFile);
        }
      } else {
        this.filePreview = null; // Reset preview for non-image files
      }
    }

  }




  // mic functionality

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }
  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.isRecording = true;
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };
      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioUrl = URL.createObjectURL(this.audioBlob); // Generate preview URL
        console.log("Audio Blob:", this.audioBlob);
        console.log("Audio URL:", this.audioUrl);
      };
      this.mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access is required to record audio.");
    }
  }

  

  
  stopRecording() {
    if (this.mediaRecorder) {
      this.isRecording = false;
      this.mediaRecorder.stop();

      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' }); // Ensure correct format
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        console.log("Audio Blob:", this.audioBlob);
        console.log("Generated Audio URL:", this.audioUrl);
        // Try playing the audio manually
        const audio = new Audio(this.audioUrl);
        audio.play().catch(error => console.error("Playback failed:", error));
      };
    }
  }

  sendAudio() {
    if (!this.audioBlob) {
      alert("No audio recorded!");
      return;
    }
    const formData = new FormData();
    formData.append("audio", this.audioBlob, "audioMessage.wav");
    // this.dashboardService.sendAudioMessage(formData).subscribe(response => {
    //   console.log("Audio uploaded successfully:", response);
    //   alert("Audio sent successfully!");
    //   this.audioUrl = null; // Clear preview after sending
    //   this.audioBlob = null;
    // }, error => {
    //   console.error("Audio upload failed:", error);
    //   alert("Failed to send audio.");
    // });
  }

  //for chatlist dates
  formatChatDate(dateString: string): string {
    if (!dateString) return '';
  
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  
    if (date.toDateString() === now.toDateString()) {
      return `Today ${time}`;
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${time}`;
    }
  
     return `${date.toLocaleDateString()} ${time}`;
  }
}
