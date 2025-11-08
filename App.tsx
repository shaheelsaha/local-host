// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors.
import * as React from 'react';
import firebase from 'firebase/compat/app';
import { auth, db } from './firebaseConfig';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Schedule from './components/Schedule';
import { Connections } from './components/Connections';
import SuccessPage from './components/Success';
import HomePage from './components/HomePage';
import { Post } from './types';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import CookiesPage from './components/CookiesPage';
import Persona from './components/Persona';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import PricingPage from './components/PricingPage';

// ✅ NEW: React Router
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

const App: React.FC = () => {
    const [user, setUser] = React.useState<firebase.User | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
    const scheduledPostsRef = React.useRef<Post[]>([]);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const toggleSidebarCollapse = () => setIsSidebarCollapsed(prev => !prev);
    const handleSidebarNavigate = () => setIsSidebarOpen(false); // For mobile

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    React.useEffect(() => {
        if (!user) return;

        const postsCol = db.collection('posts');
        const q = postsCol.where("userId", "==", user.uid).where("status", "==", "scheduled");

        const unsubscribeFromPosts = q.onSnapshot((snapshot) => {
            const posts: Post[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    scheduledAt: (data.scheduledAt as firebase.firestore.Timestamp).toDate().toISOString(),
                } as Post;
            });
            scheduledPostsRef.current = posts;
        });

        const intervalId = setInterval(async () => {
            const now = new Date();
            const duePosts = scheduledPostsRef.current.filter(p => new Date(p.scheduledAt) <= now);

            if (duePosts.length === 0) return;

            for (const post of duePosts) {
                 const currentPostState = scheduledPostsRef.current.find(p => p.id === post.id);
                 if (!currentPostState || currentPostState.status !== 'scheduled') {
                    continue; 
                }
                try {
                    const formData = new FormData();
                    formData.append('caption', post.caption);
                    formData.append('platforms', JSON.stringify(post.platforms));
                    formData.append('tags', JSON.stringify(post.tags));
                    formData.append('scheduledAt', post.scheduledAt);

                    const mediaUploads = await Promise.all(post.mediaUrls.map(async (url) => {
                        const response = await fetch(url);
                        if (!response.ok) throw new Error(`Failed to fetch media from ${url}`);
                        const blob = await response.blob();
                        const fileName = url.split('/').pop()?.split('?')[0].split('%2F').pop() || 'media';
                        return { blob, fileName };
                    }));

                    mediaUploads.forEach(({ blob, fileName }, index) =>
                        formData.append(`media[${index}]`, blob, fileName)
                    );

                    const response = await fetch('https://n8n.sahaai.online/webhook/sheet-status', { method: 'POST', body: formData });
                     if (!response.ok) {
                        throw new Error(`Webhook failed with status ${response.status}`);
                    }

                    await db.collection('posts').doc(post.id).update({ status: 'published' });

                } catch(error) {
                    console.error(`Failed to publish post ${post.id}:`, error);
                    await db.collection('posts').doc(post.id).update({ status: 'failed' });
                }
            }
        }, 60000);

        return () => {
            unsubscribeFromPosts();
            clearInterval(intervalId);
        };
    }, [user]);

    const handleLogout = () => auth.signOut();
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const LoggedInLayout = () => (
        <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
            <Sidebar
                onLinkClick={handleSidebarNavigate}
                isOpen={isSidebarOpen}
                toggle={toggleSidebar}
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={toggleSidebarCollapse}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={user!} onLogout={handleLogout} toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
    
    // A component to handle conditional rendering based on auth state
    const AppRoutes = () => {
        if (!user) {
            // Public routes for non-logged-in users
            return (
                 <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/cookies" element={<CookiesPage />} />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            );
        }

        // Protected routes for logged-in users
        return (
            <Routes>
                <Route element={<LoggedInLayout />}>
                    <Route index element={<Navigate to="/schedule" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/settings" element={<Settings user={user} />} />
                    <Route path="/connections" element={<Connections />} />
                    <Route path="/persona" element={<Persona user={user} />} />
                    {/* Redirect any other authenticated path to the default page */}
                    <Route path="*" element={<Navigate to="/schedule" replace />} />
                </Route>
            </Routes>
        );
    };


    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};

export default App;