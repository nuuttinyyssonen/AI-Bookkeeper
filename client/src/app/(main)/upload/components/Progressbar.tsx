interface Props {
    progress: string
}

export default function Progressbar({progress}: Props) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />
            <p className="text-sm font-medium text-teal-700">{progress}</p>
        </div>
    );
};