// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import LegalPageLayout from './LegalPageLayout';

const PrivacyPage: React.FC = () => (
    <LegalPageLayout title="Privacy Policy">
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us. For example, we collect information when you create an account, subscribe, participate in any interactive features of our services, fill out a form, request customer support, or otherwise communicate with us.</p>
        <p>The types of information we may collect include your name, email address, postal address, credit card information, and other contact or identifying information you choose to provide.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, such as to process transactions, develop new products, and personalize the services. We may also use the information we collect to:</p>
        <ul>
            <li>Send you technical notices, updates, security alerts, and support and administrative messages;</li>
            <li>Respond to your comments, questions, and requests and provide customer service;</li>
            <li>Communicate with you about products, services, offers, promotions, rewards, and events offered by SAHA AI and others, and provide news and information we think will be of interest to you;</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services;</li>
        </ul>

        <h2>3. Sharing of Information</h2>
        <p>We may share information about you as follows or as otherwise described in this Privacy Policy:</p>
        <ul>
            <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf;</li>
            <li>In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law, regulation or legal process;</li>
            <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of SAHA AI or others;</li>
        </ul>
        
        <h2>4. Your Choices</h2>
        <p>You may update, correct or delete information about you at any time by logging into your online account. If you wish to delete or deactivate your account, please email us, but note that we may retain certain information as required by law or for legitimate business purposes.</p>
    </LegalPageLayout>
);

export default PrivacyPage;
