module.exports = class Storage {
    constructor(storeName) {
        this.storeName = storeName || `store-${Math.random()}`;
        try {
            let rawStore = localStorage.getItem(storeName) || "{}";
            this.data = JSON.parse(rawStore);
        } catch (e) {
            this.data = {};
        }
    }

    set(key, value) {
        this.data[key] = value;
        return localStorage.setItem(this.storeName, JSON.stringify(this.data));
    }

    get(key) {
        return this.data[key];
    }

    remove(key) {
        delete this.data[key];
        return this;
    }
};