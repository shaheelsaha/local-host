





// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
// FIX: Switched to firebase/compat/app to use v8 syntax with v9 SDK and resolve type errors.
// FIX: Use Firebase v8 compat import to resolve type error for `User`.
import firebase from 'firebase/compat/app';
import { db } from '../firebaseConfig';
// FIX: Refactor Firebase calls to v8 compat syntax.
// import { collection, query, where, getDocs, addDoc, updateDoc, doc, limit } from 'firebase/firestore';
import { Persona as PersonaType } from '../types';
import { EditIcon, InfoIcon, ProhibitIcon } from './icons';

interface PersonaProps {
    user: firebase.User;
}

const Persona: React.FC<PersonaProps> = ({ user }) => {
    const [persona, setPersona] = React.useState<Partial<PersonaType>>({ name: '', characteristics: '', avoid: '' });
    const [personaId, setPersonaId] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

    React.useEffect(() => {
        const fetchPersona = async () => {
            try {
                // FIX: Refactor Firebase calls to v8 compat syntax.
                const q = db.collection('personas').where('userId', '==', user.uid).limit(1);
                const querySnapshot = await q.get();
                if (!querySnapshot.empty) {
                    const personaDoc = querySnapshot.docs[0];
                    setPersona(personaDoc.data() as PersonaType);
                    setPersonaId(personaDoc.id);
                }
            } catch (error) {
                console.error("Error fetching persona:", error);
                setMessage({ type: 'error', text: 'Failed to load persona data.' });
            } finally {
                setLoading(false);
            }
        };
        fetchPersona();
    }, [user.uid]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        if (!persona.name || !persona.characteristics) {
             setMessage({ type: 'error', text: 'Persona Name and Characteristics are required.' });
             setSaving(false);
             return;
        }

        try {
            const personaData = {
                userId: user.uid,
                name: persona.name,
                characteristics: persona.characteristics,
                avoid: persona.avoid,
            };

            if (personaId) {
                // Update existing persona
                // FIX: Refactor Firebase calls to v8 compat syntax.
                const personaRef = db.collection('personas').doc(personaId);
                await personaRef.update(personaData);
            } else {
                // Create new persona
                // FIX: Refactor Firebase calls to v8 compat syntax.
                const docRef = await db.collection('personas').add(personaData);
                setPersonaId(docRef.id);
            }
            setMessage({ type: 'success', text: 'AI Persona saved successfully!' });
        } catch (error) {
            console.error("Error saving persona:", error);
            setMessage({ type: 'error', text: 'Failed to save persona.' });
        } finally {
            setSaving(false);
             setTimeout(() => setMessage(null), 5000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPersona(prev => ({ ...prev, [name]: value }));
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
            <h1 className="text-3xl font-bold mb-2 text-gray-900">AI Persona</h1>
            <p className="text-gray-500 mb-6">Define the voice and tone for your AI-generated content to ensure brand consistency.</p>
            
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
                    <div>
                        <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <EditIcon className="w-4 h-4 mr-2 text-gray-400" />
                            Persona Name
                        </label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={persona.name} 
                            onChange={handleChange} 
                            placeholder="e.g., Friendly & Witty Marketer"
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
                        />
                         <p className="text-xs text-gray-500 mt-1">Give your persona a memorable name.</p>
                    </div>

                     <div>
                        <label htmlFor="characteristics" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <InfoIcon className="w-4 h-4 mr-2 text-gray-400" />
                            Core Characteristics & Instructions
                        </label>
                        <textarea 
                            id="characteristics" 
                            name="characteristics"
                            rows={6}
                            value={persona.characteristics} 
                            onChange={handleChange}
                            placeholder="Describe your brand voice. e.g., 'You are a helpful assistant for a coffee brand. Your tone is warm, inviting, and slightly playful. You love using coffee-related puns. Always end with a question to drive engagement.'"
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
                        />
                        <p className="text-xs text-gray-500 mt-1">This is the main instruction for the AI. Be descriptive about the desired tone, style, and personality.</p>
                    </div>

                     <div>
                        <label htmlFor="avoid" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <ProhibitIcon className="w-4 h-4 mr-2 text-gray-400" />
                            Topics or Words to Avoid
                        </label>
                        <textarea 
                            id="avoid"
                            name="avoid"
                            rows={3}
                            value={persona.avoid} 
                            onChange={handleChange}
                            placeholder="e.g., 'Do not use corporate jargon like 'synergy'. Avoid mentioning competitors by name. Don't use more than 2 emojis per post.'"
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
                        />
                         <p className="text-xs text-gray-500 mt-1">Provide negative constraints to guide the AI on what not to do.</p>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg text-white bg-blue-600 font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed">
                            {saving ? 'Saving...' : 'Save Persona'}
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

export default Persona;