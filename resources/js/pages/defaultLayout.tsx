import Footer from '@/components/footer';
import NavBar from '@/components/navBar';

export default function DefaultLayout({ children }) {
    return (
        <>
            <NavBar />
            {children}
            <Footer />
        </>
    );
}
