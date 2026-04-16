function createLocalStorageGateway(storageKey) {
    return {
        load() {
            const raw = localStorage.getItem(storageKey);
            if (!raw) {
                return null;
            }

            try {
                return JSON.parse(raw);
            } catch (error) {
                localStorage.removeItem(storageKey);
                return null;
            }
        },
        save(data) {
            localStorage.setItem(storageKey, JSON.stringify(data));
        },
        clear() {
            localStorage.removeItem(storageKey);
        }
    };
}

// Futuro upgrade:
// troque este gateway local por um gateway HTTP que converse com um backend.
window.dataGateway = createLocalStorageGateway(window.APP_CONFIG.storage.key);
