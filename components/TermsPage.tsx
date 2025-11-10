// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import LegalPageLayout from './LegalPageLayout';

const TermsPage: React.FC = () => (
    <LegalPageLayout title="Terms of Service">
        <p>Welcome to SAHA AI (“Company”, “we”, “our”, “us”).</p>
        <p>These Terms of Service (“Terms”) govern your access to and use of our website, platform, products, and services (collectively, the “Service”).</p>
        <p>By accessing or using the Service, you agree to these Terms. If you do not agree, do not use the Service.</p>

        <h2>1. Use of the Service</h2>
        <p>You may use the Service only in compliance with these Terms and all applicable laws. You agree not to:</p>
        <ul>
            <li>Use the Service for unlawful activities.</li>
            <li>Try to gain unauthorized access to systems or accounts.</li>
            <li>Copy, reverse engineer, or attempt to extract the source code of our software.</li>
            <li>Use our Service to create or distribute harmful, misleading, or illegal content.</li>
        </ul>

        <h2>2. Accounts</h2>
        <p>To access some features, you may need to create a SAHA AI Account. You are responsible for:</p>
        <ul>
            <li>Keeping your login credentials secure.</li>
            <li>All activity that occurs under your account.</li>
        </ul>
        <p>We may suspend or terminate accounts used in violation of these Terms.</p>

        <h2>3. Data & Privacy</h2>
        <p>Your use of the Service is also governed by our Privacy Policy and Cookie Policy, which describe how we collect, use, and store data.</p>
        <ul>
            <li>Privacy Policy: <a href="/privacy" className="text-blue-600 hover:underline">https://sahaai.io/privacy</a></li>
            <li>Cookie Policy: <a href="/cookies" className="text-blue-600 hover:underline">https://sahaai.io/cookie-policy</a></li>
        </ul>
        
        <h2>4. Content Ownership</h2>
        <p>All content, software, branding, logos, and features in the Service are owned by SAHA AI or our partners and are protected by intellectual property laws.</p>
        <p>You may not copy, resell, or redistribute any part of the Service without written permission.</p>

        <h2>5. AI-Generated Output</h2>
        <p>Our platform may generate texts, predictions, images, or recommendations using AI. You understand and agree that:</p>
        <ul>
            <li>AI output may contain errors.</li>
            <li>You are responsible for verifying any information before using it.</li>
            <li>We are not liable for decisions made based on AI outputs.</li>
        </ul>

        <h2>6. Payments & Subscriptions (If applicable)</h2>
        <p>If paid features are offered:</p>
        <ul>
            <li>Fees will be displayed before purchase.</li>
            <li>Payments are final unless otherwise stated.</li>
            <li>We may change pricing with notice.</li>
        </ul>
        <p>If you are not offering paid plans yet, this section still protects future updates.</p>

        <h2>7. Service Changes & Availability</h2>
        <p>We may modify, update, suspend, or discontinue any Service at any time. We are not liable if the Service becomes unavailable.</p>

        <h2>8. Disclaimer of Warranties</h2>
        <p>The Service is provided “AS IS” and “AS AVAILABLE.” We make no guarantees regarding:</p>
        <ul>
            <li>Accuracy of information</li>
            <li>Performance</li>
            <li>Reliability</li>
            <li>Availability</li>
        </ul>
        <p>You use the Service at your own risk.</p>

        <h2>9. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law: SAHA AI is not liable for:</p>
        <ul>
            <li>Loss of profits</li>
            <li>Loss of data</li>
            <li>Business interruption</li>
            <li>Indirect, incidental, special, or consequential damages</li>
        </ul>
        <p>Even if we have been advised of the possibility of such damages.</p>

        <h2>10. Indemnification</h2>
        <p>You agree to defend, indemnify, and hold harmless SAHA AI from any claims arising from your use of the Service or violation of these Terms.</p>
        
        <h2>11. Governing Law</h2>
        <p>These Terms are governed worldwide, but any disputes will be handled under the legal jurisdiction where SAHA AI is operating.</p>

        <h2>12. Contact</h2>
        <p>For questions or concerns:</p>
        <p>Email: <a href="mailto:shaheel@sahaai.io" className="text-blue-600 hover:underline">shaheel@sahaai.io</a></p>
        <p>Website: <a href="https://sahaai.io" className="text-blue-600 hover:underline">https://sahaai.io</a></p>
    </LegalPageLayout>
);
export default TermsPage;