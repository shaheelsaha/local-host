// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';

const Footer: React.FC = () => (
    <footer className="py-10 border-t border-white/10">
        <div className="container mx-auto px-4 text-gray-400">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
                <div className="col-span-2 sm:col-span-3 md:col-span-2">
                    <div className="flex items-center">
                        <div className="bg-white/10 rounded-lg p-2 mr-3"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white"><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/><path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" stroke="currentColor" strokeWidth="1.5"/><path d="M12 4.5V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 22V19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M19.5 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 12H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
                        <h1 className="text-xl font-bold tracking-tight text-white">SAHA AI</h1>
                    </div>
                </div>
                <div>
                    <h5 className="font-bold text-white mb-3">Product</h5>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/#features" className="hover:text-white">Features</a></li>
                        <li><a href="/#pricing" className="hover:text-white">Pricing</a></li>
                        <li><a href="#" className="hover:text-white">Roadmap</a></li>
                    </ul>
                </div>
                    <div>
                    <h5 className="font-bold text-white mb-3">Company</h5>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/about" className="hover:text-white">About</a></li>
                        <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
                        <li><a href="#" className="hover:text-white">Blog</a></li>
                        <li><a href="#" className="hover:text-white">Careers</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold text-white mb-3">Support</h5>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white">Help Center</a></li>
                        <li><a href="#" className="hover:text-white">Documentation</a></li>
                        <li><a href="#" className="hover:text-white">Status Page</a></li>
                    </ul>
                </div>
                    <div>
                    <h5 className="font-bold text-white mb-3">Social</h5>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white">Instagram</a></li>
                        <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                        <li><a href="#" className="hover:text-white">YouTube</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-sm">
                <p className="text-gray-500">&copy; {new Date().getFullYear()} SAHA AI. All Rights Reserved.</p>
                <div className="flex space-x-6 mt-4 sm:mt-0">
                    <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                    <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                    <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;