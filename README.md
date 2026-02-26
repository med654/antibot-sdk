# AntiBot SDK

A powerful JavaScript library for detecting and blocking bots, scrapers, and automated traffic on your website.

##🚀 Quick Start

### CDN (Recommended)
```html
<script src="https://cdn.jsdelivr.net/gh/med654/antibot-sdk@v1.0.0/dist/antibot.min.js"></script>
```

### Direct Download
- [Minified Version (Production)](https://github.com/med654/antibot-sdk/raw/v1.0.0/dist/antibot.min.js)
- [Development Version](https://github.com/med654/antibot-sdk/raw/v1.0.0/dist/antibot.js)

##🛡 Features

- **Browser Fingerprinting** - Collects comprehensive device and browser information
- **Behavior Analysis** - Tracks mouse movement, keyboard input, and user interactions
- **ALTCHA Challenge** - Proof-of-work based CAPTCHA alternative
- **Real-time Detection** - Instant bot detection with minimal latency
- **Lightweight** - Only ~15KB minified
- **No Dependencies** - Pure JavaScript, works everywhere

##📖

### Basic Implementation
```html
<script src="https://cdn.jsdelivr.net/gh/med654/antibot-sdk@v1.0.0/dist/antibot.min.js"></script>
<script>
// The SDK auto-initializes when DOM is ready
document.addEventListener('antibot:ready', function(e) {
    console.log('AntiBot SDK loaded');
    console.log('Collected data:', e.detail);
});

// Check if user is human
AntiBot.isHuman('YOUR_API_KEY').then(isHuman => {
    if (isHuman) {
        console.log('User is human');
        // Allow access
    } else {
        console.log('Bot detected');
        // Block or challenge
    }
});
</script>
```

### Advanced Usage
```javascript
// Submit data for analysis
AntiBot.submit('YOUR_API_KEY', function(error, result) {
    if (error) {
        console.error('Detection failed:', error);
        return;
    }
    
    console.log('Detection result:', result);
    console.log('Verdict:', result.verdict); // 'human', 'bot', or 'suspicious'
    
    if (result.verdict === 'human') {
        // Allow access
    } else if (result.verdict === 'suspicious') {
        // Challenge user
    } else {
        // Block access
    }
});

// Get collected data
const data = AntiBot.getData();
console.log('Fingerprint:', data.fingerprint);
console.log('Behavior:', data.behavior);
```

## 🔧 API Reference

### Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `AntiBot.init()` | Initialize the SDK (auto-called) | - | void |
| `AntiBot.getData()` | Get all collected data | - | Object |
| `AntiBot.submit(apiKey, callback)` | Submit data for analysis | `apiKey` (string), `callback` (function) | void |
| `AntiBot.isHuman(apiKey)` | Check if user is human | `apiKey` (string) | Promise<boolean> |
| `AntiBot.completeAltcha()` | Complete ALTCHA challenge | - | Promise<boolean> |

### Events

| Event | Description | Data |
|-------|-------------|------|
| `antibot:ready` | SDK loaded and ready | Collected data |
| `antibot:result` | Detection result received | Detection result |

### Data Structure

The SDK collects the following data:

```javascript
{
    fingerprint: {
        user_agent: "...",
        platform: "...",
        screen: {...},
        window: {...},
        canvas: {...},
        webgl: {...},
        // ... and more
    },
    behavior: {
        mouse: [...],      // Mouse movement data
        keyboard: [...],   // Keyboard events
        scroll: [...],     // Scroll events
        clicks: [...],     // Click events
        touch: [...],      // Touch events (mobile)
        time_on_page: 1234 // Time spent on page
    },
    altcha_payload: "...", // ALTCHA proof-of-work
    timestamp: 1234567890
}
```

## 🎯 Detection Methods

1. **Browser Fingerprinting**
   - Canvas rendering differences
   - WebGL renderer information
   - Plugin enumeration
   - Font detection
   - Audio context analysis

2. **Behavior Analysis**
   - Mouse movement patterns
   - Keyboard typing rhythm
   - Scroll behavior
   - Click patterns
   - Touch gestures

3. **Automation Detection**
   - WebDriver detection
   - Selenium indicators
   - Puppeteer detection
   - Headless browser detection

4. **ALTCHA Challenge**
   - Client-side proof-of-work
   - Difficulty-based challenges
   - Automatic challenge solving

##🛠️ Configuration

The SDK works out of the box with zero configuration. However, you can customize behavior:

```javascript
// Adjust event collection limits
AntiBot.config = {
    maxMouseEvents: 50,
    maxKeyboardEvents: 50,
    maxScrollEvents: 30,
    sampleInterval: 50 // ms
};
```

##🔒 Security

- **No cookies required** - Works without cookie consent
- **Privacy focused** - No personal data collection
- **Secure transmission** - Uses HTTPS for all communications
- **Rate limiting** - Built-in protection against abuse

##📱 Support

- Chrome 50+
- Firefox 50+
- Safari 10+
- Edge 15+
- Mobile browsers (iOS Safari, Chrome for Android)

##📄 License

MIT License - See [LICENSE](LICENSE) file for details.

##🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

##🆘 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact support@antibot.example.com

## 🔄 Version History

### v1.0.0 (Initial Release)
- Core fingerprinting capabilities
- Behavior tracking
- ALTCHA challenge system
- Real-time detection
- CDN distribution

---
Protect your website from bots and automated traffic with AntiBot SDK.