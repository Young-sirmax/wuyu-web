import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { ToastViewport } from "@/components/ui";
import { LangSwitch } from "@/components/lang-switch";
import { I18nProvider } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("ui-lang")?.value === "en" ? "en" : "zh";
  return {
    title:
      lang === "en"
        ? "Hushuo · Campus Language Exchange & Party Platform"
        : "胡说 · 高校国际口语语伴与组局平台",
    description:
      lang === "en"
        ? "Find language partners and start speaking. Recommended partners, speaking parties, Toastmasters clubs and practice vlogs — a responsive web app migrated from the WeChat mini program."
        : "找到语伴，开口说外语。推荐语伴、口语组局、头马演讲俱乐部、练习 Vlog —— 由微信小程序完整迁移的响应式 Web 应用。",
    applicationName: "胡说 / Hushuo",
    appleWebApp: { capable: true, title: "Hushuo", statusBarStyle: "default" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#ff6b4a",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = (await cookies()).get("ui-lang")?.value === "en" ? "en" : "zh";
  return (
    <html lang={lang === "en" ? "en" : "zh-CN"}>
      <body>
        <I18nProvider>
          {children}
          <LangSwitch />
          <ToastViewport />
        </I18nProvider>
      </body>
    </html>
  );
}
