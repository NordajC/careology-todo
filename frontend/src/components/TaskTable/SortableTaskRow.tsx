import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table, IconButton } from "@chakra-ui/react";
import { MdDragIndicator } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox";
import { DesktopTaskRow } from "./DesktopTaskRow";
import type { Task } from "@/types/task";
import type { UpdateTaskInput } from "@/types/index";

interface SortableTaskRowProps {
    task: Task;
    isDone?: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, input: UpdateTaskInput) => void;
}

export function SortableTaskRow({ task, isDone, onToggle, onDelete, onUpdate }: SortableTaskRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: "relative" as const,
        zIndex: isDragging ? 999 : "auto" as any,
    };

    return (
        <Table.Row ref={setNodeRef} style={style} bg="white" borderColor="gray.200">
            {/* Drag Handle */}
            <Table.Cell w="32px" bg="white" px={1}>
                <IconButton
                    aria-label="Drag to reorder"
                    size="xs"
                    variant="ghost"
                    cursor="grab"
                    color="gray.400"
                    _active={{ cursor: "grabbing" }}
                    {...attributes}
                    {...listeners}
                >
                    <MdDragIndicator />
                </IconButton>
            </Table.Cell>

            {/* Checkbox */}
            <Table.Cell w="40px" bg="white">
                <Checkbox
                    checked={isDone}
                    colorPalette="teal"
                    onChange={() => onToggle(task.id)}
                />
            </Table.Cell>

            {/* Rest of cells via embedded DesktopTaskRow */}
            <DesktopTaskRow
                task={task}
                isDone={isDone}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
                embedded
            />
        </Table.Row>
    );
}