import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import "@/App.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import AboutPage from "@/pages/AboutPage";
import GalleryPage from "@/pages/GalleryPage";
import ContactPage from "@/pages/ContactPage";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

function LenisRoot() {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  const { token, checking } = useAuth();
  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-bone">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-palm border-t-transparent" />
      </div>
    );
  }
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

function MarketingLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <LenisRoot />
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<MarketingLayout><HomePage /></MarketingLayout>} />
          <Route path="/products" element={<MarketingLayout><ProductsPage /></MarketingLayout>} />
          <Route path="/about" element={<MarketingLayout><AboutPage /></MarketingLayout>} />
          <Route path="/gallery" element={<MarketingLayout><GalleryPage /></MarketingLayout>} />
          <Route path="/contact" element={<MarketingLayout><ContactPage /></MarketingLayout>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
