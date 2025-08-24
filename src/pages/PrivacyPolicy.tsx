import React from 'react';
import { Shield, Lock, Eye, Database } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b bg-blue-50">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600">How UrbanWatch protects your privacy</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Commitment to Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              At UrbanWatch, we are committed to protecting your privacy while helping improve urban environments. 
              This privacy policy explains how we collect, use, and protect your information when you use our 
              billboard monitoring application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3 mb-3">
                <Lock className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold text-green-900">Data Security</h3>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• End-to-end encryption for all data</li>
                <li>• Secure cloud storage with backups</li>
                <li>• Regular security audits and updates</li>
                <li>• No unauthorized access or sharing</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <Eye className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">No Face Recognition</h3>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• AI focuses only on billboards</li>
                <li>• No personal identification features</li>
                <li>• Automatic blur of sensitive areas</li>
                <li>• Privacy-first computer vision</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">📷 Photos and Images</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>What we collect:</strong> Images of billboards that you capture using the app
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>How we use it:</strong> AI analysis to detect violations and regulatory compliance
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Privacy protection:</strong> Automatic removal of personal identifiers, no facial recognition
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">📍 Location Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>What we collect:</strong> GPS coordinates when you take photos
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>How we use it:</strong> Verify billboard placement compliance and generate location-based reports
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Privacy protection:</strong> Approximate location only, can be disabled in settings
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">👤 Account Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>What we collect:</strong> Email address, username, and activity statistics
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>How we use it:</strong> Account management, progress tracking, and reward system
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Privacy protection:</strong> Optional public profile, can be kept private
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How We Protect Your Data</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Secure Storage</h3>
                <p className="text-sm text-gray-600">Encrypted databases with restricted access</p>
              </div>
              <div className="text-center p-4">
                <Lock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Data Encryption</h3>
                <p className="text-sm text-gray-600">All data encrypted in transit and at rest</p>
              </div>
              <div className="text-center p-4">
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Access Control</h3>
                <p className="text-sm text-gray-600">Strict authentication and authorization</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Rights and Controls</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-medium text-yellow-900 mb-3">You have the right to:</h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li>• <strong>Access your data:</strong> View all information we have about you</li>
                <li>• <strong>Correct your data:</strong> Update or fix any incorrect information</li>
                <li>• <strong>Delete your data:</strong> Request complete removal of your account and data</li>
                <li>• <strong>Export your data:</strong> Download your reports and activity history</li>
                <li>• <strong>Control sharing:</strong> Choose what information is public or private</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Sharing and Usage</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900"><strong>With Municipal Authorities:</strong> Anonymized violation reports for regulatory enforcement</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900"><strong>For Research:</strong> Aggregated, anonymized data for urban planning research</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900"><strong>Never shared:</strong> Personal photos, exact location data, or identifying information</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                If you have any questions about this privacy policy or how we handle your data, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@urbanwatch.app</p>
                <p><strong>Address:</strong> UrbanWatch Privacy Office, Tech Park, Bangalore</p>
                <p><strong>Phone:</strong> +91-80-XXXX-XXXX</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-gray-500">
              This privacy policy was last updated on January 15, 2024. We may update this policy from time to time, 
              and we will notify you of any significant changes through the app or via email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;