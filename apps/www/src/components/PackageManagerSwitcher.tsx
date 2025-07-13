import { useState } from 'react';

const packageManagers = {
  npm: 'npm install @form-kit/form-kit',
  pnpm: 'pnpm add @form-kit/form-kit',
  yarn: 'yarn add @form-kit/form-kit',
  bun: 'bun add @form-kit/form-kit',
};

type PackageManager = keyof typeof packageManagers;

export default function PackageManagerSwitcher() {
  const [selected, setSelected] = useState<PackageManager>('npm');

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
      <div className="flex space-x-2 mb-4">
        {Object.keys(packageManagers).map((pm) => (
          <button
            key={pm}
            onClick={() => setSelected(pm as PackageManager)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selected === pm
                ? 'bg-primary text-primary-foreground'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}>
            {pm}
          </button>
        ))}
      </div>
      <div className="bg-gray-900 text-gray-300 p-4 rounded-md w-full text-left font-mono">
        {packageManagers[selected]}
      </div>
    </div>
  );
}
