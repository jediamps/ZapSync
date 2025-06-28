import { useEffect } from 'react';
import { Check } from 'lucide-react';

const AppearanceSettings = ({
  theme,
  setTheme,
  primaryColor,
  setPrimaryColor,
  handleResetToDefault,
  showSaveSuccess,
  hasChanges
}) => {
  // Helper function to calculate hover color
  const getHoverColor = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.max(0, r - 25);
    g = Math.max(0, g - 25);
    b = Math.max(0, b - 25);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Apply theme preview (only when there are unsaved changes)
  useEffect(() => {
    if (hasChanges) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.setProperty('--color-primary', primaryColor);
      document.documentElement.style.setProperty(
        '--color-primary-hover', 
        getHoverColor(primaryColor)
      );
    }
  }, [theme, primaryColor, hasChanges]);

  const handleColorChange = (e) => {
    setPrimaryColor(e.target.value);
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-2 text-[var(--color-text)]">Appearance</h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Change how your public dashboard looks and feels.
      </p>

      <div className="mb-6 flex justify-end">
        <button
          onClick={handleResetToDefault}
          className="text-sm text-[var(--color-primary)] hover:underline"
        >
          Reset to default colors
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Theme</label>
        <div className="flex gap-4 mt-2">
          {["light", "dark", "system"].map((themeOption) => (
            <button
              key={themeOption}
              onClick={() => setTheme(themeOption)}
              className={`border rounded px-4 py-2 text-sm capitalize ${
                theme === themeOption
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white text-gray-800 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              {themeOption}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
          Primary Color
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={primaryColor}
            onChange={handleColorChange}
            className="w-16 h-10 border rounded cursor-pointer"
          />
          <span className="text-sm text-[var(--color-text-secondary)]">{primaryColor}</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          Preview
        </label>
        <div className="flex gap-4">
          <div className="flex-1 border rounded-lg p-4 border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-[var(--color-text)]">Sample Component</h3>
              <button 
                className="text-xs px-3 py-1 rounded" 
                style={{
                  backgroundColor: primaryColor,
                  color: 'white'
                }}
              >
                Button
              </button>
            </div>
            <div 
              className="h-4 w-full rounded-full mb-2"
              style={{ backgroundColor: `${primaryColor}33` }}
            ></div>
            <div 
              className="h-4 w-3/4 rounded-full mb-4"
              style={{ backgroundColor: `${primaryColor}33` }}
            ></div>
            <div className="flex gap-2">
              <div 
                className="h-8 w-8 rounded-full"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <div className="flex-1 border rounded p-2 text-sm border-[var(--color-border)] text-[var(--color-text)]">
                This is a preview of your selected color scheme
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          Language
        </label>
        <select className="border rounded px-3 py-2 text-sm border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]">
          <option>English (UK)</option>
          <option>English (US)</option>
        </select>
      </div>
    </>
  );
};

export default AppearanceSettings;