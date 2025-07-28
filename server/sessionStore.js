/* abstract */ class SessionStore {
    findSession(id) {}
    saveSession(id, session) {}
    findAllSessions() {}
}

// extends SessionStore
class InMemorySessionStore extends SessionStore {
    constructor() {
        super();
        this.sessions = new Map();
    }

    findSession(id) {
        console.log("SSSSSESSSION " + id)
        return this.sessions.get(id);
    }

    saveSession(id, session) {
        this.sessions.set(id, session);

    }

    findAllSessions() {
        return [...this.sessions.values()];
    }
}

module.exports = {
    InMemorySessionStore
};