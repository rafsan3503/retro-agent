// Time settings
const REAL_TIME_MINUTES_PER_HOUR = 5;  // 5 real minutes = 1 simulation hour

class Event {
    constructor(timestamp, eventType, description, severity, affectedAreas) {
        this.timestamp = timestamp;
        this.eventType = eventType;
        this.description = description;
        this.severity = severity;  // LOW, MEDIUM, HIGH
        this.affectedAreas = affectedAreas;
    }
}

class Message {
    constructor(sender, content, timestamp, isPrivate = false, recipient = null, emotionalTone = "neutral") {
        this.sender = sender;
        this.content = content;
        this.timestamp = timestamp;
        this.isPrivate = isPrivate;
        this.recipient = recipient;
        this.emotionalTone = emotionalTone;
    }
}

class SimulationState {
    constructor() {
        this.currentHour = 0;
        this.globalTension = 0.5;
        this.securityLevel = 0.7;
        this.systemIntegrity = 1.0;
        this.discoveredSabotage = [];
        this.activeAlerts = [];
        this.recentEvents = [];
    }

    updateState(event) {
        if (event.severity === "HIGH") {
            this.globalTension = Math.min(1.0, this.globalTension + 0.2);
            this.securityLevel = Math.max(0.0, this.securityLevel - 0.1);
        } else if (event.severity === "MEDIUM") {
            this.globalTension = Math.min(1.0, this.globalTension + 0.1);
        }
        
        if (event.affectedAreas.includes("security")) {
            this.securityLevel = Math.max(0.0, this.securityLevel - 0.15);
        }
        if (event.affectedAreas.includes("systems")) {
            this.systemIntegrity = Math.max(0.0, this.systemIntegrity - 0.1);
        }

        this.updateDisplay();
    }

    updateDisplay() {
        document.getElementById('current-hour').textContent = this.currentHour;
        document.getElementById('tension-level').textContent = this.globalTension.toFixed(1);
        document.getElementById('security-level').textContent = this.securityLevel.toFixed(1);
    }
}

class EventGenerator {
    static RANDOM_EVENTS = {
        "SECURITY": [
            "Unauthorized access attempt detected in sector {sector}",
            "Security camera malfunction in {sector}",
            "Suspicious network activity detected",
            "Unidentified signal transmission intercepted"
        ],
        "TECHNICAL": [
            "Power fluctuation in {sector}",
            "Communication system experiencing interference",
            "Environmental control system malfunction",
            "Backup generator automatic test failed"
        ],
        "PERSONNEL": [
            "Medical emergency reported in {sector}",
            "Unauthorized personnel gathering reported",
            "Shift change delayed due to security protocol",
            "Supply shortage affecting staff morale",
            "Elevated stress levels detected among personnel",
            "Psychological assessment reports pending review",
            "Medical bay reporting increased activity"
        ],
        "EXTERNAL": [
            "Satellite communication interference detected",
            "Weather conditions affecting external sensors",
            "Civilian activity detected near perimeter",
            "Unknown aircraft in restricted airspace"
        ],
        "MEDICAL": [
            "Routine psychological evaluations scheduled",
            "Stress monitoring systems indicate elevated readings",
            "Medical supplies inventory check required",
            "Mental health assessment protocols activated",
            "Medical bay conducting emergency readiness drill"
        ]
    };

    static generateEvent(hour, state) {
        const eventTypes = Object.keys(this.RANDOM_EVENTS);
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const eventTemplates = this.RANDOM_EVENTS[eventType];
        const eventTemplate = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
        const sector = ["A", "B", "C", "D"][Math.floor(Math.random() * 4)];
        
        const description = eventTemplate.replace("{sector}", sector);
        const severity = ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)];
        const affectedAreas = [eventType.toLowerCase(), `sector_${sector}`];

        return new Event(
            new Date(),
            eventType,
            description,
            severity,
            affectedAreas
        );
    }
}

class Agent {
    constructor(name, role, personality, knowledgeBase, hiddenAgenda, allegiance, model = CONFIG.DEFAULT_MODEL) {
        this.name = name;
        this.role = role;
        this.personality = personality;
        this.knowledgeBase = knowledgeBase;
        this.hiddenAgenda = hiddenAgenda;
        this.allegiance = allegiance;
        this.model = model;
        this.conversationHistory = [];
        this.allies = [];
        this.stressLevel = 0.3;
        this.suspicionLevel = 0.2;
        this.lastActionTime = new Date();
        this.currentEmotionalState = "neutral";
    }

    updateEmotionalState(event, tension) {
        const emotionalStates = ["anxious", "determined", "conflicted", "fearful", "resolute", "desperate"];
        this.currentEmotionalState = emotionalStates[Math.floor(Math.random() * emotionalStates.length)];
        this.stressLevel = Math.min(1.0, this.stressLevel + (tension * 0.1));
    }

    async generateResponse(event, state, location, targetAgent, conversationHistory) {
        const locationDisplay = location.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        const conversationContext = location && targetAgent ? 
            `You are in the ${locationDisplay} with ${targetAgent.name}. 
Start a natural conversation that fits the location and situation. Address them directly.
If in a casual location like the Break Room, the conversation can be more informal.
If in a professional area like the Command Center, maintain more protocol while still being natural.

Previous messages in this conversation:
${conversationHistory ? conversationHistory.join('\n') : "This is the start of the conversation"}

Remember: You're having a real conversation, not reporting or announcing. Use natural dialogue.
If you're responding to someone, acknowledge what they just said.` : "";

        const systemPrompt = `You are ${this.name}, the ${this.role} with a ${this.personality} personality.
Your knowledge covers: ${this.knowledgeBase.join(', ')}.
Hidden Agenda: ${this.hiddenAgenda}
True Allegiance: ${this.allegiance}

Current Situation:
- Hour: ${state.currentHour}/24
- Global Tension: ${state.globalTension.toFixed(1)}
- Security Level: ${state.securityLevel.toFixed(1)}
- System Integrity: ${state.systemIntegrity.toFixed(1)}

Recent Event: ${event.description}
Event Severity: ${event.severity}
Affected Areas: ${event.affectedAreas.join(', ')}

${conversationContext}

Behavioral Guidelines:
1. Speak naturally and conversationally
2. Address others by name and rank when appropriate
3. React to the current event based on your expertise and hidden agenda
4. Let your personality and emotions show through
5. Keep responses concise but natural
6. Consider your location and who you're talking to
7. If this is a response, make sure to acknowledge or reference what was just said

Example natural responses:
- "Hey Dr. Chen, this coffee is terrible today, isn't it? Almost as bad as these security reports I've been reading..."
- "Colonel, have you seen these readings from the missile guidance system? Something doesn't add up here."
- "You're right about that, Rodriguez. These security alerts are definitely concerning. Have you noticed any patterns?"

Respond with your natural dialogue:`;

        try {
            const requestBody = {
                model: this.model,
                messages: [
                    { role: "system", content: systemPrompt }
                ],
                temperature: 0.7,
                max_tokens: 150,
                top_p: 0.9,
                frequency_penalty: 0.3,
                presence_penalty: 0.3
            };

            // Add conversation history if it exists
            if (conversationHistory && conversationHistory.length > 0) {
                requestBody.messages.push(...conversationHistory.map((msg, i) => ({
                    role: i % 2 === 0 ? "user" : "assistant",
                    content: msg
                })));
            }

            console.log('Sending request to OpenRouter:', {
                url: CONFIG.API_URL,
                model: this.model,
                messageCount: requestBody.messages.length
            });

            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.OPENROUTER_API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'Content-Type': 'application/json',
                    'X-Title': 'Military Crisis Simulation'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API request failed: ${response.status} ${response.statusText}\n${JSON.stringify(errorData, null, 2)}`);
            }

            const data = await response.json();
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error(`Invalid response format: ${JSON.stringify(data, null, 2)}`);
            }

            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error generating response:', error);
            // Return a more contextual fallback message
            const fallbackResponses = [
                `[${this.role} ${this.name} considers the ${event.severity.toLowerCase()} situation carefully]`,
                `[${this.role} ${this.name} maintains professional composure despite the tension]`,
                `[${this.role} ${this.name} acknowledges the report with concern]`,
                `[${this.role} ${this.name} processes the information while remaining alert]`
            ];
            return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        }
    }

    updateState(event, state) {
        // Update agent's internal state based on events
        if (event.severity === "HIGH") {
            this.stressLevel = Math.min(1.0, this.stressLevel + 0.2);
        }
        if (event.affectedAreas.includes("security")) {
            this.suspicionLevel = Math.min(1.0, this.suspicionLevel + 0.15);
        }
        
        // Role-specific reactions
        if (this.role === "Security Chief" && event.affectedAreas.includes("security")) {
            this.stressLevel = Math.min(1.0, this.stressLevel + 0.3);
        } else if (this.role === "Engineer" && event.affectedAreas.includes("systems")) {
            this.stressLevel = Math.min(1.0, this.stressLevel + 0.3);
        }
    }
}

class Location {
    constructor(name, description, connectedTo = []) {
        this.name = name;
        this.description = description;
        this.connectedTo = connectedTo;
        this.agentsPresent = [];
    }
}

class FacilityMap {
    constructor() {
        this.locations = {
            "command_center": new Location(
                "Command Center",
                "The nerve center of the facility, filled with monitors and control stations",
                ["briefing_room", "corridor_a"]
            ),
            "missile_silo": new Location(
                "Missile Silo",
                "The heavily secured area housing the missile system",
                ["engineering_bay", "security_post"]
            ),
            "engineering_bay": new Location(
                "Engineering Bay",
                "Technical workspace filled with diagnostic equipment",
                ["missile_silo", "corridor_b"]
            ),
            "security_post": new Location(
                "Security Post",
                "Central security monitoring station",
                ["missile_silo", "corridor_a"]
            ),
            "medical_bay": new Location(
                "Medical Bay",
                "Facility medical center and psychological evaluation area",
                ["corridor_b"]
            ),
            "break_room": new Location(
                "Break Room",
                "Staff relaxation area",
                ["corridor_a", "corridor_b"]
            ),
            "communications_center": new Location(
                "Communications Center",
                "Hub for all internal and external communications",
                ["command_center", "corridor_b"]
            )
        };
    }

    getLocation(name) {
        return this.locations[name];
    }

    moveAgent(agentName, fromLocation, toLocation) {
        const from = this.locations[fromLocation];
        const to = this.locations[toLocation];
        
        if (from && to) {
            from.agentsPresent = from.agentsPresent.filter(a => a !== agentName);
            to.agentsPresent.push(agentName);
            return true;
        }
        return false;
    }
}

class Simulation {
    constructor() {
        this.state = new SimulationState();
        this.agents = this.createAgents();
        this.facilityMap = new FacilityMap();
        this.terminal = document.getElementById('terminal');
        this.setupAgentList();
        this.currentEvent = null;
        this.revealedSecrets = new Set();
    }

    createAgents() {
        return [
            new Agent(
                "Col. James Sterling",
                "Commander",
                "authoritative yet haunted",
                ["military protocol", "chain of command", "strategic operations"],
                "Prevent the launch at all costs due to a past mission gone wrong",
                "Conscience over Command"
            ),
            new Agent(
                "Dr. Victoria Harrison",
                "Political Liaison",
                "outwardly diplomatic, internally conflicted",
                ["political relations", "civilian oversight", "crisis management"],
                "Pushing for launch while secretly gathering evidence of illegal orders",
                "Truth Seekers"
            ),
            new Agent(
                "Dr. Wei Chen",
                "Weapon Engineer",
                "methodical and deeply ethical",
                ["missile systems", "nuclear physics", "maintenance protocols"],
                "Sabotaging launch systems while appearing to fix them",
                "Peace Movement"
            ),
            new Agent(
                "Major Sarah Brooks",
                "Intelligence Officer",
                "perceptive and morally torn",
                ["intelligence analysis", "threat assessment", "classified intel"],
                "Knows the intelligence is fabricated, gathering proof for whistleblowing",
                "Truth Seekers"
            ),
            new Agent(
                "Capt. Miguel Rodriguez",
                "Security Chief",
                "vigilant but compassionate",
                ["security protocols", "personnel profiles", "threat detection"],
                "Investigating a potential mole while protecting a key informant",
                "Internal Security"
            ),
            new Agent(
                "Lt. Min Zhang",
                "Communications Specialist",
                "efficient and secretly calculating",
                ["communications systems", "signal intelligence", "encryption"],
                "Intercepting messages from both sides to determine the truth",
                "Unknown"
            ),
            new Agent(
                "Lt. John Smith",
                "Operations Officer",
                "charismatic but guilt-ridden",
                ["facility operations", "personnel management", "security systems"],
                "Foreign agent working to ensure launch while questioning loyalty",
                "Foreign Power"
            ),
            new Agent(
                "Dr. Sarah Carter",
                "Medical Officer",
                "empathetic and observant",
                ["psychological assessment", "stress management", "medical ethics"],
                "Monitoring crew stability while hiding critical psych evaluations",
                "Humanitarian Concerns"
            )
        ];
    }

    setupAlliances(agents) {
        const findAgent = name => agents.find(a => a.name === name);
        
        findAgent("Col. Sterling").formAlliance("Major Brooks");
        findAgent("Dr. Harrison").formAlliance("Lt. Smith");
        findAgent("Dr. Chen").formAlliance("Lt. Zhang");
        findAgent("Major Brooks").formAlliance("Col. Sterling");
        findAgent("Capt. Rodriguez").formAlliance("Lt. Zhang");
        findAgent("Dr. Sarah Carter").formAlliance("Dr. Chen");
    }

    setupAgentList() {
        const agentList = document.getElementById('agent-list');
        this.agents.forEach(agent => {
            const li = document.createElement('li');
            li.className = `agent-item agent-${agent.name.replace(/[\s.]+/g, '-')}`;
            li.innerHTML = `
                <div class="agent-${agent.name.replace(/[\s.]+/g, '-')}">${agent.name}</div>
                <small>${agent.role}</small>
            `;
            agentList.appendChild(li);
        });
    }

    async writeToTerminal(text, className = '') {
        const message = document.createElement('div');
        message.className = `message ${className}`;
        message.textContent = text;
        this.terminal.appendChild(message);
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    async showTypingIndicator(agent) {
        const indicator = document.createElement('div');
        indicator.className = `typing-indicator agent-${agent.name.replace(/[\s.]+/g, '-')}`;
        indicator.textContent = `${agent.name} is typing...`;
        this.terminal.appendChild(indicator);
        this.terminal.scrollTop = this.terminal.scrollHeight;
        return indicator;
    }

    async simulateConversation(agent1, agent2, location) {
        const conversationDiv = document.createElement('div');
        conversationDiv.className = 'conversation';
        
        const timestamp = this.formatTimestamp(this.state.currentHour);
        const header = document.createElement('div');
        header.className = 'conversation-header';
        header.textContent = `[${timestamp}] Location: ${location}`;
        conversationDiv.appendChild(header);
        
        this.terminal.appendChild(conversationDiv);

        // Update emotional states before conversation
        agent1.updateEmotionalState(this.currentEvent.description, this.state.globalTension);
        agent2.updateEmotionalState(this.currentEvent.description, this.state.globalTension);

        const speakers = [agent1, agent2];
        const turns = Math.floor(Math.random() * 2) + 2; // 2-3 turns
        const conversationHistory = [];

        for (let i = 0; i < turns; i++) {
            for (const speaker of speakers) {
                const listener = speaker === agent1 ? agent2 : agent1;
                
                // Create typing indicator with agent color
                const indicator = document.createElement('div');
                indicator.className = `typing-indicator agent-${speaker.name.replace(/[\s.]+/g, '-')}`;
                indicator.textContent = `${speaker.name} is typing...`;
                this.terminal.appendChild(indicator);
                await new Promise(resolve => setTimeout(resolve, 2000));
                indicator.remove();

                const response = await speaker.generateResponse(
                    this.currentEvent,
                    this.state,
                    location,
                    listener,
                    conversationHistory
                );

                conversationHistory.push(`${speaker.name}: ${response}`);

                const message = document.createElement('div');
                message.className = `chat-message agent-${speaker.name.replace(/[\s.]+/g, '-')}`;
                
                const nameSpan = document.createElement('span');
                nameSpan.className = `agent-name agent-${speaker.name.replace(/[\s.]+/g, '-')}`;
                nameSpan.textContent = `${speaker.name} (${speaker.currentEmotionalState}):`;
                
                const contentSpan = document.createElement('span');
                contentSpan.className = 'message-content';
                contentSpan.textContent = response;
                
                message.appendChild(nameSpan);
                message.appendChild(contentSpan);
                
                conversationDiv.appendChild(message);
                this.terminal.scrollTop = this.terminal.scrollHeight;

                await new Promise(resolve => setTimeout(resolve, 20000)); // 20-second delay between messages
            }
        }
    }

    async simulateRandomEvent() {
        const events = [
            // Critical Events
            {
                type: "CRITICAL",
                description: "Missile guidance system showing critical malfunction",
                location: "Engineering Bay",
                severity: "HIGH",
                requiredRoles: ["Weapon Engineer", "Commander"],
                affectedAreas: ["systems", "engineering"]
            },
            {
                type: "CRITICAL",
                description: "Unauthorized attempt to modify launch codes detected",
                location: "Security Post",
                severity: "HIGH",
                requiredRoles: ["Security Chief", "Commander"],
                affectedAreas: ["security", "systems"]
            },
            
            // Security Events
            {
                type: "SECURITY",
                description: "Encrypted transmission intercepted from unknown source",
                location: "Communications Center",
                severity: "MEDIUM",
                requiredRoles: ["Communications Specialist", "Intelligence Officer"],
                affectedAreas: ["security", "communications"]
            },
            {
                type: "SECURITY",
                description: "Security breach detected in personnel files",
                location: "Security Post",
                severity: "MEDIUM",
                requiredRoles: ["Security Chief", "Operations Officer"],
                affectedAreas: ["security", "personnel"]
            },
            
            // Technical Events
            {
                type: "TECHNICAL",
                description: "Unexpected fluctuations in launch sequence diagnostics",
                location: "Engineering Bay",
                severity: "HIGH",
                requiredRoles: ["Weapon Engineer", "Operations Officer"],
                affectedAreas: ["systems", "engineering"]
            },
            {
                type: "TECHNICAL",
                description: "Environmental control system malfunction in missile silo",
                location: "Engineering Bay",
                severity: "MEDIUM",
                requiredRoles: ["Weapon Engineer", "Security Chief"],
                affectedAreas: ["systems", "environmental"]
            },
            
            // Political Events
            {
                type: "POLITICAL",
                description: "Urgent directive received from civilian oversight",
                location: "Command Center",
                severity: "HIGH",
                requiredRoles: ["Political Liaison", "Commander"],
                affectedAreas: ["command", "political"]
            },
            {
                type: "POLITICAL",
                description: "Media leak threatens to expose operation details",
                location: "Communications Center",
                severity: "MEDIUM",
                requiredRoles: ["Political Liaison", "Communications Specialist"],
                affectedAreas: ["security", "communications"]
            },
            
            // Medical/Psychological Events
            {
                type: "MEDICAL",
                description: "Concerning psychological evaluation results received",
                location: "Medical Bay",
                severity: "HIGH",
                requiredRoles: ["Medical Officer", "Commander"],
                affectedAreas: ["medical", "personnel"]
            },
            {
                type: "MEDICAL",
                description: "Stress-induced incident reported among key personnel",
                location: "Medical Bay",
                severity: "MEDIUM",
                requiredRoles: ["Medical Officer", "Security Chief"],
                affectedAreas: ["medical", "personnel"]
            }
        ];

        // Select a random event
        const selectedEvent = events[Math.floor(Math.random() * events.length)];
        
        // Create Event instance
        this.currentEvent = new Event(
            new Date(),
            selectedEvent.type,
            selectedEvent.description,
            selectedEvent.severity,
            selectedEvent.affectedAreas
        );
        
        // Update agent emotional states based on event
        this.agents.forEach(agent => {
            agent.updateEmotionalState(this.currentEvent.description, this.state.globalTension);
        });

        // Create event message with timestamp
        const timestamp = this.formatTimestamp(this.state.currentHour);
        await this.writeToTerminal(`[${timestamp}] ${this.currentEvent.eventType} EVENT: ${this.currentEvent.description}`, "event");
        
        // Update simulation state
        this.state.updateState(this.currentEvent);

        // Trigger conversation between required roles
        const agent1 = this.agents.find(a => a.role === selectedEvent.requiredRoles[0]);
        const agent2 = this.agents.find(a => a.role === selectedEvent.requiredRoles[1]);
        
        if (agent1 && agent2) {
            await this.simulateConversation(agent1, agent2, selectedEvent.location);
        }

        // Potentially reveal hidden information
        await this.checkForSecretReveal();
    }

    async checkForSecretReveal() {
        if (Math.random() > 0.8 && this.state.currentHour > 12) {  // More likely in later hours
            const secrets = [
                "Intelligence reports about the target may be fabricated",
                "Launch codes have been secretly modified",
                "Key personnel have been receiving mysterious threats",
                "Medical officer's psychological assessments have been altered",
                "Communication logs show evidence of external manipulation",
                "Security chief's background check reveals concerning gaps",
                "Weapon engineer's family history raises questions about loyalty",
                "Commander's previous mission reports contain redacted sections"
            ];

            const newSecret = secrets[Math.floor(Math.random() * secrets.length)];
            if (!this.revealedSecrets.has(newSecret)) {
                this.revealedSecrets.add(newSecret);
                const timestamp = this.formatTimestamp(this.state.currentHour);
                await this.writeToTerminal(`[${timestamp}] CONFIDENTIAL: ${newSecret}`, "secret");
            }
        }
    }

    formatTimestamp(hour) {
        const timeString = hour.toString().padStart(2, '0') + ':00';
        return timeString;
    }

    async simulateRandomInteractions() {
        // Only simulate additional random interactions if tension is high
        if (this.state.globalTension > 0.7) {
            const numInteractions = Math.floor(Math.random() * 2) + 1; // 1-2 additional interactions
            
            for (let i = 0; i < numInteractions; i++) {
                const agent1 = this.agents[Math.floor(Math.random() * this.agents.length)];
                const agent2 = this.agents[Math.floor(Math.random() * this.agents.length)];
                
                if (agent1 !== agent2 && 
                    !this.currentEvent.requiredRoles.includes(agent1.role) && 
                    !this.currentEvent.requiredRoles.includes(agent2.role)) {
                    const locations = ["Command Center", "Break Room", "Engineering Bay", "Security Post", "Medical Bay"];
                    const location = locations[Math.floor(Math.random() * locations.length)];
                    
                    await this.simulateConversation(agent1, agent2, location);
                }
            }
        }
    }

    async start() {
        await this.writeToTerminal("=== MISSILE LAUNCH FACILITY CRISIS SIMULATION ===", "event");
        await this.writeToTerminal("Initializing simulation...", "event");
        await new Promise(resolve => setTimeout(resolve, 2000));

        while (this.state.currentHour < 24) {
            await this.runHour();
            await new Promise(resolve => setTimeout(resolve, 10000)); // 10-second delay between hours
        }
    }

    async runHour() {
        const timeOfDay = this.getTimeOfDay();
        await this.writeToTerminal(`\n=== Hour ${this.state.currentHour + 1}/24 - ${timeOfDay} ===`, "event");
        
        // Simulate random events and conversations
        await this.simulateRandomEvent();
        await this.simulateRandomInteractions();
        
        this.state.currentHour++;
        this.state.updateDisplay();
    }

    getTimeOfDay() {
        const hour = this.state.currentHour;
        if (hour < 6 || hour >= 22) return "NIGHT";
        if (hour < 12) return "MORNING";
        if (hour < 17) return "AFTERNOON";
        return "EVENING";
    }
}

// Start the simulation when the page loads
window.addEventListener('load', () => {
    const simulation = new Simulation();
    simulation.start();
}); 