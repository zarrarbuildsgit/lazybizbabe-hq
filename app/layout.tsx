import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Sidebar } from '@/components/ui/Sidebar'
import { Topbar } from '@/components/ui/Topbar'
import { QuickCapture } from '@/components/ui/QuickCapture'
import { MobileNav } from '@/components/ui/MobileNav'
import { ThemeProvider } from '@/components/ui/ThemeProvider'

export const metadata: Metadata = {
  title: 'LazyBizBabe HQ ✦',
  description: 'Your command centre, Ope.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-0 lg:ml-[220px] flex flex-col min-h-screen relative z-10">
              <Topbar />
              <main className="flex-1 p-5 lg:p-10 pb-24 lg:pb-10">
                {children}
              </main>
            </div>
          </div>
          <MobileNav />
          <QuickCapture />
        </ThemeProvider>
      </body>
    </html>
  )
}
