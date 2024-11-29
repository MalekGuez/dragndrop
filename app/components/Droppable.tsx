import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';

interface DroppableProps {
  id: string;
  children: ReactNode;
}

export function Droppable({ id, children }: DroppableProps) {
  const { setNodeRef } = useDroppable({ id });

    return <div ref={setNodeRef} className="w-[85%] h-fit flex justify-center">{children}</div>;
}