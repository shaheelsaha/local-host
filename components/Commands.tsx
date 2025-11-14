





// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
// FIX: Switched to firebase/compat/app to use v8 syntax with v9 SDK and resolve type errors.
// FIX: Use Firebase v8 compat import to resolve type error for `User`.
import firebase from 'firebase/compat/app';
import { db } from '../firebaseConfig';
import { CommandLineIcon } from './icons';

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
    const [systemPrompt, setSystemPrompt] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

    React.useEffect(() => {
        const fetchCommand = async () => {
            try {
                const connectionRef = db.collection('users').doc(user.uid).collection('connection').doc('connection');
                const docSnap = await connectionRef.get();
                if (docSnap.exists && docSnap.data()?.command_prompt) {
                    setSystemPrompt(docSnap.data()!.command_prompt);
                } else {
                    // If no command is found, set the default prompt
                    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
                }
            } catch (error) {
                console.error("Error fetching command prompt:", error);
                setMessage({ type: 'error', text: 'Failed to load command prompt data.' });
                // Still provide default prompt on error
                setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
            } finally {
                setLoading(false);
            }
        };
        fetchCommand();
    }, [user.uid]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        if (!systemPrompt) {
             setMessage({ type: 'error', text: 'System Prompt is required.' });
             setSaving(false);
             return;
        }

        try {
            const connectionRef = db.collection('users').doc(user.uid).collection('connection').doc('connection');
            await connectionRef.set({ command_prompt: systemPrompt }, { merge: true });

            setMessage({ type: 'success', text: 'Command prompt saved successfully!' });
        } catch (error) {
            console.error("Error saving command prompt:", error);
            setMessage({ type: 'error', text: 'Failed to save command prompt.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Commands</h1>
            <p className="text-gray-500 mb-6">Create and manage a custom command prompt for AI-powered actions. This command will be used for auto-commenting.</p>
            
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
                     <div>
                        <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700 mb-1">
                            System Prompt
                        </label>
                        <textarea 
                            id="systemPrompt" 
                            name="systemPrompt"
                            rows={20}
                            value={systemPrompt} 
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            placeholder="Describe the task and personality for the AI..."
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition font-mono text-xs leading-relaxed"
                        />
                        <p className="text-xs text-gray-500 mt-1">This is the main instruction for the AI. You can edit or replace this default prompt.</p>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg text-white bg-blue-600 font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed">
                            {saving ? 'Saving...' : 'Save Command'}
                        </button>
                    </div>

                    {message && (
                        <div className={`mt-4 p-4 border rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                           {message.text}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Commands;