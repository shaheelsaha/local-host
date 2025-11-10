// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import { Link } from 'react-router-dom';

const CookieConsentBanner: React.FC = () => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (consent !== 'true') {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0D1117] text-white p-4 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-in-out transform translate-y-0">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-300 text-center md:text-left">
                    This website uses cookies. We use cookies to make sure you get the best experience on our website. Please read our{' '}
                    <Link to="/privacy" className="underline hover:text-[#00FFC2]">privacy</Link> and{' '}
                    <Link to="/cookies" className="underline hover:text-[#00FFC2]">cookie policy</Link>.
                </p>
                <div className="flex-shrink-0 flex items-center gap-3 w-full sm:w-auto">
                    <button 
                        onClick={handleAccept}
                        className="flex-1 px-4 py-2.5 bg-white text-black font-semibold rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                        YES, I ACCEPT COOKIES
                    </button>
                    <Link 
                        to="/cookies"
                        className="flex-1 px-4 py-2.5 border border-gray-500 text-white font-semibold rounded-lg text-sm hover:bg-white/10 transition-colors text-center"
                    >
                        NO, I WANT MORE INFO
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CookieConsentBanner;
