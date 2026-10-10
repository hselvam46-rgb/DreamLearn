import React, { useState, useRef } from 'react';
import { Camera, Upload, Link as LinkIcon, Sparkles, Trash2, X, Check, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarUpdated?: (newAvatar: string) => void;
}

const PRESET_AVATARS = [
  { id: '1', label: 'Professional Woman', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80' },
  { id: '2', label: 'Professional Man', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80' },
  { id: '3', label: 'Creative Woman', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80' },
  { id: '4', label: 'Tech Lead Man', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80' },
  { id: '5', label: 'Software Engineer', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80' },
  { id: '6', label: 'Student Dev', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80' },
  { id: '7', label: 'Data Scientist', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80' },
  { id: '8', label: 'Modern 3D Avatar', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=250&auto=format&fit=crop&q=80' },
];

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
  onAvatarUpdated,
}) => {
  const { user, refreshUser } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user?.avatar || '');
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [customUrl, setCustomUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file (PNG, JPG, WebP, or SVG).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError('Selected image exceeds 3 MB. Please pick a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedAvatar(reader.result);
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file. Please try another one.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!customUrl.trim()) return;
    try {
      new URL(customUrl.trim());
      setSelectedAvatar(customUrl.trim());
      setError(null);
    } catch {
      setError('Please enter a valid HTTP or HTTPS image URL.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.auth.updateProfile({ avatar: selectedAvatar });
      await refreshUser();
      if (onAvatarUpdated) {
        onAvatarUpdated(selectedAvatar);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile picture.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = () => {
    setSelectedAvatar('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary-container flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#102344]">Update Profile Picture</h3>
              <p className="text-xs text-slate-500">Upload a custom photo or choose a curated avatar</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Live Preview Section */}
          <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-primary-container text-white font-extrabold text-2xl flex items-center justify-center overflow-hidden shadow-md border-2 border-white ring-2 ring-blue-100">
                {selectedAvatar ? (
                  <img
                    src={selectedAvatar}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setError('Unable to load preview for this image URL.');
                    }}
                  />
                ) : (
                  <span>{user?.name?.charAt(0) || 'U'}</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-extrabold text-[#102344]">
                {selectedAvatar ? 'New Avatar Preview' : 'Default Initials Avatar'}
              </div>
              <p className="text-xs text-slate-500">
                {selectedAvatar
                  ? 'Looking great! Click "Save Photo" below to apply it.'
                  : 'Currently using your initial letter badge.'}
              </p>
              {selectedAvatar && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold pt-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove picture (use initials)</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => { setActiveTab('upload'); setError(null); }}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-primary-container shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('presets'); setError(null); }}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-white text-primary-container shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preset Avatars</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('url'); setError(null); }}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-white text-primary-container shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Image URL</span>
            </button>
          </div>

          {/* Tab 1: Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-primary-container rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-blue-50/30 group"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-primary-container flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-extrabold text-[#102344]">Click to upload an image from your device</div>
                <p className="text-[11px] text-slate-400 mt-1">Supports PNG, JPG, WebP or SVG up to 3 MB</p>
              </div>
            </div>
          )}

          {/* Tab 2: Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">Select any avatar to preview and apply:</p>
              <div className="grid grid-cols-4 gap-3">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = selectedAvatar === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(preset.url);
                        setError(null);
                      }}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer hover:scale-105 ${
                        isSelected
                          ? 'border-primary-container ring-2 ring-blue-200 shadow-md scale-105'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover rounded-xl" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary-container/30 backdrop-blur-[1px] flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-primary-container text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#102344]">Image Link / URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1 h-11 px-3.5 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 h-11 bg-slate-100 hover:bg-slate-200 text-[#102344] text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                >
                  Preview
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                You can paste image links from Unsplash, Gravatar, GitHub, or any public image URL.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-primary-container hover:bg-[#104AA8] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Profile Picture</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
