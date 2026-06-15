interface Props {
    handleDeductibleToggle: () => void,
    isDeductible: boolean
};

export default function Deductible({handleDeductibleToggle, isDeductible}: Props) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-sm font-medium text-slate-700">Vähennyskelpoinen</span>
            <button
                onClick={handleDeductibleToggle}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    isDeductible
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
            >
            {isDeductible ? "Kyllä" : "Ei"}
            </button>
        </div>
    );
};