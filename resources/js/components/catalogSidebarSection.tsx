import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

interface SidebarItem {
    id: number | string;
    name: string;
}

interface CatalogSidebarSectionProps<T extends SidebarItem> {
    title: string;
    items?: T[];
    activeId?: number | string | null;
    isOpen: boolean;
    onToggle: () => void;
    searchPlaceholder: string;
    emptyMessage: string;
    getHref: (item: T) => string;
    getData?: (item: T) => Record<string, number | string>;
}

export default function CatalogSidebarSection<T extends SidebarItem>({
    title,
    items = [],
    activeId,
    isOpen,
    onToggle,
    searchPlaceholder,
    emptyMessage,
    getHref,
    getData,
}: CatalogSidebarSectionProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredItems = items.filter((item) => item.name.toLowerCase().includes(normalizedSearchTerm));
    const normalizedActiveId = activeId == null ? null : String(activeId);

    return (
        <div className="flex flex-col">
            <button onClick={onToggle} className="flex flex-row items-center justify-between border-b border-[#E0E0E0] pr-2 pb-1">
                <h2 className="text-[18px] font-semibold md:text-[20px]">{title}</h2>
                <FontAwesomeIcon
                    icon={faChevronUp}
                    color="#74716A"
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
                <div className="pt-3">
                    <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        type="search"
                        aria-label={searchPlaceholder}
                        placeholder={searchPlaceholder}
                        className="mb-3 h-[38px] w-full border border-[#E0E0E0] bg-white px-3 text-[13px] text-[#74716A] outline-none transition-colors placeholder:text-[#A0A0A0] focus:border-[#C8C8C8] md:text-[14px]"
                    />

                    <div className="flex flex-col md:max-h-[640px] md:overflow-y-auto md:pr-1">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <div key={item.id} className="border-b border-[#E0E0E0] py-2">
                                    <Link
                                        className={`block w-full text-[14px] text-[#74716A] transition-colors hover:text-black md:text-[16px] ${
                                            normalizedActiveId === String(item.id) ? 'font-bold' : ''
                                        }`}
                                        href={getHref(item)}
                                        data={getData ? getData(item) : undefined}
                                    >
                                        {item.name}
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="border-b border-[#E0E0E0] py-2 text-[13px] text-[#A0A0A0] md:text-[14px]">{emptyMessage}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
