/**
 * Example with React component where useLocalStorage let you save value 
 * to LocalStorage and get value from LocalStorage
 */

import React, { useState, useEffect, Fragment } from 'react';
import { useLocalStorage  } from 'reacteffect';

export const LayoutPage = () => {

    const [value, setValue] = useState('');
    const { getItem, setItem, getItemCurrentValue } = useLocalStorage();

    //  This will initialize your getItemCurrentValue variable after reload page with F5
    useEffect(() => {
        getItem('example-key-in-local-storage');
    }, []);

    const handleChange = (e) => {
        const { value } = e.target;
        setValue(value);
        setItem('example-key-in-local-storage', value);
        
        getItem('example-key-in-local-storage');
    }

    return (
        <Fragment>
            
            <main>
                Start input any text:
                <input type="text" value={value} onChange={handleChange} />
            </main>
            {/* Here will appear a text from LocalStorage in that moment when you typing in the field above */}
            { getItemCurrentValue }
            
        </Fragment>
    );
}
