/**
 * AntiBot Detection Script
 * Collects browser fingerprint and behavior data for bot detection
 */

(function() {
    'use strict';

    const AntiBot = {
        data: {
            fingerprint: {},
            behavior: {
                mouse: [],
                keyboard: [],
                scroll: [],
                touch: [],
                clicks: [],
            },
            altcha: null,
            startTime: Date.now(),
        },
        altcha: {
            challenge: null,
            payload: null,
            worker: null,
        },
        config: {
            maxMouseEvents: 50,
            maxKeyboardEvents: 50,
            maxScrollEvents: 30,
            sampleInterval: 50, // ms
        },

        /**
         * Initialize data collection
         */
        init: function() {
            this.collectFingerprint();
            this.attachEventListeners();
            
            // Expose for external use
            window.AntiBot = this;
            
            // Dispatch ready event
            window.dispatchEvent(new CustomEvent('antibot:ready', { detail: this.data }));
        },

        /**
         * Collect browser fingerprint data
         */
        collectFingerprint: function() {
            const nav = navigator;
            const screen = window.screen;
            const perf = window.performance;

            this.data.fingerprint = {
                // Basic info
                user_agent: nav.userAgent,
                platform: nav.platform,
                navigator_platform: nav.platform,
                language: nav.language,
                languages: nav.languages || [nav.language],
                
                // Screen info
                screen: {
                    width: screen.width,
                    height: screen.height,
                    availWidth: screen.availWidth,
                    availHeight: screen.availHeight,
                    colorDepth: screen.colorDepth,
                    pixelDepth: screen.pixelDepth,
                },
                
                // Window info
                window: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
                
                // Hardware info
                device_memory: nav.deviceMemory || null,
                hardware_concurrency: nav.hardwareConcurrency || null,
                max_touch_points: nav.maxTouchPoints || 0,
                
                // Timezone
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                timezone_offset: new Date().getTimezoneOffset(),
                
                // Plugins
                plugins: this.getPlugins(),
                mimeTypes: this.getMimeTypes(),
                
                // Canvas fingerprint
                canvas: this.getCanvasFingerprint(),
                
                // WebGL info
                webgl: this.getWebGLInfo(),
                
                // Feature detection
                webdriver: nav.webdriver || false,
                permissions_api: typeof nav.permissions !== 'undefined',
                chrome_runtime: typeof window.chrome !== 'undefined' && !!window.chrome.runtime,
                
                // Automation indicators
                cdc_adoQpoasnfa76pfcZLmcfl_: window.cdc_adoQpoasnfa76pfcZLmcfl_ || null,
                __webdriver_script_fn: window.__webdriver_script_fn || null,
                selenium: window.selenium || null,
                __fxdriver_id: window.__fxdriver_id || null,
                
                // Performance timing
                timing: perf ? perf.timing : null,
            };

            // Generate hash
            this.data.fingerprint.hash = this.generateHash(JSON.stringify(this.data.fingerprint));
        },

        /**
         * Get browser plugins
         */
        getPlugins: function() {
            const plugins = [];
            if (navigator.plugins) {
                for (let i = 0; i < navigator.plugins.length; i++) {
                    const plugin = navigator.plugins[i];
                    plugins.push({
                        name: plugin.name,
                        description: plugin.description,
                    });
                }
            }
            return plugins;
        },

        /**
         * Get MIME types
         */
        getMimeTypes: function() {
            const types = [];
            if (navigator.mimeTypes) {
                for (let i = 0; i < navigator.mimeTypes.length; i++) {
                    types.push(navigator.mimeTypes[i].type);
                }
            }
            return types;
        },

        /**
         * Get canvas fingerprint
         */
        getCanvasFingerprint: function() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Draw complex image
                canvas.width = 200;
                canvas.height = 50;
                
                ctx.textBaseline = 'top';
                ctx.font = '14px Arial';
                ctx.fillStyle = '#f60';
                ctx.fillRect(0, 0, 200, 50);
                ctx.fillStyle = '#069';
                ctx.fillText('AntiBot Canvas v1.0 🎨', 2, 15);
                ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
                ctx.fillText('Fingerprint Test', 4, 30);
                
                // Add some complexity
                ctx.beginPath();
                ctx.arc(150, 25, 10, 0, Math.PI * 2);
                ctx.fillStyle = '#FF6B6B';
                ctx.fill();
                
                const data = canvas.toDataURL();
                return {
                    hash: this.generateHash(data),
                    data: data.substring(0, 100), // First 100 chars for reference
                };
            } catch (e) {
                return { hash: '', data: '', error: e.message };
            }
        },

        /**
         * Get WebGL info
         */
        getWebGLInfo: function() {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                
                if (!gl) {
                    return { vendor: '', renderer: '', error: 'WebGL not supported' };
                }
                
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                
                return {
                    vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : '',
                    renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '',
                    version: gl.getParameter(gl.VERSION),
                    shading_language: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                };
            } catch (e) {
                return { vendor: '', renderer: '', error: e.message };
            }
        },

        /**
         * Attach event listeners for behavior tracking
         */
        attachEventListeners: function() {
            const self = this;
            
            // Mouse movement (throttled)
            let lastMouseTime = 0;
            document.addEventListener('mousemove', function(e) {
                const now = Date.now();
                if (now - lastMouseTime < self.config.sampleInterval) return;
                lastMouseTime = now;
                
                if (self.data.behavior.mouse.length < self.config.maxMouseEvents) {
                    self.data.behavior.mouse.push({
                        x: e.clientX,
                        y: e.clientY,
                        t: now - self.data.startTime,
                    });
                }
            }, { passive: true });

            // Keyboard events
            document.addEventListener('keydown', function(e) {
                if (self.data.behavior.keyboard.length < self.config.maxKeyboardEvents) {
                    self.data.behavior.keyboard.push({
                        key: e.key,
                        code: e.code,
                        t: Date.now() - self.data.startTime,
                    });
                }
            }, { passive: true });

            // Scroll events (throttled)
            let lastScrollTime = 0;
            window.addEventListener('scroll', function() {
                const now = Date.now();
                if (now - lastScrollTime < 100) return;
                lastScrollTime = now;
                
                if (self.data.behavior.scroll.length < self.config.maxScrollEvents) {
                    self.data.behavior.scroll.push({
                        x: window.scrollX,
                        y: window.scrollY,
                        t: now - self.data.startTime,
                    });
                }
            }, { passive: true });

            // Click events
            document.addEventListener('click', function(e) {
                self.data.behavior.clicks.push({
                    x: e.clientX,
                    y: e.clientY,
                    target: e.target.tagName,
                    t: Date.now() - self.data.startTime,
                });
            }, { passive: true });

            // Touch events (mobile)
            if ('ontouchstart' in window) {
                document.addEventListener('touchstart', function(e) {
                    for (let i = 0; i < e.touches.length; i++) {
                        self.data.behavior.touch.push({
                            x: e.touches[i].clientX,
                            y: e.touches[i].clientY,
                            type: 'start',
                            t: Date.now() - self.data.startTime,
                        });
                    }
                }, { passive: true });
            }

            // Track time on page
            window.addEventListener('beforeunload', function() {
                self.data.behavior.time_on_page = Date.now() - self.data.startTime;
            });
        },

        /**
         * Generate simple hash
         */
        generateHash: function(str) {
            let hash = 0;
            if (str.length === 0) return hash.toString(16);
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(16).padStart(16, '0');
        },

        /**
         * Get collected data for API submission
         */
        getData: function() {
            this.data.behavior.time_on_page = Date.now() - this.data.startTime;
            return {
                fingerprint: this.data.fingerprint,
                behavior: this.data.behavior,
                altcha_payload: this.altcha.payload,
                timestamp: Date.now(),
            };
        },

        /**
         * Fetch ALTCHA challenge from server
         */
        fetchChallenge: async function() {
            try {
                const response = await fetch('/api/v1/challenge');
                const data = await response.json();
                if (data.success) {
                    this.altcha.challenge = data.challenge;
                    return data.challenge;
                }
                throw new Error('Failed to fetch challenge');
            } catch (error) {
                console.error('AntiBot ALTCHA challenge error:', error);
                return null;
            }
        },

        /**
         * Solve ALTCHA challenge using Web Worker
         */
        solveChallenge: async function(challenge) {
            return new Promise((resolve, reject) => {
                // Create inline worker for proof-of-work calculation
                const workerScript = `
                    self.onmessage = function(e) {
                        const { challenge, number } = e.data;
                        let solution = number;
                        const target = parseInt(challenge.difficulty, 16);
                        
                        while (solution < challenge.maxnumber) {
                            const hash = self.crypto.subtle.digest('SHA-256', 
                                new TextEncoder().encode(challenge.salt + solution)
                            ).then(buffer => {
                                const hashArray = Array.from(new Uint8Array(buffer));
                                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                                const hashValue = parseInt(hashHex.substring(0, 8), 16);
                                
                                if (hashValue < target) {
                                    self.postMessage({ success: true, solution });
                                    return;
                                }
                                solution++;
                                if (solution >= challenge.maxnumber) {
                                    self.postMessage({ success: false, error: 'Max number reached' });
                                }
                            });
                        }
                    };
                `;
                
                const blob = new Blob([workerScript], { type: 'application/javascript' });
                const worker = new Worker(URL.createObjectURL(blob));
                
                worker.onmessage = (e) => {
                    if (e.data.success) {
                        resolve(e.data.solution);
                    } else {
                        reject(new Error(e.data.error));
                    }
                    worker.terminate();
                };
                
                worker.onerror = (error) => {
                    reject(error);
                    worker.terminate();
                };
                
                // Start from random number for better distribution
                const startNumber = Math.floor(Math.random() * (challenge.maxnumber / 2));
                worker.postMessage({ challenge, number: startNumber });
            });
        },

        /**
         * Complete ALTCHA challenge and generate payload
         */
        completeAltcha: async function() {
            if (!this.altcha.challenge) {
                await this.fetchChallenge();
            }
            
            if (!this.altcha.challenge) {
                console.error('AntiBot: No ALTCHA challenge available');
                return false;
            }
            
            try {
                const solution = await this.solveChallenge(this.altcha.challenge);
                
                // Create payload
                const payload = btoa(JSON.stringify({
                    algorithm: this.altcha.challenge.algorithm,
                    challenge: this.altcha.challenge.challenge,
                    number: solution,
                    salt: this.altcha.challenge.salt,
                    signature: this.altcha.challenge.signature,
                }));
                
                this.altcha.payload = payload;
                return true;
            } catch (error) {
                console.error('AntiBot ALTCHA solve error:', error);
                return false;
            }
        },

        /**
         * Handle challenge response from server
         */
        handleChallengeResponse: async function(apiKey, callback) {
            const completed = await this.completeAltcha();
            if (completed) {
                // Retry submission with ALTCHA payload
                this.submit(apiKey, callback);
            } else {
                if (callback) callback(new Error('Failed to complete ALTCHA challenge'), null);
            }
        },

        /**
         * Submit data to detection API
         */
        submit: function(apiKey, callback) {
            const self = this;
            const data = this.getData();
            
            fetch('/api/v1/detect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                // Handle challenge response
                if (result.action === 'challenge' && !self.altcha.payload) {
                    // Server wants ALTCHA challenge, complete it and retry
                    self.handleChallengeResponse(apiKey, callback);
                    return;
                }
                
                if (callback) callback(null, result);
                window.dispatchEvent(new CustomEvent('antibot:result', { detail: result }));
            })
            .catch(error => {
                if (callback) callback(error, null);
                console.error('AntiBot detection error:', error);
            });
        },

        /**
         * Check if user is human (convenience method)
         */
        isHuman: async function(apiKey) {
            return new Promise((resolve, reject) => {
                this.submit(apiKey, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.verdict === 'human' || (result.verdict === 'suspicious' && result.action === 'allow'));
                    }
                });
            });
        },
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            AntiBot.init();
        });
    } else {
        AntiBot.init();
    }
})();
