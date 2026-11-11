import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Clock,
  Tag,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calculator,
} from 'lucide-react';
import { BlogPost } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, Input } from '../common/FormField';
import { HtmlEditor } from './HtmlEditor';

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (blogData: Omit<BlogPost, 'id' | 'createdAt'>) => void;
  initialData?: BlogPost | null;
}

const coverPresets = [
  {
    label: 'Modern Skyline',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Luxury Interior',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Balcony Terrace',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Penthouse View',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Architectural Facade',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Private Estate',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  },
];

const typeSuggestions = [
  'Market Analysis',
  'Architecture & Design',
  'Investment Guide',
  'Luxury Lifestyle',
  'Interior Architecture',
  'Legal & Tenancy',
];

export const BlogFormModal: React.FC<BlogFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [type, setType] = useState('Market Analysis');
  const [readTime, setReadTime] = useState('5 min read');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('DPL Editorial');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setImage(initialData.image || '');
      setType(initialData.type || 'Market Analysis');
      setReadTime(initialData.readTime || '5 min read');
      setDescription(initialData.description || '');
      setAuthor(initialData.author || 'DPL Editorial');
      setStatus(initialData.status || 'published');
      setTagsInput(initialData.tags ? initialData.tags.join(', ') : '');
    } else {
      setTitle('');
      setImage('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80');
      setType('Market Analysis');
      setReadTime('5 min read');
      setDescription(
        `<h2>Introduction to the Topic</h2>\n<p>Write your detailed real estate analysis or article content here. You can use <strong>bold highlights</strong>, lists, blockquotes, and headings.</p>\n<h3>Strategic Takeaways</h3>\n<ul>\n  <li>First key observation or trend</li>\n  <li>Second key observation or recommendation</li>\n</ul>`
      );
      setAuthor('DPL Editorial');
      setStatus('published');
      setTagsInput('Luxury, Investment, Real Estate');
    }
    setError(null);
  }, [initialData, isOpen]);

  // Helper to auto-calculate read time from HTML content
  const handleCalculateReadTime = () => {
    // Strip HTML tags to count words
    const plainText = description.replace(/<[^>]*>?/gm, ' ').trim();
    const wordCount = plainText ? plainText.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(wordCount / 180));
    setReadTime(`${minutes} min read`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Article title is required.');
      return;
    }
    if (!image.trim()) {
      setError('Cover image URL is required.');
      return;
    }
    if (!type.trim()) {
      setError('Article type (category) is required.');
      return;
    }
    if (!readTime.trim()) {
      setError('Read time is required.');
      return;
    }
    if (!description.trim()) {
      setError('Article description (HTML content) is required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      image: image.trim(),
      type: type.trim(),
      readTime: readTime.trim(),
      description: description.trim(),
      author: author.trim() || 'DPL Editorial',
      status,
      tags,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Blog Article' : 'Create New Blog Article'}
      subtitle={
        initialData
          ? `Update "${initialData.title}"`
          : 'Compose and publish a rich HTML article for the DPL Horizon journal'
      }
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Article Title */}
        <FormField label="Article Title" required>
          <Input
            placeholder="e.g. 2026 Metropolitan Luxury Real Estate: Navigating Market Growth & Prime Urban Yields"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormField>

        {/* 2. Cover Image with Visual Presets & Live Preview */}
        <div className="space-y-2">
          <FormField label="Cover / Featured Image URL" required>
            <Input
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </FormField>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs text-slate-500 font-medium">Cover presets:</span>
            {coverPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setImage(preset.url)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer min-h-[32px] ${
                  image === preset.url
                    ? 'bg-sky-100 text-sky-900 border-sky-400 font-bold'
                    : 'bg-white text-sky-850 border-sky-200 hover:border-sky-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Image Preview */}
          {image && (
            <div className="relative aspect-21/9 rounded-2xl overflow-hidden border border-sky-200 bg-slate-900 mt-2">
              <img
                src={image}
                alt="Article cover preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-xs text-white/90 font-medium truncate">
                  Cover Preview: {title || 'Untitled Article'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Type (Input Text) & Read Time (Input Text) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Article Type - Explicit input text as requested */}
          <div className="space-y-1.5">
            <FormField
              label="Article Type (Input Text)"
              required
              hint="Free-form type: Market Analysis, Architecture, Investment, etc."
            >
              <Input
                placeholder="e.g. Market Analysis"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              />
            </FormField>

            {/* Quick Type suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-xs text-slate-400">Suggestions:</span>
              {typeSuggestions.map((sugg) => (
                <button
                  key={sugg}
                  type="button"
                  onClick={() => setType(sugg)}
                  className={`text-xs px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    type === sugg
                      ? 'bg-sky-100 text-sky-900 border-sky-400 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  {sugg}
                </button>
              ))}
            </div>
          </div>

          {/* Read Time - Explicit input text as requested */}
          <div className="space-y-1.5">
            <FormField
              label="Read Time (Input Text)"
              required
              hint="e.g. 5 min read"
            >
              <div className="flex items-center gap-2">
                <Input
                  placeholder="e.g. 5 min read"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={handleCalculateReadTime}
                  title="Auto calculate read time from HTML content"
                  className="px-3 py-2 text-xs font-bold text-sky-850 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-xl transition-colors cursor-pointer shrink-0 flex items-center gap-1 min-h-[44px]"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Calc</span>
                </button>
              </div>
            </FormField>
          </div>
        </div>

        {/* 4. Description (HTML Text Editor) - Explicit requirement */}
        <HtmlEditor
          value={description}
          onChange={setDescription}
          label="Article Description (HTML Text)"
          placeholder="<h1>Heading</h1><p>Article body in HTML...</p>"
        />

        {/* 5. Author, Status & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
          <FormField label="Author Byline">
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. DPL Editorial"
            />
          </FormField>

          <FormField label="Tags (Comma-separated)">
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Penthouse, ROI, Trends"
            />
          </FormField>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Publication Status
            </label>
            <div className="flex items-center gap-2 pt-1.5">
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer min-h-[40px] ${
                  status === 'published'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                Published
              </button>
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer min-h-[40px] ${
                  status === 'draft'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                Draft
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            {initialData ? 'Update Article' : 'Publish Article'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
