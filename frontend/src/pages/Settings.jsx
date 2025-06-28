import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { Menu, ChevronDown, Check } from 'lucide-react';
import AppearanceSettings from '../components/settings/Appearance';
import PreferencesSettings from '../components/settings/Preferences';
import PrivacySettings from '../components/settings/Privacy';
import SecuritySettings from '../components/settings/Security';
import NotificationSettings from '../components/settings/Notifications';
import BillingSettings from '../components/settings/Billing';
import IntegrationSettings from '../components/settings/Integration';
import { DEFAULT_THEME, DEFAULT_PRIMARY_COLOR, DEFAULT_PRIMARY_LIGHT } from '../constants/theme';
import { lightenColor } from "../utils/color";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("Appearance");
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const { toggleSidebar } = useOutletContext();

  // Original settings from localStorage or defaults
  const originalTheme = localStorage.getItem('theme') || DEFAULT_THEME;
  const originalPrimaryColor = localStorage.getItem('primaryColor') || DEFAULT_PRIMARY_COLOR;
  const originalPrimaryLight = DEFAULT_PRIMARY_LIGHT;

  // Working copies of settings
  const [theme, setTheme] = useState(originalTheme);
  const [primaryColor, setPrimaryColor] = useState(originalPrimaryColor);
  const [primaryLight, setPrimaryLight] = useState(originalPrimaryLight);
  const [hasChanges, setHasChanges] = useState(false);


  const tabs = [
    "Preferences", "Privacy", "Security", "Appearance", 
    "Notifications", "Billing", "Integrations"
  ];

  // Check for changes
  useEffect(() => {
    const changesExist = 
      theme !== originalTheme || 
      primaryColor !== originalPrimaryColor;
    setHasChanges(changesExist);
  }, [theme, primaryColor, originalTheme, originalPrimaryColor]);

  const handleSaveChanges = () => {
    const primaryLight = lightenColor(primaryColor, 0.4); 

    // Apply changes to the actual theme
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--color-primary', primaryColor);
    document.documentElement.style.setProperty('--color-primary-light', primaryLight);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('primaryLight', primaryLight);
    
    // Show success message
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
    
    // Reset hasChanges
    setHasChanges(false);
  };

  const handleResetToDefault = () => {
    // Update the preview immediately
    document.documentElement.setAttribute('data-theme', DEFAULT_THEME);
    document.documentElement.style.setProperty('--color-primary', DEFAULT_PRIMARY_COLOR);
    document.documentElement.style.setProperty('--color-primary-light', DEFAULT_PRIMARY_LIGHT);
    
    // Update state
    setTheme(DEFAULT_THEME);
    setPrimaryColor(DEFAULT_PRIMARY_COLOR);
    setPrimaryLight(DEFAULT_PRIMARY_LIGHT)
  
    
    // Save to localStorage immediately for reset
    localStorage.setItem('theme', DEFAULT_THEME);
    localStorage.setItem('primaryColor', DEFAULT_PRIMARY_COLOR);
    localStorage.setItem('primaryLight', DEFAULT_PRIMARY_LIGHT);
    
    setHasChanges(false);
  };

  const handleCancel = () => {
    // Revert to original settings
    setTheme(originalTheme);
    setPrimaryColor(originalPrimaryColor);
    setHasChanges(false);
    
    // Revert the preview
    document.documentElement.setAttribute('data-theme', originalTheme);
    document.documentElement.style.setProperty('--color-primary', originalPrimaryColor);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Appearance":
        return (
          <AppearanceSettings
            theme={theme}
            setTheme={setTheme}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            handleResetToDefault={handleResetToDefault}
            showSaveSuccess={showSaveSuccess}
            hasChanges={hasChanges}
          />
        );
        case "Preferences":
          return <PreferencesSettings />;
        case "Privacy":
          return <PrivacySettings />;
        case "Security":
          return <SecuritySettings />;
        case "Notifications":
          return <NotificationSettings />;
        case "Billing":
          return <BillingSettings />;
        case "Integrations":
          return <IntegrationSettings />;
        default:
          return null;
    }
  };

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-[var(--color-text)]">Settings</h1>
        </div>

        {/* Mobile tabs dropdown */}
        <div className="md:hidden mb-4 relative">
          <button
            onClick={() => setShowMobileTabs(!showMobileTabs)}
            className="w-full flex justify-between items-center border rounded-md px-4 py-2 text-sm font-medium"
          >
            {activeTab}
            <ChevronDown size={16} className={`transition-transform ${showMobileTabs ? 'rotate-180' : ''}`} />
          </button>
          {showMobileTabs && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setShowMobileTabs(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    activeTab === tab 
                      ? 'bg-[var(--color-primary)] text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop tabs */}
        <div className="hidden md:flex space-x-4 border-b mb-6 md:mb-8 overflow-x-auto dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab 
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]" 
                  : "border-transparent text-gray-500 hover:text-[var(--color-primary)] dark:text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <section className="bg-[var(--color-bg)] rounded-lg p-4 md:p-6 shadow-sm border border-[var(--color-border)]">
          {renderTabContent()}
          <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-6 md:mt-8">
            {hasChanges && (
              <button 
                onClick={handleResetToDefault}
                className="px-4 py-2 rounded border text-sm hover:bg-gray-50 transition-colors dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Reset
              </button>
            )}
            <button 
              onClick={handleCancel}
              className="px-4 py-2 rounded border text-sm hover:bg-gray-50 transition-colors dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveChanges}
              className={`px-4 py-2 rounded text-white text-sm transition-colors ${
                hasChanges 
                  ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]' 
                  : 'bg-gray-400 cursor-not-allowed dark:bg-gray-600'
              }`}
              disabled={!hasChanges}
            >
              {showSaveSuccess ? (
                <span className="flex items-center gap-1">
                  <Check size={16} /> Saved
                </span>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;