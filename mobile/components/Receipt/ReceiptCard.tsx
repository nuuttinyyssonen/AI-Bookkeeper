import { View, Text, TextInput, TouchableOpacity } from "react-native"
import Deductible from "./Deductible"
import Categories from "./Categories"

export default function ReceiptCard({ receiptView }: any) {
    return (
        <View className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-6 shadow-sm">
            <View className="flex-row items-start justify-between">
                <View className="flex-1">
                    <Text className="mb-1 text-xs text-slate-500 dark:text-slate-400">Toimittaja</Text>
                    {receiptView.isEditing ? (
                        <TextInput
                            value={receiptView.editForm.vendor_name}
                            onChangeText={(value) => receiptView.setEditForm((prev: any) => ({ ...prev, vendor_name: value }))}
                            className="h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 text-sm text-slate-950 dark:text-slate-50"
                        />
                    ) : (
                        <Text className="text-lg font-semibold text-slate-950 dark:text-slate-50">{receiptView.receipt.vendor_name}</Text>
                    )}
                </View>
            </View>

            <View className="mt-4 flex-row items-end justify-between gap-4">
                <View className="flex-1">
                    <Text className="mb-1 text-xs text-slate-500 dark:text-slate-400">Päivämäärä</Text>
                    {receiptView.isEditing ? (
                        <TextInput
                            value={receiptView.editForm.receipt_date}
                            onChangeText={(value) => receiptView.setEditForm((prev: any) => ({ ...prev, receipt_date: value }))}
                            placeholder="VVVV-KK-PP"
                            placeholderTextColor="#94a3b8"
                            className="h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 text-sm text-slate-950 dark:text-slate-50"
                        />
                    ) : (
                        <Text className="text-sm text-slate-700 dark:text-slate-200">
                            {new Date(receiptView.receipt.receipt_date).toLocaleDateString("fi-FI")}
                        </Text>
                    )}
                </View>
                <View className="flex-1 items-end">
                    <Text className="mb-1 text-xs text-slate-500 dark:text-slate-400">Yhteensä</Text>
                    {receiptView.isEditing ? (
                        <TextInput
                            value={receiptView.editForm.total_amount}
                            onChangeText={(value) => receiptView.setEditForm((prev: any) => ({ ...prev, total_amount: value }))}
                            keyboardType="decimal-pad"
                            className="h-11 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 text-right text-sm text-slate-950 dark:text-slate-50"
                        />
                    ) : (
                        <Text className="text-lg font-semibold text-slate-950 dark:text-slate-50">{receiptView.receipt.total_amount} €</Text>
                    )}
                </View>
            </View>

            {receiptView.isEditing ? (
                receiptView.editVats.length > 0 && (
                    <View className="mt-4 gap-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4">
                        <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">ALV-erittely</Text>
                        {receiptView.editVats.map((vat: any) => (
                            <View key={vat.id} className="gap-2">
                                <View className="flex-row items-center gap-2">
                                    <Text className="w-16 text-xs text-slate-500 dark:text-slate-400">Kanta %</Text>
                                    <TextInput
                                        value={vat.rate}
                                        onChangeText={(value) => receiptView.handleVatFieldChange(vat.id, "rate", value)}
                                        keyboardType="decimal-pad"
                                        className="h-9 flex-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 text-sm text-slate-700 dark:text-slate-200"
                                    />
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Text className="w-16 text-xs text-slate-500 dark:text-slate-400">Netto</Text>
                                    <TextInput
                                        value={vat.net_amount}
                                        onChangeText={(value) => receiptView.handleVatFieldChange(vat.id, "net_amount", value)}
                                        keyboardType="decimal-pad"
                                        className="h-9 flex-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 text-sm text-slate-700 dark:text-slate-200"
                                    />
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Text className="w-16 text-xs text-slate-500 dark:text-slate-400">ALV</Text>
                                    <TextInput
                                        value={vat.vat_amount}
                                        onChangeText={(value) => receiptView.handleVatFieldChange(vat.id, "vat_amount", value)}
                                        keyboardType="decimal-pad"
                                        className="h-9 flex-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 text-sm text-slate-700 dark:text-slate-200"
                                    />
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Text className="w-16 text-xs text-slate-500 dark:text-slate-400">Yhteensä</Text>
                                    <TextInput
                                        value={vat.total}
                                        onChangeText={(value) => receiptView.handleVatFieldChange(vat.id, "total", value)}
                                        keyboardType="decimal-pad"
                                        className="h-9 flex-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 text-sm text-slate-700 dark:text-slate-200"
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                )
            ) : receiptView.receipt.receiptVats.length > 0 ? (
                <View className="mt-4 gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4">
                    <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">ALV-erittely</Text>
                    {receiptView.receipt.receiptVats.map((vat: any) => (
                        <View key={vat.id} className="flex-row flex-wrap gap-x-4 gap-y-1">
                            <Text className="text-sm text-slate-700 dark:text-slate-200">Kanta: {vat.rate} %</Text>
                            <Text className="text-sm text-slate-700 dark:text-slate-200">Netto: {vat.net_amount} €</Text>
                            <Text className="text-sm text-slate-700 dark:text-slate-200">ALV: {vat.vat_amount} €</Text>
                            <Text className="text-sm text-slate-700 dark:text-slate-200">Yhteensä: {vat.total} €</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <Text className="mt-4 text-sm text-slate-500 dark:text-slate-400">ALV-tietoja ei saatavilla.</Text>
            )}

            <View className="mt-4">
                <Categories
                    selectedCategory={receiptView.selectedCategory}
                    handleCategoryChange={receiptView.handleCategoryChange}
                />
            </View>

            <View className="mt-4">
                <Deductible
                    handleDeductibleToggle={receiptView.handleDeductibleToggle}
                    isDeductible={receiptView.isDeductible}
                    deductiblePercentage={receiptView.deductiblePercentage}
                    handleDeductiblePercentageChange={receiptView.handleDeductiblePercentageChange}
                />
            </View>

            <View className="mt-6 flex-row flex-wrap gap-3">
                {receiptView.isEditing ? (
                    <>
                        <TouchableOpacity
                            onPress={receiptView.handleSaveEdit}
                            disabled={receiptView.isSaving}
                            className={`h-9 items-center justify-center rounded-md bg-teal-600 px-4 ${receiptView.isSaving ? "opacity-60" : ""}`}
                        >
                            <Text className="text-sm font-semibold text-white">{receiptView.isSaving ? "Tallennetaan..." : "Tallenna"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={receiptView.handleCancelEdit}
                            disabled={receiptView.isSaving}
                            className="h-9 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4"
                        >
                            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">Peruuta</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity onPress={receiptView.handleEdit} className="h-9 items-center justify-center rounded-md bg-slate-950 dark:bg-slate-800 px-4">
                            <Text className="text-sm font-semibold text-white">Muokkaa kuittia</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={receiptView.handleDeleteReceipt} className="h-9 items-center justify-center rounded-md bg-red-600 dark:bg-red-700 px-4">
                            <Text className="text-sm font-semibold text-white">Poista kuitti</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    )
}