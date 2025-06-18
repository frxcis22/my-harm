import React, { useState } from 'react';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  Archive, 
  Download,
  Link,
  Trash2,
  Search
} from 'lucide-react';

const Uploads = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isDragOver, setIsDragOver] = useState(false);

  // Mock data
  const documents = [
    {
      id: 1,
      name: 'Security_Audit_Report_2024.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedAt: new Date('2024-01-15'),
      tags: ['Audit', 'Report'],
      linkedTo: 'Advanced Phishing Detection'
    },
    {
      id: 2,
      name: 'Vendor_Assessment_Template.docx',
      type: 'docx',
      size: '1.8 MB',
      uploadedAt: new Date('2024-01-12'),
      tags: ['Template', 'VendorRisk'],
      linkedTo: null
    },
    {
      id: 3,
      name: 'Network_Topology_Diagram.png',
      type: 'png',
      size: '856 KB',
      uploadedAt: new Date('2024-01-10'),
      tags: ['Diagram', 'Network'],
      linkedTo: 'Zero-Day Exploit Analysis'
    },
    {
      id: 4,
      name: 'Incident_Response_Playbook.zip',
      type: 'zip',
      size: '5.2 MB',
      uploadedAt: new Date('2024-01-08'),
      tags: ['Playbook', 'IncidentResponse'],
      linkedTo: null
    },
    {
      id: 5,
      name: 'Security_Policy_Document.pdf',
      type: 'pdf',
      size: '3.1 MB',
      uploadedAt: new Date('2024-01-05'),
      tags: ['Policy', 'Compliance'],
      linkedTo: 'Vendor Risk Assessment Framework'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Files', count: documents.length },
    { id: 'pdf', label: 'PDF', count: documents.filter(d => d.type === 'pdf').length },
    { id: 'docx', label: 'Documents', count: documents.filter(d => d.type === 'docx').length },
    { id: 'images', label: 'Images', count: documents.filter(d => ['png', 'jpg', 'jpeg'].includes(d.type)).length },
    { id: 'archives', label: 'Archives', count: documents.filter(d => ['zip', 'rar'].includes(d.type)).length },
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'images' && ['png', 'jpg', 'jpeg'].includes(doc.type)) ||
                         (selectedFilter === 'archives' && ['zip', 'rar'].includes(doc.type)) ||
                         doc.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <Image className="h-8 w-8 text-green-500" />;
      case 'zip':
      case 'rar':
        return <Archive className="h-8 w-8 text-orange-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    // Handle file upload logic here
    console.log('Files dropped:', e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Uploads</h1>
          <p className="text-muted">Securely store and manage your documents and files</p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`card p-8 border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="h-12 w-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Drop files here</h3>
          <p className="text-muted mb-4">
            Upload .pdf, .docx, .png, .jpg files — max 10MB each
          </p>
          <button className="btn btn-primary">
            <Upload className="h-4 w-4 mr-2" />
            Choose Files
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-1">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted hover:text-foreground'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              {getFileIcon(doc.type)}
              <div className="flex space-x-1">
                <button className="p-1 hover:bg-muted rounded">
                  <Link className="h-4 w-4" />
                </button>
                <button className="p-1 hover:bg-muted rounded">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-1 hover:bg-muted rounded hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-1 line-clamp-2">{doc.name}</h3>
              <div className="flex items-center justify-between text-sm text-muted mb-2">
                <span>{doc.size}</span>
                <span>{doc.uploadedAt.toLocaleDateString()}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {doc.tags.map((tag) => (
                  <span key={tag} className="tag text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              
              {doc.linkedTo && (
                <div className="text-xs text-muted">
                  Linked to: <span className="text-primary">{doc.linkedTo}</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button className="btn btn-ghost btn-sm flex-1">
                <Link className="h-4 w-4 mr-1" />
                Link to Post
              </button>
              <button className="btn btn-primary btn-sm flex-1">
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <File className="h-12 w-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No files found</h3>
          <p className="text-muted mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
          </p>
          {!searchQuery && (
            <button className="btn btn-primary">
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Uploads; 