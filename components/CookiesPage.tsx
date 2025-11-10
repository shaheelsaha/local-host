// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import LegalPageLayout from './LegalPageLayout';

const CookiesPage: React.FC = () => (
    <LegalPageLayout title="Cookie Policy">
        <p>
            This Cookie Policy explains how SAHA AI (“we”, “our”, “us”) uses cookies and similar tracking technologies on our website <a href="https://sahaai.io" className="text-blue-600 hover:underline">https://sahaai.io</a>.
        </p>
        <p>
            By using our website, you agree to the use of cookies as described in this policy.
        </p>

        <h2>1. What Are Cookies?</h2>
        <p>
            Cookies are small text files placed on your device when you visit a website. They help websites function, improve performance, and provide analytics insights.
        </p>
        <p>Cookies allow us to:</p>
        <ul>
            <li>Remember user preferences</li>
            <li>Understand how visitors interact with the website</li>
            <li>Improve performance and user experience</li>
            <li>Support security and account access</li>
        </ul>

        <h2>2. Types of Cookies We Use</h2>
        <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left font-semibold p-3 border-b border-gray-200">Cookie Type</th>
                        <th className="text-left font-semibold p-3 border-b border-gray-200">Description</th>
                        <th className="text-left font-semibold p-3 border-b border-gray-200">Required</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    <tr>
                        <td className="p-3"><strong>Essential Cookies</strong></td>
                        <td className="p-3">Enable core site features such as login, navigation, and security.</td>
                        <td className="p-3"><strong>Always On</strong></td>
                    </tr>
                    <tr>
                        <td className="p-3"><strong>Analytics Cookies</strong></td>
                        <td className="p-3">Help us understand how users interact with our website (e.g., page visits, clicks).</td>
                        <td className="p-3">Optional</td>
                    </tr>
                    <tr>
                        <td className="p-3"><strong>Marketing Cookies</strong></td>
                        <td className="p-3">Used to deliver ads and measure campaign effectiveness across social platforms.</td>
                        <td className="p-3">Optional</td>
                    </tr>
                    <tr>
                        <td className="p-3"><strong>Functional Cookies</strong></td>
                        <td className="p-3">Remember your preferences (language, account settings, etc.).</td>
                        <td className="p-3">Optional</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <h2>3. Third-Party Cookies</h2>
        <p>We may use cookies provided by trusted third-party services, including but not limited to:</p>
        <ul>
            <li>Google services</li>
            <li>Meta (Facebook / Instagram)</li>
            <li>TikTok</li>
            <li>LinkedIn</li>
            <li>YouTube</li>
            <li>Microsoft Ads</li>
        </ul>
        <p>These third parties may also collect information about your activity across websites.</p>
        <p>Each service has its own privacy/cookie policy.</p>

        <h2>4. Managing Cookies</h2>
        <p>You can control or delete cookies at any time by:</p>
        <ul>
            <li>Adjusting your browser settings</li>
            <li>Clearing stored cookies</li>
            <li>Blocking specific cookie categories</li>
        </ul>
        <p>Note: Disabling some cookies may affect website functionality.</p>

        <h2>5. Changes to This Policy</h2>
        <p>We may update this Cookie Policy to reflect changes in our practices. Updates will be posted on this page with a revised date at the top.</p>

        <h2>6. Contact Us</h2>
        <p>If you have questions about our Cookie Policy or data practices, contact us:</p>
        <p>Email: <a href="mailto:shaheel@sahaai.io" className="text-blue-600 hover:underline">shaheel@sahaai.io</a></p>
        <p>Website: <a href="https://sahaai.io" className="text-blue-600 hover:underline">https://sahaai.io</a></p>

    </LegalPageLayout>
);

export default CookiesPage;
