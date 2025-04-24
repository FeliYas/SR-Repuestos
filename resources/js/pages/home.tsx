import BannerInicio from '@/components/bannerInicio';
import Carousel from '@/components/Carousel';
import InstagramInicio from '@/components/instagramInicio';
import MarcasInicio from '@/components/marcasInicio';
import NovedadesInicio from '@/components/novedadesInicio';
import ProductosInicio from '@/components/productosInicio';
import SearchBar from '@/components/searchBar';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import DefaultLayout from './defaultLayout';

export default function Home() {
    const { auth } = usePage<SharedData>().props;

    return (
        <DefaultLayout>
            <Carousel />
            <SearchBar />
            <ProductosInicio />
            <BannerInicio />
            <NovedadesInicio />
            <InstagramInicio />
            <MarcasInicio />
        </DefaultLayout>
    );
}
