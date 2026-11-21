import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { GalleryItem, GalleryCategory } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';

export const GalleryManagementPage: React.FC = () => {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem, togglePublishGallery } = useData();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const categories: GalleryCategory[] = [
    'Architecture',
    'Rooms',
    'Interiors',
    'Dining',
    'Nature',
    'Details'
  ];

  const initialForm = {
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85',
    caption: '',
    category: 'Architecture' as GalleryCategory,
    displayOrder: gallery.length + 1,
    published: true
  };

  const [formData, setFormData] = useState(initialForm);

  const filteredItems = activeCategory === 'All'
    ? gallery
    : gallery.filter((item) => item.category === activeCategory);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      imageUrl: item.imageUrl,
      caption: item.caption,
      category: item.category,
      displayOrder: item.displayOrder,
      published: item.published
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl || !formData.caption) {
      showToast('Please provide an image URL and a caption.', 'error');
      return;
    }

    if (editingItem) {
      updateGalleryItem(editingItem.id, {
        imageUrl: formData.imageUrl,
        caption: formData.caption,
        category: formData.category,
        displayOrder: Number(formData.displayOrder),
        published: formData.published
      });
      showToast('Photograph updated successfully.', 'success');
    } else {
      addGalleryItem({
        imageUrl: formData.imageUrl,
        caption: formData.caption,
        category: formData.category,
        displayOrder: Number(formData.displayOrder),
        published: formData.published
      });
      showToast('New photograph added to gallery.', 'success');
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteGalleryItem(itemToDelete);
      showToast('Photograph removed from gallery.', 'info');
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-forest-deep font-medium">
            Gallery Management
          </h2>
          <p className="text-xs text-charcoal/60 mt-1">
            Curate visual photography displayed on the public gallery and atmospheric previews.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase bg-forest hover:bg-forest-deep text-ivory rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photograph</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-sand-dark/20 shadow-xs">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors ${
            activeCategory === 'All'
              ? 'bg-forest text-ivory'
              : 'text-charcoal/70 hover:bg-sand/30'
          }`}
        >
          All Categories ({gallery.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors ${
              activeCategory === cat
                ? 'bg-forest text-ivory'
                : 'text-charcoal/70 hover:bg-sand/30'
            }`}
          >
            {cat} ({gallery.filter((g) => g.category === cat).length})
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-xl overflow-hidden border border-sand-dark/20 shadow-xs flex flex-col justify-between"
          >
            {/* Image Preview */}
            <div className="relative aspect-[4/3] bg-sand/30 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] font-semibold tracking-widest uppercase bg-forest-deep/80 text-sand rounded">
                {item.category}
              </span>
              <button
                type="button"
                onClick={() => togglePublishGallery(item.id)}
                className={`absolute top-2.5 right-2.5 p-1 rounded-full backdrop-blur-md transition-colors ${
                  item.published ? 'bg-emerald-600/90 text-white' : 'bg-charcoal/80 text-ivory'
                }`}
                title={item.published ? 'Published' : 'Hidden'}
              >
                {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Caption & Controls */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-charcoal/80 font-light line-clamp-2 mb-3">
                {item.caption}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-sand-dark/20 text-xs">
                <span className="text-[10px] text-charcoal/40 font-mono">Order: {item.displayOrder}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1 text-charcoal/60 hover:text-forest hover:bg-sand/30 rounded"
                    title="Edit caption"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setItemToDelete(item.id)}
                    className="p-1 text-charcoal/40 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Photograph' : 'Add New Photograph'}
        subtitle="Manage gallery photograph URL, category, and descriptive caption"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
            />
          </div>

          {/* Quick preset selector for testing */}
          <div className="p-3 bg-sand/20 rounded border border-sand-dark/30 space-y-1.5">
            <span className="text-[10px] font-semibold text-charcoal/60 uppercase tracking-wider block">
              Sample Imagery Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Mountain Sunrise', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85', cat: 'Nature' },
                { label: 'Cedar Bedroom', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85', cat: 'Rooms' },
                { label: 'Stone Terrace', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85', cat: 'Architecture' },
                { label: 'Morning Tea', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85', cat: 'Dining' },
              ].map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: preset.url, category: preset.cat as GalleryCategory, caption: preset.label })}
                  className="px-2 py-1 bg-white hover:bg-ivory border border-sand-dark/40 rounded text-[10px] text-charcoal/80"
                >
                  + {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              Descriptive Caption *
            </label>
            <input
              type="text"
              required
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="e.g. Dawn mist clearing over Machapuchare seen from the yoga terrace"
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as GalleryCategory })}
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min={1}
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-forest rounded focus:ring-forest"
              />
              <span className="font-medium text-charcoal">Publish immediately to public gallery</span>
            </label>
          </div>

          <div className="pt-4 border-t border-sand-dark/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 uppercase tracking-wider text-charcoal/70 hover:bg-sand/30 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 uppercase tracking-wider font-semibold bg-forest hover:bg-forest-deep text-ivory rounded shadow-sm"
            >
              {editingItem ? 'Save Changes' : 'Add to Gallery'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Photograph?"
        message="Are you sure you want to remove this photograph from the gallery?"
        confirmText="Delete"
        isDestructive={true}
      />

    </div>
  );
};
