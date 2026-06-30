import { Button } from "@/components/ui/button"

interface Props {
    handleDelete: () => void;
};

export default function Buttons({handleDelete}: Props) {
    return (
        <div className="mt-6 flex flex-wrap gap-3">
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>Delete receipt</Button>
            <Button className="bg-teal-600 text-white hover:bg-teal-700">Download PDF</Button>
            <Button className="bg-teal-600 text-white hover:bg-teal-700">Edit receipt</Button>
        </div>
    )
};