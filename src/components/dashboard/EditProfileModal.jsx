import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Briefcase, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { AVATAR_PRESETS } from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { validateName, validatePhone } from '../../utils/validators';

export const EditProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile, isLoading } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    phone: '',
    location: '',
    bio: '',
    avatarStyle: 'gradient-aurora',
    avatarUrl: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser && isOpen) {
      setFormData({
        name: currentUser.name || '',
        role: currentUser.role || '',
        department: currentUser.department || '',
        phone: currentUser.phone || '',
        location: currentUser.location || '',
        bio: currentUser.bio || '',
        avatarStyle: currentUser.avatarStyle || 'gradient-aurora',
        avatarUrl: currentUser.avatarUrl || '',
      });
      setErrors({});
    }
  }, [currentUser, isOpen]);

  const validate = () => {
    const newErrors = {};
    const nameVal = validateName(formData.name);
    if (!nameVal.isValid) newErrors.name = nameVal.message;

    const phoneVal = validatePhone(formData.phone);
    if (!phoneVal.isValid) newErrors.phone = phoneVal.message;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await updateProfile(formData);
    setIsSubmitting(false);

    if (result.success) {
      showToast('Profile updated successfully!', 'success');
      onClose();
    } else {
      showToast(result.error || 'Failed to update profile', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile Information"
      subtitle="Update your personal details, role attributes, and avatar badge."
      maxWidth="560px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSubmitting || isLoading}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <form onSubmit={handleSave} noValidate>
        {/* Avatar Preset Selector */}
        <div className="form-group">
          <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
            Choose Avatar Radiant Style
          </label>
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {AVATAR_PRESETS.map((preset) => {
              const isSelected = formData.avatarStyle === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, avatarStyle: preset.id }))}
                  className={preset.class}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    border: isSelected ? '3px solid var(--text-primary)' : '2px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: isSelected ? '0 0 12px var(--accent-glow)' : 'none',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 200ms ease',
                  }}
                  title={preset.name}
                >
                  {isSelected && <Check size={18} strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          icon={<User size={18} />}
          error={errors.name}
          required
        />

        {/* Role & Department */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Job Title / Role"
            type="text"
            value={formData.role}
            onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
            icon={<Briefcase size={18} />}
          />
          <Input
            label="Department"
            type="text"
            value={formData.department}
            onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
          />
        </div>

        {/* Phone & Location */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            icon={<Phone size={18} />}
            error={errors.phone}
          />
          <Input
            label="Location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            icon={<MapPin size={18} />}
          />
        </div>

        {/* Bio */}
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="edit-bio" className="form-label">
              Professional Biography
            </label>
            <span className="form-hint">{formData.bio.length}/200</span>
          </div>
          <textarea
            id="edit-bio"
            rows={3}
            maxLength={200}
            value={formData.bio}
            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
            className="form-input"
            placeholder="Share a short summary of your background and core focus..."
            style={{ resize: 'vertical' }}
          />
        </div>
      </form>
    </Modal>
  );
};
