export type AppLanguage = "id" | "en";

export type AppSettings = {
  audioMuted: boolean;
  language: AppLanguage;
};

const STORAGE_KEY = "grinbuds.settings.v1";
export const SETTINGS_EVENT = "grinbuds:settings";

const DEFAULT_SETTINGS: AppSettings = {
  audioMuted: false,
  language: "id",
};

function parseLanguage(value: unknown): AppLanguage | null {
  if (value === "id" || value === "en") return value;
  return null;
}

export function getAppSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_SETTINGS;

    const record = parsed as Record<string, unknown>;

    return {
      audioMuted: typeof record.audioMuted === "boolean" ? record.audioMuted : DEFAULT_SETTINGS.audioMuted,
      language: parseLanguage(record.language) ?? DEFAULT_SETTINGS.language,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function setAppSettings(next: Partial<AppSettings>): AppSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS, ...next };

  const merged: AppSettings = { ...getAppSettings(), ...next };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent<AppSettings>(SETTINGS_EVENT, { detail: merged }));
  } catch {
    // ignore
  }

  return merged;
}
