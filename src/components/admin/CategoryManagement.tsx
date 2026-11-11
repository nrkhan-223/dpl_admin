import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Trash2,
  Edit2,
  Building2,
  ArrowRight,
  Layers,
  Sparkles,
  Home,
  Waves,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from '../../store/slices/categoriesSlice';
import { setCategoryFilter } from '../../store/slices/propertiesSlice';
import { Category } from '../../types';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { FormField, Input } from '../common/FormField';

interface CategoryManagementProps {
  onNavigateToProperties: () => void;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  onNavigateToProperties,
}) => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);
  const { properties } = useAppSelector((state) => state.properties);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    iconName: 'Building2',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const iconOptions = [
    { name: 'Building2', label: 'High-Rise / Penthouse', icon: <Building2 className="w-4 h-4 text-sky-800" /> },
    { name: 'Home', label: 'Studio / Urban Loft', icon: <Home className="w-4 h-4 text-sky-800" /> },
    { name: 'Waves', label: 'Waterfront / Coastal', icon: <Waves className="w-4 h-4 text-sky-800" /> },
    { name: 'Sparkles', label: 'Villa / Sanctuary', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
  ];

  const resetForm = () => {
    setFormData({ name: '', description: '', iconName: 'Building2' });
    setErrors({});
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      iconName: category.iconName || 'Building2',
    });
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Category name is required';
    if (!formData.description.trim()) errs.description = 'Category description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingCategory) {
      dispatch(
        updateCategory({
          id: editingCategory.id,
          name: formData.name,
          description: formData.description,
          iconName: formData.iconName,
        })
      );
      setEditingCategory(null);
    } else {
      dispatch(
        addCategory({
          name: formData.name,
          description: formData.description,
          iconName: formData.iconName,
        })
      );
      setIsCreateModalOpen(false);
    }
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete.id));
      setCategoryToDelete(null);
    }
  };

  const getCategoryPropertyCount = (categoryId: string) => {
    return properties.filter((p) => p.categoryId === categoryId).length;
  };

  const renderIcon = (name?: string) => {
    switch (name) {
      case 'Home':
        return <Home className="w-5 h-5 text-sky-800" />;
      case 'Waves':
        return <Waves className="w-5 h-5 text-sky-700" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      default:
        return <Building2 className="w-5 h-5 text-sky-800" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-sky-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Property Categories
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-900 border border-sky-300">
              {categories.length} categories
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create and delete property classifications. Every apartment belongs to a primary category.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          icon={<Plus className="w-4 h-4" />}
          size="md"
          className="w-full sm:w-auto"
        >
          Create Category
        </Button>
      </div>

      {/* Categories Grid (1 col on mobile, 2 col on tablet/desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const propertyCount = getCategoryPropertyCount(category.id);

          return (
            <div
              key={category.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-sky-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-sky-600 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-sky-100/80 border border-sky-300 flex items-center justify-center shrink-0">
                      {renderIcon(category.iconName)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {category.name}
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        {category.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(category)}
                      title="Edit Category"
                      className="p-2 text-slate-400 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCategoryToDelete(category)}
                      title="Delete Category"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  <strong className="text-sky-900 font-mono font-bold tabular-nums">
                    {propertyCount}
                  </strong>{' '}
                  apartments created
                </span>

                <button
                  onClick={() => {
                    dispatch(setCategoryFilter(category.id));
                    onNavigateToProperties();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 hover:text-sky-950 transition-colors cursor-pointer min-h-[36px]"
                >
                  <span>View Apartments</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      <Modal
        isOpen={isCreateModalOpen || !!editingCategory}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingCategory(null);
          resetForm();
        }}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
        subtitle="Organize residential units into distinct architectural collections"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Category Name" required error={errors.name}>
            <Input
              placeholder="e.g. Duplex Penthouses"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
            />
          </FormField>

          <FormField label="Description" required error={errors.description}>
            <textarea
              rows={3}
              placeholder="Describe the architectural style and unit features..."
              className="w-full text-sm text-slate-900 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-700/25 focus:border-sky-700"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </FormField>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Category Icon Motif
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {iconOptions.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, iconName: opt.name })}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer min-h-[44px] ${
                    formData.iconName === opt.name
                      ? 'border-sky-700 bg-sky-700 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-sky-50'
                  }`}
                >
                  <span className={formData.iconName === opt.name ? 'text-white' : ''}>
                    {opt.icon}
                  </span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingCategory(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Property Category"
        message={
          categoryToDelete && getCategoryPropertyCount(categoryToDelete.id) > 0
            ? `Warning: There are currently ${getCategoryPropertyCount(
                categoryToDelete.id
              )} apartments filed under "${
                categoryToDelete.name
              }". Deleting this category will leave these apartments uncatalogued. Are you sure you wish to proceed?`
            : `Are you sure you want to permanently delete the category "${categoryToDelete?.name}"?`
        }
        confirmLabel="Delete Category"
        variant="danger"
      />
    </div>
  );
};
