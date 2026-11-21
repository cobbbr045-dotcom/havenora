import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Users,
  Bed,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Room } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';

export const RoomsManagementPage: React.FC = () => {
  const { rooms, addRoom, updateRoom, deleteRoom, togglePublishRoom } = useData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

  // Form State
  const initialFormState = {
    name: '',
    slug: '',
    tagline: '',
    description: '',
    longDescription: '',
    price: 200,
    currency: 'USD',
    capacity: 2,
    bedConfiguration: '1 King Bed',
    roomSize: '50 m² (538 sq ft)',
    view: 'Mountain & Valley View',
    amenitiesInput: 'Rain shower, Organic linen, Himalayan tea bar, Optical WiFi',
    featuresInput: 'Terrace, Valley View, King Bed',
    mainImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
    galleryImagesInput: '',
    published: true,
    featured: false,
    displayOrder: rooms.length + 1
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      slug: room.slug,
      tagline: room.tagline || '',
      description: room.description,
      longDescription: room.longDescription || '',
      price: room.price,
      currency: room.currency,
      capacity: room.capacity,
      bedConfiguration: room.bedConfiguration,
      roomSize: room.roomSize,
      view: room.view,
      amenitiesInput: room.amenities.join(', '),
      featuresInput: room.features.join(', '),
      mainImage: room.mainImage,
      galleryImagesInput: (room.galleryImages || []).join('\n'),
      published: room.published,
      featured: room.featured || false,
      displayOrder: room.displayOrder || 1
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim() || !formData.mainImage.trim()) {
      showToast('Please fill in required suite details.', 'error');
      return;
    }

    const amenities = formData.amenitiesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const features = formData.featuresInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const galleryImages = formData.galleryImagesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingRoom) {
      updateRoom(editingRoom.id, {
        name: formData.name,
        slug: formData.slug,
        tagline: formData.tagline,
        description: formData.description,
        longDescription: formData.longDescription,
        price: Number(formData.price),
        currency: formData.currency,
        capacity: Number(formData.capacity),
        bedConfiguration: formData.bedConfiguration,
        roomSize: formData.roomSize,
        view: formData.view,
        amenities,
        features,
        mainImage: formData.mainImage,
        galleryImages: galleryImages.length > 0 ? galleryImages : [formData.mainImage],
        published: formData.published,
        featured: formData.featured,
        displayOrder: Number(formData.displayOrder)
      });
      showToast(`Suite "${formData.name}" updated successfully.`, 'success');
    } else {
      addRoom({
        name: formData.name,
        slug: formData.slug,
        tagline: formData.tagline,
        description: formData.description,
        longDescription: formData.longDescription,
        price: Number(formData.price),
        currency: formData.currency,
        capacity: Number(formData.capacity),
        bedConfiguration: formData.bedConfiguration,
        roomSize: formData.roomSize,
        view: formData.view,
        amenities,
        features,
        mainImage: formData.mainImage,
        galleryImages: galleryImages.length > 0 ? galleryImages : [formData.mainImage],
        published: formData.published,
        featured: formData.featured,
        displayOrder: Number(formData.displayOrder)
      });
      showToast(`New suite "${formData.name}" added to inventory.`, 'success');
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (roomToDelete) {
      deleteRoom(roomToDelete);
      showToast('Suite removed from property inventory.', 'info');
      setRoomToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-forest-deep font-medium">
            Suite Inventory
          </h2>
          <p className="text-xs text-charcoal/60 mt-1">
            Manage your boutique suites, pricing, photography, and publication visibility.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase bg-forest hover:bg-forest-deep text-ivory rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Suite</span>
        </button>
      </div>

      {/* Room Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-xl border border-sand-dark/20 shadow-xs overflow-hidden flex flex-col justify-between"
          >
            {/* Image Header */}
            <div className="relative aspect-[16/10] overflow-hidden bg-sand/30">
              <img
                src={room.mainImage}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-forest-deep/80 text-sand text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded">
                ${room.price} / night
              </div>
              <button
                type="button"
                onClick={() => togglePublishRoom(room.id)}
                className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md transition-colors flex items-center gap-1 ${
                  room.published
                    ? 'bg-emerald-600/90 text-white'
                    : 'bg-charcoal/80 text-ivory'
                }`}
              >
                {room.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{room.published ? 'Published' : 'Draft'}</span>
              </button>
            </div>

            {/* Room Info */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-bronze block mb-1">
                  {room.view}
                </span>
                <h3 className="font-serif text-2xl text-forest-deep mb-2">
                  {room.name}
                </h3>
                <p className="text-xs text-charcoal/70 font-light line-clamp-2 mb-4">
                  {room.description}
                </p>

                {/* Specs */}
                <div className="flex items-center gap-4 text-xs text-charcoal/60 border-t border-sand-dark/20 py-2.5 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-bronze" />
                    <span>{room.capacity} Guests</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-bronze" />
                    <span>{room.bedConfiguration}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-sand-dark/20">
                <a
                  href={`/rooms/${room.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-charcoal/60 hover:text-forest flex items-center gap-1"
                >
                  <span>Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(room)}
                    className="p-1.5 text-charcoal/70 hover:text-forest hover:bg-sand/30 rounded"
                    title="Edit suite"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setRoomToDelete(room.id)}
                    className="p-1.5 text-charcoal/40 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete suite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Room Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoom ? `Edit Suite: ${editingRoom.name}` : 'Add New Suite'}
        subtitle="Configure suite attributes, pricing, and visual presentation"
        maxWidth="3xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                Suite Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  setFormData({
                    ...formData,
                    name: val,
                    slug: editingRoom ? formData.slug : autoSlug
                  });
                }}
                placeholder="e.g. Cedar Sanctuary Suite"
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. cedar-sanctuary-suite"
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                Rate (USD) *
              </label>
              <input
                type="number"
                required
                min={50}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                Capacity (Guests)
              </label>
              <input
                type="number"
                min={1}
                max={6}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                Bed Configuration
              </label>
              <input
                type="text"
                value={formData.bedConfiguration}
                onChange={(e) => setFormData({ ...formData, bedConfiguration: e.target.value })}
                placeholder="1 King Bed"
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                Room Size
              </label>
              <input
                type="text"
                value={formData.roomSize}
                onChange={(e) => setFormData({ ...formData, roomSize: e.target.value })}
                placeholder="55 m² (592 sq ft)"
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                View & Aspect
              </label>
              <input
                type="text"
                value={formData.view}
                onChange={(e) => setFormData({ ...formData, view: e.target.value })}
                placeholder="Phewa Lake & Valley Sunset"
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              Short Description *
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Concise overview shown on listings..."
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              Detailed Narrative Description
            </label>
            <textarea
              rows={3}
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              placeholder="Full editorial story of the room, atmosphere, and architectural materials..."
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              Amenities (Comma separated)
            </label>
            <input
              type="text"
              value={formData.amenitiesInput}
              onChange={(e) => setFormData({ ...formData, amenitiesInput: e.target.value })}
              placeholder="Private terrace, Rainfall shower, Tea bar, Optical WiFi"
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              Main Image URL *
            </label>
            <input
              type="url"
              required
              value={formData.mainImage}
              onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              Additional Gallery Image URLs (one per line)
            </label>
            <textarea
              rows={2}
              value={formData.galleryImagesInput}
              onChange={(e) => setFormData({ ...formData, galleryImagesInput: e.target.value })}
              placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal font-mono text-[11px]"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-forest rounded focus:ring-forest"
              />
              <span className="font-medium text-charcoal">Publish immediately to public website</span>
            </label>
          </div>

          {/* Dialog Actions */}
          <div className="pt-4 border-t border-sand-dark/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 uppercase tracking-wider text-charcoal/70 hover:bg-sand/30 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 uppercase tracking-wider font-semibold bg-forest hover:bg-forest-deep text-ivory rounded shadow-sm"
            >
              {editingRoom ? 'Save Changes' : 'Create Suite'}
            </button>
          </div>

        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!roomToDelete}
        onClose={() => setRoomToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Suite from Inventory?"
        message="Are you sure you want to delete this room? It will be removed from your public website immediately."
        confirmText="Delete Suite"
        isDestructive={true}
      />

    </div>
  );
};
