/**
 * A simple storage system using localstorage.
 * let store = new Storage('my-storage-place');
 * store.set('name','Papa Smurf')
 * store.get('name')  // Papa Smurf
 */

module.exports = class Storage {
    /**
     * Give it a name for the top level store
     * @param {String} storeName
     */
    constructor(storeName) {
        this.storeName = storeName || `store-${Math.random()}`;
        try {
            let rawStore = localStorage.getItem(storeName) || "{}";
            this.data = JSON.parse(rawStore);
        } catch (e) {
            this.data = {};
        }
    }

    /**
     * Set a key, value
     * @param {String} key
     * @param {Any} value
     */
    set(key, value) {
        this.data[key] = value;
        return localStorage.setItem(this.storeName, JSON.stringify(this.data));
    }

    /**
     * Get a Value by Key
     * @param {String} key
     */
    get(key) {
        return this.data[key];
    }

    /**
     * Remove a Key
     * @param {String} key
     */
    remove(key) {
        delete this.data[key];
        return this;
    }
};