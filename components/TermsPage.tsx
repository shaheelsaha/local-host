// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import LegalPageLayout from './LegalPageLayout';

const TermsPage: React.FC = () => (
    <LegalPageLayout title="Terms of Service">
        <h2>1. Introduction</h2>
        <p>Welcome to SAHA AI ("Company", "we", "our", "us")! These Terms of Service ("Terms"), govern your use of our website and services (together or individually "Service") operated by SAHA AI.</p>
        <p>Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Please read it here <a href="/privacy" className="text-blue-600 hover:underline">/privacy</a>.</p>
        
        <h2>2. Using Our Services</h2>
        <p>You must follow any policies made available to you within the Services. Don’t misuse our Services. For example, don’t interfere with our Services or try to access them using a method other than the interface and the instructions that we provide.</p>

        <h2>3. Your SAHA AI Account</h2>
        <p>You may need a SAHA AI Account in order to use some of our Services. You may create your own SAHA AI Account, or your SAHA AI Account may be assigned to you by an administrator, such as your employer or educational institution. If you are using a SAHA AI Account assigned to you by an administrator, different or additional terms may apply and your administrator may be able to access or disable your account.</p>

        <h2>4. Content in Our Services</h2>
        <p>Our Services display some content that is not SAHA AI's. This content is the sole responsibility of the entity that makes it available. We may review content to determine whether it is illegal or violates our policies, and we may remove or refuse to display content that we reasonably believe violates our policies or the law. But that does not necessarily mean that we review content, so please don’t assume that we do.</p>
        
        <h2>5. Modifying and Terminating our Services</h2>
        <p>We are constantly changing and improving our Services. We may add or remove functionalities or features, and we may suspend or stop a Service altogether. You can stop using our Services at any time, although we’ll be sorry to see you go. SAHA AI may also stop providing Services to you, or add or create new limits to our Services at any time.</p>
    </LegalPageLayout>
);
export default TermsPage;
