import Footer from '@/components/footer';
import NavBar from '@/components/navBar';
import { Toaster } from 'react-hot-toast';

export default function DefaultLayout({ children }) {
    return (
        <>
            <Toaster />
            <NavBar />
            {children}
            <Footer />
        </>
    );
}
