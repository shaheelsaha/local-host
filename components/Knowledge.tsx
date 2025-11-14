// FIX: Switched to firebase/compat/app to use v8 syntax with v9 SDK and resolve type errors.
import * as React from 'react';
// FIX: Use Firebase v8 compat imports to resolve type errors for `User` and `firestore`.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from '../firebaseConfig';
import { Property, PropertyType, PropertyStatus, PropertyPlan } from '../types';
import { PlusIcon, FilterIcon, SearchIcon, EditIcon, TrashIcon, XIcon, SpinnerIcon, BuildingOfficeIcon, TagIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

const PROPERTY_TYPES: PropertyType[] = ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Duplex'];
const PROPERTY_STATUSES: PropertyStatus[] = ['For Sale', 'For Rent', 'Sold', 'Rented'];
const PROPERTY_PLANS: PropertyPlan[] = ['Studio', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'];

interface KnowledgeProps {
    user: firebase.User;
}

const Knowledge: React.FC<KnowledgeProps> = ({ user }) => {
    const [properties, setProperties] = React.useState<Property[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingProperty, setEditingProperty] = React.useState<Property | null>(null);
    const [filters, setFilters] = React.useState({ search: '', status: '', type: '', plan: '' });
    const [currentPage, setCurrentPage] = React.useState(1);
    const propertiesPerPage = 10;

    React.useEffect(() => {
        const propertiesRef = db.collection('users').doc(user.uid).collection('property_details');
        const q = propertiesRef.orderBy('createdAt', 'desc');

        const unsubscribe = q.onSnapshot(querySnapshot => {
            const propsData: Property[] = [];
            querySnapshot.forEach(doc => {
                propsData.push({ id: doc.id, ...doc.data() } as Property);
            });
            setProperties(propsData);
            setLoading(false);
        }, error => {
            console.error("Error fetching properties:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user.uid]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilters({ search: '', status: '', type: '', plan: '' });
        setCurrentPage(1);
    };

    const filteredProperties = React.useMemo(() => {
        return properties.filter(p => {
            const searchLower = filters.search.toLowerCase();
            return (
                (p.title.toLowerCase().includes(searchLower) || p.location.toLowerCase().includes(searchLower)) &&
                (filters.status ? p.status === filters.status : true) &&
                (filters.type ? p.propertyType === filters.type : true) &&
                (filters.plan ? p.plan === filters.plan : true)
            );
        });
    }, [properties, filters]);

    const paginatedProperties = React.useMemo(() => {
        const startIndex = (currentPage - 1) * propertiesPerPage;
        return filteredProperties.slice(startIndex, startIndex + propertiesPerPage);
    }, [filteredProperties, currentPage]);

    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

    const handleAddProperty = () => {
        setEditingProperty(null);
        setIsModalOpen(true);
    };

    const handleEditProperty = (property: Property) => {
        setEditingProperty(property);
        setIsModalOpen(true);
    };
    
    const handleDeleteProperty = async (propertyId: string) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            await db.collection('users').doc(user.uid).collection('property_details').doc(propertyId).delete();
        }
    };

    const handleStatusChange = async (propertyId: string, newStatus: PropertyStatus) => {
        const propertyRef = db.collection('users').doc(user.uid).collection('property_details').doc(propertyId);
        await propertyRef.update({ status: newStatus });
    };

    return (
        <div className="p-4 md:p-8 h-full flex flex-col">
            <header className="flex-shrink-0 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Knowledge</h1>
                <p className="mt-1 text-gray-500">Your smart data center for managing property information in real-time.</p>
            </header>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex-shrink-0">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="w-full md:w-auto flex-1 relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search by title or location..."
                            className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
                        <select name="status" value={filters.status} onChange={handleFilterChange} className="bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500">
                            <option value="">All Statuses</option>
                            {PROPERTY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                         <select name="type" value={filters.type} onChange={handleFilterChange} className="bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500">
                            <option value="">All Types</option>
                            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <select name="plan" value={filters.plan} onChange={handleFilterChange} className="bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500">
                            <option value="">All Plans</option>
                            {PROPERTY_PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <button onClick={resetFilters} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border">Reset</button>
                    </div>
                    <button onClick={handleAddProperty} className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Property
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white border border-gray-200 rounded-xl shadow-sm">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Property</th>
                            <th scope="col" className="px-6 py-3">Price</th>
                            <th scope="col" className="px-6 py-3">Type & Plan</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Added On</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="text-center p-8"><SpinnerIcon className="w-8 h-8 mx-auto animate-spin text-blue-600" /></td></tr>
                        ) : paginatedProperties.length > 0 ? (
                            paginatedProperties.map(prop => (
                                <tr key={prop.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="font-bold">{prop.title}</div>
                                        <div className="text-xs text-gray-500">{prop.location}</div>
                                    </td>
                                    <td className="px-6 py-4">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(prop.price)}</td>
                                    <td className="px-6 py-4">{prop.propertyType} / {prop.plan}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={prop.status}
                                            onChange={(e) => handleStatusChange(prop.id, e.target.value as PropertyStatus)}
                                            className="text-xs font-semibold p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {PROPERTY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">{prop.createdAt.toDate().toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button onClick={() => handleEditProperty(prop)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md"><EditIcon className="w-4 h-4"/></button>
                                            <button onClick={() => handleDeleteProperty(prop.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md"><TrashIcon className="w-4 h-4"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={6} className="text-center p-8 text-gray-500">No properties found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 text-sm">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-md disabled:opacity-50 flex items-center"><ChevronLeftIcon className="w-4 h-4 mr-1"/> Previous</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md disabled:opacity-50 flex items-center">Next <ChevronRightIcon className="w-4 h-4 ml-1"/></button>
                </div>
            )}

            <PropertyEditorModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={user}
                property={editingProperty}
            />
        </div>
    );
};

interface PropertyEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: firebase.User;
    property: Property | null;
}

const PropertyEditorModal: React.FC<PropertyEditorModalProps> = ({ isOpen, onClose, user, property }) => {
    const [formData, setFormData] = React.useState<Partial<Property>>({});
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        if (property) {
            setFormData(property);
        } else {
            setFormData({
                title: '',
                location: '',
                price: 0,
                bedrooms: 1,
                bathrooms: 1,
                area: 0,
                propertyType: 'Apartment',
                status: 'For Sale',
                plan: '1 BHK',
            });
        }
    }, [property, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (property) {
                // Update an existing property
                const { id, userId, createdAt, ...updateData } = { ...formData } as Property;
                await db.collection('users').doc(user.uid).collection('property_details').doc(property.id).update(updateData);
            } else {
                // Add a new property
                // Explicitly build the object to ensure type safety and prevent extra fields
                const dataToSave = {
                    title: formData.title || '',
                    location: formData.location || '',
                    price: Number(formData.price) || 0,
                    bedrooms: Number(formData.bedrooms) || 0,
                    bathrooms: Number(formData.bathrooms) || 0,
                    area: Number(formData.area) || 0,
                    propertyType: formData.propertyType || 'Apartment',
                    status: formData.status || 'For Sale',
                    plan: formData.plan || 'Studio',
                    userId: user.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                };
                await db.collection('users').doc(user.uid).collection('property_details').add(dataToSave);
            }
            onClose();
        } catch (error) {
            console.error("Error saving property:", error);
            alert("Failed to save property. See console for details.");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-5 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">{property ? 'Edit Property' : 'Add New Property'}</h2>
                    <button onClick={onClose}><XIcon className="w-6 h-6 text-gray-400 hover:text-gray-700"/></button>
                </header>
                <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium">Title</label>
                        <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Location</label>
                        <input type="text" name="location" value={formData.location || ''} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium">Price (USD)</label>
                            <input type="number" name="price" value={formData.price ?? 0} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Area (sqft)</label>
                            <input type="number" name="area" value={formData.area ?? 0} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                                {PROPERTY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="text-sm font-medium">Property Type</label>
                            <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Plan</label>
                            <select name="plan" value={formData.plan} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                                {PROPERTY_PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Bedrooms</label>
                            <input type="number" name="bedrooms" value={formData.bedrooms ?? 1} onChange={handleChange} required min="0" className="w-full mt-1 p-2 border rounded-md"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Bathrooms</label>
                            <input type="number" name="bathrooms" value={formData.bathrooms ?? 1} onChange={handleChange} required min="0" className="w-full mt-1 p-2 border rounded-md"/>
                        </div>
                    </div>
                </form>
                <footer className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border bg-white hover:bg-gray-100">Cancel</button>
                    <button type="button" onClick={(e) => { if(e.currentTarget.form) { e.currentTarget.form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })) } handleSave(e); }} disabled={saving} className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 flex items-center">
                        {saving && <SpinnerIcon className="w-4 h-4 mr-2 animate-spin"/>}
                        {saving ? 'Saving...' : 'Save Property'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default Knowledge;
