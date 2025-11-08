// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import ParticleNetwork from './ParticleNetwork';
import Navbar from './Navbar';
import Footer from './Footer';
import { UserIcon, SparklesIcon } from './icons';

const FeatureListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <div className="flex-shrink-0 bg-gray-800 rounded-full p-1 mr-3 mt-1">
            <UserIcon className="w-4 h-4 text-[#00FFC2]" />
        </div>
        <span className="text-gray-400">{children}</span>
    </li>
);

const PricingCard: React.FC<{
    planName: string;
    price: string;
    priceDetails: string;
    description: string;
    isPopular?: boolean;
    buttonText: string;
    buttonLink: string;
}> = ({ planName, price, priceDetails, description, isPopular, buttonText, buttonLink }) => {
    
    const cardClasses = isPopular
        ? "bg-gradient-to-br from-teal-900/50 via-gray-900/50 to-gray-900/50 border-2 border-[#00FFC2]"
        : "bg-gray-900/50 backdrop-blur-xl border border-white/10";
    
    const buttonClasses = isPopular
        ? "w-full block text-center px-8 py-3 text-base font-bold text-black bg-[#00FFC2] rounded-lg hover:bg-teal-300 transition-transform hover:scale-105 duration-300 shadow-[0_0_20px_theme(colors.teal.400/60%)]"
        : "w-full block text-center px-8 py-3 text-base font-bold text-white bg-white/10 border-2 border-white/20 rounded-lg hover:bg-white/20 transition-colors duration-300";

    return (
        <div className={`relative rounded-2xl p-8 ${cardClasses}`}>
            {isPopular && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-[#00FFC2] to-sky-400 text-black text-xs font-bold px-4 py-1.5 rounded-full">
                    Most Popular
                </div>
            )}

            <div className="bg-white/5 rounded-lg w-12 h-12 flex items-center justify-center mb-5">
                 <SparklesIcon className="w-6 h-6 text-[#00FFC2]" />
            </div>
            
            <h3 className="text-2xl font-bold text-white">{planName}</h3>
            
            <div className="my-6">
                <span className="text-5xl font-extrabold text-white">{price}</span>
                <span className="text-gray-400 font-medium ml-2">{priceDetails}</span>
            </div>
            
            <p className="text-gray-400 mb-8 h-10">{description}</p>
            
            <a href={buttonLink} className={buttonClasses}>
                {buttonText}
            </a>
        </div>
    );
};

const PricingPage: React.FC = () => {
    const basicFeatures = [
        "20 emails per month",
        "5 phone numbers per month",
        "Basic CRM integration",
    ];

    const premiumFeatures = [
        "Auto-publish to all platforms",
        "Auto-comment reply",
        "Auto-DM reply",
        "Automated CRM updates",
        "Automated Email follow-ups",
        "Access to all automation features",
        "Unlimited emails",
        "Priority support",
    ];

    return (
        <div className="relative bg-[#0D1117] text-gray-200 font-sans overflow-x-hidden">
            <ParticleNetwork />
            <div className="relative z-10">
                <Navbar />
                <main className="pt-24 pb-16">
                    <section className="container mx-auto px-4 py-16">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 animate-fade-in-down">
                                Plans & Pricing
                            </h1>
                            <p className="text-lg text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-100">
                                Start for free, upgrade for powerful automation. Choose the plan that fits your needs.
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-x-8 gap-y-12 items-start">
                           {/* Basic Plan */}
                           <div className="flex flex-col space-y-8 animate-fade-in-up delay-200">
                                <PricingCard
                                    planName="Basic"
                                    price="Free"
                                    priceDetails="forever"
                                    description="Perfect for individuals getting started with social media."
                                    buttonText="Get Started"
                                    buttonLink="/" 
                               />
                               <div>
                                   <h4 className="font-semibold text-white mb-4">Basic Plan Includes:</h4>
                                   <ul className="space-y-3">
                                        {basicFeatures.map((feature, index) => (
                                            <FeatureListItem key={index}>{feature}</FeatureListItem>
                                        ))}
                                   </ul>
                               </div>
                           </div>

                           {/* Premium Plan */}
                           <div className="flex flex-col space-y-8 animate-fade-in-up delay-300">
                                <PricingCard
                                    planName="Premium"
                                    price="$29"
                                    priceDetails="/ month"
                                    description="Unlock full automation to qualify leads and grow your business."
                                    isPopular={true}
                                    buttonText="Start 30-Day Free Trial"
                                    buttonLink="/"
                               />
                                <div>
                                   <h4 className="font-semibold text-white mb-4">Premium Plan Includes:</h4>
                                   <ul className="space-y-3">
                                        {premiumFeatures.map((feature, index) => (
                                            <FeatureListItem key={index}>{feature}</FeatureListItem>
                                        ))}
                                   </ul>
                               </div>
                           </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default PricingPage;