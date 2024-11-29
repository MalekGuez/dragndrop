"use client";

import Nav from "./components/nav";
import EditBar from "./components/editBar";
import { useState, useCallback, KeyboardEvent } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useDraggable } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Droppable } from './components/Droppable';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { SortableItem } from './components/SortableItem';

export default function Home() {
    const [sections, setSections] = useState<any[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!over) return;
        
        if (typeof active.id === 'string' && active.id.startsWith('{')) {
            const newSection = JSON.parse(active.id);
            const uniqueId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const sectionWithId = {
                ...newSection,
                id: uniqueId
            };
            setSections(prev => [...prev, sectionWithId]);
            return;
        }
        
        const oldIndex = sections.findIndex(section => section.id === active.id);
        const newIndex = sections.findIndex(section => section.id === over.id);
        
        if (oldIndex !== newIndex) {
            setSections(prev => arrayMove(prev, oldIndex, newIndex));
        }
    }, [sections]);

    const handleContentEdit = useCallback((sectionId: string, newContent: string) => {
        setSections(prev => prev.map(section => 
            section.id === sectionId 
                ? { ...section, content: newContent }
                : section
        ));
    }, []);

    const handleDeleteSection = useCallback((sectionId: string) => {
        setSections(prev => prev.filter(section => section.id !== sectionId));
    }, []);

    return (
        <DndContext 
            onDragEnd={handleDragEnd}
            onDragStart={(event) => setActiveId(event.active.id as string)}
            modifiers={[restrictToWindowEdges]}
        >
            <main className="flex h-screen overflow-hidden">
                <Nav />
                <div className="w-full h-full flex justify-center pt-[150px] pb-10 relative overflow-y-auto no-scrollbar">
                    <EditBar />
                    <Droppable id="main-content">
                        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                            <div className="w-full h-[900px] rounded-2xl shadow border-primary border bg-white p-8 overflow-y-auto no-scrollbar">
                                {sections.map((section) => (
                                    <SortableItem key={section.id} id={section.id} onDelete={() => handleDeleteSection(section.id)}>
                                        <div className="mb-2 group/section">
                                            <div
                                                contentEditable
                                                suppressContentEditableWarning
                                                onFocus={() => setIsEditing(true)}
                                                onBlur={(e) => {
                                                    handleContentEdit(section.id, e.currentTarget.innerHTML);
                                                    setIsEditing(false);
                                                }}
                                                className="cursor-text focus:outline-none focus-within:ring-1 focus-within:ring-black focus-within:ring-opacity-50 p-2"
                                                onKeyDown={(e: KeyboardEvent) => {
                                                    if (e.key === 'Escape') {
                                                        (e.target as HTMLElement).blur();
                                                    }
                                                }}
                                                dangerouslySetInnerHTML={{ __html: section.content }}
                                            />
                                        </div>
                                    </SortableItem>
                                ))}
                                {sections.length === 0 && (
                                    <p className="text-[#C0C0C0] text-xl font-medium pointer-events-none">
                                        Insérez un élément...
                                    </p>
                                )}
                            </div>
                        </SortableContext>
                    </Droppable>
                </div>
            </main>
            <DragOverlay>
                {activeId && (
                    <div className="border border-black bg-white p-2 bg-transparent cursor-move">
                        {activeId.startsWith('{') 
                            ? <div dangerouslySetInnerHTML={{__html: JSON.parse(activeId).content}} />
                            : <div dangerouslySetInnerHTML={{__html: sections.find(section => section.id === activeId)?.content}} />
                        }
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}
