import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/app/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Demo Hospital Graz: wait-time check",
  description:
    "Check how long it takes to reach the hospital and how long you will wait for a doctor. No account needed.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-text="normal" data-contrast="normal" className="h-full">
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <Providers>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
