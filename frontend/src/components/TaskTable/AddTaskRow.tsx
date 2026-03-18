import { Table, Input, IconButton, HStack } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { MdCheck, MdClose } from "react-icons/md";
import { useState } from "react";
import type { CreateTaskInput } from "@/types/index";

interface AddTaskRowProps {
    onAdd: (input: CreateTaskInput) => void;
    onCancel: () => void;
    order: number;
}

export function AddTaskRow({ onAdd, onCancel, order }: AddTaskRowProps) {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [tag, setTag] = useState("");
    const [note, setNote] = useState("");

    function handleSave() {
        if (!title.trim()) return;
        onAdd({
            title: title.trim(),
            dueDate: dueDate || undefined,
            tag: tag || undefined,
            note: note || undefined,
            order,
        });
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && title.trim()) handleSave();
        if (e.key === "Escape") onCancel();
    }

    return (
        <Table.Row bg="white" borderColor="gray.200">
            <Table.Cell w="32px" bg="white" />

            {/* Checkbox */}
            <Table.Cell w="40px" bg="white">
                <Checkbox disabled />
            </Table.Cell>

            {/* Title */}
            <Table.Cell bg="white">
                <Input
                    placeholder="Write a task here..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    size="sm"
                    variant="flushed"
                    autoFocus
                    borderColor="gray.300"
                    _focus={{ borderColor: "teal.500" }}
                />
            </Table.Cell>

            {/* Due Date — aligned with Due date column */}
            <Table.Cell w="140px" bg="white">
                <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    size="sm"
                    borderColor="gray.300"
                />
            </Table.Cell>

            {/* Tag — aligned with Tag column */}
            <Table.Cell w="120px" bg="white">
                <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    style={{
                        border: "1px solid #CBD5E0",
                        borderRadius: "4px",
                        padding: "2px 10px",
                        fontSize: "14px",
                        width: "100%",
                        backgroundColor: "white",
                        height: "2.25rem"
                    }}
                >
                    <option value="">No tag</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </Table.Cell>

            {/* Note — aligned with Note column */}
            <Table.Cell bg="white">
                <Input
                    placeholder="Add a note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    size="sm"
                    variant="flushed"
                    borderColor="gray.300"
                    maxLength={150}
                />
            </Table.Cell>

            {/* Actions */}
            <Table.Cell w="80px" textAlign="center" bg="white">
                <HStack gap={1} justify="center">
                    <IconButton
                        aria-label="Confirm"
                        size="xs"
                        variant="ghost"
                        onClick={handleSave}
                        disabled={!title.trim()}
                    >
                        <MdCheck color="green" />
                    </IconButton>
                    <IconButton aria-label="Cancel" size="xs" variant="ghost" onClick={onCancel}>
                        <MdClose color="red" />
                    </IconButton>
                </HStack>
            </Table.Cell>
        </Table.Row>
    );
}