class UserPreferences {
    static getPreference(key, defaultValue = null) {
        const value = localStorage.getItem(key);
        return value !== null ? JSON.parse(value) : defaultValue;
    }

    static setPreference(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static clearPreference(key) {
        localStorage.removeItem(key);
    }

    static clearAllPreferences() {
        localStorage.clear();
    }
}

// Usage example:
// UserPreferences.setPreference('theme', 'dark');
// const theme = UserPreferences.getPreference('theme', 'light'); 