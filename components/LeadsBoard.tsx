import * as React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from '../firebaseConfig';
import { Lead, LeadStatus } from '../types';
import { 
    SpinnerIcon, PlusIcon, ClockIcon, TagIcon, XIcon, UserIcon, PhoneIcon, EmailIcon, 
    CurrencyDollarIcon, LocationIcon, BedIcon, BuildingOfficeIcon, TrashIcon, MenuIcon 
} from './icons';

const STAGES: { title: LeadStatus; color: string }[] = [
    { title: 'NEW LEAD', color: 'bg-green-500' },
    { title: 'QUALIFYING', color: 'bg-purple-500' },
    { title: 'SEND A PROPERTY', color: 'bg-blue-500' },
    { title: 'APPOINTMENT BOOKED', color: 'bg-indigo-700' },
];

const formatDate = (timestamp: firebase.firestore.Timestamp | undefined) => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const LeadCard: React.FC<{ lead: Lead, onCardClick: (lead: Lead) => void }> = ({ lead, onCardClick }) => (
    <div
        draggable
        onDragStart={(e) => {
            e.dataTransfer.setData('leadId', lead.id);
        }}
        onClick={() => onCardClick(lead)}
        className="bg-zinc-800 p-4 rounded-lg shadow-md cursor-pointer border border-zinc-700 hover:border-blue-500 transition-colors"
    >
        <div className="flex justify-between items-start">
            <h4 className="font-bold text-sm text-gray-200 break-words">Name: {lead.name || 'Unnamed Lead'}</h4>
            <button className="text-gray-500 hover:text-white">
                <MenuIcon className="w-4 h-4" />
            </button>
        </div>
        <div className="mt-4 flex flex-col space-y-2 text-xs text-gray-400">
            <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-2" />
                <span>Started {formatDate(lead.createdAt)}</span>
            </div>
            {lead.phone && (
                 <div className="flex items-center">
                     <div className="bg-yellow-900/50 text-yellow-300 px-2 py-0.5 rounded-full flex items-center">
                        <TagIcon className="w-3 h-3 mr-1" />
                        <span>{lead.phone}</span>
                     </div>
                 </div>
            )}
        </div>
    </div>
);

interface LeadsBoardProps {
    user: firebase.User;
}

const LeadsBoard: React.FC<LeadsBoardProps> = ({ user }) => {
    const [leads, setLeads] = React.useState<Lead[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);

    React.useEffect(() => {
        setLoading(true);
        const leadsRef = db.collection('users').doc(user.uid).collection('Leads');
        const unsubscribe = leadsRef.onSnapshot(snapshot => {
            const leadsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Lead[];
            setLeads(leadsData);
            setLoading(false);
        }, error => {
            console.error("Error fetching leads:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user.uid]);

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: LeadStatus) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-zinc-700/50');
        const leadId = e.dataTransfer.getData('leadId');
        if (!leadId) return;

        try {
            const leadRef = db.collection('users').doc(user.uid).collection('Leads').doc(leadId);
            await leadRef.update({ status: newStatus });
        } catch (error) {
            console.error("Failed to update lead status:", error);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-zinc-700/50');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('bg-zinc-700/50');
    };
    
    const handleAddNewLead = (status: LeadStatus) => {
        setSelectedLead({ status } as Lead); // Open with a new lead object with pre-filled status
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-full p-8">
                <SpinnerIcon className="w-16 h-16 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-4 text-white">
            <header className="flex-shrink-0 flex items-center justify-between mb-4">
                 <h1 className="text-2xl font-bold">Board</h1>
                 {/* Placeholder for future view controls */}
                 <div className="flex items-center space-x-2">
                    {/* <button>List</button>
                    <button>View</button> */}
                 </div>
            </header>
            <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
                {STAGES.map(stage => {
                    const stageLeads = leads.filter(lead => lead.status === stage.title);
                    return (
                        <div 
                            key={stage.title}
                            onDrop={(e) => handleDrop(e, stage.title)}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className="w-72 flex-shrink-0 flex flex-col bg-zinc-900 rounded-lg transition-colors duration-200"
                        >
                            <div className="flex items-center justify-between p-3 flex-shrink-0">
                                <div className="flex items-center">
                                    <span className={`w-3 h-3 rounded-full mr-2 ${stage.color}`}></span>
                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400">{stage.title}</h3>
                                    <span className="ml-2 text-xs bg-zinc-700 text-gray-300 rounded-full px-2 py-0.5">{stageLeads.length}</span>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                                {stageLeads.map(lead => (
                                    <LeadCard key={lead.id} lead={lead} onCardClick={setSelectedLead} />
                                ))}
                            </div>
                             <div className="p-3 mt-auto">
                                <button 
                                    onClick={() => handleAddNewLead(stage.title)}
                                    className="w-full text-gray-400 hover:bg-zinc-800 hover:text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors"
                                >
                                    <PlusIcon className="w-4 h-4 mr-1"/> Add Task
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {selectedLead && (
                <LeadDetailPanel 
                    leadId={selectedLead.id} // Pass id to fetch fresh data
                    initialStatus={selectedLead.status}
                    user={user} 
                    onClose={() => setSelectedLead(null)} 
                />
            )}
        </div>
    );
};

const DetailItem: React.FC<{ icon: React.ReactElement; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <div>
        <dt className="text-xs text-gray-500 font-medium flex items-center">
            {/* FIX: Explicitly provide the type for the props in React.cloneElement to resolve a TypeScript inference issue where 'className' was not recognized on the icon prop. */}
            {React.cloneElement<{ className?: string }>(icon, { className: "w-4 h-4 mr-2" })}
            {label}
        </dt>
        <dd className="mt-1 text-sm text-gray-200">{value || <span className="text-gray-500 italic">Not set</span>}</dd>
    </div>
);

const LeadDetailPanel: React.FC<{ leadId: string | undefined, initialStatus: LeadStatus, user: firebase.User; onClose: () => void; }> = ({ leadId, initialStatus, user, onClose }) => {
    const [leadData, setLeadData] = React.useState<Partial<Lead>>({ status: initialStatus });
    const [isEditing, setIsEditing] = React.useState(!leadId); // Start in edit mode for new leads
    const [loading, setLoading] = React.useState(!!leadId);
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        if (!leadId) {
            setLoading(false);
            return;
        }
        const leadRef = db.collection('users').doc(user.uid).collection('Leads').doc(leadId);
        const unsubscribe = leadRef.onSnapshot(doc => {
            if (doc.exists) {
                setLeadData({ id: doc.id, ...doc.data() } as Lead);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [leadId, user.uid]);
    
    const handleSave = async () => {
        setSaving(true);
        try {
            const dataToSave = { ...leadData, userId: user.uid };
            delete dataToSave.id; // Don't save id field in document

            if (leadId) {
                 const leadRef = db.collection('users').doc(user.uid).collection('Leads').doc(leadId);
                 await leadRef.update(dataToSave);
            } else {
                 await db.collection('users').doc(user.uid).collection('Leads').add({
                     ...dataToSave,
                     createdAt: firebase.firestore.FieldValue.serverTimestamp()
                 });
                 onClose(); // Close after creating
            }
            setIsEditing(false);
        } catch(err) {
            console.error("Error saving lead:", err);
            alert("Failed to save lead details.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (leadId && window.confirm("Are you sure you want to delete this lead?")) {
            try {
                await db.collection('users').doc(user.uid).collection('Leads').doc(leadId).delete();
                onClose();
            } catch (err) {
                console.error("Error deleting lead:", err);
                alert("Failed to delete lead.");
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setLeadData(prev => ({...prev, [name]: type === 'number' ? Number(value) : value }));
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}>
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-900 shadow-2xl flex flex-col border-l border-zinc-700" onClick={e => e.stopPropagation()}>
                <header className="p-4 flex items-center justify-between border-b border-zinc-700 flex-shrink-0">
                    <h2 className="text-lg font-bold text-white">Lead Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon className="w-6 h-6"/></button>
                </header>
                {loading ? <div className="flex-1 flex justify-center items-center"><SpinnerIcon className="w-8 h-8 animate-spin text-blue-500" /></div>
                : (
                <div className="flex-1 overflow-y-auto p-6">
                    {isEditing ? (
                        <div className="space-y-4 text-sm">
                            <div><label>Name</label><input type="text" name="name" value={leadData.name || ''} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mt-1" /></div>
                            <div><label>Phone</label><input type="text" name="phone" value={leadData.phone || ''} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mt-1" /></div>
                            <div><label>Email</label><input type="email" name="email" value={leadData.email || ''} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mt-1" /></div>
                            <div><label>Status</label><select name="status" value={leadData.status} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mt-1 appearance-none"><option>NEW LEAD</option><option>QUALIFYING</option><option>SEND A PROPERTY</option><option>APPOINTMENT BOOKED</option></select></div>
                            <div><label>Budget</label><input type="number" name="budget" value={leadData.budget || ''} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mt-1" /></div>
                            <div><label>Location</label><input type="text" name="Location" value={leadData.Location || ''} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mt-1" /></div>
                            <div><label>Bedrooms</label><input type="number" name="bedrooms" value={leadData.bedrooms || ''} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mt-1" /></div>
                            <div><label>Intent</label><select name="intent" value={leadData.intent || ''} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mt-1 appearance-none"><option value="">Not set</option><option value="buying">Buying</option><option value="renting">Renting</option></select></div>
                            <div><label>Property Type</label><input type="text" name="property_type" value={leadData.property_type || ''} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mt-1" /></div>
                            <div><label>Notes</label><textarea name="notes" value={leadData.notes || ''} onChange={handleChange} rows={4} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mt-1" /></div>
                        </div>
                    ) : (
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                        <DetailItem icon={<UserIcon />} label="Name" value={leadData.name} />
                        <DetailItem icon={<PhoneIcon />} label="Phone" value={leadData.phone} />
                        <div className="col-span-2"><DetailItem icon={<EmailIcon />} label="Email" value={leadData.email} /></div>
                        <DetailItem icon={<TagIcon />} label="Status" value={<span className="font-semibold">{leadData.status}</span>} />
                        <DetailItem icon={<CurrencyDollarIcon />} label="Budget" value={leadData.budget ? `$${leadData.budget.toLocaleString()}` : null} />
                        <DetailItem icon={<LocationIcon />} label="Location" value={leadData.Location} />
                        <DetailItem icon={<BedIcon />} label="Bedrooms" value={leadData.bedrooms?.toString()} />
                        <DetailItem icon={<TagIcon />} label="Intent" value={<span className="capitalize">{leadData.intent}</span>} />
                        <DetailItem icon={<BuildingOfficeIcon />} label="Property Type" value={leadData.property_type} />
                        <div className="col-span-2">
                             <dt className="text-xs text-gray-500 font-medium">Notes</dt>
                             <dd className="mt-1 text-sm text-gray-300 whitespace-pre-wrap">{leadData.notes || <span className="text-gray-500 italic">No notes added.</span>}</dd>
                        </div>
                    </dl>
                    )}
                </div>
                )}
                <footer className="p-4 flex items-center justify-between border-t border-zinc-700 flex-shrink-0">
                    <div>
                        {leadId && (
                            <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {isEditing ? (
                             <>
                                <button onClick={() => { setIsEditing(false); if (!leadId) onClose(); }} className="px-4 py-2 text-sm rounded-md bg-zinc-700 hover:bg-zinc-600">Cancel</button>
                                <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 flex items-center">
                                     {saving && <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" />}
                                    Save Changes
                                </button>
                             </>
                        ) : (
                             <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm rounded-md bg-zinc-700 hover:bg-zinc-600">Edit Lead</button>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
};


export default LeadsBoard;