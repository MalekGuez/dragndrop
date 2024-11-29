"use client";

import { useEffect, useState } from 'react';
import { sections } from '@/app/data/sections';
import { useDraggable } from '@dnd-kit/core';

type Section = {
    id?: string;
    name: string;
    content: string;
};

export default function Nav() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [itemContent, setItemContent] = useState<Section[] | null>(null);

    const navItems = [
        { name: "Sections", key: "sections", icon: "/static/icons/sections.svg" },
        { name: "Formes", key: "shapes", icon: "/static/icons/shapes.svg" },
        { name: "Fichiers", key: "files", icon: "/static/icons/files.svg" },
    ];
    
    const loadItemContent = async (key: string) => {
        switch (key) {
            case 'sections':
                setItemContent(sections);
                break;
            default:
                setItemContent(null);
                break;
        }
    };
    
    useEffect(() => {
        document.documentElement.style.setProperty(
            '--sidebar-width', 
            isExpanded ? '325px' : '100px'
        );
    }, [isExpanded]);
    
    const handleItemClick = (index: number) => {
        if (selectedItem === index) {
            setIsExpanded(false);
            setSelectedItem(null);
            setItemContent(null);
        } else {
            setIsExpanded(true);
            setSelectedItem(index);
            loadItemContent(navItems[index].key);
        }
    };
    
    function DraggableSection({ section, index }: { section: Section, index: number }) {
        const sectionWithId = {
            ...section,
            id: section.id || `section-${index}`
        };
        
        const { attributes, listeners, setNodeRef, transform } = useDraggable({
            id: JSON.stringify(sectionWithId),
        });
        
        const style = transform ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        } : undefined;

        return (
            <div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
            >
                <div 
                    className="rounded-lg cursor-move"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                />
            </div>
        );
    }
    
    return (
        <div className={`bg-white p-4 transition-all duration-300 ease-in-out shadow relative
            ${isExpanded ? 'w-[450px]' : 'w-[100px]'}`}>
            <div className="flex flex-col gap-4">
                {navItems
                    .map((item, index) => ({ item, index }))
                    .sort((a, b) => {
                        if (selectedItem === a.index) return -1;
                        if (selectedItem === b.index) return 1;
                        return a.index - b.index;
                    })
                    .map(({ item, index }) => (
                        <div key={index} className="flex flex-col">
                            <div 
                                onClick={() => handleItemClick(index)}
                                className={`
                                    ${selectedItem === null 
                                        ? 'w-[60px] translate-x-0 opacity-100' 
                                        : selectedItem === index 
                                            ? 'w-full translate-x-0 opacity-100' 
                                            : 'w-0 -translate-x-full opacity-0'
                                    } 
                                    h-[60px] 
                                    rounded-lg 
                                    bg-primary 
                                    flex 
                                    items-center 
                                    justify-between
                                    px-4
                                    gap-3
                                    hover:opacity-80 
                                    transition-all
                                    duration-300 
                                    ease-in-out 
                                    cursor-pointer
                                    overflow-hidden
                                `}
                            >
                                <img 
                                    src={item.icon} 
                                    alt={item.name}
                                    className="w-[26px] h-[26px] flex-shrink-0"
                                />
                                <span className={`
                                    text-white 
                                    font-bold
                                    uppercase
                                    text-right
                                    text-xl
                                    whitespace-nowrap
                                    transition-opacity
                                    duration-300
                                    ${isExpanded ? 'opacity-100' : 'opacity-0'}
                                `}>
                                    {item.name}
                                </span>
                            </div>
                            {selectedItem === index && itemContent && (
                                <div className="mt-4 max-h-[calc(100vh-100px)] overflow-y-auto no-scrollbar">
                                    {navItems[selectedItem].key === 'sections' && (
                                        <div className="space-y-6 animate-slideInFromBottom overflow-hidden">
                                            {itemContent.map((section: Section, idx: number) => (
                                                <div key={idx} className="relative">
                                                    <h3 className="text-lg font-semibold mb-1 text-black">
                                                        {section.name}
                                                    </h3>
                                                    <DraggableSection 
                                                        key={idx}   
                                                        section={section} 
                                                        index={idx}
                                                    />
                                                </div> 
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}
  