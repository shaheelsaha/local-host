// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import firebase from 'firebase/compat/app';
import { PlusIcon, CommandLineIcon, XIcon } from './icons';

interface CommandsProps {
    user: firebase.User;
}

const Commands: React.FC<CommandsProps> = ({ user }) => {
    // State for managing commands would go here in the future
    const [commands, setCommands] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Placeholder for command data
    // const [commandName, setCommandName] = React.useState('');
    // const [systemPrompt, setSystemPrompt] = React.useState('');

    const handleCreateNew = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveCommand = () => {
        // Logic to save to Firebase would go here
        console.log("Saving command...");
        handleCloseModal();
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-3xl font-bold text-gray-800">Commands</h1>
                    <p className="mt-1 text-gray-500">Create and manage custom command prompts for AI-powered actions.</p>
                </div>
                <button 
                    onClick={handleCreateNew}
                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Command
                </button>
            </div>

            {/* Command List / Empty State */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-gray-500 flex flex-col items-center justify-center min-h-[400px]">
                <CommandLineIcon className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">No Commands Created Yet</h2>
                <p className="mt-2 max-w-sm">
                    Get started by creating your first command to automate responses or generate content.
                </p>
                <button
                    onClick={handleCreateNew} 
                    className="mt-6 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                >
                    Create Your First Command
                </button>
            </div>

            {/* Modal for creating/editing */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transition-all duration-300">
                        <header className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Create New Command</h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </header>
                        <div className="p-6 space-y-4">
                            <div>
                                <label htmlFor="commandName" className="block text-sm font-medium text-gray-700 mb-1">Command Name</label>
                                <input 
                                    type="text"
                                    id="commandName"
                                    placeholder="e.g., !summarize"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
                                />
                                <p className="text-xs text-gray-500 mt-1">A unique name for your command, starting with '!' is recommended.</p>
                            </div>
                            <div>
                                <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
                                <textarea 
                                    id="systemPrompt"
                                    rows={6}
                                    placeholder="e.g., You are a helpful assistant. Summarize the provided text in three key bullet points."
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
                                ></textarea>
                                <p className="text-xs text-gray-500 mt-1">Define the task and personality for the AI. This will be the core instruction for the command.</p>
                            </div>
                        </div>
                        <footer className="flex justify-end p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl space-x-2">
                            <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
                            <button onClick={handleSaveCommand} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save Command</button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Commands;
