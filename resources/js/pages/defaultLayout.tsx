import Footer from '@/components/footer';
import NavBar from '@/components/navBar';
import Whatsapp from '@/components/whatsapp';
import { Toaster } from 'react-hot-toast';

export default function DefaultLayout({ children }) {
    return (
        <>
            <Toaster />
            <NavBar />
            {children}
            <Footer />
            <Whatsapp />
        </>
    );
}
