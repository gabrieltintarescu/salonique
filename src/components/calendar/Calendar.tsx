
// Placeholder for a calendar component
export default function Calendar({ onSelectDate }: { onSelectDate?: (date: Date) => void }) {
    return (
        <div className="w-full bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">Calendar</div>
            {/* TODO: Integrate a calendar library or build custom calendar */}
            <div className="text-gray-400">[Calendar UI here]</div>
        </div>
    );
}
