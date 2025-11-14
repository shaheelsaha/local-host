





// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import { GoogleGenAI } from '@google/genai';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, UploadIcon, XIcon, TwitterIcon, LinkedInIcon, DribbbleIcon, FileIcon, InstagramIcon, FacebookIcon, TikTokIcon, ThreadsIcon, YouTubeIcon, PlayIcon, EditIcon, TrashIcon, SparklesIcon, CheckCircleIcon, AlertTriangleIcon, PlusIcon, InfoIcon, PinterestIcon } from './icons';
import { Post, SocialPlatform, Persona } from '../types';
import { db, storage, auth } from '../firebaseConfig';
// FIX: Refactor Firebase calls to v8 compat syntax.
// FIX: Switched to firebase/compat/app to use v8 syntax with v9 SDK and resolve type errors.
// FIX: Use Firebase v8 compat imports to resolve type errors for `firestore` and `storage`.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
// import { collection, addDoc, query, where, onSnapshot, Timestamp, doc, updateDoc, deleteDoc, getDocs, limit } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Helper to convert file to base64
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    // FIX: Corrected method name from readDataURL to readAsDataURL.
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};


const platformDetails: { [key in SocialPlatform]: { icon: React.FC<{className?: string, style?: React.CSSProperties}>, color: string, brandColor: string } } = {
    [SocialPlatform.FACEBOOK]: { icon: FacebookIcon, color: 'bg-blue-800', brandColor: '#1877F2' },
    [SocialPlatform.INSTAGRAM]: { icon: InstagramIcon, color: 'bg-pink-600', brandColor: 'transparent' },
    [SocialPlatform.LINKEDIN]: { icon: LinkedInIcon, color: 'bg-blue-700', brandColor: '#0A66C2' },
    [SocialPlatform.THREADS]: { icon: ThreadsIcon, color: 'bg-black', brandColor: '#000000' },
    [SocialPlatform.TWITTER]: { icon: TwitterIcon, color: 'bg-sky-500', brandColor: '#000000' },
    [SocialPlatform.TIKTOK]: { icon: TikTokIcon, color: 'bg-black', brandColor: '#000000' },
    [SocialPlatform.YOUTUBE]: { icon: YouTubeIcon, color: 'bg-red-600', brandColor: '#FF0000' },
    [SocialPlatform.DRIBBBLE]: { icon: DribbbleIcon, color: 'bg-pink-500', brandColor: '#ea4c89' },
    [SocialPlatform.PINTEREST]: { icon: PinterestIcon, color: 'bg-red-700', brandColor: '#E60023' },
};

// Ensures a consistent order for platforms in the UI
const platformOrder: SocialPlatform[] = [
    SocialPlatform.TWITTER,
    SocialPlatform.LINKEDIN,
    SocialPlatform.DRIBBBLE,
    SocialPlatform.INSTAGRAM,
    SocialPlatform.FACEBOOK,
    SocialPlatform.THREADS,
    SocialPlatform.YOUTUBE,
    SocialPlatform.TIKTOK,
    SocialPlatform.PINTEREST,
];


const TimePicker: React.FC<{
    selectedTime: Date;
    onChange: (date: Date) => void;
    disabled?: boolean;
}> = ({ selectedTime, onChange, disabled }) => {
    const formatTime = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = String(minutes).padStart(2, '0');
        return {
            hour: String(hours),
            minute: minutesStr,
            period: ampm as 'AM' | 'PM'
        };
    };

    const [time, setTime] = React.useState(formatTime(selectedTime));

    React.useEffect(() => {
        setTime(formatTime(selectedTime));
    }, [selectedTime]);
    
    const commitChange = (newTime: { hour: string, minute: string, period: 'AM' | 'PM' }) => {
        let newHour = Number(newTime.hour);
        if (newTime.period === 'PM' && newHour < 12) {
            newHour += 12;
        }
        if (newTime.period === 'AM' && newHour === 12) {
            newHour = 0;
        }
        
        const newDate = new Date(selectedTime);
        newDate.setHours(newHour, Number(newTime.minute));
        onChange(newDate);
    };

    const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (val === '' || (Number(val) >= 1 && Number(val) <= 12)) {
            setTime(t => ({...t, hour: val}));
        }
    };

    const handleHourBlur = () => {
        if (time.hour === '') {
            const newTime = {...time, hour: '12'};
            setTime(newTime);
            commitChange(newTime);
        } else {
            commitChange(time);
        }
    };
    
    const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (val === '' || (Number(val) >= 0 && Number(val) <= 59)) {
             setTime(t => ({...t, minute: val}));
        }
    };

    const handleMinuteBlur = () => {
        const newTime = {...time, minute: time.minute.padStart(2, '0')};
        setTime(newTime);
        commitChange(newTime);
    };

    const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
        const newTime = {...time, period: newPeriod};
        setTime(newTime);
        commitChange(newTime);
    };

    return (
         <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 px-1">
                <input
                    type="text"
                    value={time.hour}
                    onChange={handleHourChange}
                    onBlur={handleHourBlur}
                    disabled={disabled}
                    className="w-10 text-center bg-transparent outline-none py-1.5 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-gray-400 -mx-1">:</span>
                <input
                    type="text"
                    value={time.minute}
                    onChange={handleMinuteChange}
                    onBlur={handleMinuteBlur}
                    disabled={disabled}
                    className="w-10 text-center bg-transparent outline-none py-1.5 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
            </div>
            <div className="flex items-center bg-gray-200 rounded-lg p-0.5">
                <button type="button" onClick={() => handlePeriodChange('AM')} disabled={disabled} className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${time.period === 'AM' ? 'bg-blue-600 text-white shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-300'}`}>AM</button>
                <button type="button" onClick={() => handlePeriodChange('PM')} disabled={disabled} className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${time.period === 'PM' ? 'bg-blue-600 text-white shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-300'}`}>PM</button>
            </div>
        </div>
    );
};

type PostEditorProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (postData: Omit<Post, 'id' | 'userId'>, newMediaFiles: File[], existingMediaUrls: string[]) => void;
    initialData?: Post | null;
    initialDate?: Date;
    isUploading: boolean;
    connectedPlatforms: SocialPlatform[];
};

type ContentType = 'image' | 'reel' | 'video';

const PostEditorModal: React.FC<PostEditorProps> = ({ isOpen, onClose, onSubmit, initialData, initialDate, isUploading, connectedPlatforms }) => {
    const [mediaFile, setMediaFile] = React.useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = React.useState<{ url: string; type: 'image' | 'video' } | null>(null);
    const [caption, setCaption] = React.useState('');
    const [selectedPlatforms, setSelectedPlatforms] = React.useState<SocialPlatform[]>([]);
    const [scheduledAt, setScheduledAt] = React.useState(initialDate || new Date());
    const [publishMode, setPublishMode] = React.useState<'schedule' | 'now'>('schedule');
    const [contentType, setContentType] = React.useState<ContentType>('image');
    const [autoCommenting, setAutoCommenting] = React.useState(false);
    const [isContentTypeLocked, setIsContentTypeLocked] = React.useState(false);
    const [errors, setErrors] = React.useState<{ platform?: string; caption?: string; schedule?: string }>({});

    const isPublished = initialData?.status === 'published';

    // Cleanup previous object URLs when the modal closes or media changes.
    React.useEffect(() => {
        return () => {
            if (mediaPreview && mediaPreview.url.startsWith('blob:')) {
                URL.revokeObjectURL(mediaPreview.url);
            }
        };
    }, [mediaPreview]);

    const resetForm = React.useCallback((baseDate: Date) => {
        setMediaFile(null);
        setMediaPreview(null);
        setCaption('');
        setSelectedPlatforms([]);
        setScheduledAt(baseDate);
        setPublishMode('schedule');
        setContentType('image');
        setAutoCommenting(false);
        setIsContentTypeLocked(false);
        setErrors({});
    }, []);
    
    React.useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Editing mode
                setCaption(initialData.caption);
                setSelectedPlatforms(initialData.platforms);
                const scheduledDate = new Date(initialData.scheduledAt);
                setScheduledAt(scheduledDate);
                setPublishMode(scheduledDate > new Date(Date.now() + 60000) ? 'schedule' : 'now');
                setAutoCommenting(initialData.autoCommenting || false);
                
                setMediaFile(null); // No new file initially
                if (initialData.mediaUrls.length > 0) {
                    const url = initialData.mediaUrls[0];
                    const type = url.match(/\.(mp4|mov|webm|mkv)$/i) ? 'video' : 'image';
                    setMediaPreview({ url, type });
                    
                    if (initialData.contentType) {
                        setContentType(initialData.contentType);
                    } else {
                        // Fallback for older posts without contentType
                        if (type === 'video') {
                            const hasReelPlatform = initialData.platforms.some(p => [SocialPlatform.INSTAGRAM, SocialPlatform.TIKTOK].includes(p));
                            setContentType(hasReelPlatform ? 'reel' : 'video');
                        } else {
                            setContentType('image');
                        }
                    }
                    setIsContentTypeLocked(true);
                } else {
                    setMediaPreview(null);
                    setIsContentTypeLocked(false);
                    setContentType('image');
                }
            } else {
                // Creating mode
                resetForm(initialDate || new Date());
                setSelectedPlatforms(connectedPlatforms); // Auto-select connected platforms
            }
        }
    }, [isOpen, initialData, initialDate, resetForm, connectedPlatforms]);
    
    const handleClose = () => {
        resetForm(new Date());
        onClose();
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Clean up previous blob URL if it exists
        if (mediaPreview && mediaPreview.url.startsWith('blob:')) {
            URL.revokeObjectURL(mediaPreview.url);
        }

        setMediaFile(file);
        setIsContentTypeLocked(false); // Unlock while detecting

        const objectUrl = URL.createObjectURL(file);

        if (file.type.startsWith('image/')) {
            setMediaPreview({ url: objectUrl, type: 'image' });
            setContentType('image');
            setIsContentTypeLocked(true);
        } else if (file.type.startsWith('video/')) {
            setMediaPreview({ url: objectUrl, type: 'video' });
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                const isVertical = video.videoHeight > video.videoWidth;
                setContentType(isVertical ? 'reel' : 'video');
                setIsContentTypeLocked(true);
            };
            video.src = objectUrl;
        }
    };

    const removeMedia = () => {
        setMediaFile(null);
        setMediaPreview(null);
        setIsContentTypeLocked(false);
        setContentType('image'); // Reset to default
    };

    const togglePlatform = (platform: SocialPlatform) => {
        setSelectedPlatforms(prev => 
            prev.includes(platform) 
                ? prev.filter(p => p !== platform) 
                : [...prev, platform]
        );
    };

    const handleSubmission = (status: 'scheduled' | 'draft') => {
        setErrors({});
        const newErrors: { platform?: string; caption?: string; schedule?: string } = {};

        if (status !== 'draft') {
            if (selectedPlatforms.length === 0) newErrors.platform = 'Please select at least one platform.';
            if (caption.trim() === '') newErrors.caption = 'A caption is required.';
            if (publishMode === 'schedule' && scheduledAt <= new Date()) newErrors.schedule = 'Scheduled time must be in the future.';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        const keptExistingUrls = mediaPreview && mediaPreview.url.startsWith('http') ? [mediaPreview.url] : [];
        const newMediaToUpload = mediaFile ? [mediaFile] : [];
        
        if (status !== 'draft' && keptExistingUrls.length === 0 && newMediaToUpload.length === 0) {
            alert('Please upload a media file.');
            return;
        }
        
        onSubmit({
            caption,
            platforms: selectedPlatforms,
            tags: [], 
            scheduledAt: publishMode === 'now' ? new Date().toISOString() : scheduledAt.toISOString(),
            status,
            mediaUrls: keptExistingUrls, // Pass only existing URLs. The parent component will handle upload and merge.
            autoCommenting,
            contentType,
        }, newMediaToUpload, keptExistingUrls);
    }

    return (
        <div className={`fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-800">{isPublished ? 'View Published Post' : 'Share to social media'}</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmission('scheduled'); }} className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-6 md:order-2 bg-gray-50/70">
                            {mediaPreview ? (
                                <div>
                                    <div className={`relative w-full bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-300 ${contentType === 'reel' ? 'aspect-[9/16] max-w-[280px] mx-auto' : 'aspect-square'}`}>
                                        <div className={`w-full h-full overflow-hidden ${contentType === 'reel' ? 'rounded-xl shadow-inner' : ''}`}>
                                            {mediaPreview.type === 'video' 
                                                ? <video src={mediaPreview.url} controls className="w-full h-full object-contain bg-gray-900"></video>
                                                : <img src={mediaPreview.url} alt="preview" className="w-full h-full object-contain"/>
                                            }
                                        </div>
                                         {!isPublished && <button 
                                            type="button" 
                                            onClick={removeMedia}
                                            className="absolute top-2 right-2 z-10 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                                            aria-label={`Remove media`}
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </button>}
                                    </div>
                                </div>
                            ) : (
                                <label htmlFor="modal-file-upload-main" className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-colors">
                                     <UploadIcon className="w-12 h-12 text-gray-400 mb-4" />
                                     <h3 className="font-semibold text-gray-700">Upload your media</h3>
                                     <p className="text-sm text-gray-500 mt-1">Drag & drop a file or click to browse.</p>
                                     <span className="mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
                                        Browse file
                                     </span>
                                     <input type="file" onChange={handleFileChange} className="hidden" id="modal-file-upload-main" disabled={isPublished} accept="image/*,video/*"/>
                                </label>
                            )}
                        </div>
                        <div className="p-6 space-y-6 md:order-1 md:border-r md:border-gray-200">
                            {/* Platform Selector */}
                            <div>
                                <div className="grid grid-cols-4 gap-3">
                                     {platformOrder.map(platformKey => {
                                        const details = platformDetails[platformKey];
                                        if (!details) return null;
                                        const { icon: Icon, brandColor } = details;

                                        const isConnected = connectedPlatforms.includes(platformKey);
                                        const isSelected = selectedPlatforms.includes(platformKey);
                                        
                                        const iconStyle: React.CSSProperties = {};
                                        let iconClasses = "w-8 h-8 transition-colors duration-200";

                                        if (isSelected && isConnected) {
                                            if (platformKey !== SocialPlatform.INSTAGRAM) {
                                                iconStyle.color = brandColor;
                                            }
                                        } else {
                                            iconClasses += " grayscale";
                                        }

                                        return (
                                            <button
                                                key={platformKey}
                                                type="button"
                                                onClick={() => isConnected && togglePlatform(platformKey)}
                                                disabled={!isConnected || isPublished}
                                                title={!isConnected ? `Connect ${platformKey} on the Connections page` : `Click to publish to ${platformKey}`}
                                                className={`p-3 border rounded-lg flex items-center justify-center transition-all duration-200 h-16 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                                    ${isSelected 
                                                        ? 'border-blue-500 bg-blue-50/80 shadow-inner' 
                                                        : 'border-gray-200 bg-white'
                                                    }
                                                    ${isConnected 
                                                        ? 'hover:border-blue-400 hover:scale-105 active:scale-100 cursor-pointer' 
                                                        : 'opacity-60 cursor-not-allowed'
                                                    }
                                                    ${isPublished ? 'cursor-not-allowed hover:border-gray-200' : ''}
                                                `}
                                            >
                                                <Icon className={iconClasses} style={iconStyle} />
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.platform && <p className="text-red-500 text-xs mt-2">{errors.platform}</p>}
                            </div>

                            {/* Content Type Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                                    <button type="button" onClick={() => setContentType('image')} disabled={isPublished || (isContentTypeLocked && contentType !== 'image')} className={`w-full px-3 py-1.5 text-sm font-semibold rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${contentType === 'image' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}>Image</button>
                                    <button type="button" onClick={() => setContentType('reel')} disabled={isPublished || (isContentTypeLocked && contentType !== 'reel')} className={`w-full px-3 py-1.5 text-sm font-semibold rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${contentType === 'reel' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}>Reel</button>
                                    <button type="button" onClick={() => setContentType('video')} disabled={isPublished || (isContentTypeLocked && contentType !== 'video')} className={`w-full px-3 py-1.5 text-sm font-semibold rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${contentType === 'video' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}>Video</button>
                                </div>
                            </div>

                            {/* Caption */}
                            <div>
                                <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                                <textarea id="caption" value={caption} onChange={e => setCaption(e.target.value)} rows={5} readOnly={isPublished} className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 sm:text-sm disabled:bg-gray-200 disabled:cursor-not-allowed" placeholder="What's on your mind?"></textarea>
                                {errors.caption && <p className="text-red-500 text-xs mt-1">{errors.caption}</p>}
                            </div>
                            
                            {/* Auto Commenting Toggle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Automation</label>
                                <div className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg p-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Auto Commenting</h4>
                                        <p className="text-xs text-gray-500">Automatically reply to comments using AI.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setAutoCommenting(prev => !prev)}
                                        disabled={isPublished}
                                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${autoCommenting ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        role="switch"
                                        aria-checked={autoCommenting}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 ${autoCommenting ? 'translate-x-5' : 'translate-x-0'}`}
                                        />
                                    </button>
                                </div>
                            </div>

                             {/* Scheduling */}
                             <div>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center text-sm cursor-pointer">
                                        <input type="radio" name="publishMode" value="schedule"
                                               checked={publishMode === 'schedule'}
                                               onChange={() => setPublishMode('schedule')}
                                               disabled={isPublished}
                                               className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                        <span className="ml-2 text-gray-700 font-medium">Schedule</span>
                                    </label>
                                     <label className="flex items-center text-sm cursor-pointer">
                                        <input type="radio" name="publishMode" value="now"
                                               checked={publishMode === 'now'}
                                               onChange={() => setPublishMode('now')}
                                               disabled={isPublished}
                                               className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                        <span className="ml-2 text-gray-700 font-medium">Publish now</span>
                                         <InfoIcon className="w-4 h-4 text-gray-400 ml-1" title="Post will be published within the next minute."/>
                                    </label>
                                </div>
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${publishMode === 'schedule' ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                        <div className="relative">
                                            <label htmlFor="schedule-date" className="sr-only">Date</label>
                                            <div className="relative">
                                                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                <input
                                                    type="date"
                                                    id="schedule-date"
                                                    value={scheduledAt.toISOString().split('T')[0]}
                                                    onChange={(e) => {
                                                        if (!e.target.value) return;
                                                        const [year, month, day] = e.target.value.split('-').map(Number);
                                                        const newDate = new Date(scheduledAt);
                                                        newDate.setFullYear(year, month - 1, day);
                                                        setScheduledAt(newDate);
                                                    }}
                                                    disabled={isPublished}
                                                    className="pl-10 pr-3 py-2.5 w-full bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 sm:text-sm disabled:cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                        <TimePicker
                                            selectedTime={scheduledAt}
                                            onChange={setScheduledAt}
                                            disabled={isPublished}
                                        />
                                    </div>
                                    {errors.schedule && <p className="text-red-500 text-xs mt-2">{errors.schedule}</p>}
                                </div>
                             </div>
                        </div>
                    </div>
                </form>

                 <footer className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end p-4 border-t border-gray-200 flex-shrink-0 space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 bg-gray-50 rounded-b-xl">
                    {isPublished ? (
                        <button type="button" onClick={handleClose} className="w-full sm:w-auto px-5 py-2 text-sm font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-900">Close</button>
                    ) : (
                        <>
                            <button type="button" onClick={() => handleSubmission('draft')} disabled={isUploading} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50">Save as Draft</button>
                            <button type="button" className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50" disabled>Preview</button>
                            <button type="submit" form="post-editor-form" onClick={(e) => { e.preventDefault(); handleSubmission('scheduled'); }} disabled={isUploading} className="w-full sm:w-auto px-5 py-2 text-sm font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:bg-gray-400 flex items-center justify-center min-w-[100px]">
                                {isUploading ? 'Saving...' : (publishMode === 'now' ? 'Publish' : 'Schedule')}
                            </button>
                        </>
                    )}
                </footer>
            </div>
        </div>
    );
};


const Schedule: React.FC = () => {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [posts, setPosts] = React.useState<Post[]>([]);
    const [isWizardOpen, setIsWizardOpen] = React.useState(false);
    const [editingPost, setEditingPost] = React.useState<Post | null>(null);
    const [initialWizardDate, setInitialWizardDate] = React.useState(new Date());
    const [isLoading, setIsLoading] = React.useState(true);
    const [isUploading, setIsUploading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [connectedPlatforms, setConnectedPlatforms] = React.useState<SocialPlatform[]>([]);
    const [selectedDay, setSelectedDay] = React.useState(new Date());


    const startOfWeek = React.useMemo(() => {
        const date = new Date(currentDate);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
        return new Date(date.setDate(diff));
    }, [currentDate]);
    
    React.useEffect(() => {
        setSelectedDay(currentDate);
    }, [currentDate]);

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                return;
            }
            if (event.key === 'ArrowLeft') {
                changeWeek(-1);
            } else if (event.key === 'ArrowRight') {
                changeWeek(1);
            } else if (event.key.toLowerCase() === 't') {
                setCurrentDate(new Date());
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        setIsLoading(true);
        const user = auth.currentUser;
        if (!user) {
            setError("You must be logged in to see posts.");
            setIsLoading(false);
            return;
        }

        // Listener for connected platforms
        const connectionDocRef = db.collection('users').doc(user.uid).collection('connection').doc('connection');
        const unsubscribeConnections = connectionDocRef.onSnapshot(doc => {
            const connected: SocialPlatform[] = [];
            if (doc.exists) {
                const data = doc.data()!;
                if (data.Fb_ID) connected.push(SocialPlatform.FACEBOOK);
                if (data.Insta_ID) connected.push(SocialPlatform.INSTAGRAM);
                if (data.LinkedIn_Access_token) connected.push(SocialPlatform.LINKEDIN);
                if (data.Thread_Access) connected.push(SocialPlatform.THREADS);
            }
            setConnectedPlatforms(connected);
        });

        // Listener for posts
        const postsCol = db.collection('posts');
        const q = postsCol.where("userId", "==", user.uid);
        
        const unsubscribePosts = q.onSnapshot((querySnapshot) => {
            const postsData: Post[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                postsData.push({ 
                    id: doc.id,
                    ...data,
                    // Ensure scheduledAt is always a string in state
                    scheduledAt: (data.scheduledAt as firebase.firestore.Timestamp).toDate().toISOString()
                } as Post);
            });
            setPosts(postsData);
            setIsLoading(false);
            setError(null);
        }, (err) => {
            console.error("Error fetching posts: ", err);
            setError("Failed to fetch posts. Check console for details.");
            setIsLoading(false);
        });

        return () => {
            unsubscribeConnections();
            unsubscribePosts();
        }
    }, []);
    
    const handleCreatePostClick = (date: Date) => {
        setEditingPost(null);
        setInitialWizardDate(date);
        setIsWizardOpen(true);
    };
    
    const handleEditPostClick = (post: Post) => {
        setEditingPost(post);
        setIsWizardOpen(true);
    };

    const handleDeletePost = async (post: Post) => {
        if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
        
        try {
            // Delete media from storage
            if (post.mediaUrls.length > 0) {
                const deletePromises = post.mediaUrls.map(url => {
                    const fileRef = storage.refFromURL(url);
                    return fileRef.delete();
                });
                await Promise.all(deletePromises);
            }

            // Delete post from firestore
            await db.collection('posts').doc(post.id).delete();

        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post. Please check the console.");
        }
    };


    const handleFormSubmit = async (postData: Omit<Post, 'id' | 'userId'>, newMediaFiles: File[], keptExistingUrls: string[]) => {
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to create a post.");
            return;
        }
        setIsUploading(true);
        try {
            const newMediaUrls = await Promise.all(
                newMediaFiles.map(async file => {
                    const storageRef = storage.ref(`posts/${user.uid}/${Date.now()}_${file.name}`);
                    await storageRef.put(file);
                    return await storageRef.getDownloadURL();
                })
            );

            if (editingPost) {
                const urlsToDelete = editingPost.mediaUrls.filter(url => !keptExistingUrls.includes(url));
                if (urlsToDelete.length > 0) {
                    await Promise.all(urlsToDelete.map(url => storage.refFromURL(url).delete().catch(err => console.error(`Failed to delete old media ${url}`, err))));
                }
            }

            const finalMediaUrls = [...keptExistingUrls, ...newMediaUrls];
            const dataToSave = {
                ...postData,
                userId: user.uid,
                mediaUrls: finalMediaUrls,
                status: postData.status,
                scheduledAt: firebase.firestore.Timestamp.fromDate(new Date(postData.scheduledAt)),
                autoCommenting: postData.autoCommenting || false,
                contentType: postData.contentType,
            };

            if (editingPost) {
                // Update existing post
                const postRef = db.collection('posts').doc(editingPost.id);
                await postRef.update(dataToSave);
            } else {
                // Create new post
                await db.collection('posts').add(dataToSave);
            }

            setIsWizardOpen(false);
            setEditingPost(null);
        } catch (err) {
            console.error("Error saving post: ", err);
            alert("Failed to save post. Please check console for details.");
        } finally {
            setIsUploading(false);
        }
    };


    const weekDays = React.useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });
    }, [startOfWeek]);

    const timeSlots = React.useMemo(() => Array.from({ length: 24 }).map((_, i) => `${i.toString().padStart(2, '0')}:00`), []);

    const postsByDayAndHour = React.useMemo(() => {
        const grid: { [key: string]: Post[] } = {};
        posts.forEach(post => {
            if (post.scheduledAt) {
                const date = new Date(post.scheduledAt);
                const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
                if (!grid[key]) grid[key] = [];
                grid[key].push(post);
            }
        });
        return grid;
    }, [posts]);

    const changeWeek = React.useCallback((amount: number) => {
        setCurrentDate(current => {
            const newDate = new Date(current);
            newDate.setDate(newDate.getDate() + amount * 7);
            return newDate;
        });
    }, []);
    
    return (
        <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 flex-shrink-0">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <h1 className="text-2xl font-bold text-gray-800">
                       {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                    </h1>
                    <div className="flex items-center space-x-1">
                        <button onClick={() => changeWeek(-1)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"><ChevronLeftIcon className="w-5 h-5" /></button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-100">Today</button>
                        <button onClick={() => changeWeek(1)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"><ChevronRightIcon className="w-5 h-5" /></button>
                    </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button onClick={() => handleCreatePostClick(new Date())} className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create Post
                    </button>
                </div>
            </header>
            
            <div className="flex-1 overflow-auto border border-gray-200 rounded-xl bg-white shadow-sm">
                {/* Mobile View */}
                <div className="md:hidden">
                    <div className="flex justify-around items-center border-b sticky top-0 bg-white z-10">
                        {weekDays.map(day => (
                            <button
                                key={day.toISOString()}
                                onClick={() => setSelectedDay(day)}
                                className={`text-center py-2 px-1 w-full transition-colors duration-200 ${day.toDateString() === selectedDay.toDateString() ? 'border-b-2 border-blue-600' : 'border-b-2 border-transparent'}`}
                            >
                                <span className="text-xs text-gray-500">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                <span className={`font-bold block text-lg mt-1 ${new Date().toDateString() === day.toDateString() ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto' : 'text-gray-700'}`}>{day.getDate()}</span>
                            </button>
                        ))}
                    </div>
                    <div className="p-2 space-y-2">
                        {timeSlots.map((time, hour) => {
                             const slotDate = new Date(selectedDay);
                             slotDate.setHours(hour, 0, 0, 0);
                             const key = `${slotDate.getFullYear()}-${slotDate.getMonth()}-${slotDate.getDate()}-${slotDate.getHours()}`;
                             const dayPosts = postsByDayAndHour[key] || [];

                             if (dayPosts.length === 0) return null;

                             return (
                                 <div key={hour} className="flex items-start py-2 border-b last:border-b-0">
                                     <span className="text-xs text-gray-500 w-16 pt-1.5">{time}</span>
                                     <div className="flex-1 space-y-2">
                                         {dayPosts.map(post => (
                                            <div key={post.id} onClick={() => handleEditPostClick(post)} className="bg-gray-50 p-2 rounded-md border flex space-x-3 items-start">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm text-gray-800">{post.caption || 'No Caption'}</p>
                                                    <div className="flex items-center text-xs text-gray-500 mt-1 capitalize">{post.status}</div>
                                                </div>
                                                {post.mediaUrls.length > 0 && (
                                                    <img src={post.mediaUrls[0]} alt="Post media" className="w-12 h-12 object-cover rounded"/>
                                                )}
                                            </div>
                                         ))}
                                     </div>
                                 </div>
                             );
                        })}
                         {posts.filter(p => new Date(p.scheduledAt).toDateString() === selectedDay.toDateString()).length === 0 && (
                            <div className="text-center py-16 text-gray-500">
                                <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-2"/>
                                <p>No posts scheduled for this day.</p>
                                <button onClick={() => handleCreatePostClick(selectedDay)} className="mt-4 text-sm font-semibold text-blue-600 hover:underline">
                                    Schedule a post
                                </button>
                            </div>
                         )}
                    </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-[auto_1fr] min-w-[800px]">
                    {/* Time Gutter */}
                    <div className="col-start-1 row-start-1 sticky top-0 bg-white z-10">
                        <div className="h-14 border-b border-r border-gray-200"></div>
                    </div>
                    {/* Header */}
                    <div className="col-start-2 row-start-1 grid grid-cols-7 sticky top-0 bg-white z-10">
                        {weekDays.map(day => (
                            <div key={day.toISOString()} className="h-14 border-b border-gray-200 flex flex-col items-center justify-center">
                                <span className="text-xs text-gray-500 uppercase tracking-wider">{day.toLocaleString('default', { weekday: 'short' })}</span>
                                <span className={`text-xl font-semibold mt-1 ${new Date().toDateString() === day.toDateString() ? 'bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center' : 'text-gray-700'}`}>{day.getDate()}</span>
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="col-start-1 row-start-2 border-r border-gray-200 text-right">
                        {timeSlots.map(time => (
                            <div key={time} className="h-24 flex justify-end pr-2 pt-1 border-t border-gray-100 first:border-t-0">
                                <span className="text-xs text-gray-400">{time}</span>
                            </div>
                        ))}
                    </div>
                    <div className="col-start-2 row-start-2 grid grid-cols-7">
                        {weekDays.map(day => (
                            <div key={day.toISOString()} className="border-l border-gray-200">
                                {timeSlots.map((_, hour) => {
                                    const slotDate = new Date(day);
                                    slotDate.setHours(hour, 0, 0, 0);
                                    const key = `${slotDate.getFullYear()}-${slotDate.getMonth()}-${slotDate.getDate()}-${slotDate.getHours()}`;
                                    const dayPosts = postsByDayAndHour[key] || [];

                                    return (
                                        <div key={hour} className="h-24 border-t border-gray-200 p-1 group relative">
                                            {dayPosts.length > 0 ? (
                                                <div className="space-y-1">
                                                {dayPosts.map(post => {
                                                    const platform = post.platforms[0];
                                                    const PlatformIcon = platformDetails[platform]?.icon || FileIcon;
                                                    const statusStyles = {
                                                        scheduled: 'bg-blue-50 border-blue-200 text-blue-800 hover:border-blue-400',
                                                        published: 'bg-green-50 border-green-200 text-green-800 hover:border-green-400',
                                                        failed: 'bg-red-50 border-red-200 text-red-800 hover:border-red-400',
                                                        draft: 'bg-gray-100 border-gray-200 text-gray-700 hover:border-gray-400',
                                                    };
                                                    const statusIcons = {
                                                        published: <CheckCircleIcon className="w-3.5 h-3.5 mr-1.5 text-green-600"/>,
                                                        failed: <AlertTriangleIcon className="w-3.5 h-3.5 mr-1.5 text-red-600"/>,
                                                        scheduled: <PlatformIcon className="w-3.5 h-3.5 mr-1.5 text-blue-600"/>,
                                                        draft: <EditIcon className="w-3.5 h-3.5 mr-1.5 text-gray-500"/>,
                                                    };

                                                    return (
                                                        <div key={post.id} onClick={() => handleEditPostClick(post)} className={`rounded p-1.5 text-xs overflow-hidden border cursor-pointer transition-all ${statusStyles[post.status]}`}>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center overflow-hidden">
                                                                    {statusIcons[post.status]}
                                                                    <span className="font-semibold truncate">{post.caption || (post.status === 'draft' ? 'Draft' : 'No Caption')}</span>
                                                                </div>
                                                                <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 backdrop-blur-sm rounded-full p-0.5">
                                                                    <button onClick={(e) => { e.stopPropagation(); handleEditPostClick(post); }} className="p-1 hover:bg-gray-200 rounded-full"><EditIcon className="w-3 h-3 text-gray-600"/></button>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleDeletePost(post); }} className="p-1 hover:bg-gray-200 rounded-full"><TrashIcon className="w-3 h-3 text-gray-600"/></button>
                                                                </div>
                                                            </div>
                                                            <p className="truncate pl-5 text-gray-600">{post.caption}</p>
                                                        </div>
                                                    );
                                                })}
                                                </div>
                                            ) : (
                                                 <button onClick={() => handleCreatePostClick(slotDate)} className="w-full h-full rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50/80 flex items-center justify-center">
                                                     <PlusIcon className="w-5 h-5 text-gray-400" />
                                                 </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
                 {isLoading && <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>}
                 {error && <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center text-red-500">{error}</div>}
            </div>
            
            <PostEditorModal 
                isOpen={isWizardOpen} 
                onClose={() => { setIsWizardOpen(false); setEditingPost(null); }} 
                onSubmit={handleFormSubmit}
                initialData={editingPost}
                initialDate={initialWizardDate}
                isUploading={isUploading}
                connectedPlatforms={connectedPlatforms}
            />
        </div>
    );
};

export default Schedule;