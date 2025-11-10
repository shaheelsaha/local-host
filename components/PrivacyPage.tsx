// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import LegalPageLayout from './LegalPageLayout';

const PrivacyPage: React.FC = () => (
    <LegalPageLayout title="Privacy Policy">
        <p>
            This Privacy Policy describes how SAHA AI (“we”, “our”, or “us”) collects, uses, and protects your personal information when you use our website <a href="https://sahaai.io" className="text-blue-600 hover:underline">https://sahaai.io</a> and related services (the “Service”).
        </p>
        <p>
            By accessing or using the Service, you agree to this Privacy Policy.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We may collect the following information:</p>
        
        <p className="font-semibold mt-4 mb-2">a. Personal Information</p>
        <p>Information you provide directly, such as:</p>
        <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Account details</li>
            <li>Any data you submit through forms or inputs</li>
        </ul>

        <p className="font-semibold mt-4 mb-2">b. Usage Data</p>
        <p>Automatically collected data, such as:</p>
        <ul>
            <li>IP address</li>
            <li>Browser type and device information</li>
            <li>Pages visited and actions taken on the site</li>
            <li>Time and date of visits</li>
        </ul>

        <p className="font-semibold mt-4 mb-2">c. Cookies & Tracking</p>
        <p>
            We use cookies to improve site performance and user experience. For more details, see our Cookie Policy at: <a href="/cookies" className="text-blue-600 hover:underline">https://sahaai.io/cookie-policy</a>
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
            <li>Provide and maintain our services</li>
            <li>Improve website performance and usability</li>
            <li>Communicate with you regarding support or updates</li>
            <li>Personalize your experience</li>
            <li>Analyze site usage for product development</li>
            <li>Enhance security and prevent misuse</li>
        </ul>
        <p><strong>We do not sell personal data.</strong></p>

        <h2>3. Sharing of Information</h2>
        <p>We may share information with:</p>
        <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left font-semibold p-3 border-b border-gray-200">Type</th>
                        <th className="text-left font-semibold p-3 border-b border-gray-200">Purpose</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    <tr>
                        <td className="p-3">Service providers</td>
                        <td className="p-3">Hosting, maintenance, customer support</td>
                    </tr>
                    <tr>
                        <td className="p-3">Analytics platforms</td>
                        <td className="p-3">Understanding user activity and improving performance</td>
                    </tr>
                    <tr>
                        <td className="p-3">Marketing platforms</td>
                        <td className="p-3">If marketing/retargeting is enabled</td>
                    </tr>
                    <tr>
                        <td className="p-3">Legal authorities</td>
                        <td className="p-3">Only if required by law</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>All third parties must follow privacy and data protection requirements.</p>
        
        <h2>4. Data Storage & Security</h2>
        <p>We use industry-standard security measures to protect your information. However, no data transmission over the internet is completely secure. You use the Service at your own risk.</p>

        <h2>5. Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
            <li>Request access to your personal data</li>
            <li>Request correction or deletion</li>
            <li>Withdraw consent for marketing or tracking</li>
            <li>Ask how your data is processed</li>
        </ul>
        <p>To submit a request, please contact us at: <a href="mailto:shaheel@sahaai.io" className="text-blue-600 hover:underline">shaheel@sahaai.io</a></p>

        <h2>6. International Data Transfers</h2>
        <p>Because we operate worldwide, your information may be processed in multiple regions. We ensure appropriate safeguards when transferring data internationally.</p>

        <h2>7. Links to Third-Party Services</h2>
        <p>Our website may contain links to external services. We are not responsible for their privacy practices. We encourage you to review their policies separately.</p>

        <h2>8. Changes to This Policy</h2>
        <p>We may update this Privacy Policy as needed. Changes will be posted with a revised date at the top of this page.</p>
        
        <h2>9. Contact Us</h2>
        <p>If you have any questions about this policy or your data:</p>
        <p><strong>Email:</strong> <a href="mailto:shaheel@sahaai.io" className="text-blue-600 hover:underline">shaheel@sahaai.io</a></p>
        <p><strong>Website:</strong> <a href="https://sahaai.io" className="text-blue-600 hover:underline">https://sahaai.io</a></p>
    </LegalPageLayout>
);

export default PrivacyPage;