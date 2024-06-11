// src/pages/MessagePage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

/*const MessagePage: React.FC = () => {
  //const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/api/messages");
        setMessages(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    try {
      await axios.post("/api/messages", { text: newMessage });
      setNewMessage("");
      // 刷新消息列表
      const response = await axios.get("/api/messages");
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Message Page</h1>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <p>From: {message.sender.name}</p>
            <p>To: {message.receiver.name}</p>
            <p>{message.text}</p>
            <p>Created at: {message.createdAt}</p>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MessagePage;
*/
