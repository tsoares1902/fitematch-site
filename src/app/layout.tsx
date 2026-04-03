import InternalPageChrome from "@/components/Common/InternalPageChrome";
import AuthRouteGuard from "@/components/Common/AuthRouteGuard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/contexts/auth-context";
import "../styles/index.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#FCFCFC]">
        <AuthProvider>
          <AuthRouteGuard>
            <div className="isolate">
              <Header />
              <InternalPageChrome />
              {children}
              <Footer />
            </div>
            <ScrollToTop />
          </AuthRouteGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
