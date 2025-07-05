
interface ProfileInfoProps {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
    role: 'client' | 'professional';
}

export default function ProfileInfo({ name, email, phone, notes, role }: ProfileInfoProps) {
    return (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="font-bold text-lg mb-1">{name}</div>
            <div className="text-gray-600 mb-1">{email}</div>
            {phone && <div className="text-gray-600 mb-1">{phone}</div>}
            {notes && <div className="text-gray-500 text-sm mb-1">Notes: {notes}</div>}
            <div className="text-xs text-gray-400">Role: {role}</div>
        </div>
    );
}
