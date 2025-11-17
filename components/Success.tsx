
// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import { CheckCircleIcon } from './icons';

const Logo: React.FC = () => (
    <div className="flex items-center">
        <img src="https://res.cloudinary.com/ddeaazrgb/image/upload/v1763392782/logo.png" alt="SAHA AI Logo" className="h-20 w-auto mr-3" />
        <h1 className="text-xl font-semibold tracking-tight text-gray-800">SAHA AI</h1>
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
