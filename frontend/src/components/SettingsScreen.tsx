"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Howler } from "howler";
import { BookOpen, ChevronLeft, ChevronRight, HelpCircle, Languages, LockKeyhole, LogOut, Settings, User, Volume2, VolumeX } from "lucide-react";

import { AVATARS } from "@/components/ChildSetupScreen";
import { getAppSettings, SETTINGS_EVENT, setAppSettings, type AppSettings } from "@/lib/appSettings";
import { supabase } from "@/lib/supabase";

export interface SettingsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  childName?: string;
  childAvatarId?: string;
  onOpenProfile?: () => void;
  onSignOut?: () => void;
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="btn-press"
      onClick={() => onChange(!checked)}
      style={{
        width: 56,
        height: 34,
        borderRadius: 9999,
        border: `2px solid ${checked ? "var(--color-green-dark)" : "var(--color-border)"}`,
        background: checked ? "var(--color-green)" : "var(--color-border)",
        padding: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: checked ? "flex-end" : "flex-start",
        boxShadow: checked ? "var(--shadow-chunky-green)" : "var(--shadow-chunky)",
        cursor: "pointer",
        transition: "all 0.15s var(--ease-smooth)",
      }}
    >
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "var(--color-white)",
          boxShadow: "var(--shadow-md)",
        }}
      />
    </button>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--color-white)",
        borderRadius: 28,
        padding: 18,
        boxShadow: "var(--shadow-md)",
        border: "1.5px solid var(--color-border-light)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 16,
          color: "var(--color-text)",
          letterSpacing: 0.2,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function RowButton({
  icon,
  title,
  subtitle,
  onClick,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  right?: React.ReactNode;
}) {
  const isDisabled = !onClick;

  return (
    <motion.button
      type="button"
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 14px",
        borderRadius: 22,
        border: "none",
        background: "var(--color-bg)",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.55 : 1,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 18,
          background: "var(--color-green-pale)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-green)",
          flex: "0 0 auto",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 15, color: "var(--color-text)" }}>{title}</div>
        {subtitle ? (
          <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 2 }}>{subtitle}</div>
        ) : null}
      </div>
      {right ?? (!isDisabled ? <ChevronRight size={18} color="var(--color-text-muted)" /> : null)}
    </motion.button>
  );
}

export function SettingsScreen({
  isOpen,
  onClose,
  childName,
  childAvatarId,
  onOpenProfile,
  onSignOut,
}: SettingsScreenProps) {
  const [audioMuted, setAudioMuted] = useState(false);
  const [language, setLanguage] = useState<AppSettings["language"]>("id");
  const [activePanel, setActivePanel] = useState<"account" | "password" | "language" | "faq" | "help" | null>(null);

  const [accountLoading, setAccountLoading] = useState(false);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const isEnglish = language === "en";
  const t = (idText: string, enText: string) => (isEnglish ? enText : idText);

  const avatarIcon = useMemo(() => {
    if (!childAvatarId) return null;
    return AVATARS.find((a) => a.id === childAvatarId)?.icon ?? null;
  }, [childAvatarId]);

  useEffect(() => {
    if (!isOpen) {
      setActivePanel(null);
      setPasswordMessage(null);
      return;
    }

    const initial = getAppSettings();
    setAudioMuted(initial.audioMuted);
    setLanguage(initial.language);

    const handler = (e: Event) => {
      const evt = e as CustomEvent<AppSettings>;
      if (evt.detail && typeof evt.detail.audioMuted === "boolean") setAudioMuted(evt.detail.audioMuted);
      if (evt.detail && (evt.detail.language === "id" || evt.detail.language === "en")) setLanguage(evt.detail.language);
    };

    window.addEventListener(SETTINGS_EVENT, handler as EventListener);
    return () => window.removeEventListener(SETTINGS_EVENT, handler as EventListener);
  }, [isOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language === "en" ? "en" : "id";
  }, [language]);

  const setMuted = (next: boolean) => {
    setAudioMuted(next);
    setAppSettings({ audioMuted: next });
    Howler.mute(next);
  };

  const setAppLanguage = (next: AppSettings["language"]) => {
    setLanguage(next);
    setAppSettings({ language: next });
  };

  useEffect(() => {
    if (!isOpen) return;
    if (activePanel !== "account") return;

    let cancelled = false;
    setAccountLoading(true);
    setAccountEmail(null);

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (cancelled) return;
        setAccountEmail(data.user?.email ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        // ignore
      })
      .finally(() => {
        if (cancelled) return;
        setAccountLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activePanel, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (activePanel !== "password") return;

    setPasswordMessage(null);
    setNewPassword("");
    setConfirmPassword("");
  }, [activePanel, isOpen]);

  const handleChangePassword = async () => {
    setPasswordMessage(null);

    if (newPassword.trim().length < 6) {
      setPasswordMessage({ tone: "error", text: t("Password minimal 6 karakter.", "Password must be at least 6 characters.") });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ tone: "error", text: t("Konfirmasi password tidak sama.", "Password confirmation does not match.") });
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordMessage({
          tone: "error",
          text: t("Gagal mengubah password. Pastikan kamu sudah login.", "Failed to change password. Make sure you are signed in."),
        });
        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({ tone: "success", text: t("Password berhasil diubah.", "Password updated successfully.") });
    } catch {
      setPasswordMessage({ tone: "error", text: t("Gagal mengubah password. Coba lagi.", "Failed to change password. Please try again.") });
    } finally {
      setPasswordLoading(false);
    }
  };

  const headerTitle =
    activePanel === "account"
      ? t("Pengaturan Akun", "Account Settings")
      : activePanel === "password"
        ? t("Ubah Password", "Change Password")
        : activePanel === "language"
          ? t("Bahasa", "Language")
          : activePanel === "faq"
            ? "FAQ"
            : activePanel === "help"
              ? t("Bantuan", "Help")
              : t("Pengaturan", "Settings");

  const headerSubtitle =
    activePanel === null
      ? t("Atur pengalaman GrinBuds", "Customize your GrinBuds experience")
      : activePanel === "account"
        ? t("Kelola informasi akun", "Manage account information")
        : activePanel === "password"
          ? t("Perbarui keamanan akun", "Update account security")
          : activePanel === "language"
            ? t("Pilih bahasa aplikasi", "Choose app language")
            : activePanel === "faq"
              ? t("Pertanyaan yang sering ditanya", "Frequently asked questions")
              : t("Butuh bantuan?", "Need help?");

  const languageLabel = language === "en" ? "English" : "Bahasa Indonesia";
  const activePillStyle: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 9999,
    background: "var(--color-green-light)",
    color: "var(--color-green-deeper)",
    fontFamily: "var(--font-body)",
    fontWeight: 900,
    fontSize: 11,
    letterSpacing: 0.2,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "8%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "8%" }}
          transition={{ type: "spring", damping: 28, stiffness: 220 }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 480,
            background: "linear-gradient(180deg, var(--color-green-pale) 0%, var(--color-bg) 35%, var(--color-bg) 100%)",
            borderRadius: 50,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "52px 20px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                type="button"
                onClick={() => {
                  if (activePanel) {
                    setActivePanel(null);
                    return;
                  }

                  onClose();
                }}
                className="btn-press"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(12px)",
                  border: "none",
                  boxShadow: "0 4px 0 var(--color-border), var(--shadow-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--color-text)",
                }}
                aria-label="Kembali"
              >
                <ChevronLeft size={24} />
              </button>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--color-text)" }}>{headerTitle}</div>
                <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 11, color: "var(--color-text-light)", letterSpacing: 0.7, textTransform: "uppercase", marginTop: 4 }}>
                  {headerSubtitle}
                </div>
              </div>
            </div>

            {/* Quick avatar */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 20,
                background: "rgba(255,255,255,0.9)",
                border: "2px solid rgba(255,255,255,0.95)",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-green)",
              }}
              aria-hidden
            >
              <div style={{ width: 32, height: 32 }}>{avatarIcon ?? <User size={22} />}</div>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px 28px" }}>
            {activePanel === null ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card title={t("Akun", "Account")}>
                  <RowButton
                    icon={<User size={20} />}
                    title={t("Profil Anak", "Child Profile")}
                    subtitle={childName ? t(`Saat ini: ${childName}`, `Current: ${childName}`) : t("Atur nama & avatar", "Edit name and avatar")}
                    onClick={onOpenProfile}
                  />
                  <RowButton
                    icon={<Settings size={20} />}
                    title={t("Pengaturan Akun", "Account Settings")}
                    subtitle={t("Info akun & status login", "Account info & login status")}
                    onClick={() => setActivePanel("account")}
                  />
                  <RowButton
                    icon={<LockKeyhole size={20} />}
                    title={t("Ubah Password", "Change Password")}
                    subtitle={t("Perbarui password akun", "Update account password")}
                    onClick={() => setActivePanel("password")}
                  />
                </Card>

                <Card title={t("Preferensi", "Preferences")}>
                  <RowButton
                    icon={<Languages size={20} />}
                    title={t("Bahasa", "Language")}
                    subtitle={t(`Saat ini: ${languageLabel}`, `Current: ${languageLabel}`)}
                    onClick={() => setActivePanel("language")}
                  />
                </Card>

                <Card title={t("Audio", "Audio")}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "14px 14px",
                      borderRadius: 22,
                      background: "var(--color-bg)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 18,
                          background: audioMuted ? "var(--color-red-light)" : "var(--color-blue-pale)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: audioMuted ? "var(--color-red)" : "var(--color-blue)",
                        }}
                      >
                        {audioMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 15, color: "var(--color-text)" }}>{t("Matikan suara", "Mute audio")}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 2 }}>
                          {audioMuted ? t("Semua suara dimatikan", "All sounds are muted") : t("Musik & efek suara aktif", "Music and SFX are on")}
                        </div>
                      </div>
                    </div>

                    <Switch checked={audioMuted} onChange={setMuted} />
                  </div>
                </Card>

                <Card title={t("Bantuan", "Help")}>
                  <RowButton
                    icon={<BookOpen size={20} />}
                    title="FAQ"
                    subtitle={t("Pertanyaan umum", "Common questions")}
                    onClick={() => setActivePanel("faq")}
                  />
                  <RowButton
                    icon={<HelpCircle size={20} />}
                    title={t("Bantuan", "Help")}
                    subtitle={t("Panduan singkat & solusi", "Quick tips & solutions")}
                    onClick={() => setActivePanel("help")}
                  />
                </Card>

                <Card title={t("Sesi", "Session")}>
                  <motion.button
                    type="button"
                    whileTap={onSignOut ? { scale: 0.98, y: 2 } : {}}
                    onClick={onSignOut}
                    disabled={!onSignOut}
                    style={{
                      width: "100%",
                      padding: "16px 16px",
                      borderRadius: 24,
                      border: "none",
                      background: "var(--color-red)",
                      color: "var(--color-white)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 18,
                      boxShadow: "0 8px 0 var(--color-red-dark), var(--shadow-md)",
                      cursor: onSignOut ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      opacity: onSignOut ? 1 : 0.6,
                    }}
                  >
                    <LogOut size={20} /> {t("Keluar", "Sign Out")}
                  </motion.button>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", lineHeight: 1.4, padding: "0 4px" }}>
                    {t("Keluar akan kembali ke layar masuk. Progres belajar tetap tersimpan.", "Signing out returns to the login screen. Learning progress stays saved.")}
                  </div>
                </Card>
              </div>
            ) : activePanel === "account" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card title={t("Info Akun", "Account Info")}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 13, color: "var(--color-text-light)" }}>{t("Status", "Status")}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 13, color: "var(--color-text)" }}>{accountLoading ? t("Memuat...", "Loading...") : accountEmail ? t("Terhubung", "Connected") : t("Belum login", "Not signed in")}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 13, color: "var(--color-text-light)" }}>{t("Email", "Email")}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 13, color: "var(--color-text)" }}>{accountLoading ? "—" : accountEmail ?? "—"}</div>
                    </div>
                  </div>
                </Card>
                <Card title={t("Catatan", "Note")}>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, color: "var(--color-text-light)", lineHeight: 1.5 }}>
                    {t("Pengaturan akun dan ubah password akan berfungsi jika aplikasi sudah terhubung dengan sistem login.", "Account settings and password changes work when the app is connected to the login system.")}
                  </div>
                </Card>
              </div>
            ) : activePanel === "password" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card title={t("Ubah Password", "Change Password")}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 13, color: "var(--color-text-light)", paddingLeft: 4 }}>
                        {t("Password baru", "New password")}
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t("Minimal 6 karakter", "At least 6 characters")}
                        style={{
                          width: "100%",
                          borderRadius: 22,
                          border: "2px solid var(--color-border)",
                          background: "var(--color-bg)",
                          padding: "14px 16px",
                          fontFamily: "var(--font-body)",
                          fontWeight: 800,
                          fontSize: 15,
                          color: "var(--color-text)",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 13, color: "var(--color-text-light)", paddingLeft: 4 }}>
                        {t("Konfirmasi password", "Confirm password")}
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t("Ulangi password", "Repeat password")}
                        style={{
                          width: "100%",
                          borderRadius: 22,
                          border: "2px solid var(--color-border)",
                          background: "var(--color-bg)",
                          padding: "14px 16px",
                          fontFamily: "var(--font-body)",
                          fontWeight: 800,
                          fontSize: 15,
                          color: "var(--color-text)",
                          outline: "none",
                        }}
                      />
                    </div>

                    {passwordMessage ? (
                      <div
                        style={{
                          borderRadius: 18,
                          padding: "12px 14px",
                          background: passwordMessage.tone === "success" ? "var(--color-green-pale)" : "var(--color-red-light)",
                          color: passwordMessage.tone === "success" ? "var(--color-green-deeper)" : "var(--color-red-dark)",
                          fontFamily: "var(--font-body)",
                          fontWeight: 900,
                          fontSize: 13,
                          lineHeight: 1.35,
                          border: `1.5px solid ${passwordMessage.tone === "success" ? "var(--color-green-light)" : "var(--color-red)"}`,
                        }}
                      >
                        {passwordMessage.text}
                      </div>
                    ) : null}

                    <motion.button
                      type="button"
                      whileTap={passwordLoading ? {} : { scale: 0.98, y: 2 }}
                      onClick={handleChangePassword}
                      disabled={passwordLoading}
                      style={{
                        width: "100%",
                        padding: "16px 16px",
                        borderRadius: 24,
                        border: "none",
                        background: passwordLoading ? "var(--color-border)" : "var(--color-green)",
                        color: "var(--color-white)",
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: 18,
                        boxShadow: passwordLoading ? "none" : "0 8px 0 var(--color-green-dark), var(--shadow-md)",
                        cursor: passwordLoading ? "not-allowed" : "pointer",
                      }}
                    >
                      {passwordLoading ? t("Menyimpan...", "Saving...") : t("Simpan Password", "Save Password")}
                    </motion.button>
                  </div>
                </Card>
              </div>
            ) : activePanel === "language" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card title={t("Pilih Bahasa", "Choose Language")}>
                  <RowButton
                    icon={<Languages size={20} />}
                    title={t("Bahasa Indonesia", "Bahasa Indonesia")}
                    subtitle={t("Disarankan", "Recommended")}
                    onClick={() => setAppLanguage("id")}
                    right={language === "id" ? <span style={activePillStyle}>{t("Aktif", "Active")}</span> : null}
                  />
                  <RowButton
                    icon={<Languages size={20} />}
                    title="English"
                    subtitle={t("Beta", "Beta")}
                    onClick={() => setAppLanguage("en")}
                    right={language === "en" ? <span style={activePillStyle}>{t("Aktif", "Active")}</span> : null}
                  />
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", lineHeight: 1.4, padding: "0 4px" }}>
                    {t("Beberapa bagian aplikasi mungkin masih berbahasa Indonesia.", "Some parts of the app may still be in Bahasa Indonesia.")}
                  </div>
                </Card>
              </div>
            ) : activePanel === "faq" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card title={t("Pertanyaan Umum", "FAQ")}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 14, color: "var(--color-text)" }}>{t("Bagaimana cara mematikan suara?", "How do I mute the audio?")}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 6, lineHeight: 1.45 }}>
                        {t("Buka Pengaturan → Audio → aktifkan “Matikan suara”.", "Go to Settings → Audio → enable \"Mute audio\".")}
                      </div>
                    </div>
                    <div style={{ background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 14, color: "var(--color-text)" }}>{t("Bagaimana cara mengganti profil anak?", "How do I change the child profile?")}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 6, lineHeight: 1.45 }}>
                        {t("Masuk ke Pengaturan → Profil Anak untuk mengganti nama dan avatar.", "Open Settings → Child Profile to update name and avatar.")}
                      </div>
                    </div>
                    <div style={{ background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 14, color: "var(--color-text)" }}>{t("Apakah progres belajar tersimpan?", "Is learning progress saved?")}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 6, lineHeight: 1.45 }}>
                        {t("Progres disimpan setelah misi selesai. Pastikan koneksi stabil saat menyimpan.", "Progress is saved after a mission finishes. Keep a stable connection while saving.")}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card title={t("Bantuan", "Help")}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 14, color: "var(--color-text)" }}>{t("Tidak ada suara?", "No sound?")}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 6, lineHeight: 1.45 }}>
                        {t("Cek Pengaturan → Audio, lalu pastikan volume perangkat tidak dalam mode senyap.", "Check Settings → Audio, then make sure device volume is not muted.")}
                      </div>
                    </div>
                    <div style={{ background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 14, color: "var(--color-text)" }}>{t("Aplikasi terasa lambat?", "App feels slow?")}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 6, lineHeight: 1.45 }}>
                        {t("Tutup aplikasi lalu buka kembali. Jika masih, coba bersihkan tab yang sedang berjalan.", "Close and reopen the app. If it persists, close other open tabs.")}
                      </div>
                    </div>
                    <div style={{ background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 14, color: "var(--color-text)" }}>{t("Tidak bisa mengubah password?", "Can't change password?")}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 6, lineHeight: 1.45 }}>
                        {t("Fitur ini membutuhkan akun yang sudah login. Coba keluar lalu masuk kembali.", "This feature requires a signed-in account. Try signing out and back in.")}
                      </div>
                    </div>
                    <div style={{ background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 14, color: "var(--color-text)" }}>{t("Kontak", "Contact")}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 6, lineHeight: 1.45 }}>
                        {t("Email bantuan:", "Support email:")}
                        {" "}
                        <a href="mailto:grinbuds@gmail.com" style={{ color: "var(--color-blue)", fontWeight: 900, textDecoration: "none" }}>
                          grinbuds@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
