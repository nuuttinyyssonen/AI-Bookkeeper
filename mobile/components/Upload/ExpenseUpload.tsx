import { TouchableOpacity, View, Text } from "react-native"
import { UseUploadReturn } from "../../types/file"

export default function ExpenseUpload({ selectedFile, isUploading, handleCamera, handleFilePicker, handleUpload, handleGallery }: UseUploadReturn) {

    return (
        <View className="gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-lg bg-rose-100">
                    <Text className="text-base font-semibold text-rose-600">↓</Text>
                </View>
                <View className="flex-1">
                    <Text className="text-sm font-semibold text-slate-950">Kulukuitti</Text>
                    <Text className="text-xs text-slate-500">Lisää ostokuitti tai lasku</Text>
                </View>
            </View>

            <View className="flex-row gap-2">
                <TouchableOpacity onPress={handleCamera} className="h-11 flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                    <Text className="text-xs font-medium text-slate-600">Kamera</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleGallery} className="h-11 flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                    <Text className="text-xs font-medium text-slate-600">Galleria</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleFilePicker} className="h-11 flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                    <Text className="text-xs font-medium text-slate-600">Tiedostot</Text>
                </TouchableOpacity>
            </View>

            {selectedFile && (
                <View className="flex-row items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2">
                    <Text className="text-slate-400">📎</Text>
                    <Text className="flex-1 text-xs text-slate-600" numberOfLines={1}>{selectedFile.name}</Text>
                </View>
            )}

            <TouchableOpacity
                onPress={() => handleUpload(false)}
                disabled={isUploading || !selectedFile}
                className={`h-11 items-center justify-center rounded-lg bg-slate-900 ${isUploading || !selectedFile ? "opacity-40" : ""}`}
            >
                <Text className="text-sm font-semibold text-white">{isUploading ? "Lähetetään..." : "Lähetä"}</Text>
            </TouchableOpacity>
        </View>
    )
}
