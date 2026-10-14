import NewsDetail, { type NewsItem } from '@/components/newsDetail';
import { usePage } from '@inertiajs/react';
import DefaultLayout from '../defaultLayout';

export default function NovedadesPrivadasShow() {
    const { novedadPrivada } = usePage<{ novedadPrivada: NewsItem }>().props;

    return (
        <DefaultLayout>
            <NewsDetail novedad={novedadPrivada} backHref="/privada/novedades" />
        </DefaultLayout>
    );
}
