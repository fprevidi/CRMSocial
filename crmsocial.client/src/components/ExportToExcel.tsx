import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

interface ExportToExcelProps<T> {
    data: T[];
    file: string;
}

interface Filtro {
    campo: string;
    descrizione: string;
}

const ExportToExcel = <T extends Record<string, unknown>>({ data, file }: ExportToExcelProps<T>) => {
    const [columns, setColumns] = useState<Filtro[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [columnDescriptions, setColumnDescriptions] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchColumns = async () => {
            try {
                const response = await fetch(`/api/Filtri?file=${file}`);
                const data: Filtro[] = await response.json();
                const normalizedData = data.map(col => ({ ...col, campo: col.campo.toLowerCase() }));
                setColumns(normalizedData);
                const descriptions = normalizedData.reduce((acc, col) => {
                    acc[col.campo] = col.descrizione;
                    return acc;
                }, {} as { [key: string]: string });
                setColumnDescriptions(descriptions);
            } catch (error) {
                console.error('Error fetching columns:', error);
            }
        };

        fetchColumns();
    }, [file]);

    const handleColumnChange = (column: string) => {
        setSelectedColumns((prev) =>
            prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]
        );
    };

    const getNestedProperty = (obj: Record<string, unknown>, path: string): unknown => {
        return path.split('.').reduce<unknown>((acc, part) => {
            if (acc && typeof acc === 'object' && part in acc) {
                return (acc as Record<string, unknown>)[part];
            }
            return undefined;
        }, obj);
    };

    const toLowerCaseKeys = <U extends Record<string, unknown>>(obj: U): Record<string, unknown> => {
        const result: Record<string, unknown> = {};
        Object.keys(obj).forEach(key => {
            const lowerCaseKey = key.toLowerCase();
            const value = obj[key];
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                result[lowerCaseKey] = toLowerCaseKeys(value as Record<string, unknown>);
            } else {
                result[lowerCaseKey] = value;
            }
        });
        return result;
    };

    const formatDate = (date: unknown): string => {
        if (typeof date === 'string' && !isNaN(Date.parse(date))) {
            return new Date(date).toISOString().split('T')[0];
        }
        return date as string;
    };

    const handleExport = () => {
        if (selectedColumns.length === 0) return;

        const filteredData = data.map((item) => {
            const lowerCaseItem = toLowerCaseKeys(item);
            const filteredItem: Record<string, unknown> = {};
            selectedColumns.forEach((col) => {
                const value = getNestedProperty(lowerCaseItem, col.replace(/\//g, '.'));
                if (value !== undefined) {
                    filteredItem[columnDescriptions[col] || col] = formatDate(value);
                }
            });
            return filteredItem;
        });

        const sortedData = filteredData.map((item) => {
            const sortedItem: Record<string, unknown> = {};
            selectedColumns.forEach((col) => {
                sortedItem[columnDescriptions[col] || col] = item[columnDescriptions[col] || col];
            });
            return sortedItem;
        });

        const worksheet = XLSX.utils.json_to_sheet(sortedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        XLSX.writeFile(workbook, 'export.xlsx');
    };

    return (
        <div className="card shadow-lg p-4 ml-2">
            <h3 className="text-xl font-semibold mb-4">Seleziona le colonne da esportare</h3>
            <div className="columns-selector grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {columns.map((column) => (
                    <div key={column.campo} className="flex items-center">
                        <input
                            type="checkbox"
                            value={column.campo}
                            checked={selectedColumns.includes(column.campo)}
                            onChange={() => handleColumnChange(column.campo)}
                            className="mr-2"
                        />
                        <label>{column.descrizione}</label>
                    </div>
                ))}
            </div>
            <button
                onClick={handleExport}
                disabled={selectedColumns.length === 0}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition ease-in-out duration-150"
            >
                Esporta
            </button>
        </div>
    );
};

export default ExportToExcel;
