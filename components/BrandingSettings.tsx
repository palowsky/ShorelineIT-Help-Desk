import React, { useState, FormEvent } from 'react';
import { BrandingSettings as BrandingSettingsType } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface BrandingSettingsProps {
  currentBranding: BrandingSettingsType;
  onSave: (newBranding: BrandingSettingsType) => void;
}

const BrandingSettings: React.FC<BrandingSettingsProps> = ({ currentBranding, onSave }) => {
  const { t } = useLocalization();
  const [settings, setSettings] = useState<BrandingSettingsType>(currentBranding);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(settings);
    // Optional: add a success message
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">{t('branding.title')}</h1>
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('branding.companyName')}
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    value={settings.companyName}
                    onChange={handleInputChange}
                    placeholder={t('branding.companyNamePlaceholder')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('branding.logoUrl')}
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="logoUrl"
                    id="logoUrl"
                    value={settings.logoUrl}
                    onChange={handleInputChange}
                    placeholder={t('branding.logoUrlPlaceholder')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

               <div className="sm:col-span-6">
                <label htmlFor="faviconUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('branding.faviconUrl')}
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="faviconUrl"
                    id="faviconUrl"
                    value={settings.faviconUrl}
                    onChange={handleInputChange}
                    placeholder={t('branding.faviconUrlPlaceholder')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              {settings.logoUrl && (
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('branding.logoPreview')}</label>
                  <div className="mt-2 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md flex justify-center items-center">
                    <img src={settings.logoUrl} alt="Logo Preview" className="max-h-16" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {t('branding.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandingSettings;