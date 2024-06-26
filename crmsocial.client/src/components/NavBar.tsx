import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remove token from localStorage
        navigate('/Login'); // Redirect to login page
    };

    return (
        <nav className="bg-green-500 text-white p-4 font-bold relative z-50">
            <ul className="flex space-x-4">
                <li><img style={{ width: '50px', borderRadius: '50%' }} src="/img/logo.png" alt="Logo" /></li>
                <li><Link to="/Opere" className="hover:text-gray-300">Opere</Link></li>
                <li><Link to="/Contratti" className="hover:text-gray-300">Contratti</Link></li>
                <li><Link to="/DirittiVenduto" className="hover:text-gray-300">Diritti</Link></li>
                <li><Link to="/Tiratura" className="hover:text-gray-300">Tiratura</Link></li>
                <li className="relative group">
                    <button className="hover:text-gray-300">Tabelle</button>
                    <ul className="absolute hidden group-hover:block bg-gray-700 p-2 mt-1 z-50">
                        <li><Link to="/TabAutori" className="block white-space-no-wrap hover:text-gray-300 p-2">Autori</Link></li>
                        <li><Link to="/TabCollane" className="block white-space-no-wrap hover:text-gray-300 p-2">Collane</Link></li>
                        <li><Link to="/TabEditori" className="block white-space-no-wrap hover:text-gray-300 p-2">Editori</Link></li>
                        <li><Link to="/TabLingue" className="block white-space-no-wrap hover:text-gray-300 p-2">Lingue</Link></li>
                        <li><Link to="/TabStati" className="block white-space-no-wrap hover:text-gray-300 p-2">Stati</Link></li>
                        <li><Link to="/TabTipoOpera" className="block white-space-no-wrap hover:text-gray-300 p-2">Tipo Opera</Link></li>
                        <li><Link to="/TabValute" className="block white-space-no-wrap hover:text-gray-300 p-2">Valute</Link></li>


                    </ul>
                </li>
                <li className="relative group">
                    <button className="hover:text-gray-300">Estrazioni</button>
                    <ul className="absolute hidden group-hover:block bg-gray-700 p-2 mt-1 z-50">
                        <li><Link to="/DirittiVenduto/XLS" target="_estrazione" className="block white-space-no-wrap hover:text-gray-300 p-2">Diritti Venduto per anno</Link></li>
                    </ul>
                </li>
                <li><Link to="https://docs.google.com/spreadsheets/d/1euJdUDg3mCQ2dTxxux3d8B0sPIZZUeyq5T8UZW7_-GE/edit?gid=0#gid=0"
                    className="hover:text-gray-300"  target="_new" >Assistenza</Link></li>
                <li><button onClick={handleLogout} className="hover:text-gray-300">Logout</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;
