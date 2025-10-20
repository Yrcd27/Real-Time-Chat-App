import { useEffect, useState, useRef } from 'react'
import { EmojiPicker } from './components/EmojiPicker'

interface Message {
  text: string;
  sender: string;
  timestamp: number;
  isMine: boolean;
}

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isUsernameSet, setIsUsernameSet] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate a random username if not set
  useEffect(() => {
    if (!username) {
      const randomName = `User_${Math.floor(Math.random() * 1000)}`;
      setUsername(randomName);
    }
  }, [username]);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Connect to the websocket server
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');
    
    ws.onopen = () => {
      console.log('Connected to the server');
      setConnectionStatus('connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      console.log('Received a message from the server');

      // Check if event.data is a blob and convert it to text
      if(event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const messageData = JSON.parse(reader.result as string);
            const newMessage: Message = {
              text: messageData.text,
              sender: messageData.sender,
              timestamp: messageData.timestamp,
              isMine: false
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        }; 
        reader.readAsText(event.data);
      } else if (typeof event.data === 'string') {
        try {
          const messageData = JSON.parse(event.data);
          const newMessage: Message = {
            text: messageData.text,
            sender: messageData.sender,
            timestamp: messageData.timestamp,
            isMine: false
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from the server');
      setConnectionStatus('disconnected');
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, []);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (userMessage.trim() && socket) {
      const messageData = {
        text: userMessage,
        sender: username,
        timestamp: Date.now()
      };
      
      socket.send(JSON.stringify(messageData));
      
      // Add my own message to the list
      const myMessage: Message = {
        ...messageData,
        isMine: true
      };
      
      setMessages((prevMessages) => [...prevMessages, myMessage]);
      setUserMessage("");
      setShowEmojiPicker(false);
    }
  };
  
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const addEmoji = (emoji: string) => {
    setUserMessage(prevMessage => prevMessage + emoji);
  };

  if (!isUsernameSet) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Join Chat</h2>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter your username..."
              autoFocus
            />
          </div>
          <button
            onClick={() => setIsUsernameSet(true)}
            disabled={!username.trim()}
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  if (connectionStatus !== 'connected') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              {connectionStatus === 'connecting' ? (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className="text-lg font-medium">
              {connectionStatus === 'connecting' 
                ? 'Connecting to the server...' 
                : 'Disconnected from the server. Please refresh the page.'}
            </p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-screen">
      <div className="w-full max-w-md flex flex-col h-screen max-h-[600px] bg-white shadow-lg rounded-lg">
        {/* Chat header */}
        <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Websocket Chat</h1>
            <div className="ml-3 flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
              <span className="text-xs">Online as {username}</span>
            </div>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="grow overflow-y-auto px-4 py-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${message.isMine ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg px-3 py-2 wrap-break-word ${
                    message.isMine 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {!message.isMine && (
                    <div className="text-xs font-semibold mb-1">
                      {message.sender}
                    </div>
                  )}
                  <div>{message.text}</div>
                  <div className={`text-xs mt-1 ${message.isMine ? 'text-blue-200' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat input */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="relative flex items-center">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
              className="absolute left-3 text-gray-500 hover:text-gray-700"
              aria-label="Add emoji"
            >
              😊
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2">
                <EmojiPicker 
                  onSelectEmoji={addEmoji} 
                  onClose={() => setShowEmojiPicker(false)} 
                />
              </div>
            )}
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              disabled={!userMessage.trim() || !socket}
              className="absolute right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700 transition disabled:bg-gray-400"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
