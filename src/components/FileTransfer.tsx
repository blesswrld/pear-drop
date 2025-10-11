import { useRef, useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Progress } from "@nextui-org/progress";
import { UploadCloud, DownloadCloud } from "lucide-react";
import { ConfirmationModal } from "./ConfirmationModal";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

interface FileTransferProps {
    // @ts-ignore
    connRef: React.MutableRefObject<any>;
    statusMessage: string;
    progress: number;
    receivedFile: { url: string; name: string } | null;
    setReceivedFile: (file: { url: string; name: string } | null) => void;
    onDisconnect: () => void;
}

export const FileTransfer = ({
    connRef,
    statusMessage,
    progress,
    receivedFile,
    setReceivedFile,
    onDisconnect,
}: FileTransferProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > MAX_FILE_SIZE) {
                alert("Ошибка: Файл слишком большой (> 100 MB)");
                setFile(null);
            } else {
                setFile(selectedFile);
            }
        }
    };

    const sendFile = async () => {
        if (!file || !connRef.current) return;
        connRef.current.send({
            type: "metadata",
            name: file.name,
            size: file.size,
            fileType: file.type,
        });
        const buffer = await file.arrayBuffer();
        connRef.current.send(buffer);
    };

    const downloadFile = () => {
        if (receivedFile) {
            const a = document.createElement("a");
            a.href = receivedFile.url;
            a.download = receivedFile.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setReceivedFile(null);
        }
    };

    const handleConfirmDisconnect = () => {
        onDisconnect();
        setConfirmModalOpen(false);
    };

    return (
        <>
            <Card className="max-w-md w-full bg-content1/70 backdrop-blur-md">
                <CardHeader className="flex-col items-center text-center px-6 pt-6">
                    <h2 className="text-2xl font-bold text-success mb-1">
                        Соединение установлено!
                    </h2>
                    <p className="text-small text-default-500">
                        {statusMessage}
                    </p>
                </CardHeader>
                <CardBody className="p-6">
                    <div className="space-y-4">
                        {progress > 0 && progress < 100 && (
                            <Progress
                                aria-label="Загрузка..."
                                size="sm"
                                value={progress}
                                color="primary"
                                showValueLabel={true}
                                className="max-w-md"
                            />
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <Button
                            variant="bordered"
                            onPress={() => fileInputRef.current?.click()}
                            className="w-full"
                        >
                            <UploadCloud className="mr-2 h-4 w-4" />
                            {file ? file.name : "Выбрать файл"}
                        </Button>
                        <Button
                            color="primary"
                            onPress={sendFile}
                            disabled={!file || progress > 0}
                            className="w-full font-bold"
                        >
                            Отправить
                        </Button>
                        {receivedFile && (
                            <div className="pt-4 border-t border-default-200">
                                <Button
                                    onPress={downloadFile}
                                    color="success"
                                    className="w-full font-bold text-white"
                                >
                                    <DownloadCloud className="mr-2 h-4 w-4" />
                                    Скачать "{receivedFile.name}"
                                </Button>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmDisconnect}
            />
        </>
    );
};
