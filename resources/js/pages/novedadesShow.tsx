import NewsDetail, { type NewsItem } from '@/components/newsDetail';
import { usePage } from '@inertiajs/react';
import DefaultLayout from './defaultLayout';

export default function NovedadesShow() {
    const { novedad } = usePage<{ novedad: NewsItem }>().props;

    return (
        <DefaultLayout>
            <NewsDetail novedad={novedad} backHref="/novedades" compactTop />
        </DefaultLayout>
    );
}
