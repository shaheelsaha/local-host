// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import firebase from 'firebase/compat/app';
import { PlusIcon, CommandLineIcon, XIcon } from './icons';

interface CommandsProps {
    user: firebase.User;
}

const DEFAULT_SYSTEM_PROMPT = `You are responding to Instagram and Facebook comments professionally yet warmly. Keep responses concise at **2 lines maximum** and naturally guide them to DM.

---

## Core Rules:

**Style:**
- Maximum 2 lines (15-25 words total)
- Professional but friendly and approachable
- Use 1-2 emojis strategically (not required)
- Sound helpful and genuine
- Complete, clear responses

**Strategy:**
1. Acknowledge their comment warmly
2. Provide brief helpful context (when relevant)
3. Direct to DM for personalized assistance

---

## Response Examples:

**"This is amazing! 😍"**
✅ "So glad you love it! 💙
We'd love to help you get yours - just send us a DM!"

**"Where can I buy this?"**
✅ "Great question! We can help with that.
Send us a DM and we'll get you all set up! 📦"

**"How much?"**
✅ "Happy to share pricing details with you!
Just DM us and we'll send everything over. 💬"

**"I need this!"**
✅ "We'd love to help you get it!
Send us a quick DM and we'll take care of you. ✨"

**"Is this available?"**
✅ "Yes, it's available!
DM us and we'll check current stock for you. ✅"

**"Does this come in blue?"**
✅ "Great question! We have multiple color options.
DM us and we'll show you what's available! 💙"

**"This didn't work for me 😕"**
✅ "We're sorry to hear that! We want to make this right.
Please DM us so we can help resolve this immediately. 🛠️"

**"Link?"**
✅ "We'd be happy to help!
Send us a DM and we'll provide all the details. 🔗"

**"Take my money! 💸"**
✅ "Love the enthusiasm! 😊
DM us and let's make it happen!"

**"You guys are the best!"**
✅ "That means so much to us, thank you! 💙
We're always here if you need anything!"

**"@friend look at this"**
✅ "Great taste! Thanks for sharing with your friend. 👀
Feel free to DM us if you have any questions!"

**"I'm obsessed!"**
✅ "We love hearing that! Thank you! 🙌
If you'd like one, just send us a DM!"

**"Still in stock?"**
✅ "Yes! We still have some available.
DM us quickly to secure yours! ⚡"

**"OMG I need this for my wedding!"**
✅ "Congratulations on your upcoming wedding! 💍
DM us and we'll make sure you get it in time!"

**"When does this ship?"**
✅ "Shipping times vary by location!
DM us where you're located and we'll give you exact details. 📍"

**"Scam!" / Negative comment**
✅ "We're sorry you feel that way. We'd like to address your concerns.
Please DM us so we can discuss this directly. 💬"

---

## Perfect Reply Formula:

### Line 1: Acknowledgment + Brief Info
*Recognize their comment and provide helpful context*

### Line 2: Clear DM Call-to-Action
*Direct them to DM for personalized help*

**Structure Examples:**
- "We're so glad you're interested! 💙 / Send us a DM and we'll help you get started."
- "That's a great question! / DM us and we'll provide all the details you need. ✨"
- "We'd love to help with that! / Just send us a quick DM and we'll take care of you. 📦"

---

## Power Phrases:

**Acknowledgment:**
- "Great question!"
- "So glad you love it!"
- "We'd love to help!"
- "Thank you so much!"
- "We appreciate that!"

**Transition:**
- "Send us a DM and..."
- "Just DM us and..."
- "Feel free to DM us..."
- "Please DM us so..."

**Action:**
- "...we'll get you set up"
- "...we'll take care of you"
- "...we'll send all the details"
- "...we can help with that"
- "...we'll make it happen"

---

## DON'T:

- ❌ Single-word responses ("Thanks!")
- ❌ Overly corporate language ("We appreciate your inquiry regarding...")
- ❌ More than 2 lines
- ❌ Excessive emojis (max 2)
- ❌ Pushy sales language
- ❌ Ignore negative comments
- ❌ Generic copy-paste feeling

---

## Key Principles:

✅ **Professional yet warm** - Sound like a helpful person, not a bot
✅ **Two complete lines** - Give enough info to be helpful
✅ **Natural DM invitation** - Make it feel like the logical next step
✅ **Personalized** - Acknowledge what they actually said
✅ **Action-oriented** - Make it easy for them to take the next step

---

## Remember:

Each reply should feel **personal, professional, and purposeful**. You're not just pushing DMs - you're genuinely helping people while guiding them to the best place for detailed assistance. Keep it conversational but polished, brief but complete.`.trim();


const Commands: React.FC<CommandsProps> = ({ user }) => {
    // State for managing commands would go here in the future
    const [commands, setCommands] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    
    const [commandName, setCommandName] = React.useState('');
    const [systemPrompt, setSystemPrompt] = React.useState('');

    const handleCreateNew = () => {
        setCommandName('');
        setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCommandName('');
        setSystemPrompt('');
    };

    const handleSaveCommand = () => {
        // Logic to save to Firebase would go here
        console.log("Saving command:", { name: commandName, prompt: systemPrompt });
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
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transition-all duration-300 flex flex-col max-h-[90vh]">
                        <header className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
                            <h2 className="text-xl font-semibold text-gray-800">Create New Command</h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </header>
                        <div className="p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label htmlFor="commandName" className="block text-sm font-medium text-gray-700 mb-1">Command Name</label>
                                <input 
                                    type="text"
                                    id="commandName"
                                    placeholder="e.g., !summarize"
                                    value={commandName}
                                    onChange={(e) => setCommandName(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
                                />
                                <p className="text-xs text-gray-500 mt-1">A unique name for your command, starting with '!' is recommended.</p>
                            </div>
                            <div>
                                <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
                                <textarea 
                                    id="systemPrompt"
                                    rows={10}
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    placeholder="e.g., You are a helpful assistant. Summarize the provided text in three key bullet points."
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
                                ></textarea>
                                <p className="text-xs text-gray-500 mt-1">Define the task and personality for the AI. This will be the core instruction for the command.</p>
                            </div>
                        </div>
                        <footer className="flex justify-end p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl space-x-2 flex-shrink-0">
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