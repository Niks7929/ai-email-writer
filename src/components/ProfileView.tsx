import React, { useState } from 'react';
import { User as UserIcon, Save, Check, Upload, Trash2, Camera } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileViewProps {
  user: UserType;
  onUpdateProfile: (fullname: string, email: string, phone: string, profile: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateProfile }) => {
  const [fullname, setFullname] = useState(user.fullname);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [profile, setProfile] = useState(user.profile);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    setFullname(user.fullname);
    setEmail(user.email);
    setPhone(user.phone);
    setProfile(user.profile);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(fullname, email, phone, profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfile(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfile('');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile & User Settings</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Update account details, upload profile photo, and save separate profiles for Admin & User.
          </p>
        </div>
        <div className={`rounded-lg px-3 py-1 text-xs font-bold ${
          user.role === 'Admin'
            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
        }`}>
          Editing Profile: {user.role} Mode
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        
        {/* Profile Picture Upload Section */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            Profile Photo
          </label>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
              {profile ? (
                <img
                  src={profile}
                  alt="Profile Preview"
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-indigo-500/20 shadow-md"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 ring-4 ring-indigo-500/20 shadow-md dark:bg-indigo-950 dark:text-indigo-400">
                  <UserIcon className="h-10 w-10" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-all">
                <Camera className="h-3.5 w-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition-all">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {profile && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Upload your photo directly from your device (JPG, PNG, WEBP).
              </p>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{saved ? 'Changes Saved Successfully!' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
