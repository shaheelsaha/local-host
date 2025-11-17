import * as React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from '../firebaseConfig';
import { Lead, LeadStatus } from '../types';
import { 
    SpinnerIcon, PlusIcon, ClockIcon, TagIcon, XIcon, UserIcon, PhoneIcon, EmailIcon, 
    CurrencyDollarIcon, LocationIcon, BedIcon, BuildingOfficeIcon, TrashIcon, MenuIcon 
} from './icons';

const STAGES: { title: LeadStatus; color: string; bgColor: string; textColor: string; borderColor: string; }[] = [
    { title: 'NEW LEAD', color: 'text-green-600', bgColor: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-500' },
    { title: 'QUALIFYING', color: 'text-purple-600', bgColor: 'bg-purple-100', textColor: 'text-purple-800', borderColor: 'border-purple-500' },
    { title: 'SEND A PROPERTY', color: 'text-blue-600', bgColor: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-500' },
    { title: 'APPOINTMENT BOOKED', color: 'text-indigo-600', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800', borderColor: 'border-indigo-700' },
];

const formatDate = (timestamp: firebase.firestore.Timestamp | undefined) => {
    if (!timestamp) return '...';
    return timestamp.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getInitials = (name: string | null | undefined): string => {
    if (!name) return '??';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const LeadCard: React.FC<{ lead: Lead; onCardClick: (lead: Lead) => void; index: number; stage: typeof STAGES[0] }> = ({ lead, onCardClick, index, stage }) => (
    <div
        draggable
        onDragStart={(e) => {
            e.dataTransfer.setData('leadId', lead.id);
            e.currentTarget.classList.add('dragging-card');
        }}
        onDragEnd={(e) => {
            e.currentTarget.classList.remove('dragging-card');
        }}
        onClick={() => onCardClick(lead)}
        className={`lead-card-enter bg-white p-3.5 rounded-md shadow-sm cursor-pointer border-l-4 ${stage.borderColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
        style={{ animationDelay: `${index * 50}ms` }}
    >
        <div className="flex justify-between items-start">
            <h4 className="font-semibold text-sm text-gray-800 break-words pr-2">{lead.name || 'Unnamed Lead'}</h4>
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-600 font-bold text-xs flex-shrink-0 ml-2">
                {getInitials(lead.name)}
            </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 truncate">{lead.phone || 'No phone number'}</p>
        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1.5" />
                <span>{formatDate(lead.createdAt)}</span>
            </div>
            {lead.budget && (
                <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center font-medium">
                    <TagIcon className="w-3 h-3 mr-1" />
                    <span>${(lead.budget / 1000).toFixed(0)}k</span>
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
    const [isPanelClosing, setIsPanelClosing] = React.useState(false);


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
        e.currentTarget.classList.remove('drag-over-column');
        const leadId = e.dataTransfer.getData('leadId');
        if (!leadId) return;

        const originalStatus = leads.find(l => l.id === leadId)?.status;
        if (originalStatus === newStatus) return;

        // Optimistic UI update
        setLeads(prevLeads => prevLeads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));

        try {
            const leadRef = db.collection('users').doc(user.uid).collection('Leads').doc(leadId);
            await leadRef.update({ status: newStatus });
        } catch (error) {
            console.error("Failed to update lead status:", error);
            // Revert on failure
            setLeads(prevLeads => prevLeads.map(l => l.id === leadId ? { ...l, status: originalStatus! } : l));
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over-column');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('drag-over-column');
    };
    
    const handleAddNewLead = (status: LeadStatus) => {
        openPanel({ status } as Lead);
    };

    const openPanel = (lead: Lead) => {
        setSelectedLead(lead);
        setIsPanelClosing(false);
    };
    
    const closePanel = () => {
        setIsPanelClosing(true);
        setTimeout(() => {
            setSelectedLead(null);
        }, 300); // Animation duration
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-full p-8 bg-slate-100">
                <SpinnerIcon className="w-16 h-16 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-4 md:p-6 bg-slate-100">
            <header className="flex-shrink-0 flex items-center justify-between mb-6">
                 <h1 className="text-2xl font-bold text-gray-800">Leads Board</h1>
            </header>
            <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
                {STAGES.map(stage => {
                    const stageLeads = leads.filter(lead => lead.status === stage.title);
                    return (
                        <div 
                            key={stage.title}
                            onDrop={(e) => handleDrop(e, stage.title)}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`w-80 flex-shrink-0 flex flex-col bg-gray-200/50 rounded-lg shadow-sm border-t-4 ${stage.borderColor} transition-colors duration-300`}
                        >
                            <div className="flex items-center justify-between p-4 flex-shrink-0 border-b border-gray-200 sticky top-0 bg-gray-100 rounded-t-lg z-10">
                                <h3 className={`font-bold text-sm uppercase tracking-wider ${stage.color}`}>{stage.title}</h3>
                                <span className={`text-sm font-bold ${stage.bgColor} ${stage.textColor} rounded-full w-6 h-6 flex items-center justify-center`}>{stageLeads.length}</span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                                {stageLeads.map((lead, index) => (
                                    <LeadCard key={lead.id} lead={lead} onCardClick={openPanel} index={index} stage={stage} />
                                ))}
                            </div>
                             <div className="p-3 mt-auto flex-shrink-0">
                                <button 
                                    onClick={() => handleAddNewLead(stage.title)}
                                    className="w-full text-gray-500 hover:bg-gray-300 hover:text-gray-700 p-2 rounded-lg text-sm flex items-center justify-center transition-colors"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2"/> Add New Lead
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {selectedLead && (
                <LeadDetailPanel 
                    leadId={selectedLead.id}
                    initialStatus={selectedLead.status}
                    user={user} 
                    onClose={closePanel}
                    isClosing={isPanelClosing}
                />
            )}
        </div>
    );
};

const DetailItem: React.FC<{ icon: React.ReactElement; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <div>
        <dt className="text-xs text-gray-500 font-medium flex items-center">
            {React.cloneElement<{ className?: string }>(icon, { className: "w-4 h-4 mr-2" })}
            {label}
        </dt>
        <dd className="mt-1 text-sm text-gray-800">{value || <span className="text-gray-400 italic">Not set</span>}</dd>
    </div>
);

const LeadDetailPanel: React.FC<{ leadId: string | undefined, initialStatus: LeadStatus, user: firebase.User; onClose: () => void; isClosing: boolean; }> = ({ leadId, initialStatus, user, onClose, isClosing }) => {
    const [leadData, setLeadData] = React.useState<Partial<Lead>>({ status: initialStatus });
    const [isEditing, setIsEditing] = React.useState(!leadId);
    const [loading, setLoading] = React.useState(!!leadId);
    const [saving, setSaving] = React.useState(false);
    
    const inputClasses = "w-full bg-gray-100 border border-gray-300 rounded-lg p-2 mt-1 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
    const selectClasses = `${inputClasses} appearance-none`;

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
            delete dataToSave.id;

            if (leadId) {
                 const leadRef = db.collection('users').doc(user.uid).collection('Leads').doc(leadId);
                 await leadRef.update(dataToSave);
            } else {
                 await db.collection('users').doc(user.uid).collection('Leads').add({
                     ...dataToSave,
                     createdAt: firebase.firestore.FieldValue.serverTimestamp()
                 });
                 onClose();
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
        setLeadData(prev => ({...prev, [name]: type === 'number' ? (value === '' ? null : Number(value)) : value }));
    }

    return (
        <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} style={{ animationDuration: '300ms' }} onClick={onClose}>
            <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-200 ${isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'}`} style={{ animationDuration: '300ms' }} onClick={e => e.stopPropagation()}>
                <header className="p-4 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-lg font-bold text-gray-800">Lead Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XIcon className="w-6 h-6"/></button>
                </header>
                {loading ? <div className="flex-1 flex justify-center items-center"><SpinnerIcon className="w-8 h-8 animate-spin text-blue-500" /></div>
                : (
                <div className="flex-1 overflow-y-auto p-6">
                    {isEditing ? (
                        <div className="space-y-4 text-sm text-gray-600">
                            <div><label>Name</label><input type="text" name="name" value={leadData.name || ''} onChange={handleChange} className={inputClasses} /></div>
                            <div><label>Phone</label><input type="text" name="phone" value={leadData.phone || ''} onChange={handleChange} className={inputClasses} /></div>
                            <div><label>Email</label><input type="email" name="email" value={leadData.email || ''} onChange={handleChange} className={inputClasses} /></div>
                            <div><label>Status</label><select name="status" value={leadData.status} onChange={handleChange} className={selectClasses}>{STAGES.map(s => <option key={s.title}>{s.title}</option>)}</select></div>
                            <div><label>Budget</label><input type="number" name="budget" value={leadData.budget || ''} onChange={handleChange} className={inputClasses} /></div>
                            <div><label>Location</label><input type="text" name="Location" value={leadData.Location || ''} onChange={handleChange} className={inputClasses} /></div>
                            <div><label>Bedrooms</label><input type="number" name="bedrooms" value={leadData.bedrooms || ''} onChange={handleChange} className={inputClasses} /></div>
                            <div><label>Intent</label><select name="intent" value={leadData.intent || ''} onChange={handleChange} className={selectClasses}><option value="">Not set</option><option value="buying">Buying</option><option value="renting">Renting</option></select></div>
                            <div><label>Property Type</label><input type="text" name="property_type" value={leadData.property_type || ''} onChange={handleChange} className={inputClasses} /></div>
                            <div><label>Notes</label><textarea name="notes" value={leadData.notes || ''} onChange={handleChange} rows={4} className={inputClasses} /></div>
                        </div>
                    ) : (
                    <dl className="space-y-6">
                        <DetailItem icon={<UserIcon />} label="Name" value={leadData.name} />
                        <DetailItem icon={<PhoneIcon />} label="Phone" value={leadData.phone} />
                        <DetailItem icon={<EmailIcon />} label="Email" value={leadData.email} />
                        <div className="grid grid-cols-2 gap-6">
                            <DetailItem icon={<TagIcon />} label="Status" value={<span className="font-semibold text-gray-900">{leadData.status}</span>} />
                            <DetailItem icon={<CurrencyDollarIcon />} label="Budget" value={leadData.budget ? `$${leadData.budget.toLocaleString()}` : null} />
                            <DetailItem icon={<LocationIcon />} label="Location" value={leadData.Location} />
                            <DetailItem icon={<BedIcon />} label="Bedrooms" value={leadData.bedrooms?.toString()} />
                        </div>
                        <DetailItem icon={<TagIcon />} label="Intent" value={<span className="capitalize">{leadData.intent}</span>} />
                        <DetailItem icon={<BuildingOfficeIcon />} label="Property Type" value={leadData.property_type} />
                        <div>
                             <dt className="text-xs text-gray-500 font-medium">Notes</dt>
                             <dd className="mt-2 text-sm text-gray-700 whitespace-pre-wrap p-3 bg-gray-50 rounded-md border border-gray-200 min-h-[60px]">{leadData.notes || <span className="text-gray-400 italic">No notes added.</span>}</dd>
                        </div>
                    </dl>
                    )}
                </div>
                )}
                <footer className="p-4 flex items-center justify-between border-t border-gray-200 flex-shrink-0 bg-gray-50">
                    <div>
                        {leadId && !isEditing && (
                            <button onClick={handleDelete} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {isEditing ? (
                             <>
                                <button onClick={() => { setIsEditing(false); if (!leadId) onClose(); }} className="px-4 py-2 text-sm rounded-md bg-white hover:bg-gray-100 border border-gray-300 font-semibold text-gray-800">Cancel</button>
                                <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 flex items-center font-semibold">
                                     {saving && <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" />}
                                    Save Changes
                                </button>
                             </>
                        ) : (
                             <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold">Edit Lead</button>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
};


export default LeadsBoard;