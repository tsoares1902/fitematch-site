import InternalPageChrome from "@/components/Common/InternalPageChrome";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import "../styles/index.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#FCFCFC]">
        <div className="isolate">
          <Header />
          <InternalPageChrome />
          {children}
          <Footer />
        </div>
        <ScrollToTop />
      </body>
    </html>
  );
}
