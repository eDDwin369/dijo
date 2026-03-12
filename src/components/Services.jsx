import React from 'react';
import { PenTool, Layout, TrendingUp } from 'lucide-react';

const services = [
    {
        icon: <PenTool size={32} className="card-icon" />,
        title: "Brand Systems",
        text: "Identity, messaging, and visuals shaped to feel clear, modern, and unmistakably yours.",
    },
    {
        icon: <Layout size={32} className="card-icon" />,
        title: "Product Design",
        text: "Interfaces that are polished, conversion-aware, and built to work beautifully across devices.",
    },
    {
        icon: <TrendingUp size={32} className="card-icon" />,
        title: "Growth Campaigns",
        text: "Launch strategy, content, and performance loops designed to keep momentum after day one.",
    },
];

const Services = () => {
    return (
        <section className="section" id="services">
            <div className="section-heading">
                <p className="eyebrow">Services</p>
                <h2>Everything needed for a modern landing page.</h2>
            </div>
            <div className="card-grid">
                {services.map((service, index) => (
                    <article key={service.title} className={`info-card delay-${index}`}>
                        <div className="icon-wrapper">
                            {service.icon}
                        </div>
                        <h3>{service.title}</h3>
                        <p>{service.text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Services;
