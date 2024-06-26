import React, { useEffect, useState } from 'react';

interface DropdownItem {
    value: string;
    label: string;
}

interface DropdownProps {
    fetchData: () => Promise<DropdownItem[]>; // Usa DropdownItem[] invece di any[]
    label: string;
    onSelect: (value: string) => void; // Assumi che value sia una stringa, modifica se necessario
}

const Dropdown: React.FC<DropdownProps> = ({ fetchData, label, onSelect }) => {
    const [items, setItems] = useState<DropdownItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<string | undefined>();

    useEffect(() => {
        const getItems = async () => {
            const data = await fetchData();
            setItems(data);
        };

        getItems();
    }, [fetchData]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedItem(value);
        onSelect(value);
    };

    return (
        <div>
            <label>{label}</label>
            <select value={selectedItem} onChange={handleChange}>
                <option value="">Seleziona un'opzione</option>
                {items.map((item, index) => (
                    <option key={index} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;
