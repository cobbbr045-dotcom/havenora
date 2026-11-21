import React, { useState } from 'react';
import {
  Save,
  Globe,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../components/ui/Toast';

export const WebsiteSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToDefaultData } = useData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'homepage' | 'location'>('general');

  const [formData, setFormData] = useState({
    hotelName: settings.hotelName,
    tagline: settings.tagline,
    brandDescription: settings.brandDescription,
    fullStory: settings.fullStory,
    email: settings.email,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    address: settings.address,
    city: settings.city,
    country: settings.country,
    mapEmbedUrl: settings.mapEmbedUrl,
    instagram: settings.socialLinks?.instagram || '',
    facebook: settings.socialLinks?.facebook || '',
    heroHeading: settings.homepage.heroHeading,
    heroSubheading: settings.homepage.heroSubheading,
    heroDescription: settings.homepage.heroDescription,
    heroImage: settings.homepage.heroImage,
    primaryCtaText: settings.homepage.primaryCtaText,
    introHeading: settings.homepage.introHeading,
    introDescription: settings.homepage.introDescription
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      hotelName: formData.hotelName,
      tagline: formData.tagline,
      brandDescription: formData.brandDescription,
      fullStory: formData.fullStory,
      email: formData.email,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      mapEmbedUrl: formData.mapEmbedUrl,
      socialLinks: {
        instagram: formData.instagram,
        facebook: formData.facebook,
      },
      homepage: {
        ...settings.homepage,
        heroHeading: formData.heroHeading,
        heroSubheading: formData.heroSubheading,
        heroDescription: formData.heroDescription,
        heroImage: formData.heroImage,
        primaryCtaText: formData.primaryCtaText,
        introHeading: formData.introHeading,
        introDescription: formData.introDescription
      }
    });

    setIsSaved(true);
    showToast('Website content updated! Changes are live on the public site.', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-forest-deep font-medium">
            Website Content & Settings
          </h2>
          <p className="text-xs text-charcoal/60 mt-1">
            Edit your live hotel details, hero storytelling, contact phone, and public metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-forest hover:bg-sand/30 border border-sand-dark/40 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-sand-dark/20 pb-3">
        {[
          { id: 'general', label: 'General & Brand' },
          { id: 'homepage', label: 'Homepage Hero & Intro' },
          { id: 'contact', label: 'Contact & Socials' },
          { id: 'location', label: 'Location & Map' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-forest text-ivory shadow-xs'
                : 'text-charcoal/70 hover:bg-ivory'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Container */}
      <form onSubmit={handleSave} className="bg-white rounded-xl p-6 sm:p-8 border border-sand-dark/20 shadow-xs space-y-6 text-xs">
        
        {/* Tab 1: General & Brand */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            <h3 className="font-serif text-xl text-forest-deep">Brand Identity</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                  Hotel Wordmark Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.hotelName}
                  onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                  className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal font-serif text-sm tracking-wider"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                Concise Brand Essence (Footer & Meta)
              </label>
              <textarea
                rows={3}
                value={formData.brandDescription}
                onChange={(e) => setFormData({ ...formData, brandDescription: e.target.value })}
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                Full Heritage Narrative (About Story)
              </label>
              <textarea
                rows={5}
                value={formData.fullStory}
                onChange={(e) => setFormData({ ...formData, fullStory: e.target.value })}
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Homepage Hero & Intro */}
        {activeTab === 'homepage' && (
          <div className="space-y-5">
            <h3 className="font-serif text-xl text-forest-deep">Homepage Hero Section</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                  Hero Location Pill Tag
                </label>
                <input
                  type="text"
                  value={formData.heroSubheading}
                  onChange={(e) => setFormData({ ...formData, heroSubheading: e.target.value })}
                  placeholder="POKHARA, NEPAL"
                  className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={formData.primaryCtaText}
                  onChange={(e) => setFormData({ ...formData, primaryCtaText: e.target.value })}
                  placeholder="EXPLORE OUR ROOMS"
                  className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                Hero Heading Title
              </label>
              <input
                type="text"
                value={formData.heroHeading}
                onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal font-serif text-base"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                Hero Supporting Paragraph
              </label>
              <textarea
                rows={3}
                value={formData.heroDescription}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                Hero Background Photography URL
              </label>
              <input
                type="url"
                value={formData.heroImage}
                onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
              />
              <p className="text-[10px] text-charcoal/50 mt-1">High-resolution image (minimum 1920x1080 recommended)</p>
            </div>

            <div className="pt-4 border-t border-sand-dark/20">
              <h4 className="font-serif text-lg text-forest-deep mb-3">Intro Section Editorial</h4>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                    Intro Heading
                  </label>
                  <input
                    type="text"
                    value={formData.introHeading}
                    onChange={(e) => setFormData({ ...formData, introHeading: e.target.value })}
                    className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal font-serif text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                    Intro Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.introDescription}
                    onChange={(e) => setFormData({ ...formData, introDescription: e.target.value })}
                    className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Contact & Socials */}
        {activeTab === 'contact' && (
          <div className="space-y-5">
            <h3 className="font-serif text-xl text-forest-deep">Contact Channels & Reception</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                  Public Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                  WhatsApp Concierge
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                />
              </div>
            </div>

            <h4 className="font-serif text-lg text-forest-deep pt-4 border-t border-sand-dark/20">
              Social Media Accounts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                  Instagram Link
                </label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="https://instagram.com/havenoraretreat"
                  className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                  Facebook Link
                </label>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="https://facebook.com/havenoraretreat"
                  className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Location & Map */}
        {activeTab === 'location' && (
          <div className="space-y-5">
            <h3 className="font-serif text-xl text-forest-deep">Geographic Location</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                  Address Line
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                Google Maps Embed URL
              </label>
              <input
                type="text"
                value={formData.mapEmbedUrl}
                onChange={(e) => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
                className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal font-mono text-[11px]"
              />
            </div>
          </div>
        )}

        {/* Submit Bottom Bar */}
        <div className="pt-6 border-t border-sand-dark/20 flex items-center justify-between">
          <div className="text-[11px] text-charcoal/50">
            Changes are saved to local persistent storage immediately.
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold tracking-wider uppercase bg-forest hover:bg-forest-deep text-ivory rounded shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
