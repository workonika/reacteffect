import { useEffect, useState } from 'react';

export const useLocalStorage = (defaultReturnValue = null) => {

    const [currentSavingValue, setCurrentSavingValue] = useState('');
    const [currentSavingKey, setCurrentSavingKey] = useState('');
    
    const [currentGettingKey, setCurrentGettingKey] = useState('');
    const [currentGettingValue, setCurrentGettingValue] = useState(defaultReturnValue);

    const complementaryString = '&&&';

    useEffect(() => {
        localStorage.setItem(currentSavingKey, currentSavingValue);
    }, [currentSavingKey, currentSavingValue]);

    useEffect(() => {

        let key;

        if (currentGettingKey.indexOf(complementaryString) !== -1){
            const splittedKeys = currentGettingKey.split(complementaryString);
            const [firstPart] = splittedKeys;
            key = firstPart;
        } else {
            key = currentGettingKey;
        } 

        const savedValue = localStorage.getItem(key);
        
        if (savedValue){
            setCurrentGettingValue(JSON.parse(savedValue));
        }
    }, [currentGettingKey, defaultReturnValue]);

    return {
        getItem: (key) => {
            const newKey = key === currentGettingKey ? `${key}${complementaryString}${key}` : key;
            setCurrentGettingKey(newKey);
        },
        getItemCurrentValue: currentGettingValue,
        setItem: (key, value) => {
            
            const jsonedValue = JSON.stringify(value);
            setCurrentSavingKey(key);
            setCurrentSavingValue(jsonedValue);
        },
    }
}

module.exports = {
    useLocalStorage,
}