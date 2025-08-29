import { useRef, useState } from "react";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

interface FileTransferProps {
    // @ts-ignore
    connRef: React.MutableRefObject<any>;
    statusMessage: string;
    progress: number;
    receivedFile: { url: string; name: string } | null;
    setReceivedFile: (file: { url: string; name: string } | null) => void;
}

/**
 * Компонент, отвечающий за UI в состоянии установленного P2P-соединения.
 * Позволяет выбирать, отправлять и скачивать файлы.
 */
export const FileTransfer = ({
    connRef,
    statusMessage,
    progress,
    receivedFile,
    setReceivedFile,
}: FileTransferProps) => {
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Обрабатывает выбор файла пользователем и проверяет его размер
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

    // Отправляет сначала метаданные, а затем сам файл (как ArrayBuffer)
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

    // Создает временную ссылку и инициирует скачивание полученного файла
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

    return (
        <div className="text-center space-y-4">
            <p className="text-lg text-emerald-400 font-bold">
                {statusMessage}
            </p>
            {progress > 0 && progress < 100 && (
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div
                        className="bg-sky-500 h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
            {/* Скрытый input[type=file] для выбора файла */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg"
            >
                {file ? `Выбран: ${file.name}` : "Выбрать файл"}
            </button>
            <button
                onClick={sendFile}
                disabled={!file || progress > 0}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-slate-700 disabled:cursor-not-allowed"
            >
                Отправить
            </button>
            {receivedFile && (
                <div className="pt-4 border-t border-slate-700">
                    <button
                        onClick={downloadFile}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg"
                    >
                        Скачать "{receivedFile.name}"
                    </button>
                </div>
            )}
        </div>
    );
};
