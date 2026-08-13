import { TouchableOpacity, View, Text } from "react-native"
import { UseUploadReturn } from "../../types/file"

export default function IncomeUpload({ handleClearFile, selectedIncomeFiles, isUploading, handleCamera, handleFilePicker, handleUpload, handleGallery }: UseUploadReturn) {

    return (
        <View className="gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
            <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-800">
                    <Text className="text-base font-semibold text-teal-600 dark:text-teal-300">↑</Text>
                </View>
                <View className="flex-1">
                    <Text className="text-sm font-semibold text-slate-950 dark:text-slate-50">Tulokuitti</Text>
                    <Text className="text-xs text-slate-500 dark:text-slate-400">Lisää myyntitosite tai lasku</Text>
                </View>
            </View>

            <View className="flex-row gap-2">
                <TouchableOpacity onPress={() => handleCamera(true)} className="h-11 flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">Kamera</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleGallery(true)} className="h-11 flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">Galleria</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleFilePicker(true)} className="h-11 flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">Tiedostot</Text>
                </TouchableOpacity>
            </View>

            {selectedIncomeFiles.length > 0 && (
                selectedIncomeFiles.map((file, index) => (
                    <View key={index} className="flex-row items-center gap-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2">
                        <Text className="text-slate-400 dark:text-slate-500">📎</Text>
                        <Text className="flex-1 text-xs text-slate-600 dark:text-slate-300" numberOfLines={1}>{file.name}</Text>
                    </View>
                ))
            )}

            <TouchableOpacity
                onPress={() => handleUpload(true)}
                disabled={isUploading || !selectedIncomeFiles}
                className={`h-11 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-800 ${isUploading || !selectedIncomeFiles ? "opacity-40" : ""}`}
            >
                <Text className="text-sm font-semibold text-white">{isUploading ? "Lähetetään..." : "Lähetä"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handleClearFile(true)}
                disabled={isUploading || !selectedIncomeFiles}
                className={`h-11 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-800 ${isUploading || !selectedIncomeFiles ? "opacity-40" : ""}`}
            >
                <Text className="text-sm font-semibold text-white">Tyhjennä</Text>
            </TouchableOpacity>
        </View>
    )
}
