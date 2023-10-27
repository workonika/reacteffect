import { useEffect, useState, useRef } from 'react';

export const createBrowserStorageHook = (storage) => {
    const __keys_stored_to_restore__ = '__REACT_HOOK_EFFECT__LOCAL_STORAGE_KEYS_';
    const __default_value__ = Math.round(Math.random() * 1_000_000_000_000);

    const __store__ = {
        getItem: (key: string) => storage.getItem(key),
        setItem: (key: string, value: any) => storage.setItem(key, value),
        clear: () => storage.clear(),
        removeItem: (key: string) => storage.removeItem(key),
        getLength: () => storage.length,
    };

    type KeyValue = { key: string, value: any };

    return (defaultReturnValue = null) => {

        const [currentKeyValue, setCurrentKeyValue] = useState<KeyValue | number>(__default_value__);
        const [currentKeyRemove, setCurrentKeyRemove] = useState<string | number>(__default_value__);
        const [clear, setClear] = useState<boolean | number>(__default_value__);
        
        const __REACT_HOOK_EFFECT__BUFFER__ = useRef<string, any>();

        //  This useEffect delete key and value from localStorage
        useEffect(() => {
            if (currentKeyRemove !== __default_value__) {
                const storedKeysArray = __store__.getItem(__keys_stored_to_restore__);

                __store__.removeItem(currentKeyRemove);
                __REACT_HOOK_EFFECT__BUFFER__.current.delete(currentKeyRemove);

                if (storedKeysArray) {
                    const parsedKeysArray = JSON.parse(storedKeysArray);
                    const filteredKeysArray = parsedKeysArray.filter((key: string) => key !== currentKeyRemove);
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

        //  This useEffect initialize __REACT_HOOK_EFFECT__BUFFER__
        useEffect(() => {
            const storedKeysArray = __store__.getItem(__keys_stored_to_restore__);
            const keysWithNonexistentValues = new Set<string>();

            if (storedKeysArray) {
                const parsedKeysArray = JSON.parse(storedKeysArray);
                const keyValueRecords = parsedKeysArray.map((key: string) => {
                    const storedValue = __store__.getItem(key);
                    if (storedValue) {
                        const parsedValue = JSON.parse(storedValue);
                        return [key, parsedValue];
                    }
                    
                    keysWithNonexistentValues.add(key);
                    return null;
                });

                const purifiedKeyValueRecords = keyValueRecords.filter((keyValue: KeyValue | null) => keyValue !== null);
                const bufferedValues = new Map<string, KeyValue>(purifiedKeyValueRecords);
                __REACT_HOOK_EFFECT__BUFFER__.current = bufferedValues;

                if (keysWithNonexistentValues.size) {
                    const purifiedKeysArray = parsedKeysArray.filter((key: string) => !keysWithNonexistentValues.has(key));
                    const stringifiedKeysArray = JSON.stringify(purifiedKeysArray);
                    __store__.setItem(__keys_stored_to_restore__, stringifiedKeysArray);
                }
            } else {
                __REACT_HOOK_EFFECT__BUFFER__.current = new Map<string, KeyValue>();
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
            getItem (key: string) {
                const value = __REACT_HOOK_EFFECT__BUFFER__.current.get(key);

                return value ?? defaultReturnValue;
            },
            setItem (key: string, value: any) {
                __REACT_HOOK_EFFECT__BUFFER__.current.set(key, value);
                setCurrentKeyValue({ key, value });
            },
            clear () {
                __REACT_HOOK_EFFECT__BUFFER__.current.clear();
                setClear(true);
            },
            removeItem (key: string) {
                __REACT_HOOK_EFFECT__BUFFER__.current.delete(key);
                setCurrentKeyRemove(key);
            },
            getLength (wholeStorage = false) {

                return wholeStorage ? __store__.getLength() : __REACT_HOOK_EFFECT__BUFFER__?.current?.size;
            },
            getKeys () {
                if (__REACT_HOOK_EFFECT__BUFFER__.current) {
                    return [...__REACT_HOOK_EFFECT__BUFFER__.current.keys()]
                }

                return 0;
            }
        };
    }
}

export const useLocalStorage = createBrowserStorageHook(localStorage);

export const useSessionStorage = createBrowserStorageHook(sessionStorage);
