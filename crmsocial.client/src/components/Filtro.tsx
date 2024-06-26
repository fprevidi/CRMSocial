import React, { useState, useEffect } from 'react';

interface FiltroProps {
    file: string;
    onCerca: (stringaRicercaOdata: string) => void;
}

interface FiltroValore {
    campo: string;
    descrizione: string;
}

interface Operatore {
    label: string;
    value: string;
}

interface FiltroSet {
    id: number;
    selezionatoFiltro: string;
    operatore: string;
    testo: string;
}

const Filtro: React.FC<FiltroProps> = ({ file, onCerca }) => {
    const [filtri, setFiltri] = useState<FiltroSet[]>([
        { id: 0, selezionatoFiltro: '', operatore: 'eq', testo: '' }
    ]);

    const [filtroValori, setFiltroValori] = useState<FiltroValore[]>([]);

    useEffect(() => {
        const fetchFiltroValori = async () => {
            try {
                const response = await fetch(`/api/Filtri?file=${file}`);
                if (response.ok) {
                    const data = await response.json();
                    setFiltroValori(data);
                } else {
                    throw new Error('Errore nella richiesta API');
                }
            } catch (error) {
                console.error('Errore nel recupero dei dati:', error);
            }
        };

        fetchFiltroValori();
    }, [file]);

    const handleFiltroChange = (index: number, campo: keyof FiltroSet, value: string) => {
        const nuoviFiltri = filtri.map((filtro, i) => {
            if (i === index) {
                return { ...filtro, [campo]: value };
            }
            return filtro;
        });
        setFiltri(nuoviFiltri);
    };

    const handleAggiungiFiltro = () => {
        setFiltri([...filtri, { id: filtri.length, selezionatoFiltro: '', operatore: 'eq', testo: '' }]);
    };
    const handleRimuoviFiltro = (index: number) => {
        setFiltri(filtri => filtri.filter((_, i) => i !== index));
    };
    const handleReset = () => {
        setFiltri([{ id: 0, selezionatoFiltro: '', operatore: 'eq', testo: '' }]);
        onCerca("")
    };

    const handleCerca = () => {
        const isValidDate = (dateString:string) => {
            // Regex per verificare il formato yyyy-MM-dd
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            return regex.test(dateString);
        };

        const partiDiFiltro: string[] = filtri.map(filtro => {
            const isDate = isValidDate(filtro.testo);
            const isNumeric = !isNaN(Number(filtro.testo));

            if (filtro.operatore === 'contains') {
                return `contains(${filtro.selezionatoFiltro},'${filtro.testo}')`;
            } else if (isDate) {
                // Se 'filtro.testo' è una data valida, usala così com'è
                return `${filtro.selezionatoFiltro} ${filtro.operatore} ${filtro.testo}`;
            } else if (isNumeric) {
                // Se 'filtro.testo' è numerico, non usare gli apici
                return `${filtro.selezionatoFiltro} ${filtro.operatore} ${filtro.testo}`;
            } else {
                // Altrimenti, circonda 'filtro.testo' con gli apici
                return `${filtro.selezionatoFiltro} ${filtro.operatore} '${filtro.testo}'`;
            }
        });

        const stringaRicercaOData = partiDiFiltro.length > 0 ? `${partiDiFiltro.join(' and ')}` : '';
        onCerca(stringaRicercaOData);
    };



    const operatori: Operatore[] = [
        { label: '=', value: 'eq' },
        { label: '!=', value: 'ne' },
        { label: '>', value: 'gt' },
        { label: '<', value: 'lt' },
        { label: '>=', value: 'ge' },
        { label: '<=', value: 'le' },
        { label: 'contiene', value: 'contains' },
    ];

    return (
        <div className="mt-5 flex flex-col space-y-2 w-11/12">
            {filtri.map((filtro, index) => (
                <div key={index} className="flex space-x-2 items-center">
                    <span className="whitespace-nowrap">Filtra per:</span>
                    <select className="form-select form-select-sm appearance-none block w-40 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" value={filtro.selezionatoFiltro} onChange={e => handleFiltroChange(index, 'selezionatoFiltro', e.target.value)}>
                    <option value="">Seleziona...</option>
                        {filtroValori.map(valore => (
                            <option key={valore.campo} value={valore.campo}>
                                {valore.descrizione}
                            </option>
                        ))}
                    </select>
                    <select className="form-select form-select-sm appearance-none block w-40 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" value={filtro.operatore} onChange={e => handleFiltroChange(index, 'operatore', e.target.value)}>
                        {operatori.map(op => (
                            <option key={op.value} value={op.value}>
                                {op.label}
                            </option>
                        ))}
                    </select>
                    
                    <input className="form-input sm:text-sm appearance-none block w-100 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" type="text" value={filtro.testo} onChange={e => handleFiltroChange(index, 'testo', e.target.value)} />


                    {index === filtri.length - 1 && (
                        <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-700 transition ease-in-out duration-150" onClick={handleAggiungiFiltro}>+</button>
                    )}

                    {filtri.length > 1 && (
                        <button className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-700 transition ease-in-out duration-150" onClick={() => handleRimuoviFiltro(index)}>-</button>
                    )}

                    {index === filtri.length - 1 && (
                        <div className="flex space-x-2">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 transition ease-in-out duration-150"
                                onClick={handleCerca}
                            >
                                Cerca
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-700 transition ease-in-out duration-150"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                        </div>
                    )}
                </div>
            ))}
            
        </div>
    );
};

export default Filtro;
