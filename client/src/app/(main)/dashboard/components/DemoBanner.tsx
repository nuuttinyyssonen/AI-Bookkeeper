export default function DemoBanner() {
    return (
        <div className="flex items-center justify-between rounded-lg border border-teal-200 bg-teal-50 px-4 py-3">
            <p className="text-sm text-teal-800">
                Tämä on <span className="font-medium">demo-versio</span> AI Bookkeeper -sovelluksesta. Data nollautuu session päättyessä.
            </p>
        </div>
    );
}