import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/layout/NavBar";
import { RouteFocus } from "@/components/layout/RouteFocus";
import { SkyBand } from "@/components/layout/SkyBand";
import { TutorialGate } from "@/components/layout/TutorialGate";
import { StorageNotice } from "@/components/layout/StorageNotice";
import { Heart } from "@/components/ui/Icon";
import { focusRing, font } from "@/components/ui/styles";
import { cssVars } from "@/lib/tokens";
import { fontVars } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Kind Regards", template: "%s · Kind Regards" },
  description: "Do something kind, write it on a postcard, and watch your wall fill up. Saved on your device.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" style={cssVars} className={`${fontVars} h-full antialiased`}>
      <body className="paper-grain flex min-h-full flex-col">
        <a
          href="#main"
          className={`sr-only bg-(--cp-surface) px-4 py-2 focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 ${font.display} ${focusRing}`}
        >
          Skip to content
        </a>
        <SkyBand />
        <header className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-5 sm:px-6">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 self-start text-2xl font-bold ${font.display} ${focusRing} focus-visible:outline-offset-4`}
          >
            <Heart className="h-6 w-7" />
            Kind Regards
          </Link>
          <NavBar />
        </header>
        <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 pt-6 pb-32 outline-none sm:px-6">
          <StorageNotice />
          <RouteFocus />
          <TutorialGate>{children}</TutorialGate>
        </main>
        <footer className={`mx-auto w-full max-w-3xl px-4 pb-8 text-sm text-(--cp-muted) sm:px-6 ${font.body}`}>
          Your postcards are saved only in this browser, on this device. Nothing is sent anywhere.
        </footer>
      </body>
    </html>
  );
}
