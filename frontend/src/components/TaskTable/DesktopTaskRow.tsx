import { Table, Text, Badge, Input, IconButton, HStack, Button } from "@chakra-ui/react";
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogFooter,
    DialogCloseTrigger,
    DialogBackdrop,
    DialogPositioner,
} from "@chakra-ui/react";
import { createPortal } from "react-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { MdEdit, MdDeleteOutline, MdCheck, MdClose } from "react-icons/md";
import { useState } from "react";
import type { Task } from "@/types/task";
import type { UpdateTaskInput } from "@/types/index";
import { getTagStyle } from "@/utils/tagStyles";

interface TaskRowProps {
    task: Task;
    isDone?: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, input: UpdateTaskInput) => void;
    embedded?: boolean; // when true, renders cells only (no Table.Row wrapper)
}

export function DesktopTaskRow({ task, isDone, onToggle, onDelete, onUpdate, embedded = false }: TaskRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDueDate, setEditDueDate] = useState(task.dueDate ?? "");
    const [editTag, setEditTag] = useState(task.tag ?? "");
    const [editNote, setEditNote] = useState(task.note ?? "");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    function handleSave() {
        onUpdate(task.id, {
            title: editTitle.trim() || task.title,
            dueDate: editDueDate || undefined,
            tag: editTag || undefined,
            note: editNote || undefined,
        });
        setIsEditing(false);
    }

    function handleCancel() {
        setEditTitle(task.title);
        setEditDueDate(task.dueDate ?? "");
        setEditTag(task.tag ?? "");
        setEditNote(task.note ?? "");
        setIsEditing(false);
    }

    const tagStyle = task.tag ? getTagStyle(task.tag) : null;
    const noteContent = task.weather?.city
        ? `(${task.weather.icon ?? "☀️"} ${task.weather.temp})`
        : task.note ?? "";

    // The cells content — shared between embedded and standalone modes
    const cells = (
        <>
            <Table.Cell w="40%" color={isDone ? "gray.500" : "inherit"} bg="white">
                {isEditing ? (
                    <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        size="sm"
                        autoFocus
                        bg="white"
                        color="gray.800"
                        onKeyDown={(e) => { if (e.key === "Escape") handleCancel(); }}
                        borderColor="teal.400"
                        placeholder="Task name"
                    />
                ) : (
                    <Text color={isDone ? "gray.400" : "gray.800"} textDecoration={isDone ? "line-through" : "none"}>
                        {task.title}
                    </Text>
                )}
            </Table.Cell>

            <Table.Cell w="140px" color={isDone ? "gray.500" : "inherit"} bg="white">
                {isEditing ? (
                    <Input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        size="sm"
                        bg="white"
                        color="gray.800"
                        borderColor="teal.400"
                    />
                ) : (
                    task.dueDate
                        ? new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short"
                        })
                        : ""
                )}
            </Table.Cell>

            <Table.Cell w="120px" bg="white">
                {isEditing ? (
                    <select
                        value={editTag}
                        onChange={(e) => setEditTag(e.target.value)}
                        style={{
                            border: "1px solid #81E6D9",
                            borderRadius: "4px",
                            padding: "2px 10px",
                            fontSize: "14px",
                            width: "100%",
                            backgroundColor: "white",
                            color: "#2D3748",
                            height: "2.25rem"
                        }}
                    >
                        <option value="">None</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                ) : (
                    tagStyle && task.tag ? (
                        <Badge
                            bg={tagStyle.bg}
                            color={tagStyle.color}
                            variant="solid"
                            size="md"
                            opacity={isDone ? 0.7 : 1}
                        >
                            {task.tag}
                        </Badge>
                    ) : null
                )}
            </Table.Cell>

            <Table.Cell w="20%" color={isDone ? "gray.500" : "inherit"} bg="white">
                {isEditing ? (
                    <Input
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        size="sm"
                        bg="white"
                        color="gray.800"
                        borderColor="teal.400"
                        placeholder="Add a note..."
                        maxLength={150}
                    />
                ) : (
                    noteContent
                )}
            </Table.Cell>

            <Table.Cell w="80px" textAlign="center" bg="white">
                <HStack gap={1} justify="center">
                    {isEditing ? (
                        <>
                            <IconButton aria-label="Save" size="xs" variant="ghost" onClick={handleSave}>
                                <MdCheck color="green" />
                            </IconButton>
                            <IconButton aria-label="Cancel" size="xs" variant="ghost" onClick={handleCancel}>
                                <MdClose color="red" />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton aria-label="Edit task" size="xs" variant="ghost" onClick={() => setIsEditing(true)}>
                                <MdEdit color="#4A5568" />
                            </IconButton>
                            <IconButton aria-label="Delete task" size="xs" variant="ghost" onClick={() => setShowDeleteDialog(true)}>
                                <MdDeleteOutline color="#4A5568" />
                            </IconButton>
                        </>
                    )}
                </HStack>
            </Table.Cell>
        </>
    );

    const dialog = showDeleteDialog && createPortal(
        <DialogRoot open={showDeleteDialog} onOpenChange={(e) => setShowDeleteDialog(e.open)}>
            <DialogBackdrop />
            <DialogPositioner
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="fixed"
                inset="0"
            >
                <DialogContent bg="white">
                    <DialogHeader color="gray.800">Delete Task</DialogHeader>
                    <DialogCloseTrigger />
                    <DialogBody color="gray.700">
                        Are you sure you want to delete <strong>"{task.title}"</strong>? This cannot be undone.
                    </DialogBody>
                    <DialogFooter>
                        <HStack gap={3}>
                            <Button variant="outline" color="gray.700" onClick={() => setShowDeleteDialog(false)}>
                                Cancel
                            </Button>
                            <Button
                                bg="red.500"
                                color="white"
                                _hover={{ bg: "red.600" }}
                                onClick={() => { onDelete(task.id); setShowDeleteDialog(false); }}
                            >
                                Delete
                            </Button>
                        </HStack>
                    </DialogFooter>
                </DialogContent>
            </DialogPositioner>
        </DialogRoot>,
        document.body
    );

    // Embedded mode — just cells, no Table.Row (used by SortableTaskRow)
    if (embedded) {
        return (
            <>
                {cells}
                {dialog}
            </>
        );
    }

    // Standalone mode — full Table.Row
    return (
        <>
            <Table.Row bg="white" borderColor="gray.200">

                <Table.Cell w="40px" bg="white">
                    <Checkbox
                        checked={isDone}
                        colorPalette="teal"
                        onChange={() => onToggle(task.id)}
                    />
                </Table.Cell>
                {cells}
            </Table.Row>
            {dialog}
        </>
    );
}