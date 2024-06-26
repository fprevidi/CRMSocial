import React, { useEffect, useState, useCallback, useRef } from 'react';
import {decode } from 'he'
interface AutocompleteItem {
    value: string;
    label: string;
}

interface AutocompleteProps<T extends string | number | null> {
    fileName: string;
    onSelect: (value: T) => void;
    defaultValue?: T;
}

function Autocomplete<T extends string | number | null>({ fileName, onSelect, defaultValue }: AutocompleteProps<T>) {
    const [items, setItems] = useState<AutocompleteItem[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredItems, setFilteredItems] = useState<AutocompleteItem[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const blurTimeoutRef = useRef<number | null>(null);
    const token = localStorage.getItem('authToken');

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`/api/Autocomplete/${fileName}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data: AutocompleteItem[] = await response.json();
            return data.map(item => ({
                value: item.value,
                label: decode(item.label??'')
            }));
        } catch (error) {
            console.error("Error loading data:", error);
            return [];
        }
    }, [fileName]);

    useEffect(() => {
        fetchData().then(data => {
            setItems(data);
            setFilteredItems(data);
            if (defaultValue !== undefined && defaultValue !== null) {
                const defaultItem = data.find(item => item.value.toString() === defaultValue?.toString());
                if (defaultItem) {
                    setInputValue(defaultItem.label);
                }
            }
        });
    }, [fetchData, defaultValue]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        if (value === '') {
            onSelect(null as T); // Passa null se l'input è vuoto
        }
        const filtered = items.filter(item => item.label.toLowerCase().includes(value.toLowerCase()));
        setFilteredItems(filtered);
        setIsOpen(true);
        setHighlightedIndex(-1);
    };

    const handleSelect = (value: string) => {
        const selectedItem = items.find(item => item.value === value);
        if (selectedItem) {
            setInputValue(selectedItem.label);
            const parsedValue = typeof defaultValue === 'number' ? parseInt(selectedItem.value, 10) : selectedItem.value;
            onSelect(parsedValue as T);
        }
        setIsOpen(false);
    };

    const handleBlur = () => {
        blurTimeoutRef.current = window.setTimeout(() => {
            setIsOpen(false);
        }, 200);
    };

    const handleFocus = () => {
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = null;
        }
        setIsOpen(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHighlightedIndex(prevIndex => (prevIndex + 1) % filteredItems.length);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlightedIndex(prevIndex => (prevIndex - 1 + filteredItems.length) % filteredItems.length);
        } else if (event.key === 'Enter' && highlightedIndex >= 0) {
            event.preventDefault();
            handleSelect(filteredItems[highlightedIndex].value);
        } else if (event.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="Type to search..."
                className="w-full px-2 py-1 border"
            />
            {isOpen && (
                <div className="absolute mt-1 w-full bg-white shadow-lg border border-gray-300 z-50 max-h-60 overflow-auto">
                    {filteredItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(item.value)}
                            className={`px-2 py-1 cursor-pointer ${highlightedIndex === index ? 'bg-gray-200' : ''}`}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Autocomplete;
