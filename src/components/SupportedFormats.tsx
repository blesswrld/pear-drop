import { FileText, Image, Video, Archive, FileCode, Music } from "lucide-react";
import { motion } from "framer-motion";

const formats = [
    {
        icon: <Image size={24} />,
        name: "Изображения",
        types: "JPG, PNG, GIF, WEBP",
    },
    { icon: <Video size={24} />, name: "Видео", types: "MP4, MOV, AVI, WEBM" },
    { icon: <Music size={24} />, name: "Аудио", types: "MP3, WAV, OGG" },
    {
        icon: <FileText size={24} />,
        name: "Документы",
        types: "PDF, DOCX, TXT",
    },
    { icon: <Archive size={24} />, name: "Архивы", types: "ZIP, RAR, 7Z" },
    {
        icon: <FileCode size={24} />,
        name: "Другие",
        types: "Любые файлы до 100МБ",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

export const SupportedFormats = () => {
    return (
        <motion.div
            className="w-full max-w-4xl mx-auto mt-16 text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <h3 className="text-lg font-semibold text-default-500 mb-6">
                Поддерживает все популярные форматы
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {formats.map((format) => (
                    <motion.div
                        key={format.name}
                        className="bg-content1/50 p-4 rounded-xl border border-default-200 flex flex-col items-center justify-center gap-2"
                        variants={itemVariants}
                    >
                        <div className="text-success">{format.icon}</div>
                        <p className="font-semibold text-foreground">
                            {format.name}
                        </p>
                        <p className="text-xs text-default-500">
                            {format.types}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
