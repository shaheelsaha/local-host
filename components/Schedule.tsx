// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import { GoogleGenAI } from '@google/genai';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, UploadIcon, XIcon, TwitterIcon, LinkedInIcon, DribbbleIcon, FileIcon, InstagramIcon, FacebookIcon, TikTokIcon, ThreadsIcon, YouTubeIcon, PlayIcon, EditIcon, TrashIcon, SparklesIcon, CheckCircleIcon, AlertTriangleIcon, PlusIcon, InfoIcon, PinterestIcon } from './icons';
import { Post, SocialPlatform, Persona } from '../types';
import { db, storage, auth } from '../firebaseConfig';
// FIX: Refactor Firebase calls to v8 compat syntax.
import firebase from 'firebase/compat/app';
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
                    aria-label="Hour"
                />
                <span className="font-semibold">:</span>
                <input
                    type="text"
                    value={time.minute}
                    onChange={handleMinuteChange}
                    onBlur={handleMinuteBlur}
                    disabled={disabled}
                    className="w-10 text-center bg-transparent outline-none py-1.5 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    aria-label="Minute"
                />
            </div>
            <div className="flex rounded-lg bg-gray-200 p-0.5 text-sm font-semibold">
                <button
                    type="button"
                    onClick={() => handlePeriodChange('AM')}
                    disabled={disabled}
                    className={`px-2 py-1 rounded-md transition-colors ${time.period === 'AM' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                >
                    AM
                </button>
                <button
                    type="button"
                    onClick={() => handlePeriodChange('PM')}
                    disabled={disabled}
                    className={`px-2 py-1 rounded-md transition-colors ${time.period === 'PM' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                >
                    PM
                </button>
            </div>
        </div>
    );
};


const Calendar: React.FC<{
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    disabled?: boolean;
}> = ({ selectedDate, onDateChange, disabled }) => {
    const [viewDate, setViewDate] = React.useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    const [isOpen, setIsOpen] = React.useState(false);
    const calendarRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

    const handleDateClick = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onDateChange(newDate);
        setIsOpen(false);
    };
    
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const blanks = Array(startDay).fill(null);
    const days = Array.from({ length: numDays }, (_, i) => i + 1);

    return (
        <div ref={calendarRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className="flex items-center justify-between w-full sm:w-auto bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            >
                <CalendarIcon className="w-5 h-5 text-gray-500 mr-2" />
                {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </button>
            {isOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 z-20 p-4">
                    <div className="flex justify-between items-center mb-2">
                        <button type="button" onClick={handlePrevMonth} className="p-1.5 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5" /></button>
                        <span className="font-semibold text-sm">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        <button type="button" onClick={handleNextMonth} className="p-1.5 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 text-sm">
                        {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
                        {days.map(day => {
                            const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                            return (
                                <button
                                    type="button"
                                    key={day}
                                    onClick={() => handleDateClick(day)}
                                    className={`py-1.5 rounded-full hover:bg-gray-100 ${isSelected ? 'bg-blue-600 text-white font-semibold hover:bg-blue-700' : ''}`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

interface MediaFile {
    file: File;
    preview: string;
    type: 'image' | 'video';
}

const Schedule: React.FC = () => {
    const [user, setUser] = React.useState<firebase.User | null>(null);
    const [selectedPlatforms, setSelectedPlatforms] = React.useState<SocialPlatform[]>([]);
    const [caption, setCaption] = React.useState('');
    const [mediaFiles, setMediaFiles] = React.useState<MediaFile[]>([]);
    const [tags, setTags] = React.useState<string[]>([]);
    const [isScheduling, setIsScheduling] = React.useState(true);
    const [scheduledAt, setScheduledAt] = React.useState(() => {
        const date = new Date();
        date.setHours(10, 0, 0, 0);
        return date;
    });
    const [autoCommenting, setAutoCommenting] = React.useState(false);
    const [scheduledPosts, setScheduledPosts] = React.useState<Post[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [editingPost, setEditingPost] = React.useState<Post | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    // AI States
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [aiPersona, setAiPersona] = React.useState<Persona | null>(null);

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(currentUser => {
            if (currentUser) {
                setUser(currentUser);
                
                // Fetch AI Persona
                const personaQuery = db.collection('personas').where('userId', '==', currentUser.uid).limit(1);
                personaQuery.get().then(snapshot => {
                    if (!snapshot.empty) {
                        setAiPersona(snapshot.docs[0].data() as Persona);
                    }
                }).catch(err => console.error("Error fetching persona:", err));

                // Fetch Posts
                const postsQuery = db.collection('posts')
                    .where("userId", "==", currentUser.uid)
                    .orderBy("scheduledAt", "desc");
                
                const unsubscribePosts = postsQuery.onSnapshot(snapshot => {
                    const postsData = snapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            ...data,
                            scheduledAt: (data.scheduledAt as firebase.firestore.Timestamp).toDate().toISOString(),
                        } as Post;
                    });
                    setScheduledPosts(postsData);
                    setIsLoading(false);
                }, err => {
                    console.error("Error fetching posts:", err);
                    setError("Failed to load posts.");
                    setIsLoading(false);
                });
                
                return () => unsubscribePosts();
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const togglePlatform = (platform: SocialPlatform) => {
        setSelectedPlatforms(prev =>
            prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).map(file => ({
                file,
                preview: URL.createObjectURL(file),
                type: file.type.startsWith('video') ? 'video' : 'image' as 'image' | 'video'
            }));
            setMediaFiles(prev => [...prev, ...files]);
        }
    };
    
    const removeMediaFile = (index: number) => {
        const fileToRemove = mediaFiles[index];
        URL.revokeObjectURL(fileToRemove.preview); // Clean up object URL
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setSelectedPlatforms([]);
        setCaption('');
        mediaFiles.forEach(mf => URL.revokeObjectURL(mf.preview));
        setMediaFiles([]);
        setTags([]);
        setIsScheduling(true);
        setScheduledAt(new Date(new Date().setHours(10, 0, 0, 0)));
        setAutoCommenting(false);
        setEditingPost(null);
        setError(null);
    };

    const handleSchedulePost = async (status: 'scheduled' | 'draft') => {
        if (!user) return;
        if (selectedPlatforms.length === 0) {
            setError("Please select at least one social media platform.");
            return;
        }
        if (caption.trim() === '') {
            setError("Caption cannot be empty.");
            return;
        }
         if (mediaFiles.length === 0) {
            setError("Please upload at least one media file.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const mediaUrls: string[] = [];

            for (const media of mediaFiles) {
                 if (typeof media.preview === 'string' && media.preview.startsWith('http')) {
                    // This is an existing URL from an editing post
                    mediaUrls.push(media.preview);
                } else {
                    // This is a new file to upload
                    const storageRef = storage.ref(`posts/${user.uid}/${Date.now()}-${media.file.name}`);
                    const snapshot = await storageRef.put(media.file);
                    const downloadURL = await snapshot.ref.getDownloadURL();
                    mediaUrls.push(downloadURL);
                }
            }

            const postData = {
                userId: user.uid,
                caption,
                platforms: selectedPlatforms,
                tags,
                mediaUrls,
                scheduledAt: isScheduling ? scheduledAt.toISOString() : new Date().toISOString(),
                status,
                autoCommenting,
            };

            if (editingPost) {
                // Update existing post
                const postRef = db.collection('posts').doc(editingPost.id);
                await postRef.update({
                    ...postData,
                     scheduledAt: isScheduling ? firebase.firestore.Timestamp.fromDate(scheduledAt) : firebase.firestore.Timestamp.now()
                });
            } else {
                // Add new post
                await db.collection('posts').add({
                    ...postData,
                    scheduledAt: isScheduling ? firebase.firestore.Timestamp.fromDate(scheduledAt) : firebase.firestore.Timestamp.now()
                });
            }
            
            resetForm();
        } catch (error) {
            console.error("Error scheduling post:", error);
            setError("An error occurred while saving the post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeletePost = async (postId: string, mediaUrls: string[]) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            // Delete media from Storage
            for (const url of mediaUrls) {
                try {
                    const storageRef = storage.refFromURL(url);
                    await storageRef.delete();
                } catch (storageError: any) {
                    // If file doesn't exist, we can ignore the error and proceed
                    if (storageError.code !== 'storage/object-not-found') {
                        throw storageError; // Re-throw other errors
                    }
                }
            }
            // Delete post from Firestore
            await db.collection('posts').doc(postId).delete();
        } catch (error) {
            console.error("Error deleting post:", error);
            setError("Failed to delete the post.");
        }
    };

    const handleEditPost = (post: Post) => {
        setEditingPost(post);
        setSelectedPlatforms(post.platforms);
        setCaption(post.caption);
        setMediaFiles(post.mediaUrls.map(url => ({
            file: new File([], url.split('/').pop()!, { type: 'text/plain' }), // Placeholder file
            preview: url,
            type: url.includes('.mp4') || url.includes('.mov') ? 'video' : 'image' // Simple type detection
        })));
        setTags(post.tags || []);
        setAutoCommenting(post.autoCommenting || false);
        const postDate = new Date(post.scheduledAt);
        if (post.status === 'scheduled') {
            setIsScheduling(true);
            setScheduledAt(postDate);
        } else {
            setIsScheduling(false);
            setScheduledAt(new Date()); // Set to now for drafts, though it won't be shown
        }
        window.scrollTo(0, 0); // Scroll to top to see the form
    };

    const handleGenerateCaption = async () => {
        if (!mediaFiles.length && !caption) {
            setError("Please upload a media file or write a draft caption first for context.");
            return;
        }
        setIsGenerating(true);
        setError(null);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            let prompt = "Generate a social media caption.";
            if (aiPersona) {
                prompt = `${aiPersona.characteristics}. The brand persona is '${aiPersona.name}'. Avoid these topics/words: '${aiPersona.avoid}'. Now, generate a social media caption based on the following:`;
            }

            const contentParts: any[] = [{ text: prompt }];

            if (caption) {
                contentParts.push({ text: `\n\nHere's a draft to improve upon: "${caption}"` });
            }

            if (mediaFiles.length > 0) {
                 for (const mediaFile of mediaFiles) {
                    if (mediaFile.type === 'image') {
                        contentParts.push(await fileToGenerativePart(mediaFile.file));
                    }
                }
                contentParts.push({ text: "\n\nDescribe the image and generate a caption based on it." });
            }

            const result = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: { parts: contentParts },
            });
            
            const response = result;
            const text = response.text.replace(/[*#]/g, ''); // Basic cleanup
            setCaption(text);

        } catch (err) {
            console.error("AI caption generation failed:", err);
            setError("Failed to generate caption. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };


    const CreatePostForm = (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{editingPost ? "Edit Post" : "Create a new post"}</h2>
            
            <div className="space-y-6">
                {/* Platform Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Share to</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {Object.values(SocialPlatform).map(platform => (
                            <button
                                key={platform}
                                type="button"
                                onClick={() => togglePlatform(platform)}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${selectedPlatforms.includes(platform) ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                            >
                                {React.createElement(platformDetails[platform].icon, { className: 'w-6 h-6 mb-1.5' })}
                                <span className="text-xs font-semibold text-gray-700">{platform}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Caption */}
                <div>
                    <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Caption</label>
                    <div className="relative mt-1">
                        <textarea
                            id="caption"
                            rows={5}
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="w-full p-3 pr-28 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
                            placeholder="What's on your mind?"
                        />
                        <button 
                            type="button"
                            onClick={handleGenerateCaption}
                            disabled={isGenerating}
                            className="absolute top-2.5 right-2.5 flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold hover:bg-blue-200 disabled:bg-gray-200 disabled:text-gray-500 transition-colors"
                        >
                            {isGenerating ? (
                                <>
                                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                 Generating...
                                </>
                            ) : (
                                <>
                                <SparklesIcon className="w-4 h-4 mr-1.5"/>
                                AI Assist
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Scheduling Options */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="publishOption" checked={isScheduling} onChange={() => setIsScheduling(true)} className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
                                <span className="ml-2 text-sm text-gray-700">Schedule</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="publishOption" checked={!isScheduling} onChange={() => setIsScheduling(false)} className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
                                <span className="ml-2 text-sm text-gray-700">Publish now</span>
                                <span className="ml-1.5 group relative">
                                    <InfoIcon className="w-4 h-4 text-gray-400" />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        Your post will be published within a few minutes.
                                    </span>
                                </span>
                            </label>
                        </div>
                        {isScheduling && (
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 bg-gray-100 p-2 rounded-lg">
                                <Calendar selectedDate={scheduledAt} onDateChange={setScheduledAt} />
                                <TimePicker selectedTime={scheduledAt} onChange={setScheduledAt} />
                            </div>
                        )}
                    </div>
                     {/* Auto Commenting Toggle */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <label htmlFor="autoCommentingToggle" className="flex flex-col cursor-pointer pr-4">
                            <span className="font-medium text-gray-700">Auto Commenting</span>
                            <span className="text-sm text-gray-500">Enable AI to automatically comment on this post.</span>
                        </label>
                        <button
                            type="button"
                            id="autoCommentingToggle"
                            onClick={() => setAutoCommenting(!autoCommenting)}
                            className={`relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                autoCommenting ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                    autoCommenting ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                    <button type="button" onClick={resetForm} className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
                    <button
                        type="button"
                        onClick={() => handleSchedulePost('draft')}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                    >
                         {isSubmitting ? 'Saving...' : 'Save as Draft'}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSchedulePost('scheduled')}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 disabled:bg-gray-400 disabled:shadow-none"
                    >
                         {isSubmitting ? 'Saving...' : (editingPost ? 'Update Post' : 'Schedule Post')}
                    </button>
                </div>
            </div>
        </div>
    );

    const UploadArea = (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="flex-1 flex flex-col justify-center items-center text-center p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                <div className="space-y-2">
                    <UploadIcon className="w-10 h-10 text-gray-400 mx-auto" />
                    <h3 className="text-lg font-semibold text-gray-800">Upload your media</h3>
                    <p className="text-sm text-gray-500">Drag & drop a file or click to browse</p>
                    <label htmlFor="file-upload" className="cursor-pointer inline-block mt-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        Browse Files
                    </label>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                </div>
            </div>

            {mediaFiles.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Uploaded Files ({mediaFiles.length})</h4>
                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                        {mediaFiles.map((media, index) => (
                            <div key={index} className="relative group aspect-square">
                                {media.type === 'image' ? (
                                    <img src={media.preview} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
                                        <video src={media.preview} className="max-w-full max-h-full" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <PlayIcon className="w-8 h-8 text-white"/>
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={() => removeMediaFile(index)}
                                    className="absolute top-1.5 right-1.5 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Remove file"
                                >
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="lg:col-span-1 space-y-8">
                    {CreatePostForm}
                </div>
                <div className="lg:col-span-1 lg:sticky lg:top-28">
                    {UploadArea}
                </div>
            </div>

            {/* Scheduled Posts List */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Scheduled & Drafts</h2>
                {isLoading ? (
                    <div className="text-center p-8 text-gray-500">Loading posts...</div>
                ) : scheduledPosts.length === 0 ? (
                     <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                        <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-700">No posts scheduled yet</h3>
                        <p className="mt-1 text-sm">Use the form above to schedule your first post.</p>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                           {scheduledPosts.map(post => (
                               <li key={post.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-5">
                                   {post.mediaUrls[0] && (
                                       <img src={post.mediaUrls[0]} alt="Post media" className="w-full sm:w-20 h-auto sm:h-20 object-cover rounded-lg flex-shrink-0" />
                                   )}
                                   <div className="flex-1">
                                       <p className="text-sm text-gray-700 line-clamp-2">{post.caption}</p>
                                       <div className="flex items-center space-x-2 mt-2">
                                            {post.platforms.map(p => (
                                                <div key={p} title={p} className={`w-6 h-6 rounded-full flex items-center justify-center ${platformDetails[p]?.color || 'bg-gray-400'}`}>
                                                    {platformDetails[p] && React.createElement(platformDetails[p].icon, { className: 'w-3.5 h-3.5 text-white' })}
                                                </div>
                                            ))}
                                       </div>
                                   </div>
                                   <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center justify-between">
                                        <div className="text-sm text-gray-500 font-medium text-left sm:text-right">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                post.status === 'published' ? 'bg-green-100 text-green-800' :
                                                post.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                            </div>
                                            {post.status === 'scheduled' && (
                                                <p className="mt-1">{new Date(post.scheduledAt).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                                            )}
                                        </div>
                                       <div className="flex space-x-2 mt-0 sm:mt-2">
                                            <button onClick={() => handleEditPost(post)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"><EditIcon className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeletePost(post.id, post.mediaUrls)} className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-md"><TrashIcon className="w-4 h-4" /></button>
                                       </div>
                                   </div>
                               </li>
                           ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Schedule;
