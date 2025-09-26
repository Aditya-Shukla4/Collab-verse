import type { Metadata } from 'next'
// 1. Temporarily remove Geist font imports
// import { GeistMono } from 'geist/font/mono' 
// import { GeistSans } from 'geist/font/sans'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
// 2. Import the client wrapper for theme (assuming you created it)
import { ThemeProvider } from '@/theme-provider' 

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning is needed when using theme providers
    <html lang="en" suppressHydrationWarning>
      {/* 3. Use standard font classes only */}
      <body className={`font-sans`}>
        {/* 4. Wrap the app with the Theme Provider */}
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
        >
          {children}
        </ThemeProvider>
        {/* 5. Analytics remains optional */}
        <Analytics />
      </body>
    </html>
  )
}