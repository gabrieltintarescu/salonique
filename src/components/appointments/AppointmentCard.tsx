
interface AppointmentCardProps {
    clientName: string;
    startTime: string;
    endTime: string;
    status: string;
    onClick?: () => void;
}

export default function AppointmentCard({ clientName, startTime, endTime, status, onClick }: AppointmentCardProps) {
    return (
        <div className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer mb-4 bg-white" onClick={onClick}>
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{clientName}</span>
                <span className={`text-xs px-2 py-1 rounded ${status === 'confirmed' ? 'bg-green-100 text-green-700' : status === 'requested' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'}`}>{status}</span>
            </div>
            <div className="text-sm text-gray-500">{startTime} - {endTime}</div>
        </div>
    );
}
