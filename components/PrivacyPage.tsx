// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import LegalPageLayout from './LegalPageLayout';

const PrivacyPage: React.FC = () => (
    <LegalPageLayout title="Privacy Policy">
        <p>
            This Privacy Policy explains how <strong>SAHA AI</strong> ("we", "our", or "us") collects, uses, and protects your information when you use our website <a href="https://sahaai.io" className="text-blue-600 hover:underline">https://sahaai.io</a>, our applications, and related services (collectively, the “Service”).
        </p>
        <p>
            By accessing or using the Service, you agree to the practices described in this Privacy Policy.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We may collect:</p>
        <ul>
            <li><strong>Personal Information</strong>: Name, email address, phone number, account details.</li>
            <li><strong>Usage Data</strong>: Device information, pages visited, interactions, log files.</li>
            <li><strong>Content You Provide</strong>: Messages, files, forms, and interactions with our AI services.</li>
            <li><strong>Social Media or Third-Party Login Data</strong> (if connected).</li>
        </ul>

        <h2>2. How We Use Your Data</h2>
        <p>We use your information to:</p>
        <ul>
            <li>Operate and improve our platform and services.</li>
            <li>Provide customer support and respond to messages.</li>
            <li>Personalize features and recommendations.</li>
            <li>Monitor usage for analytics and optimization.</li>
            <li>Run marketing or promotional campaigns (only with consent).</li>
            <li>Maintain security and prevent abuse or fraud.</li>
        </ul>

        <h2>3. Sharing of Information</h2>
        <p><strong>We do not sell personal data.</strong></p>
        <p>We may share data with:</p>
        <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left font-semibold p-3 border-b border-gray-200">Type of Third Party</th>
                        <th className="text-left font-semibold p-3 border-b border-gray-200">Purpose</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    <tr>
                        <td className="p-3">Analytics Tools (e.g., Google Analytics)</td>
                        <td className="p-3">Understand platform usage</td>
                    </tr>
                    <tr>
                        <td className="p-3">Advertising Platforms (e.g., Meta, TikTok, Google Ads)</td>
                        <td className="p-3">Run marketing campaigns</td>
                    </tr>
                    <tr>
                        <td className="p-3">Social Media Tools</td>
                        <td className="p-3">Sharing/content integration</td>
                    </tr>
                    <tr>
                        <td className="p-3">Hosting & Cloud Infrastructure Providers</td>
                        <td className="p-3">Secure system operation</td>
                    </tr>
                    <tr>
                        <td className="p-3">Customer Support Services</td>
                        <td className="p-3">Assistance & communication</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>All third-party providers must follow required privacy and security standards.</p>

        <h2>4. Cookies & Tracking</h2>
        <p>We use cookies to:</p>
        <ul>
            <li>Enable website functionality</li>
            <li>Track usage analytics</li>
            <li>Personalize content & ads</li>
            <li>Improve user experience</li>
        </ul>
        <p>See the <a href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</a> for full details.</p>

        <h2>5. Data Protection & Security</h2>
        <p>We use industry-standard encryption and security safeguards. However, no system is completely secure; use the Service at your own risk.</p>

        <h2>6. Your Rights</h2>
        <p>Depending on your region, you may:</p>
        <ul>
            <li>Request access to your data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing or tracking</li>
            <li>Withdraw consent at any time</li>
        </ul>
        <p>To submit a request, email us at: <a href="mailto:shaheel@sahaai.io" className="text-blue-600 hover:underline"><strong>shaheel@sahaai.io</strong></a></p>

        <h2>7. International Processing</h2>
        <p>Because we operate <strong>worldwide</strong>, your information may be processed in multiple regions. We ensure compliance with applicable global privacy regulations.</p>

        <h2>8. Contact Us</h2>
        <p>For questions:</p>
        <p><strong>Email:</strong> <a href="mailto:shaheel@sahaai.io" className="text-blue-600 hover:underline">shaheel@sahaai.io</a></p>
        <p><strong>Website:</strong> <a href="https://sahaai.io" className="text-blue-600 hover:underline">https://sahaai.io</a></p>
    </LegalPageLayout>
);

export default PrivacyPage;
