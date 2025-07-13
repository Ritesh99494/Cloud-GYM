import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, CreditCard, MapPin, Star } from 'lucide-react';
import { Gym, TimeSlot } from '../../types';

interface BookingModalProps {
  gym: Gym | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingData: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  gym,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && gym && selectedDate) {
      loadAvailableSlots();
    }
  }, [isOpen, gym, selectedDate]);

  useEffect(() => {
    if (isOpen) {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    }
  }, [isOpen]);

  const loadAvailableSlots = async () => {
    if (!gym || !selectedDate) return;
    
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockSlots: TimeSlot[] = [
        {
          id: '1',
          gymId: gym.id,
          date: selectedDate,
          startTime: '06:00',
          endTime: '08:00',
          availableSpots: 15,
          totalSpots: 20,
          price: 25,
        },
        {
          id: '2',
          gymId: gym.id,
          date: selectedDate,
          startTime: '08:00',
          endTime: '10:00',
          availableSpots: 8,
          totalSpots: 20,
          price: 30,
        },
        {
          id: '3',
          gymId: gym.id,
          date: selectedDate,
          startTime: '10:00',
          endTime: '12:00',
          availableSpots: 12,
          totalSpots: 20,
          price: 35,
        },
        {
          id: '4',
          gymId: gym.id,
          date: selectedDate,
          startTime: '18:00',
          endTime: '20:00',
          availableSpots: 3,
          totalSpots: 20,
          price: 40,
        },
        {
          id: '5',
          gymId: gym.id,
          date: selectedDate,
          startTime: '20:00',
          endTime: '22:00',
          availableSpots: 18,
          totalSpots: 20,
          price: 30,
        },
      ];
      setAvailableSlots(mockSlots);
    } catch (error) {
      console.error('Failed to load available slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = () => {
    if (!gym || !selectedSlot) return;

    const bookingData = {
      gymId: gym.id,
      slotId: selectedSlot.id,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      price: selectedSlot.price,
    };

    onConfirm(bookingData);
  };

  const getNextSevenDays = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const getSlotAvailabilityColor = (availableSpots: number, totalSpots: number) => {
    const percentage = (availableSpots / totalSpots) * 100;
    if (percentage > 50) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage > 20) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (!isOpen || !gym) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book Workout Session</h2>
            <p className="text-gray-600">Reserve your spot at {gym.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Gym Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <img
              src={gym.images[0] || 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg'}
              alt={gym.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{gym.name}</h3>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{gym.address}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{gym.rating} ({gym.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Select Date
          </h4>
          <div className="grid grid-cols-7 gap-2">
            {getNextSevenDays().map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`p-3 text-center rounded-lg border transition-all ${
                  selectedDate === date
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="text-sm font-medium">{formatDate(date)}</div>
                <div className="text-xs opacity-75">
                  {new Date(date).toLocaleDateString('en-US', { day: 'numeric' })}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slot Selection */}
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Available Time Slots
          </h4>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading available slots...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  disabled={slot.availableSpots === 0}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedSlot?.id === slot.id
                      ? 'border-blue-600 bg-blue-50'
                      : slot.availableSpots === 0
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      ${slot.price}
                    </span>
                  </div>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getSlotAvailabilityColor(slot.availableSpots, slot.totalSpots)}`}>
                    <Users className="h-3 w-3" />
                    <span>
                      {slot.availableSpots === 0 ? 'Full' : `${slot.availableSpots} spots left`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Booking Summary & Actions */}
        {selectedSlot && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="mb-4">
              <h5 className="font-semibold text-gray-900 mb-2">Booking Summary</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">2 hours</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">${selectedSlot.price}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Confirm Booking</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};