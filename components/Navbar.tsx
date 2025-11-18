// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
    import * as React from 'react';
    import { MenuIcon, XIcon } from './icons';
    import { Link } from 'react-router-dom';

    interface NavbarProps {}

    const Logo: React.FC = () => (
        <div className="flex items-center">
            <img src="https://res.cloudinary.com/ddeaazrgb/image/upload/v1763392782/logo.png" alt="SAHA AI Logo" className="h-20 w-auto mr-3" />
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">SAHA AI</h1>
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
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-800' : 'bg-transparent'}`}>
                <div className="container mx-auto flex justify-between items-center p-4">
                    <Link to="/"><Logo /></Link>
                    <nav className="hidden md:flex items-center space-x-6">
                        {navLinks.map(link => (
                            <NavLinkItem key={link.name} {...link} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" />
                        ))}
                    </nav>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="hidden sm:block px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30 dark:shadow-[0_0_15px_theme(colors.blue.500/50%)]">
                            Sign Up
                        </Link>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg md:hidden" aria-label="Toggle menu">
                            {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                <div className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="p-4">
                        <nav className="flex flex-col space-y-4">
                            {navLinks.map(link => (
                            <NavLinkItem key={link.name} {...link} className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white" onClick={() => setIsMenuOpen(false)} />
                            ))}
                        </nav>
                        <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
                            <Link to="/register" className="w-full mt-4 px-4 py-3 text-base font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30 dark:shadow-[0_0_15px_theme(colors.blue.500/50%)] sm:hidden text-center block">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        );
    };

    export default Navbar;