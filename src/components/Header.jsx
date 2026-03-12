import React from 'react';
import { ArrowRight } from 'lucide-react';

const Header = () => {
    return (
        <header className="site-header">
            <div className="brand">Northstar Studio</div>
            <nav className="nav">
                <a href="#about">About</a>
                <a href="#services">Services</a>
                <a href="#contact">Contact</a>
            </nav>
            <a className="button button-small" href="#contact">
                Start a Project <ArrowRight size={16} />
            </a>
        </header>
    );
};

export default Header;
