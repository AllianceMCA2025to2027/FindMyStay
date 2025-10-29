document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const chatbotButton = document.getElementById("chatbotButton");
  const chatContainer = document.getElementById("chatContainer");
  const closeBtn = document.getElementById("closeBtn");
  const messagesArea = document.getElementById("messagesArea");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const quickReplies = document.getElementById("quickReplies");

  if (!chatbotButton || !chatContainer || !sendBtn) {
    console.error("Chatbot elements not found in DOM!");
    return;
  }

  let messages = [];

  // Initialize
  function init() {
    addBotMessage(
      "Hello! Welcome to FindMyStay 🏡 I can help you find the perfect accommodation in Bangalore. What are you looking for today?"
    );

    chatbotButton.addEventListener("click", openChat);
    closeBtn.addEventListener("click", closeChat);
    sendBtn.addEventListener("click", sendMessage);

    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });

    // Quick reply buttons
    document.querySelectorAll(".quick-reply-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const keyword = btn.getAttribute("data-keyword");
        chatInput.value = keyword;
        sendMessage();
      });
    });
  }

  function openChat() {
    chatbotButton.classList.add("hidden");
    chatContainer.classList.add("active");
  }

  function closeChat() {
    chatContainer.classList.remove("active");
    chatbotButton.classList.remove("hidden");
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    chatInput.value = "";

    if (messages.length > 2) quickReplies.style.display = "none";

    showTypingIndicator();

    setTimeout(() => {
      hideTypingIndicator();
      const response = generateBotResponse(text);
      addBotMessage(response.text, response.suggestions);
    }, 800);
  }

  function addUserMessage(text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message user";
    messageDiv.innerHTML = `<div class="message-bubble">${text}</div>`;
    messagesArea.appendChild(messageDiv);
    messages.push({ sender: "user", text });
    scrollToBottom();
  }

  function addBotMessage(text, suggestions = null) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message bot";
    messageDiv.innerHTML = `<div class="message-bubble">${text}</div>`;

    if (suggestions) {
      const suggestionsDiv = document.createElement("div");
      suggestionsDiv.className = "suggestions";
      suggestions.forEach((s) => {
        const btn = document.createElement("button");
        btn.className = "suggestion-btn";
        btn.textContent = s;
        btn.onclick = () => {
          chatInput.value = s;
          sendMessage();
        };
        suggestionsDiv.appendChild(btn);
      });
      messageDiv.appendChild(suggestionsDiv);
    }

    messagesArea.appendChild(messageDiv);
    messages.push({ sender: "bot", text });
    scrollToBottom();
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot";
    typingDiv.id = "typingIndicator";
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messagesArea.appendChild(typingDiv);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator");
    if (typingIndicator) typingIndicator.remove();
  }

  function scrollToBottom() {
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function generateBotResponse(msg) {
    const text = msg.toLowerCase();

    if (
      text.includes("budget") ||
      text.includes("cheap") ||
      text.includes("affordable")
    ) {
      return {
        text: `Great choice! We have excellent affordable options in Bangalore:\n\n🏠 Sunrise Stay - ₹1,200/night ⭐4.3\n🏠 Silver Star Residency - ₹1,100/night ⭐4.4\n🏠 The Cozy Corner - ₹1,250/night ⭐4.5\n🏠 Maple Tree Residency - ₹1,350/night ⭐4.6`,
        suggestions: ["Tell me about Sunrise Stay", "Luxury options", "Amenities?"],
      };
    }

    if (text.includes("luxury") || text.includes("villa") || text.includes("premium")) {
      return {
        text: `Our luxury villas are exceptional! 🏰\n\nThe Grand Olive Estate - ₹5,200/night ⭐4.9\nCrystal Waters Estate - ₹5,000/night ⭐5.0\nRoyal Breeze Mansion - ₹4,650/night ⭐4.8`,
        suggestions: ["Yes, help me book", "Mid-range options", "Amenities?"],
      };
    }

    if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
      return {
        text: "Hello 👋 Welcome to FindMyStay! How can I assist you today?",
        suggestions: ["Show budget options", "Luxury stays", "Popular homes"],
      };
    }

    if (text.includes("book") || text.includes("reserve")) {
      return {
        text: `I'd be happy to help you book!\n\nPlease choose your preferred property and check-in dates.`,
        suggestions: ["Show budget options", "Luxury villas", "Top rated"],
      };
    }

    return {
      text: `I'm here to help! You can ask me about:\n\n🏠 Budget options\n⭐ Luxury stays\n📍 Locations\n💳 Booking help`,
      suggestions: ["Budget options", "Luxury villas", "Top rated stays"],
    };
  }

  init();
});
