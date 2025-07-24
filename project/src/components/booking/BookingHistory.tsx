import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, QrCode, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';

interface Booking {
  id: string;
  gym: {
    name: string;
    address: string;
    images: string[];
  };
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  bookingDate: string;
  status: string;
  qrCode: string;
  price: number;
  createdAt: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
  try {
    setLoading(true);
    const response = await apiService.getUserBookings();
    setBookings(response as Booking[]); // <-- Cast to Booking[]
  } catch (err) {
    setError('Failed to load booking history');
    console.error('Error fetching bookings:', err);
  } finally {
    setLoading(false);
  }
};

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending_payment':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status.toLowerCase() === filter;
  });

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await apiService.getUserBookings();
      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading booking history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchBookings}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking History</h1>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { key: 'all', label: 'All Bookings' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' },
            { key: 'pending_payment', label: 'Pending Payment' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "You haven't made any bookings yet." 
              : `No ${filter} bookings found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={booking.gym.images[0] || 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg'}
                      alt={booking.gym.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {booking.gym.name}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{booking.gym.address}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(booking.bookingDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status.replace('_', ' ')}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 mt-2">
                      ${booking.price}
                    </div>
                  </div>
                </div>

                {/* QR Code and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    {booking.status.toLowerCase() === 'confirmed' && (
                      <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                        <QrCode className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          QR: {booking.qrCode.substring(0, 8)}...
                        </span>
                      </div>
                    )}
                    
                    {booking.checkInTime && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Check-in:</span> {formatDate(booking.checkInTime)}
                      </div>
                    )}
                    
                    {booking.checkOutTime && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Check-out:</span> {formatDate(booking.checkOutTime)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    {booking.status.toLowerCase() === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Cancel Booking
                      </button>
                    )}
                    
                    {booking.status.toLowerCase() === 'pending_payment' && (
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Complete Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};