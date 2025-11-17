
// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';

const Logo: React.FC = () => (
    <div className="flex items-center">
        <img src="https://res.cloudinary.com/ddeaazrgb/image/upload/v1763392782/logo.png" alt="Logo" className="h-20 w-auto mr-3" />
        <h1 className="text-xl font-semibold tracking-tight text-gray-800">SAHA AI</h1>
    </div>
);

const LegalPageLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <style>{`
                .legal-content h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    border-bottom: 1px solid #e5e7eb;
                    padding-bottom: 0.5rem;
                }
                .legal-content p {
                    line-height: 1.75;
                    margin-bottom: 1.25rem;
                    color: #4b5563;
                }
                .legal-content ul {
                    list-style-type: disc;
                    padding-left: 2rem;
                    margin-bottom: 1.25rem;
                    color: #4b5563;
                }
                 .legal-content li {
                    margin-bottom: 0.5rem;
                }
            `}</style>
            <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/75 sticky top-0 z-30">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <a href="/"><Logo /></a>
                    <a href="/" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        Back to Home
                    </a>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-gray-200">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">{title}</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div className="legal-content">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LegalPageLayout;
