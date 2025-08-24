import React, { useState } from 'react';
import { MapPin, Calendar, Filter, Eye, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Report {
  id: number;
  location: string;
  coordinates: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'resolved' | 'rejected';
  violations: string[];
  severity: 'low' | 'medium' | 'high';
  points: number;
  imageUrl: string;
}

const Reports = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'resolved' | 'rejected'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const reports: Report[] = [
    {
      id: 1,
      location: 'MG Road Junction',
      coordinates: '12.9716, 77.5946',
      timestamp: '2024-01-15 14:30',
      status: 'verified',
      violations: ['Oversized billboard', 'Blocking traffic sign'],
      severity: 'high',
      points: 100,
      imageUrl: 'https://images.pexels.com/photos/1666073/pexels-photo-1666073.jpeg'
    },
    {
      id: 2,
      location: 'Brigade Road',
      coordinates: '12.9698, 77.6083',
      timestamp: '2024-01-14 09:15',
      status: 'pending',
      violations: ['No license QR code visible'],
      severity: 'medium',
      points: 50,
      imageUrl: 'https://images.pexels.com/photos/1666073/pexels-photo-1666073.jpeg'
    },
    {
      id: 3,
      location: 'Commercial Street',
      coordinates: '12.9833, 77.6092',
      timestamp: '2024-01-13 16:45',
      status: 'resolved',
      violations: ['Inappropriate content for family area'],
      severity: 'low',
      points: 75,
      imageUrl: 'https://images.pexels.com/photos/1666073/pexels-photo-1666073.jpeg'
    },
    {
      id: 4,
      location: 'Koramangala 4th Block',
      coordinates: '12.9352, 77.6245',
      timestamp: '2024-01-12 11:20',
      status: 'rejected',
      violations: ['Billboard appears compliant upon review'],
      severity: 'low',
      points: 0,
      imageUrl: 'https://images.pexels.com/photos/1666073/pexels-photo-1666073.jpeg'
    }
  ];

  const filteredReports = filter === 'all' ? reports : reports.filter(report => report.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'resolved': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'resolved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalPoints = reports.reduce((sum, report) => sum + report.points, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Stats Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Reports Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{reports.length}</p>
            <p className="text-sm text-gray-600">Total Reports</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{reports.filter(r => r.status === 'verified').length}</p>
            <p className="text-sm text-gray-600">Verified</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{reports.filter(r => r.status === 'pending').length}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{totalPoints}</p>
            <p className="text-sm text-gray-600">Points Earned</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <Filter className="h-5 w-5 text-gray-600" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Reports</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <h3 className="font-medium text-gray-900">{report.location}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getSeverityColor(report.severity)}`}>
                      {report.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Coordinates: {report.coordinates}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{report.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(report.status)}
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(report.status)}`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>
                    <span className="text-blue-600 font-medium">+{report.points} points</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                >
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">View</span>
                </button>
              </div>

              <div className="border-l-4 border-gray-200 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">Violations Reported:</h4>
                <ul className="space-y-1">
                  {report.violations.map((violation, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{violation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
          <p className="text-gray-600">No reports match your current filter criteria.</p>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <img
                src={selectedReport.imageUrl}
                alt="Billboard report"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                  <p className="text-sm text-gray-600">{selectedReport.location}</p>
                  <p className="text-sm text-gray-500">{selectedReport.coordinates}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Status</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedReport.status)}
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Violations</h3>
                <ul className="space-y-2">
                  {selectedReport.violations.map((violation, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{violation}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Points Earned:</span>
                  <span className="font-medium text-blue-600">+{selectedReport.points}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Reported:</span>
                  <span className="text-gray-900">{selectedReport.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;