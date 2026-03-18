import { Box, Table, Text } from "@chakra-ui/react";
import {
    AccordionItem,
    AccordionItemTrigger,
    AccordionItemContent,
} from "@/components/ui/accordion";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DesktopTableHeader } from "./DesktopTableHeader";
import { SortableTaskRow } from "./SortableTaskRow";
import { DesktopTaskRow } from "./DesktopTaskRow";
import { AddTaskRow } from "./AddTaskRow";
import type { Task } from "@/types/task";
import type { CreateTaskInput, UpdateTaskInput } from "@/types/index";

interface DesktopTaskListProps {
    title: string;
    tasks: Task[];
    isDone?: boolean;
    showAddRow?: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, input: UpdateTaskInput) => void;
    onAdd: (input: CreateTaskInput) => void;
    onCancelAdd: () => void;
    onReorder?: (orderedIds: string[]) => void;
}

export function DesktopTaskList({
    title,
    tasks,
    isDone,
    showAddRow,
    onToggle,
    onDelete,
    onUpdate,
    onAdd,
    onCancelAdd,
    onReorder,
}: DesktopTaskListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = tasks.findIndex((t) => t.id === active.id);
        const newIndex = tasks.findIndex((t) => t.id === over.id);
        const reordered = arrayMove(tasks, oldIndex, newIndex);

        onReorder?.(reordered.map((t) => t.id));
    }

    return (
        <AccordionItem value={title.toLowerCase()} borderBottom="none">
            <AccordionItemTrigger mb={2} px={0} _hover={{ bg: "transparent" }}>
                <Text fontWeight="bold" fontSize="lg">{title}</Text>
            </AccordionItemTrigger>
            <AccordionItemContent px={0} pb={8}>

                {/* Tasks done — no drag and drop */}
                {isDone ? (
                    <Box
                        borderWidth="1px"
                        borderColor="gray.200"
                        borderRadius="8px"
                        bg="white"
                        overflow="hidden"
                    >
                        <Table.Root
                            size="sm"
                            bg="white"
                            mb={0}
                            css={{ "--chakra-colors-border": "var(--chakra-colors-gray-200)" }}
                        >
                            <DesktopTableHeader />
                            <Table.Body bg="white">
                                {tasks.map((task) => (
                                    <DesktopTaskRow
                                        key={task.id}
                                        task={task}
                                        isDone
                                        onToggle={onToggle}
                                        onDelete={onDelete}
                                        onUpdate={onUpdate}
                                    />
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                ) : (
                    // Tasks to do — DndContext wraps the entire box/table
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <Box
                            borderWidth="1px"
                            borderColor="gray.200"
                            borderRadius="8px"
                            bg="white"
                            overflow="hidden"
                        >
                            <Table.Root
                                size="sm"
                                bg="white"
                                mb={0}
                                css={{ "--chakra-colors-border": "var(--chakra-colors-gray-200)" }}
                            >
                                <DesktopTableHeader showDragColumn />
                                <Table.Body bg="white">
                                    <SortableContext
                                        items={tasks.map((t) => t.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {tasks.map((task) => (
                                            <SortableTaskRow
                                                key={task.id}
                                                task={task}
                                                onToggle={onToggle}
                                                onDelete={onDelete}
                                                onUpdate={onUpdate}
                                            />
                                        ))}
                                    </SortableContext>

                                    {showAddRow && (
                                        <AddTaskRow
                                            onAdd={onAdd}
                                            onCancel={onCancelAdd}
                                            order={tasks.length}
                                        />
                                    )}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    </DndContext>
                )}

            </AccordionItemContent>
        </AccordionItem>
    );
}