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
      setPasswordMessage({ tone: "error", text: "Password minimal 6 karakter." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ tone: "error", text: "Konfirmasi password tidak sama." });
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordMessage({
          tone: "error",
          text: "Gagal mengubah password. Pastikan kamu sudah login.",
        });
        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({ tone: "success", text: "Password berhasil diubah." });
    } catch {
      setPasswordMessage({ tone: "error", text: "Gagal mengubah password. Coba lagi." });
    } finally {
      setPasswordLoading(false);
    }
  };

  const headerTitle =
    activePanel === "account"
      ? "Pengaturan Akun"
      : activePanel === "password"
        ? "Ubah Password"
        : activePanel === "language"
          ? "Bahasa"
          : activePanel === "faq"
            ? "FAQ"
            : activePanel === "help"
              ? "Bantuan"
              : "Pengaturan";

  const headerSubtitle =
    activePanel === null
      ? "Atur pengalaman GrinBuds"
      : activePanel === "account"
        ? "Kelola informasi akun"
        : activePanel === "password"
          ? "Perbarui keamanan akun"
          : activePanel === "language"
            ? "Pilih bahasa aplikasi"
            : activePanel === "faq"
              ? "Pertanyaan yang sering ditanya"
              : "Butuh bantuan?";

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
                <Card title="Akun">
                  <RowButton
                    icon={<User size={20} />}
                    title="Profil Anak"
                    subtitle={childName ? `Saat ini: ${childName}` : "Atur nama & avatar"}
                    onClick={onOpenProfile}
                  />
                  <RowButton
                    icon={<Settings size={20} />}
                    title="Pengaturan Akun"
                    subtitle="Info akun & status login"
                    onClick={() => setActivePanel("account")}
                  />
                  <RowButton
                    icon={<LockKeyhole size={20} />}
                    title="Ubah Password"
                    subtitle="Perbarui password akun"
                    onClick={() => setActivePanel("password")}
                  />
                </Card>

                <Card title="Preferensi">
                  <RowButton
                    icon={<Languages size={20} />}
                    title="Bahasa"
                    subtitle={`Saat ini: ${languageLabel}`}
                    onClick={() => setActivePanel("language")}
                  />
                </Card>

                <Card title="Audio">
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
                        <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 15, color: "var(--color-text)" }}>Matikan suara</div>
                        <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 2 }}>
                          {audioMuted ? "Semua suara dimatikan" : "Musik & efek suara aktif"}
                        </div>
                      </div>
                    </div>

                    <Switch checked={audioMuted} onChange={setMuted} />
                  </div>
                </Card>

                <Card title="Bantuan">
                  <RowButton
                    icon={<BookOpen size={20} />}
                    title="FAQ"
                    subtitle="Pertanyaan umum"
                    onClick={() => setActivePanel("faq")}
                  />
                  <RowButton
                    icon={<HelpCircle size={20} />}
                    title="Bantuan"
                    subtitle="Panduan singkat & solusi"
                    onClick={() => setActivePanel("help")}
                  />
                </Card>

                <Card title="Sesi">
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
                    <LogOut size={20} /> Keluar
                  </motion.button>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", lineHeight: 1.4, padding: "0 4px" }}>
                    Keluar akan kembali ke layar masuk. Progres belajar tetap tersimpan.
                  </div>
                </Card>
              </div>
            ) : activePanel === "account" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card title="Info Akun">
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 13, color: "var(--color-text-light)" }}>Status</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 13, color: "var(--color-text)" }}>{accountLoading ? "Memuat..." : accountEmail ? "Terhubung" : "Belum login"}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 13, color: "var(--color-text-light)" }}>Email</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 13, color: "var(--color-text)" }}>{accountLoading ? "—" : accountEmail ?? "—"}</div>
                    </div>
                  </div>
                </Card>
                <Card title="Catatan">
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, color: "var(--color-text-light)", lineHeight: 1.5 }}>
                    Pengaturan akun dan ubah password akan berfungsi jika aplikasi sudah terhubung dengan sistem login.
                  </div>
                </Card>
              </div>
            ) : activePanel === "password" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card title="Ubah Password">
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 13, color: "var(--color-text-light)", paddingLeft: 4 }}>
                        Password baru
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
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
                        Konfirmasi password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi password"
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
                      {passwordLoading ? "Menyimpan..." : "Simpan Password"}
                    </motion.button>
                  </div>
                </Card>
              </div>
            ) : activePanel === "language" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card title="Pilih Bahasa">
                  <RowButton
                    icon={<Languages size={20} />}
                    title="Bahasa Indonesia"
                    subtitle="Disarankan"
                    onClick={() => setAppLanguage("id")}
                    right={language === "id" ? <span style={activePillStyle}>Aktif</span> : null}
                  />
                  <RowButton
                    icon={<Languages size={20} />}
                    title="English"
                    subtitle="Beta"
                    onClick={() => setAppLanguage("en")}
                    right={language === "en" ? <span style={activePillStyle}>Aktif</span> : null}
                  />
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", lineHeight: 1.4, padding: "0 4px" }}>
                    Beberapa teks mungkin masih menggunakan Bahasa Indonesia.
                  </div>
                </Card>
              </div>
            ) : activePanel === "faq" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card title="Pertanyaan Umum">
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 14, color: "var(--color-text)" }}>Bagaimana cara mematikan suara?</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 6, lineHeight: 1.45 }}>
                        Buka Pengaturan → Audio → aktifkan “Matikan suara”.
                      </div>
                    </div>
                    <div style={{ background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 14, color: "var(--color-text)" }}>Bagaimana cara mengganti profil anak?</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 6, lineHeight: 1.45 }}>
                        Masuk ke Pengaturan → Profil Anak untuk mengganti nama dan avatar.
                      </div>
                    </div>
                    <div style={{ background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 14, color: "var(--color-text)" }}>Apakah progres belajar tersimpan?</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 6, lineHeight: 1.45 }}>
                        Progres disimpan setelah misi selesai. Pastikan koneksi stabil saat menyimpan.
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card title="Bantuan">
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 14, color: "var(--color-text)" }}>Tidak ada suara?</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 6, lineHeight: 1.45 }}>
                        Cek Pengaturan → Audio, lalu pastikan volume perangkat tidak dalam mode senyap.
                      </div>
                    </div>
                    <div style={{ background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 14, color: "var(--color-text)" }}>Aplikasi terasa lambat?</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 6, lineHeight: 1.45 }}>
                        Tutup aplikasi lalu buka kembali. Jika masih, coba bersihkan tab yang sedang berjalan.
                      </div>
                    </div>
                    <div style={{ background: "var(--color-bg)", padding: "14px 14px", borderRadius: 22 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: 14, color: "var(--color-text)" }}>Tidak bisa mengubah password?</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "var(--color-text-light)", marginTop: 6, lineHeight: 1.45 }}>
                        Fitur ini membutuhkan akun yang sudah login. Coba keluar lalu masuk kembali.
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
