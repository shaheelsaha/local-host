// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import ParticleNetwork from './ParticleNetwork';
// FIX: Corrected import to reflect that Navbar is a default export.
import Navbar from './Navbar';
import Footer from './Footer';

const TeamMemberCard: React.FC<{ name: string; role: string; avatar: string; bio: string }> = ({ name, role, avatar, bio }) => (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
        <img src={avatar} alt={name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700" />
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-[#00FFC2] mb-3">{role}</p>
        <p className="text-sm text-gray-400">{bio}</p>
    </div>
);

const AboutPage: React.FC = () => {
    return (
        <div className="relative bg-[#0D1117] text-gray-200 font-sans overflow-x-hidden">
            <ParticleNetwork />
            <div className="relative z-10">
                <Navbar />
                <main className="pt-24 pb-16">
                    <div className="container mx-auto px-4">
                        <section className="text-center mb-16 md:mb-24">
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 animate-fade-in-down">
                                About <span className="bg-gradient-to-r from-[#00FFC2] to-sky-400 bg-clip-text text-transparent">SAHA AI</span>
                            </h1>
                            <p className="text-lg text-gray-400 max-w-3xl mx-auto animate-fade-in-up delay-100">
                                We're on a mission to revolutionize how businesses engage with their customers on social media.
                            </p>
                        </section>

                        <section className="max-w-4xl mx-auto mb-16 md:mb-24">
                            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                SAHA AI was born from a simple observation: businesses spend too much time on repetitive tasks and not enough time building genuine connections. Lead qualification, follow-ups, and data entry were bogging down sales and marketing teams, preventing them from focusing on what truly matters—closing deals and delighting customers.
                            </p>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                We envisioned a smarter way. By harnessing the power of artificial intelligence, we created a platform that acts as a co-pilot for your social media efforts. SAHA AI automates the mundane, allowing you to scale your engagement, qualify leads with precision, and grow your business faster than ever before.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                                Meet the Creators
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                                <TeamMemberCard
                                    name="Alex Johnson"
                                    role="Co-Founder & CEO"
                                    avatar="https://randomuser.me/api/portraits/men/46.jpg"
                                    bio="A visionary leader with a passion for building products that solve real-world problems."
                                />
                                <TeamMemberCard
                                    name="Maria Garcia"
                                    role="Co-Founder & CTO"
                                    avatar="https://randomuser.me/api/portraits/women/46.jpg"
                                    bio="The brilliant mind behind our AI engine, dedicated to pushing the boundaries of technology."
                                />
                                <TeamMemberCard
                                    name="David Chen"
                                    role="Head of Product"
                                    avatar="https://randomuser.me/api/portraits/men/47.jpg"
                                    bio="Obsessed with user experience and crafting a seamless, intuitive platform for our customers."
                                />
                            </div>
                        </section>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default AboutPage;