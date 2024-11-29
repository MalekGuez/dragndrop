import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, ReactNode } from 'react';

interface Props {
    id: string;
    children: ReactNode;
    onDelete: () => void;
}

export function SortableItem({ id, children, onDelete }: Props) {
    const [isFocused, setIsFocused] = useState(false);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString({
            x: transform?.x ?? 0,
            y: transform?.y ?? 0,
            scaleX: transform?.scaleX ?? 1,
            scaleY: 1
        }),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    setIsFocused(false);
                }
            }}
        >
            <div className="relative group">
                <div className={`absolute right-0 top-0 flex flex-col justify-center items-center gap transition-opacity duration-200
                    ${isFocused || isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div
                        {...attributes}
                        {...listeners}
                        className="px-2 py-1 cursor-move text-gray-500 hover:text-gray-700"
                        title="Déplacer"
                    >
                        ⋮⋮
                    </div>
                    <button
                        onClick={onDelete}
                        className="px-2 py-1 text-red-500 hover:text-red-700"
                        title="Supprimer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
} 