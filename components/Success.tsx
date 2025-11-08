// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import { CheckCircleIcon } from './icons';

const Logo: React.FC = () => (
    <div className="flex items-center">
        <div className="bg-zinc-900 rounded-lg p-2 mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 4.5V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 22V19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M19.5 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 12H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-800">SAHA AI</h1>
    </div>
);


const SuccessPage: React.FC = () => {
  React.useEffect(() => {
    // Close the window after a short delay
    const timer = setTimeout(() => {
      window.close();
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
            <Logo />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-800 mt-5">Connection Successful!</h1>
          <p className="text-gray-500 mt-2">
            Your account is now linked. This window will close automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;