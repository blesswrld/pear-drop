import { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

// @ts-ignore
type DataConnection = any;

type Metadata = {
    type: "metadata";
    name: string;
    size: number;
    fileType: string;
};

/**
 * Кастомный хук для управления всей логикой PeerJS соединения.
 * Инкапсулирует состояние и методы для P2P-взаимодействия.
 */
export const usePeer = () => {
    // Состояния, напрямую влияющие на UI
    const [peerId, setPeerId] = useState("");
    const [remotePeerId, setRemotePeerId] = useState("");
    const [statusMessage, setStatusMessage] = useState("Инициализация...");
    const [isConnected, setIsConnected] = useState(false);
    const [receivedFile, setReceivedFile] = useState<{
        url: string;
        name: string;
    } | null>(null);
    const [progress, setProgress] = useState(0);

    // Refs для хранения экземпляров Peer и DataConnection без вызова ререндеров
    const peerRef = useRef<Peer | null>(null);
    const connRef = useRef<DataConnection | null>(null);

    // Эффект для инициализации PeerJS и подписки на основные события. Выполняется один раз.
    useEffect(() => {
        const newPeer = new Peer();
        peerRef.current = newPeer;

        // Срабатывает при успешном подключении к сигнальному серверу PeerJS
        newPeer.on("open", (id) => {
            setPeerId(id);
            setStatusMessage("Готов к работе. Поделитесь ID.");
        });

        // Срабатывает при входящем соединении от другого пира
        newPeer.on("connection", (connection) => {
            connRef.current = connection;
            setupConnectionEvents();
        });

        // Очистка при размонтировании компонента
        return () => {
            newPeer.destroy();
        };
    }, []);

    // Настраивает обработчики событий для установленного DataConnection
    const setupConnectionEvents = () => {
        if (!connRef.current) return;

        connRef.current.on("open", () => {
            setIsConnected(true);
            setStatusMessage("Соединение установлено!");
        });

        let receivedChunks: ArrayBuffer[] = [];
        let metadata: Metadata | null = null;

        // Обработка входящих данных (метаданные или чанки файла)
        // @ts-ignore
        connRef.current.on("data", (data: any) => {
            if (data.type === "metadata") {
                metadata = data;
                receivedChunks = [];
                setProgress(0);
                setStatusMessage(`Получение файла: ${metadata.name}`);
            } else {
                receivedChunks.push(data);
                const receivedSize = receivedChunks.reduce(
                    (acc, chunk) => acc + chunk.byteLength,
                    0
                );
                if (metadata) {
                    setProgress(
                        Math.round((receivedSize / metadata.size) * 100)
                    );
                    if (receivedSize === metadata.size) {
                        const fileBlob = new Blob(receivedChunks, {
                            type: metadata.fileType,
                        });
                        const url = URL.createObjectURL(fileBlob);
                        setReceivedFile({ url, name: metadata.name });
                        setStatusMessage(`Файл "${metadata.name}" получен!`);
                        setProgress(0);
                    }
                }
            }
        });
    };

    // Инициирует соединение с удаленным пиром по его ID
    const connectToPeer = () => {
        if (!peerRef.current || !remotePeerId) return;
        setStatusMessage(`Подключение к ${remotePeerId}...`);

        connRef.current = peerRef.current.connect(remotePeerId);
        setupConnectionEvents();
    };

    // Возвращаем все необходимые данные и функции для использования в UI
    return {
        peerId,
        remotePeerId,
        setRemotePeerId,
        statusMessage,
        isConnected,
        receivedFile,
        setReceivedFile,
        progress,
        connectToPeer,
        connRef, // Отдаем ref для отправки файла
    };
};
