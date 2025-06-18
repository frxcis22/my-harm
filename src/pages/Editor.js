import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Save, 
  Eye, 
  EyeOff, 
  Upload, 
  Tag, 
  Globe, 
  Lock,
  ArrowLeft,
  Trash2,
  Edit
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      visibility: 'private',
      excerpt: ''
    }
  });

  const watchedContent = watch('content');
  const watchedTitle = watch('title');

  // Auto-save functionality
  useEffect(() => {
    if (!watchedContent && !watchedTitle) return;

    const autoSaveTimer = setTimeout(() => {
      if (watchedContent || watchedTitle) {
        setAutoSaveStatus('saving');
        // Simulate auto-save
        setTimeout(() => {
          setAutoSaveStatus('saved');
          toast.success('Auto-saved');
        }, 1000);
      }
    }, 15000); // Auto-save every 15 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [watchedContent, watchedTitle]);

  // Load article data if editing
  useEffect(() => {
    if (id) {
      // Mock data - in real app, fetch from API
      setValue('title', 'Advanced Phishing Detection Techniques');
      setValue('content', `# Advanced Phishing Detection Techniques

## Introduction

Phishing attacks continue to evolve, becoming more sophisticated and harder to detect. This article explores advanced techniques for identifying and preventing these threats.

## Key Detection Methods

### 1. Behavioral Analysis
\`\`\`python
def analyze_user_behavior(user_actions):
    suspicious_patterns = []
    for action in user_actions:
        if action.risk_score > 0.8:
            suspicious_patterns.append(action)
    return suspicious_patterns
\`\`\`

### 2. Machine Learning Models
- **Random Forest**: 95% accuracy
- **Neural Networks**: 97% accuracy
- **Ensemble Methods**: 98% accuracy

## Best Practices

1. **Multi-factor Authentication**
2. **Email Security Gateways**
3. **User Training Programs**
4. **Regular Security Audits**

## Conclusion

Implementing these advanced detection techniques can significantly reduce the risk of successful phishing attacks.`);
      setValue('excerpt', 'Exploring the latest methods to identify and prevent sophisticated phishing attacks that target enterprise environments.');
      setTags(['ThreatIntel', 'Detection']);
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(id ? 'Article updated successfully!' : 'Article created successfully!');
      navigate('/articles');
    } catch (error) {
      toast.error('Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/articles')}
            className="btn btn-ghost"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </button>
          <div>
            <h1 className="text-2xl font-bold font-heading">
              {id ? 'Edit Article' : 'New Article'}
            </h1>
            <p className="text-muted">
              {id ? 'Update your article content and settings' : 'Create a new cybersecurity article'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted">
            {autoSaveStatus === 'saving' && 'Saving...'}
            {autoSaveStatus === 'saved' && 'All changes saved'}
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="btn btn-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Article Settings */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Article Settings</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="input"
                placeholder="Enter article title..."
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium mb-2">Visibility</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    {...register('visibility')}
                    type="radio"
                    value="private"
                    className="text-primary"
                  />
                  <Lock className="h-4 w-4" />
                  <span>Private</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    {...register('visibility')}
                    type="radio"
                    value="public"
                    className="text-primary"
                  />
                  <Globe className="h-4 w-4" />
                  <span>Public</span>
                </label>
              </div>
            </div>

            {/* Excerpt */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <textarea
                {...register('excerpt')}
                className="input min-h-[80px]"
                placeholder="Brief description of your article..."
              />
            </div>

            {/* Tags */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="tag flex items-center space-x-1"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <form onSubmit={addTag} className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="input flex-1"
                  placeholder="Add a tag..."
                />
                <button
                  type="submit"
                  className="btn btn-secondary"
                >
                  <Tag className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Editor/Preview Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className={`btn ${!isPreview ? 'btn-primary' : 'btn-ghost'}`}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className={`btn ${isPreview ? 'btn-primary' : 'btn-ghost'}`}
            >
              {isPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              Preview
            </button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted">
            <span>Auto-save every 15 seconds</span>
          </div>
        </div>

        {/* Editor/Preview Area */}
        <div className="card min-h-[600px]">
          {isPreview ? (
            <div className="p-6 prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown components={markdownComponents}>
                {watchedContent || '# Start writing your article...'}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="p-6">
              <textarea
                {...register('content', { required: 'Content is required' })}
                className="w-full h-[600px] p-4 font-mono text-sm border-0 resize-none focus:outline-none bg-transparent"
                placeholder="# Start writing your article...

## Use Markdown

You can use **bold**, *italic*, and `code` formatting.

### Code Blocks
\`\`\`python
def hello_world():
    print('Hello, Cybersecurity!')
\`\`\`

### Lists
- Point 1
- Point 2
- Point 3

### Links
[Learn more](https://example.com)

Start writing your cybersecurity insights..."
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-2">{errors.content.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="btn btn-ghost"
            >
              <Upload className="h-4 w-4 mr-2" />
              Attach Files
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {id && (
              <button
                type="button"
                className="btn btn-ghost text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : (id ? 'Update Article' : 'Publish Article')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Editor; 