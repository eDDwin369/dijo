import React from 'react';
import { Users, Target, Zap } from 'lucide-react';

const AboutUs = () => {
    return (
        <section className="section about-section" id="about">
            <div className="about-content">
                <div className="section-heading">
                    <p className="eyebrow">About Us</p>
                    <h2>We blend strategy, storytelling, and design craft.</h2>
                </div>
                <div className="about-grid">
                    <div className="about-text-content">
                        <p>
                            Northstar Studio is a creative team focused on building websites that
                            look distinct and communicate clearly. We care about motion, structure,
                            typography, and the small details that make a brand feel trustworthy.
                        </p>
                        <p>
                            Whether you are launching something new or refreshing an existing
                            presence, we help turn rough ideas into a polished digital front door.
                        </p>
                    </div>
                    <div className="about-features">
                        <div className="feature">
                            <span className="feature-icon"><Users size={24} /></span>
                            <div>
                                <strong>Collaborative</strong>
                                <p>Working with you, not just for you.</p>
                            </div>
                        </div>
                        <div className="feature">
                            <span className="feature-icon"><Target size={24} /></span>
                            <div>
                                <strong>Purpose-Driven</strong>
                                <p>Every pixel serves a clear business goal.</p>
                            </div>
                        </div>
                        <div className="feature">
                            <span className="feature-icon"><Zap size={24} /></span>
                            <div>
                                <strong>Lightning Fast</strong>
                                <p>Optimized for performance and SEO.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
