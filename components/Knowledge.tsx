// FIX: Switched to firebase/compat/app to use v8 syntax with v9 SDK and resolve type errors.
import * as React from 'react';
// FIX: Use Firebase v8 compat imports to resolve type errors for `User` and `firestore`.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db, storage } from '../firebaseConfig';
import { Property, PropertyType, PropertyStatus, PropertyPlan } from '../types';
import {
  PlusIcon,
  FilterIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  SpinnerIcon,
  BuildingOfficeIcon,
  TagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  LocationIcon,
  BedIcon,
  BathIcon,
  CurrencyDollarIcon,
  AreaIcon,
  LinkIcon,
  UploadIcon
} from './icons';

const PROPERTY_TYPES: PropertyType[] = ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Duplex'];
const PROPERTY_STATUSES: PropertyStatus[] = ['For Sale', 'For Rent', 'Sold', 'Rented'];
const PROPERTY_PLANS: PropertyPlan[] = ['Studio', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'];

// Helper function to send webhook
const sendPropertyWebhook = async (propertyData: Property, action: 'create' | 'update' | 'delete') => {
  const { id, createdAt, ...restOfData } = propertyData;

  let createdAtISO: string | null = null;
  if (createdAt && typeof (createdAt as any).toDate === 'function') {
    createdAtISO = (createdAt as any).toDate().toISOString();
  } else if (createdAt) {
    createdAtISO = new Date(createdAt as any).toISOString();
  }

  const payload = {
    ...restOfData,
    createdAt: createdAtISO,
    documentId: id,
    action,
  };

  try {
    const response = await fetch('https://n8n.sahaai.online/webhook/property_details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Webhook failed with status:', response.status, await response.text());
    }
  } catch (error) {
    console.error('Failed to send property webhook:', error);
  }
};


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
  const [toasts, setToasts] = React.useState<{ id: number; message: string; type: 'success' }[]>([]);

  const addToast = (message: string, type: 'success' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000); // Toast disappears after 3 seconds
  };

  React.useEffect(() => {
    const propertiesRef = db.collection('users').doc(user.uid).collection('Property_details');
    const q = propertiesRef.orderBy('createdAt', 'desc');

    const unsubscribe = q.onSnapshot(
      querySnapshot => {
        const propsData: Property[] = [];
        querySnapshot.forEach(doc => {
          propsData.push({ id: doc.id, ...doc.data() } as Property);
        });
        setProperties(propsData);
        setLoading(false);
      },
      error => {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    );

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
      const title = (p.title || '').toString().toLowerCase();
      const location = (p.location || '').toString().toLowerCase();
      return (
        (title.includes(searchLower) || location.includes(searchLower)) &&
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
      try {
        const propertyRef = db.collection('users').doc(user.uid).collection('Property_details').doc(propertyId);
        
        // Fetch the property data before deleting to send with the webhook
        const docSnap = await propertyRef.get();
        if (docSnap.exists) {
            const propertyToDelete = { id: docSnap.id, ...docSnap.data() } as Property;
            // Send webhook with full data and 'delete' action
            await sendPropertyWebhook(propertyToDelete, 'delete');
        } else {
            console.warn(`Property with id ${propertyId} not found, cannot send delete webhook.`);
        }
        
        // Then delete from Firestore
        await propertyRef.delete();
        addToast('Property deleted successfully.');
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete property.');
      }
    }
  };

  const handleStatusChange = async (propertyId: string, newStatus: PropertyStatus) => {
    try {
      const propertyRef = db.collection('users').doc(user.uid).collection('Property_details').doc(propertyId);
      await propertyRef.update({ status: newStatus });
      
      // Send webhook with updated data
      const updatedDoc = await propertyRef.get();
      if (updatedDoc.exists) {
        const updatedPropertyData = { id: updatedDoc.id, ...updatedDoc.data() } as Property;
        await sendPropertyWebhook(updatedPropertyData, 'update');
      }

      addToast('Status updated.');
    } catch (err) {
      console.error('Status update failed:', err);
      alert('Failed to update status.');
    }
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col text-white">
      <header className="flex-shrink-0 mb-6">
        <h1 className="text-3xl font-bold text-white">Knowledge</h1>
        <p className="mt-1 text-gray-400">Your smart data center for managing property information in real-time.</p>
      </header>

      <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 mb-6 flex-shrink-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by title or location..."
              className="pl-10 pr-4 py-2 w-full bg-zinc-700 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition text-white"
            />
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <select name="status" value={filters.status} onChange={handleFilterChange} className="bg-zinc-700 border border-zinc-600 text-white rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500">
              <option value="">All Statuses</option>
              {PROPERTY_STATUSES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select name="type" value={filters.type} onChange={handleFilterChange} className="bg-zinc-700 border border-zinc-600 text-white rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500">
              <option value="">All Types</option>
              {PROPERTY_TYPES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select name="plan" value={filters.plan} onChange={handleFilterChange} className="bg-zinc-700 border border-zinc-600 text-white rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500">
              <option value="">All Plans</option>
              {PROPERTY_PLANS.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button onClick={resetFilters} className="px-3 py-2 text-sm text-gray-300 hover:bg-zinc-700 rounded-lg border border-zinc-600">
              Reset
            </button>
          </div>
          <button onClick={handleAddProperty} className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Property
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-zinc-800/50 border border-zinc-700 rounded-xl shadow-sm">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-400 uppercase bg-zinc-800">
            <tr>
              <th scope="col" className="px-6 py-3">
                Property
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Type & Plan
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Added On
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-8">
                  <SpinnerIcon className="w-8 h-8 mx-auto animate-spin text-blue-500" />
                </td>
              </tr>
            ) : paginatedProperties.length > 0 ? (
              paginatedProperties.map(prop => (
                <tr key={prop.id} className="border-b border-zinc-700 hover:bg-zinc-700/50">
                  <td className="px-6 py-4 font-medium text-white">
                    <div className="font-bold">{prop.title}</div>
                    <div className="text-xs text-gray-400">{prop.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat(prop.currency === 'USD' ? 'en-US' : 'en-AE', { style: 'currency', currency: prop.currency || 'USD', minimumFractionDigits: 0 }).format(
                      Number(prop.price) || 0
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {prop.propertyType} / {prop.plan}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={prop.status}
                      onChange={e => handleStatusChange(prop.id, e.target.value as PropertyStatus)}
                      className="text-xs font-semibold p-1 border border-zinc-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-zinc-700 text-white appearance-none"
                    >
                      {PROPERTY_STATUSES.map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {prop.createdAt && (prop.createdAt as any).toDate
                      ? (prop.createdAt as any).toDate().toLocaleDateString()
                      : prop.createdAt
                      ? new Date(prop.createdAt as any).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleEditProperty(prop)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-zinc-700 rounded-md">
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteProperty(prop.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-zinc-700 rounded-md">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500">
                  No properties found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border border-zinc-600 rounded-md disabled:opacity-50 flex items-center hover:bg-zinc-700">
            <ChevronLeftIcon className="w-4 h-4 mr-1" /> Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border border-zinc-600 rounded-md disabled:opacity-50 flex items-center hover:bg-zinc-700">
            Next <ChevronRightIcon className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}

      <PropertyEditorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={user} property={editingProperty} onSaveSuccess={addToast} />

      {/* Toast Container */}
      <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]">
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {toasts.map(toast => (
            <div key={toast.id} className="max-w-sm w-full bg-gray-800 text-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium">{toast.message}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper for details list in preview card
const DetailItem: React.FC<{ icon: React.ReactElement; label: string; value?: React.ReactNode }> = ({ icon, label, value }) => (
    <li className="flex items-center text-gray-100">
        {/* FIX: Explicitly provide the type for the props in React.cloneElement to resolve a TypeScript inference issue where 'className' was not recognized on the icon prop. */}
        {React.cloneElement<{ className?: string }>(icon, { className: 'w-5 h-5 text-gray-400 mr-3 flex-shrink-0' })}
        <span className="font-medium">{label}</span>
        {value && <span className="ml-2 text-gray-300">{value}</span>}
    </li>
);

const PropertyPreviewCard: React.FC<{ property: Partial<Property> }> = ({ property }) => {
    const formattedPrice = new Intl.NumberFormat(property.currency === 'USD' ? 'en-US' : 'en-AE', {
      style: 'currency',
      currency: property.currency || 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(property.price) || 0);
  
    const {
        title = 'Sale in Jumeirah Living Business Bay: Panoramic Views',
        location = 'Jumeirah Living, Business Bay',
        bedrooms = 0,
        bathrooms = 0,
        area = 0,
        imageUrl,
        propertyLink,
      } = property;

    return (
      <div className="bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 w-full max-w-sm mx-auto font-sans">
        <img
            src={imageUrl || 'https://storage.googleapis.com/aistudio-hosting.appspot.com/gallery/5f02f0a1-a637-4560-a292-32b0a94e844a.jpeg'}
            alt={title}
            className="w-full h-48 object-cover rounded-t-xl bg-zinc-700"
            onError={(e) => { e.currentTarget.src = 'https://storage.googleapis.com/aistudio-hosting.appspot.com/gallery/5f02f0a1-a637-4560-a292-32b0a94e844a.jpeg'; }}
        />
        <div className="p-4">
            <h3 className="text-base font-semibold text-gray-100 leading-tight">
                {title || 'Property Title'}
            </h3>
            <p className="text-xs text-gray-400 mt-1">propertyfinder.ae</p>
        </div>
        <div className="mx-4 mb-4 p-4 bg-zinc-700/50 border border-zinc-600/80 rounded-lg">
            <ul className="space-y-3 text-sm">
                <DetailItem icon={<LocationIcon />} label={location || "Property Location"} />
                <li className="flex items-center text-gray-100 font-medium flex-wrap">
                    <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span>{formattedPrice}</span>
                    <span className="text-zinc-600 mx-2.5">|</span>
                    <BedIcon className="w-5 h-5 text-gray-400 mr-1.5 flex-shrink-0" />
                    <span>{bedrooms} bed</span>
                    <span className="text-zinc-600 mx-2.5">|</span>
                    <BathIcon className="w-5 h-5 text-gray-400 mr-1.5 flex-shrink-0" />
                    <span>{bathrooms} bath</span>
                </li>
                <DetailItem icon={<AreaIcon />} label={`${area} sqft`} />
                <li className="flex items-center text-gray-100">
                    <LinkIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <a href={propertyLink || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs truncate">
                        {propertyLink || 'No link provided'}
                    </a>
                </li>
            </ul>
        </div>
      </div>
    );
};

interface PropertyEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: firebase.User;
  property: Property | null;
  onSaveSuccess: (message: string) => void;
}

const PropertyEditorModal: React.FC<PropertyEditorModalProps> = ({ isOpen, onClose, user, property, onSaveSuccess }) => {
  const [formData, setFormData] = React.useState<Partial<Property>>({});
  const [saving, setSaving] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (property) {
      setFormData({ ...property });
      setImagePreviewUrl(property.imageUrl || null);
    } else {
      setFormData({
        title: '',
        location: '',
        price: 0,
        currency: 'AED',
        bedrooms: 1,
        bathrooms: 1,
        area: 0,
        propertyType: 'Apartment',
        status: 'For Sale',
        plan: '1 BHK',
        imageUrl: '',
        propertyLink: '',
      });
      setImagePreviewUrl(null);
    }
    setImageFile(null); // Reset file on open
  }, [property, isOpen]);

  React.useEffect(() => {
    // Cleanup blob URL
    return () => {
        if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
    };
  }, [imagePreviewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        const newPreviewUrl = URL.createObjectURL(file);
        setImagePreviewUrl(newPreviewUrl);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSaveClick = async () => {
    if (!formRef.current?.reportValidity()) return;

    setSaving(true);
    try {
        let finalImageUrl = property?.imageUrl || '';
        
        if (imageFile) { // New image uploaded
            if (property?.imageUrl) { // Delete old image if it exists
                try { await storage.refFromURL(property.imageUrl).delete(); } catch (e) { console.warn("Old image deletion failed:", e); }
            }
            const storageRef = storage.ref(`posts/${user.uid}/${Date.now()}_${imageFile.name}`);
            await storageRef.put(imageFile);
            finalImageUrl = await storageRef.getDownloadURL();
        } else if (!imagePreviewUrl && property?.imageUrl) { // Image was removed
             try { await storage.refFromURL(property.imageUrl).delete(); } catch (e) { console.warn("Old image deletion failed:", e); }
            finalImageUrl = '';
        }

        const { id, ...dataForFirestore } = formData;

        const dataToSave = {
            ...dataForFirestore,
            userId: user.uid,
            createdAt: property?.createdAt || firebase.firestore.FieldValue.serverTimestamp(),
            imageUrl: finalImageUrl,
            price: Number(formData.price) || 0,
            area: Number(formData.area) || 0,
            bedrooms: Number(formData.bedrooms) || 0,
            bathrooms: Number(formData.bathrooms) || 0,
        };

      if (property) {
        const propertyRef = db.collection('users').doc(user.uid).collection('Property_details').doc(property.id);
        await propertyRef.update(dataToSave);

        // Send webhook for update
        // FIX: Explicitly set createdAt to satisfy the 'Property' type.
        // The type of dataToSave.createdAt is inferred as a union type, but inside this block,
        // we know it's a Timestamp from the existing `property`.
        const updatedPropertyData: Property = { ...property, ...dataToSave, createdAt: property.createdAt };
        await sendPropertyWebhook(updatedPropertyData, 'update');

        onSaveSuccess('Property updated successfully!');
      } else {
        const docRef = await db.collection('users').doc(user.uid).collection('Property_details').add(dataToSave);
        
        // Send webhook for creation
        const newDoc = await docRef.get();
        const newPropertyData = { id: newDoc.id, ...newDoc.data() } as Property;
        await sendPropertyWebhook(newPropertyData, 'create');

        onSaveSuccess('Property added successfully!');
      }
      onClose();
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Failed to save property. See console for details.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const livePreviewData = { ...formData, imageUrl: imagePreviewUrl || formData.imageUrl };
  const inputClasses = "w-full mt-1 p-2 border rounded-md bg-zinc-800 border-zinc-600 text-white focus:ring-blue-500 focus:border-blue-500";
  const selectClasses = `${inputClasses} appearance-none`;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col text-white">
        <header className="flex items-center justify-between p-5 border-b border-zinc-700">
          <h2 className="text-xl font-semibold text-white">{property ? 'Edit Property' : 'Add New Property'}</h2>
          <button onClick={onClose}>
            <XIcon className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </header>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
            <form ref={formRef} className="flex-1 flex flex-col overflow-hidden" noValidate>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-300">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required className={inputClasses}/>
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <input type="text" name="location" value={formData.location || ''} onChange={handleChange} required className={inputClasses}/>
                </div>
                <div>
                    <label className="text-sm font-medium">Property Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {imagePreviewUrl ? (
                                <div className="relative group">
                                    <img src={imagePreviewUrl} alt="Preview" className="mx-auto h-32 w-auto rounded-md shadow-sm"/>
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button type="button" onClick={removeImage} className="text-white bg-red-600 rounded-full p-2 hover:bg-red-700">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <UploadIcon className="mx-auto h-12 w-12 text-gray-500"/>
                                    <div className="flex text-sm text-gray-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-zinc-800 rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 focus-within:ring-offset-zinc-900">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" ref={fileInputRef} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                 <div>
                  <label className="text-sm font-medium">Property Link</label>
                  <input type="url" name="propertyLink" value={formData.propertyLink || ''} onChange={handleChange} placeholder="https://www.propertyfinder.ae/..." className={inputClasses}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Price</label>
                    <div className="flex items-center mt-1">
                        <input type="number" name="price" value={formData.price ?? 0} onChange={handleChange} required min="0" className={`${inputClasses} rounded-r-none`} />
                        <select name="currency" value={formData.currency || 'AED'} onChange={handleChange} className={`${selectClasses} p-2 border-t border-b border-r rounded-r-md bg-zinc-700 border-zinc-600`}>
                            <option>AED</option>
                            <option>USD</option>
                        </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Area (sqft)</label>
                    <input type="number" name="area" value={formData.area ?? 0} onChange={handleChange} required min="0" step="1" className={inputClasses}/>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className={selectClasses}>
                      {PROPERTY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Property Type</label>
                    <select name="propertyType" value={formData.propertyType} onChange={handleChange} className={selectClasses}>
                      {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Plan</label>
                    <select name="plan" value={formData.plan} onChange={handleChange} className={selectClasses}>
                      {PROPERTY_PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Bedrooms</label>
                    <input type="number" name="bedrooms" value={formData.bedrooms ?? 1} onChange={handleChange} required min="0" step="1" className={inputClasses}/>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bathrooms</label>
                    <input type="number" name="bathrooms" value={formData.bathrooms ?? 1} onChange={handleChange} required min="0" step="1" className={inputClasses}/>
                  </div>
                </div>
              </div>
            </form>
            <div className="bg-zinc-950 p-6 hidden md:flex items-center justify-center border-l border-zinc-700 overflow-hidden">
                <div className="transform scale-90">
                    <PropertyPreviewCard property={livePreviewData} />
                </div>
            </div>
        </div>

        <footer className="p-4 bg-zinc-800 border-t border-zinc-700 flex justify-end space-x-2 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600">
                Cancel
            </button>
            <button
                type="button"
                onClick={handleSaveClick}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-800 flex items-center"
            >
                {saving && <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" />}
                {saving ? 'Saving...' : 'Save Property'}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default Knowledge;