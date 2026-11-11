import React from 'react';
import {
  Calendar,
  Clock,
  Tag,
  User,
  Edit2,
  Trash2,
  Share2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { BlogPost } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface BlogDetailsModalProps {
  blog: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (blog: BlogPost) => void;
  onDelete?: (blogId: string) => void;
}

export const BlogDetailsModal: React.FC<BlogDetailsModalProps> = ({
  blog,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!blog) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="3xl" showCloseButton={true}>
      <div className="space-y-6">
        {/* Hero Cover Image */}
        <div className="relative aspect-16/9 sm:aspect-21/9 bg-slate-900 rounded-2xl overflow-hidden -mx-5 -mt-5 sm:-mx-6">
          <img
            src={blog.image}
            alt={blog.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

          {/* Top Overlay Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md text-white shadow-md ${
                blog.status === 'published' ? 'bg-emerald-600' : 'bg-amber-600'
              }`}
            >
              {blog.status === 'published' ? 'Published Article' : 'Draft'}
            </span>

            <button
              onClick={handleShare}
              className="bg-white/20 hover:bg-sky-700 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>

          {/* Bottom Title & Over-image Metadata */}
          <div className="absolute bottom-4 left-5 right-5 sm:left-6 sm:right-6 text-white space-y-1">
            <div className="flex items-center gap-2 text-xs text-sky-200 font-semibold tracking-wide uppercase">
              <span>{blog.type}</span>
              <span aria-hidden="true">·</span>
              <span>{blog.readTime}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
              {blog.title}
            </h2>
          </div>
        </div>

        {/* Clean Unboxed Metadata Strip (Zero-Pill Discipline) */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-sky-100 text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900">{blog.author || 'DPL Editorial'}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono text-sky-850 font-bold">{blog.readTime}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-sky-900 font-medium">Type: {blog.type}</span>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Tag className="w-3.5 h-3.5 text-sky-700" />
              <span>{blog.tags.join(' · ')}</span>
            </div>
          )}
        </div>

        {/* Rendered HTML Description */}
        <div className="bg-white rounded-2xl">
          <div
            className="prose prose-slate prose-sky max-w-none text-sm sm:text-base leading-relaxed space-y-4 [&_h2]:text-lg sm:[&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:tracking-tight [&_h3]:text-base sm:[&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:text-slate-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-sky-950 [&_blockquote]:bg-sky-50/70 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl [&_strong]:text-slate-900 [&_strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
        </div>

        {/* Admin Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(blog);
                }}
              >
                <Edit2 className="w-3.5 h-3.5 mr-1 text-sky-700" />
                Edit Article
              </Button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
                    onDelete(blog.id);
                    onClose();
                  }
                }}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer min-h-[38px] flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
          </div>

          <Button variant="primary" size="sm" onClick={onClose}>
            Close Article
          </Button>
        </div>
      </div>
    </Modal>
  );
};
