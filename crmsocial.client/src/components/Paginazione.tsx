import React from 'react';

interface Props {
    paginaCorrente: number;
    totalePagine: number;
    cambiaPagina: (pagina: number) => void;
}

const Paginazione: React.FC<Props> = ({ paginaCorrente, totalePagine, cambiaPagina }) => {
    // Calcola la pagina iniziale da mostrare nel range di paginazione
    const primaPaginaVisibile = Math.max(1, paginaCorrente - 4);
    // Calcola la pagina finale da mostrare nel range di paginazione
    const ultimaPaginaVisibile = Math.min(totalePagine, primaPaginaVisibile + 9);

    const pagine = [];
    // Aggiungi il pulsante per la prima pagina
    pagine.push(
        <button
            key="first"
            onClick={() => cambiaPagina(1)}
            className="px-3 py-1 bg-gray-300 text-black rounded mx-1"
            disabled={paginaCorrente === 1}
        >
            Prima Pagina
        </button>
    );

    // Genera i pulsanti per le pagine nel range visibile
    for (let i = primaPaginaVisibile; i <= ultimaPaginaVisibile; i++) {
        pagine.push(
            <button
                key={i}
                onClick={() => cambiaPagina(i)}
                className={`px-3 py-1 ${paginaCorrente === i ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} rounded mx-1`}
            >
                {i}
            </button>
        );
    }

    // Aggiungi il pulsante per l'ultima pagina
    pagine.push(
        <button
            key="last"
            onClick={() => cambiaPagina(totalePagine)}
            className="px-3 py-1 bg-gray-300 text-black rounded mx-1"
            disabled={paginaCorrente === totalePagine}
        >
            Ultima Pagina
        </button>
    );

    return <div className="flex justify-center my-4">{pagine}</div>;
};

export default Paginazione;
