import React from 'react';
import { MessageCircle, X, Check } from 'lucide-react';

interface Class {
  id: number;
  name: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWhatsAppShare: () => void;
  data: any;
  getStudentName: (rollNumber: number) => string;
  classes: Class[];
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onWhatsAppShare,
  data,
  getStudentName,
  classes
}) => {
  if (!isOpen || !data) return null;

  const className = classes.find(c => c.id === data.class_id)?.name;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Check className="text-green-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Attendance Submitted!</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Summary</h3>
              <div className="text-sm space-y-1">
                <p><strong>Class:</strong> {className}</p>
                <p><strong>Date:</strong> {data.date}</p>
                <p><strong>Session:</strong> {data.session.toUpperCase()}</p>
                <p><strong>Absentees:</strong> {data.absentees.length} students</p>
              </div>
            </div>

            {data.absentees.length > 0 && (
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Absent Students</h4>
                <div className="text-sm space-y-1">
                  {data.absentees.map((roll: number) => (
                    <div key={roll}>
                      Roll {roll}: {getStudentName(roll)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={onWhatsAppShare}
              className="w-full p-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle size={20} />
              <span>Send to WhatsApp</span>
            </button>

            <button
              onClick={onClose}
              className="w-full p-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;