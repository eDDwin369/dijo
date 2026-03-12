import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="brand">Northstar Studio</div>
                    <p>© 2026 Northstar Studio.<br />Crafted for bold launches.</p>
                </div>

                <div className="footer-links-container">
                    <div className="footer-col">
                        <strong>Sitemap</strong>
                        <a href="#about">About Us</a>
                        <a href="#services">Services</a>
                        <a href="#contact">Contact</a>
                    </div>
                    <div className="footer-col">
                        <strong>Socials</strong>
                        <div className="social-links">
                            <a href="#"><Twitter size={20} /></a>
                            <a href="#"><Linkedin size={20} /></a>
                            <a href="#"><Github size={20} /></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-legal">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
                <a className="button button-small" href="mailto:hello@northstarstudio.com">
                    hello@northstarstudio.com
                </a>
            </div>
        </footer>
    );
};

export default Footer;
