// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import { MenuIcon, XIcon } from './icons';
import { Link } from 'react-router-dom';

interface NavbarProps {}

const Logo: React.FC = () => (
    <div className="flex items-center">
        <div className="bg-white/10 rounded-lg p-2 mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 4.5V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 22V19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M19.5 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 12H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">SAHA AI</h1>
    </div>
);

const Navbar: React.FC<NavbarProps> = () => {
    const [scrolled, setScrolled] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '/#features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' }
    ];

    const NavLinkItem: React.FC<{href: string, name: string, className: string, onClick?: () => void}> = ({ href, name, className, onClick }) => {
        if (href.startsWith('/#')) {
            return <a href={href} className={className} onClick={onClick}>{name}</a>;
        }
        return <Link to={href} className={className} onClick={onClick}>{name}</Link>;
    };

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-black/30 backdrop-blur-lg shadow-lg border-b border-white/10' : 'bg-transparent'}`}>
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link to="/"><Logo /></Link>
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map(link => (
                        <NavLinkItem key={link.name} {...link} className="text-sm font-medium text-gray-300 hover:text-white transition-colors" />
                    ))}
                </nav>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <Link to="/login" className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-colors">
                        Sign In
                    </Link>
                    <Link to="/register" className="hidden sm:block px-4 py-2 text-sm font-bold text-black bg-[#00FFC2] rounded-lg hover:bg-teal-300 transition-colors shadow-[0_0_15px_theme(colors.teal.400/50%)]">
                        Sign Up
                    </Link>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white hover:bg-white/10 rounded-lg md:hidden" aria-label="Toggle menu">
                        {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-4">
                    <nav className="flex flex-col space-y-4">
                        {navLinks.map(link => (
                           <NavLinkItem key={link.name} {...link} className="text-lg font-medium text-gray-200 hover:text-white" onClick={() => setIsMenuOpen(false)} />
                        ))}
                    </nav>
                    <div className="mt-6 border-t border-white/10 pt-4">
                         <Link to="/register" className="w-full mt-4 px-4 py-3 text-base font-bold text-black bg-[#00FFC2] rounded-lg hover:bg-teal-300 transition-colors shadow-[0_0_15px_theme(colors.teal.400/50%)] sm:hidden text-center block">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
