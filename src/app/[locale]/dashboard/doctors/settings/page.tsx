'use client';

import { type ReactNode, useState } from 'react';

import { usePathname, useRouter } from '@/i18n/routing';
import { Check, Globe, Zap } from 'lucide-react';
import { useLocale } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

/* ── Reusable section wrapper ── */
function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="text-primary flex h-10 w-10 items-center justify-center rounded-md bg-sky-100">
          {icon}
        </div>
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

/* ── Reusable option button (for language/theme pickers) ── */
function OptionButton({
  selected,
  onClick,
  icon,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md border-2 px-5 py-3 text-sm font-medium transition-colors ${
        selected
          ? 'border-primary bg-primary/5 text-primary'
          : 'border-gray-200 text-gray-600 hover:border-gray-300'
      }`}
    >
      {selected && !icon && <Check className="h-4 w-4" />}
      {icon}
      {label}
    </button>
  );
}

/* ── Reusable toggle row (for availability prefs) ── */
function ToggleRow({
  id,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-sky-50 px-5 py-4">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} className="shrink-0" />
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [autoAvailable, setAutoAvailable] = useState(true);
  const [autoBusy, setAutoBusy] = useState(false);

  const switchLocale = (newLocale: 'en' | 'ar') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex justify-center pt-10">
      <div className="w-full max-w-4xl space-y-6">
        {/* Language */}
        <SettingsSection
          icon={<Globe className="h-5 w-5" />}
          title="Language"
          description="Choose your preferred language"
        >
          <div className="flex gap-3">
            <OptionButton
              selected={locale === 'en'}
              onClick={() => switchLocale('en')}
              label="English"
            />
            <OptionButton
              selected={locale === 'ar'}
              onClick={() => switchLocale('ar')}
              label="العربية"
            />
          </div>
        </SettingsSection>

        {/* Availability Preferences */}
        <SettingsSection
          icon={<Zap className="h-5 w-5" />}
          title="Availability Preferences"
          description="Automatically manage your status based on office hours"
        >
          <div className="space-y-4">
            <ToggleRow
              id="auto-available"
              title="Auto-set Available during office hours"
              description='Your status will automatically change to "Available" when your office hours begin'
              checked={autoAvailable}
              onCheckedChange={setAutoAvailable}
            />
            <ToggleRow
              id="auto-busy"
              title="Auto-set Busy outside office hours"
              description='Your status will automatically change to "Busy" when your office hours end'
              checked={autoBusy}
              onCheckedChange={setAutoBusy}
            />
          </div>
        </SettingsSection>

        {/* Save */}
        <div className="flex justify-end">
          <Button className="gap-2 bg-amber-400 px-6 text-white hover:bg-amber-500">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
