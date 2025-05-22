import React, { useEffect } from 'react';
import { CHATBASE_CONFIG } from '../../config';

const ChatWidget = () => {
  useEffect(() => {
    // Create and append the chatbase embed script
    const script = document.createElement('script');
    script.innerHTML = `
      window.chatbaseConfig = {
        chatbotId: "${CHATBASE_CONFIG.chatbotId}"
      }
    `;
    document.head.appendChild(script);

    // Load Chatbase widget
    const widgetScript = document.createElement('script');
    widgetScript.src = 'https://www.chatbase.co/embed.min.js';
    widgetScript.defer = true;
    document.head.appendChild(widgetScript);

    // Cleanup
    return () => {
      document.head.removeChild(script);
      const existingWidget = document.getElementById('chatbase-widget-script');
      if (existingWidget) {
        document.head.removeChild(existingWidget);
      }
    };
  }, []);

  return null;
};

export default ChatWidget; 