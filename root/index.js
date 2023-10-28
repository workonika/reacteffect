import { useEffect, useState, useRef } from 'react';

export const createBrowserStorageHook = (storage) => {
    const __keys_stored_to_restore__ = '__REACT_HOOK_EFFECT__BROWSER_STORAGE_KEYS_';
    const __default_value__ = Math.round(Math.random() * 1_000_000_000_000);

    const __store__ = {
        getItem: (key) => storage.getItem(key),
        setItem: (key, value) => storage.setItem(key, value),
        clear: () => storage.clear(),
        removeItem: (key) => storage.removeItem(key),
        getLength: () => storage.length,
    };

    return (defaultReturnValue = null) => {

        const [currentKeyValue, setCurrentKeyValue] = useState(__default_value__);
        const [currentKeyRemove, setCurrentKeyRemove] = useState(__default_value__);
        const [clear, setClear] = useState(__default_value__);
        
        const __REACT_HOOK_EFFECT__BROWSER_STORAGE_BUFFER__ = useRef();

        //  This useEffect delete key and value from localStorage
        useEffect(() => {
            if (currentKeyRemove !== __default_value__) {
                const storedKeysArray = __store__.getItem(__keys_stored_to_restore__);

                __store__.removeItem(currentKeyRemove);
                __REACT_HOOK_EFFECT__BROWSER_STORAGE_BUFFER__.current.delete(currentKeyRemove);

                if (storedKeysArray) {
                    const parsedKeysArray = JSON.parse(storedKeysArray);
                    const filteredKeysArray = parsedKeysArray.filter(key => key !== currentKeyRemove);
                    const stringifiedKeysArray = JSON.stringify(filteredKeysArray);

                    __store__.setItem(__keys_stored_to_restore__, stringifiedKeysArray);
                }

                setCurrentKeyRemove(__default_value__);
            }
        }, [currentKeyRemove]);

        //  This useEffect update localStorage by new or existing key, value
        useEffect(() => {
            if (currentKeyValue !== __default_value__) {
                
                let stringifiedKeysArray;
                const storedKeysArray = __store__.getItem(__keys_stored_to_restore__);
                const { key, value } = currentKeyValue;
    
                if (storedKeysArray) {
                    const parsedKeysArray = JSON.parse(storedKeysArray);
                    stringifiedKeysArray = JSON.stringify(parsedKeysArray.includes(key) ? parsedKeysArray : [...parsedKeysArray, key]);
                } else {
                    stringifiedKeysArray = JSON.stringify([key]);
                }

                __store__.setItem(__keys_stored_to_restore__, stringifiedKeysArray);

                const stringifiedCurrentValue = JSON.stringify(value);
                __store__.setItem(key, stringifiedCurrentValue);

                setCurrentKeyValue(__default_value__);
            }
        }, [currentKeyValue]);

        //  This useEffect initialize __REACT_HOOK_EFFECT__BROWSER_STORAGE_BUFFER__
        useEffect(() => {
            const storedKeysArray = __store__.getItem(__keys_stored_to_restore__);
            const keysWithNonexistentValues = new Set();

            if (storedKeysArray) {
                const parsedKeysArray = JSON.parse(storedKeysArray);
                const keyValueRecords = parsedKeysArray.map(key => {
                    const storedValue = __store__.getItem(key);
                    if (storedValue) {
                        const parsedValue = JSON.parse(storedValue);
                        return [key, parsedValue];
                    }
                    
                    keysWithNonexistentValues.add(key);
                    return null;
                });

                const purifiedKeyValueRecords = keyValueRecords.filter(keyValue => keyValue !== null);
                const bufferedValues = new Map(purifiedKeyValueRecords);
                __REACT_HOOK_EFFECT__BROWSER_STORAGE_BUFFER__.current = bufferedValues;

                if (keysWithNonexistentValues.size) {
                    const purifiedKeysArray = parsedKeysArray.filter(key => !keysWithNonexistentValues.has(key));
                    const stringifiedKeysArray = JSON.stringify(purifiedKeysArray);
                    __store__.setItem(__keys_stored_to_restore__, stringifiedKeysArray);
                }
            } else {
                __REACT_HOOK_EFFECT__BROWSER_STORAGE_BUFFER__.current = new Map();
            }
        }, []);
        
        //  This useEffect clear localStorage
        useEffect(() => {
            if (clear !== __default_value__) {
                
                __store__.clear();
                setClear(__default_value__);
            }
        }, [clear]);

        //  You don't need use JSON.stringify when calling setItem method, 
        //  and you don't need use JSON.parse when calling getItem method in your code
        return {
            getItem (key) {
                const value = __REACT_HOOK_EFFECT__BROWSER_STORAGE_BUFFER__.current.get(key);

                return value ?? defaultReturnValue;
            },
            setItem (key, value) {
                __REACT_HOOK_EFFECT__BROWSER_STORAGE_BUFFER__.current.set(key, value);
                setCurrentKeyValue({ key, value });
            },
            clear () {
                __REACT_HOOK_EFFECT__BROWSER_STORAGE_BUFFER__.current.clear();
                setClear(true);
            },
            removeItem (key) {
                __REACT_HOOK_EFFECT__BROWSER_STORAGE_BUFFER__.current.delete(key);
                setCurrentKeyRemove(key);
            },
            getLength (wholeStorage = false) {

                return wholeStorage ? __store__.getLength() : __REACT_HOOK_EFFECT__BROWSER_STORAGE_BUFFER__?.current?.size;
            },
            getKeys () {
                if (__REACT_HOOK_EFFECT__BROWSER_STORAGE_BUFFER__.current) {
                    return [...__REACT_HOOK_EFFECT__BROWSER_STORAGE_BUFFER__.current.keys()]
                }

                return 0;
            }
        };
    }
}

export const useLocalStorage = createBrowserStorageHook(localStorage);

export const useSessionStorage = createBrowserStorageHook(sessionStorage);
