// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import ParticleNetwork from './ParticleNetwork';
import Navbar from './Navbar';
import Footer from './Footer';
import { EmailIcon, SpinnerIcon, CheckCircleIcon, TwitterIcon, InstagramIcon, LinkedInIcon, PhoneIcon, LocationIcon } from './icons';

const ContactInfoItem: React.FC<{ icon: React.ReactElement; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 bg-gray-900/50 border border-white/10 rounded-lg p-3 text-[#00FFC2]">
            {/* FIX: Explicitly provide the type for the props in React.cloneElement to resolve a TypeScript inference issue. */}
            {React.cloneElement<{ className?: string }>(icon, { className: 'w-6 h-6' })}
        </div>
        <div className="ml-4">
            <h4 className="text-lg font-semibold text-white">{title}</h4>
            <div className="text-gray-400 mt-1">{children}</div>
        </div>
    </div>
);


const ContactPage: React.FC = () => {
    const [formState, setFormState] = React.useState({ name: '', email: '', message: '' });
    const [submissionStatus, setSubmissionStatus] = React.useState<'idle' | 'submitting' | 'success'>('idle');
    const [error, setError] = React.useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionStatus('submitting');
        setError(null);

        try {
            const response = await fetch('https://n8n.sahaai.online/webhook/support-meg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });

            if (!response.ok) {
                throw new Error('Something went wrong. Please try again.');
            }

            setSubmissionStatus('success');
            setFormState({ name: '', email: '', message: '' }); // Clear form on success
        } catch (err: any) {
            console.error('Failed to send message:', err);
            setError(err.message || 'An unexpected error occurred.');
            setSubmissionStatus('idle'); // Reset to allow another attempt
        }
    };
    
    return (
        <div className="relative bg-[#0D1117] text-gray-200 font-sans overflow-x-hidden">
            <ParticleNetwork />
            <div className="relative z-10">
                <Navbar />
                <main className="pt-24 pb-16">
                    <section className="container mx-auto px-4 py-16">
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center mb-16">
                                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 animate-fade-in-down">
                                    Get In Touch
                                </h1>
                                <p className="text-lg text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-100">
                                    Have a question or want to work together? Drop us a line! We're excited to hear from you.
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-12 items-start">
                                {/* Contact Form */}
                                <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 animate-fade-in-up">
                                    {submissionStatus === 'success' ? (
                                        <div className="flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                                            <CheckCircleIcon className="w-16 h-16 text-[#00FFC2] mb-4"/>
                                            <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                            <p className="text-gray-400">Thanks for reaching out. We'll get back to you as soon as possible.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {error && (
                                                <div className="p-3 text-sm text-red-400 bg-red-500/20 border border-red-500/30 rounded-lg">
                                                    {error}
                                                </div>
                                            )}
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formState.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="e.g. John Smith"
                                                    className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-gray-200 focus:ring-2 focus:ring-[#00FFC2]/50 focus:border-[#00FFC2] outline-none transition duration-300"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formState.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="e.g. example@gmail.com"
                                                    className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-gray-200 focus:ring-2 focus:ring-[#00FFC2]/50 focus:border-[#00FFC2] outline-none transition duration-300"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    rows={5}
                                                    value={formState.message}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Let us know how we can help"
                                                    className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-gray-200 focus:ring-2 focus:ring-[#00FFC2]/50 focus:border-[#00FFC2] outline-none transition duration-300"
                                                ></textarea>
                                            </div>
                                            <div>
                                                <button
                                                    type="submit"
                                                    disabled={submissionStatus === 'submitting'}
                                                    className="w-full flex justify-center items-center px-6 py-3 text-base font-bold text-black bg-[#00FFC2] rounded-lg hover:bg-teal-300 transition-all duration-300 shadow-[0_0_20px_theme(colors.teal.400/50%)] disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                                                >
                                                    {submissionStatus === 'submitting' ? (
                                                        <>
                                                            <SpinnerIcon className="w-5 h-5 mr-3 animate-spin" />
                                                            Sending...
                                                        </>
                                                    ) : 'Send Message'}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-8 animate-fade-in-up delay-100 mt-8 md:mt-0">
                                    <ContactInfoItem icon={<EmailIcon />} title="Email Us">
                                        <a href="mailto:shaheel@sahaai.io" className="hover:text-[#00FFC2] transition-colors">shaheel@sahaai.io</a>
                                        <p className="text-sm text-gray-500">General inquiries & support</p>
                                    </ContactInfoItem>
                                     <ContactInfoItem icon={<PhoneIcon />} title="Call Us">
                                        <a href="tel:+971544575282" className="hover:text-[#00FFC2] transition-colors">+971 54 457 5282</a>
                                    </ContactInfoItem>
                                    
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
                                        <div className="flex space-x-4">
                                            <a href="#" className="p-3 bg-gray-900/50 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                                <TwitterIcon className="w-5 h-5"/>
                                            </a>
                                            <a href="#" className="p-3 bg-gray-900/50 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                                <LinkedInIcon className="w-5 h-5"/>
                                            </a>
                                            <a href="#" className="p-3 bg-gray-900/50 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                                <InstagramIcon className="w-5 h-5"/>
                                            </a>
                                        </div>
                                    </div>
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

export default ContactPage;