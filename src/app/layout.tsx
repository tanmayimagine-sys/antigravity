import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { BusinessProvider } from "@/components/shell/BusinessContext";
import { SourceDrawerProvider } from "@/components/ui/SourceDrawer";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { MobileTabs } from "@/components/shell/MobileTabs";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { GuidedDemoTour } from "@/components/shell/GuidedDemoTour";

export const metadata: Metadata = {
  title: "Central AI Micro-Business Operating System",
  description: "Connected AI Operating System for Indian Micro-Businesses (Cafés, Stationery, Retail)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-bg text-text antialiased selection:bg-primary-soft selection:text-primary-ink">
        <ThemeProvider>
          <BusinessProvider>
            <SourceDrawerProvider>
              <div className="flex h-screen overflow-hidden bg-bg">
                {/* Desktop Collapsible Sidebar */}
                <Sidebar />

                {/* Main Content Viewport */}
                <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                  <TopBar />

                  <main className="flex-1 overflow-y-auto pb-20 lg:pb-8 focus:outline-none">
                    {children}
                  </main>

                  <MobileTabs />
                </div>
              </div>

              {/* Global Command Palette & Guided Tour Modals */}
              <CommandPalette />
              <GuidedDemoTour />
            </SourceDrawerProvider>
          </BusinessProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
