/* ============================================
   FLOATING CHAT WIDGET – HuggingFace LLM
   Free Open-Source AI Assistant
   ============================================ */
(function () {

    // ── Config ──
    // API Token safely retrieved from global scope (defined in config.js)
    const apiToken = (typeof HF_API_TOKEN !== 'undefined') ? HF_API_TOKEN : null;

    // Model seçimi (ücretsiz, problemsiz ve hızlı bir model)
    const MODEL_ID = 'HuggingFaceH4/zephyr-7b-beta';

    // Sistem promptu - asistanın kişiliği
    const SYSTEM_PROMPT = `Sen TÜPRAŞ Mali İşler Dijitalleşme (MID) ekibinin yapay zeka asistanısın. Adın "Digitalization Asistan".
Görevin kullanıcılara dijitalleşme projeleri, SAP geliştirmeleri, Microsoft Copilot araçları ve genel iş süreçleri hakkında yardımcı olmak.
Yanıtlarını Türkçe ver, kısa ve öz ol. Samimi ama profesyonel bir dil kullan.
Bilmediğin konularda dürüst ol ve MID ekibine yönlendir.`;

    // ── State ──
    let isOpen = false;
    let conversationHistory = [];
    let isProcessing = false;

    // ── DOM Elements ──
    const bubble = document.getElementById('chatBubble');
    const panel = document.getElementById('chatPanel');
    const closeBtn = document.getElementById('chatClose');
    const msgContainer = document.getElementById('chatMessages');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    const inputBar = document.getElementById('chatInputBar');

    if (!bubble || !panel) return;

    // Show the custom input bar (was hidden for WebChat)
    if (inputBar) inputBar.style.display = '';

    // ── Toggle Chat ──
    bubble.addEventListener('click', () => {
        isOpen = !isOpen;
        panel.classList.toggle('open', isOpen);
        bubble.classList.toggle('active', isOpen);

        if (isOpen && conversationHistory.length === 0) {
            // Welcome message
            appendMessage('Merhaba! Ben Digitalization Asistan. Size nasıl yardımcı olabilirim?', 'bot');
        }

        if (isOpen) {
            setTimeout(() => input.focus(), 300);
        }
    });

    closeBtn.addEventListener('click', () => {
        isOpen = false;
        panel.classList.remove('open');
        bubble.classList.remove('active');
    });

    // ── Send Message ──
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    async function sendMessage() {
        const text = input.value.trim();
        if (!text || isProcessing) return;

        // Input uzunluk sınırlaması (XSS & abuse koruması)
        if (text.length > 500) {
            appendMessage('⚠️ Mesaj çok uzun. Maksimum 500 karakter gönderebilirsiniz.', 'system');
            return;
        }

        // Check API token
        if (!apiToken || apiToken === 'hf_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX') {
            appendMessage('⚠️ Lütfen js/config.js dosyasını kontrol edin ve geçerli bir HF_API_TOKEN ekleyin.', 'system');
            return;
        }

        appendMessage(text, 'user');
        input.value = '';
        isProcessing = true;
        sendBtn.disabled = true;

        // Add user message to history
        conversationHistory.push({ role: 'user', content: text });

        // Show typing indicator
        showTypingIndicator();

        try {
            const response = await callLLM();
            hideTypingIndicator();
            appendMessage(response, 'bot');

            // Add assistant response to history (keep last 10 exchanges)
            conversationHistory.push({ role: 'assistant', content: response });
            if (conversationHistory.length > 20) {
                conversationHistory = conversationHistory.slice(-20);
            }

        } catch (err) {
            hideTypingIndicator();
            console.error('LLM Error:', err);

            let errorMsg = 'Bir hata oluştu.';
            if (err.message.includes('401') || err.message.includes('403')) {
                errorMsg = '🔑 API token geçersiz. Lütfen HuggingFace token\'ınızı kontrol edin.';
            } else if (err.message.includes('429')) {
                errorMsg = '⏳ Çok fazla istek gönderildi. Birkaç saniye bekleyip tekrar deneyin.';
            } else if (err.message.includes('503') || err.message.includes('loading')) {
                errorMsg = '⏳ Model yükleniyor, lütfen 20-30 saniye bekleyip tekrar deneyin.';
            } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                if (window.location.protocol === 'file:') {
                    errorMsg = '⚠️ Güvenlik: Dosyayı direkt açtığınız için bağlantı engellendi. Lütfen VS Code "Live Server" eklentisi ile çalıştırın.';
                } else {
                    errorMsg = '🌐 Ağ hatası. İnternet bağlantınızı kontrol edin.';
                }
            } else {
                errorMsg = `❌ Hata: ${err.message}`;
            }

            appendMessage(errorMsg, 'system');
        }

        isProcessing = false;
        sendBtn.disabled = false;
        input.focus();
    }

    // ── Call HuggingFace LLM ──
    async function callLLM() {
        // Format prompt for Zephyr (Chat Template)
        // <|system|>...</s><|user|>...</s><|assistant|>...
        let prompt = `<|system|>\n${SYSTEM_PROMPT}</s>\n`;

        for (const msg of conversationHistory) {
            prompt += `<|${msg.role}|>\n${msg.content}</s>\n`;
        }
        prompt += `<|assistant|>\n`;

        const res = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 512,
                    temperature: 0.7,
                    top_p: 0.9,
                    return_full_text: false
                }
            })
        });

        if (!res.ok) {
            const errBody = await res.text().catch(() => '');
            if (res.status === 503 && errBody.includes('loading')) {
                throw new Error('Model loading - please wait');
            }
            throw new Error(`API error: ${res.status} ${errBody}`);
        }

        const data = await res.json();

        // HuggingFace Inference API returns an array: [{ generated_text: "..." }]
        if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
            return data[0].generated_text.trim();
        }
        // Some models/endpoints might return object
        else if (data.generated_text) {
            return data.generated_text.trim();
        }

        throw new Error('Yanıt alınamadı: ' + JSON.stringify(data));
    }

    // ── UI Helpers ──
    function appendMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${sender}`;

        const msgBubble = document.createElement('div');
        msgBubble.className = 'msg-bubble';

        // Simple markdown-like rendering
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');

        msgBubble.innerHTML = html;
        msg.appendChild(msgBubble);

        // Timestamp
        const time = document.createElement('div');
        time.className = 'msg-time';
        const now = new Date();
        time.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        msg.appendChild(time);

        msgContainer.appendChild(msg);
        scrollToBottom();
    }

    function showTypingIndicator() {
        hideTypingIndicator();
        const typing = document.createElement('div');
        typing.className = 'chat-msg bot typing-indicator';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
            <div class="msg-bubble">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        msgContainer.appendChild(typing);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    function scrollToBottom() {
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }

})();
