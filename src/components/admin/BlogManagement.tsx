import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Newspaper,
  Calendar,
  Clock,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles,
  LayoutGrid,
  List,
  RotateCcw,
  Tag,
  FileCode2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  addBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  resetBlogsToDefault,
} from '../../store/slices/blogsSlice';
import { BlogPost } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { BlogFormModal } from './BlogFormModal';
import { BlogDetailsModal } from './BlogDetailsModal';

export const BlogManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { blogs } = useAppSelector((state) => state.blogs);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [viewingBlog, setViewingBlog] = useState<BlogPost | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);

  // Distinct types list for filter
  const distinctTypes = useMemo(() => {
    const types = new Set<string>();
    blogs.forEach((b) => {
      if (b.type) types.add(b.type);
    });
    return Array.from(types);
  }, [blogs]);

  // Filtered & sorted blogs
  const filteredBlogs = useMemo(() => {
    return blogs
      .filter((blog) => {
        const matchesSearch =
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType =
          selectedType === 'all' || blog.type.toLowerCase() === selectedType.toLowerCase();

        const matchesStatus =
          selectedStatus === 'all' || blog.status === selectedStatus;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [blogs, searchTerm, selectedType, selectedStatus, sortBy]);

  const handleOpenCreate = () => {
    setEditingBlog(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (blogData: Omit<BlogPost, 'id' | 'createdAt'>) => {
    if (editingBlog) {
      dispatch(
        updateBlog({
          id: editingBlog.id,
          data: blogData,
        })
      );
    } else {
      dispatch(addBlog(blogData));
    }
    setIsFormOpen(false);
    setEditingBlog(null);
  };

  const handleConfirmDelete = () => {
    if (blogToDelete) {
      dispatch(deleteBlog(blogToDelete.id));
      setBlogToDelete(null);
    }
  };

  // Helper to extract a short plain text excerpt from HTML
  const extractExcerpt = (html: string, maxLength = 140) => {
    const text = html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold">
              <Newspaper className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Blog & Article Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish, edit, and organize rich HTML articles, market insights, and architectural developments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              if (confirm('Reset blog articles to DPL default editorial articles?')) {
                dispatch(resetBlogsToDefault());
              }
            }}
            title="Reset articles to initial catalog"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Samples
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create New Blog
          </Button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-sky-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Total Articles
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {blogs.length}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-sky-200/80 shadow-2xs">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            Published
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">
            {blogs.filter((b) => b.status === 'published').length}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-sky-200/80 shadow-2xs">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Drafts
          </span>
          <div className="text-2xl font-bold font-mono text-amber-800 mt-1">
            {blogs.filter((b) => b.status === 'draft').length}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-sky-200/80 shadow-2xs">
          <span className="text-xs font-bold text-sky-850 uppercase tracking-wider block">
            Distinct Types
          </span>
          <div className="text-2xl font-bold font-mono text-sky-900 mt-1">
            {distinctTypes.length}
          </div>
        </div>
      </div>

      {/* Search, Filter & Controls Toolbar */}
      <div className="bg-white rounded-2xl border border-sky-200/80 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by article title, type (input text), or HTML description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-600 focus:bg-white transition-all min-h-[44px]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls: Type, Status, Sort & View Toggle */}
          <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
            {/* Status Segmented Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedStatus('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer min-h-[34px] ${
                  selectedStatus === 'all'
                    ? 'bg-white text-sky-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('published')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer min-h-[34px] ${
                  selectedStatus === 'published'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Published
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('draft')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer min-h-[34px] ${
                  selectedStatus === 'draft'
                    ? 'bg-white text-amber-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Drafts
              </button>
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl cursor-pointer focus:outline-hidden min-h-[42px]"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="title">Sort: Title A-Z</option>
            </select>

            {/* Grid / Table Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-sky-850 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-sky-850 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Type Filter Buttons */}
        {distinctTypes.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-sky-700" /> Filter by Type:
            </span>
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-sky-700 text-white border-sky-700 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
              }`}
            >
              All Types ({blogs.length})
            </button>
            {distinctTypes.map((t) => {
              const count = blogs.filter((b) => b.type === t).length;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    selectedType === t
                      ? 'bg-sky-700 text-white border-sky-700 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  {t} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Article Grid or Table View */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-sky-200 p-8 shadow-xs space-y-3">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No blog articles match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query, clearing filters, or create a new blog article.
          </p>
          <div className="pt-2">
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-1" />
              Create Article
            </Button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-sky-200/90 overflow-hidden hover:border-sky-600 hover:shadow-lg transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                {/* Cover Image Container */}
                <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Badges on Cover */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-100 bg-sky-950/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-sky-400/30">
                      {blog.type}
                    </span>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-md shadow-xs ${
                        blog.status === 'published'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-amber-400 text-slate-950'
                      }`}
                    >
                      {blog.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {/* Read Time on Cover */}
                  <div className="absolute bottom-2.5 left-3 text-xs text-white/90 font-mono flex items-center gap-1.5 drop-shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-sky-300" />
                    <span>{blog.readTime}</span>
                  </div>
                </div>

                {/* Article Content Preview */}
                <div className="p-4 space-y-2.5">
                  <h3
                    onClick={() => setViewingBlog(blog)}
                    className="text-base font-extrabold text-slate-900 group-hover:text-sky-800 transition-colors line-clamp-2 cursor-pointer leading-snug"
                  >
                    {blog.title}
                  </h3>

                  {/* Plain Text Excerpt extracted from HTML */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {extractExcerpt(blog.description, 130)}
                  </p>

                  {/* Clean unboxed metadata (zero-pill) */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <span className="font-semibold text-slate-700">{blog.author || 'DPL Admin'}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewingBlog(blog)}
                  className="px-3 py-1.5 text-xs font-bold text-sky-850 hover:text-sky-950 hover:bg-sky-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1 min-h-[36px]"
                >
                  <Eye className="w-3.5 h-3.5 text-sky-700" />
                  <span>Read Article</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(blog)}
                    title="Edit article"
                    className="p-2 text-slate-500 hover:text-sky-800 hover:bg-sky-100 rounded-xl transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setBlogToDelete(blog)}
                    title="Delete article"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-sky-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Article Title & Type</th>
                  <th className="p-3.5">Read Time</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Author</th>
                  <th className="p-3.5">Created Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          referrerPolicy="no-referrer"
                          className="w-14 h-11 object-cover rounded-xl border border-sky-100 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />
                        <div>
                          <div
                            onClick={() => setViewingBlog(blog)}
                            className="font-bold text-slate-900 hover:text-sky-800 transition-colors cursor-pointer line-clamp-1 text-sm"
                          >
                            {blog.title}
                          </div>
                          <div className="text-xs text-sky-850 font-semibold mt-0.5">
                            Type: {blog.type}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-xs text-slate-700 whitespace-nowrap">
                      {blog.readTime}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => dispatch(toggleBlogStatus(blog.id))}
                        className={`text-xs font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                          blog.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td className="p-3.5 text-xs text-slate-600 whitespace-nowrap">
                      {blog.author || 'DPL Admin'}
                    </td>

                    <td className="p-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingBlog(blog)}
                          title="Read full article"
                          className="p-2 text-slate-500 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(blog)}
                          title="Edit article"
                          className="p-2 text-slate-500 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setBlogToDelete(blog)}
                          title="Delete article"
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Blog Form Modal (Create / Edit) */}
      <BlogFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBlog(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingBlog}
      />

      {/* Blog Details Modal (Article Reader) */}
      <BlogDetailsModal
        blog={viewingBlog}
        isOpen={!!viewingBlog}
        onClose={() => setViewingBlog(null)}
        onEdit={(b) => handleOpenEdit(b)}
        onDelete={(id) => dispatch(deleteBlog(id))}
      />

      {/* Delete Confirmation Modal */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Delete Article?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Are you sure you want to delete <strong className="text-slate-800">"{blogToDelete.title}"</strong>? This will permanently remove the article and its HTML content.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBlogToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
