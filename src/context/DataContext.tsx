import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Room,
  Enquiry,
  GalleryItem,
  SiteSettings,
  EnquiryStatus,
  Booking,
  BlockedSlot,
  BookingStatus,
  HourlySlotInfo
} from '../types';
import {
  initialRooms,
  initialEnquiries,
  initialGallery,
  initialSettings,
  initialBookings,
  initialBlockedSlots,
  OPERATIONAL_HOURLY_SLOTS
} from '../lib/initialData';

interface DataContextType {
  rooms: Room[];
  enquiries: Enquiry[];
  gallery: GalleryItem[];
  settings: SiteSettings;
  bookings: Booking[];
  blockedSlots: BlockedSlot[];

  // Booking Methods
  bookSlot: (bookingData: {
    customerName: string;
    phone: string;
    email: string;
    bookingDate: string;
    timeSlot: string;
    bookingType: Booking['bookingType'];
    guests: number;
    specialRequests?: string;
  }) => Promise<Booking>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<boolean>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  deleteBooking: (bookingId: string) => void;
  blockSlot: (date: string, timeSlot: string, reason: string) => void;
  unblockSlot: (id: string) => void;
  getHourlySlotsForDate: (date: string) => HourlySlotInfo[];
  findBookingByIdOrPhone: (query: string) => Booking[];

  // Enquiry actions
  addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Enquiry>;
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => void;
  updateEnquiryNotes: (id: string, notes: string) => void;
  deleteEnquiry: (id: string) => void;

  // Room actions
  addRoom: (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  togglePublishRoom: (id: string) => void;

  // Gallery actions
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'createdAt'>) => void;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  togglePublishGallery: (id: string) => void;

  // Settings actions
  updateSettings: (newSettings: Partial<SiteSettings>) => void;

  // Reset
  resetToDefaultData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const stored = localStorage.getItem('havenora_rooms');
      return stored ? JSON.parse(stored) : initialRooms;
    } catch {
      return initialRooms;
    }
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const stored = localStorage.getItem('havenora_enquiries');
      return stored ? JSON.parse(stored) : initialEnquiries;
    } catch {
      return initialEnquiries;
    }
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const stored = localStorage.getItem('havenora_gallery');
      return stored ? JSON.parse(stored) : initialGallery;
    } catch {
      return initialGallery;
    }
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const stored = localStorage.getItem('havenora_settings');
      return stored ? JSON.parse(stored) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem('havenora_bookings');
      return stored ? JSON.parse(stored) : initialBookings;
    } catch {
      return initialBookings;
    }
  });

  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>(() => {
    try {
      const stored = localStorage.getItem('havenora_blocked_slots');
      return stored ? JSON.parse(stored) : initialBlockedSlots;
    } catch {
      return initialBlockedSlots;
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('havenora_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('havenora_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('havenora_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('havenora_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('havenora_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('havenora_blocked_slots', JSON.stringify(blockedSlots));
  }, [blockedSlots]);

  // Real-time synchronization across browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'havenora_bookings' && e.newValue) {
        setBookings(JSON.parse(e.newValue));
      }
      if (e.key === 'havenora_blocked_slots' && e.newValue) {
        setBlockedSlots(JSON.parse(e.newValue));
      }
      if (e.key === 'havenora_settings' && e.newValue) {
        setSettings(JSON.parse(e.newValue));
      }
      if (e.key === 'havenora_rooms' && e.newValue) {
        setRooms(JSON.parse(e.newValue));
      }
      if (e.key === 'havenora_enquiries' && e.newValue) {
        setEnquiries(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // BOOKING METHODS

  /**
   * Check if a specific slot on a given date is available.
   * Returns hourly slot breakdown.
   */
  const getHourlySlotsForDate = useCallback(
    (date: string): HourlySlotInfo[] => {
      return OPERATIONAL_HOURLY_SLOTS.map((timeSlot) => {
        const [startTime, endTime] = timeSlot.split(' - ');

        // Check if manually blocked by owner
        const blocked = blockedSlots.find(
          (b) => b.date === date && (b.timeSlot === timeSlot || b.timeSlot === 'ALL_DAY')
        );
        if (blocked) {
          return {
            timeSlot,
            startTime,
            endTime,
            status: 'blocked',
            blockedSlot: blocked
          };
        }

        // Check if booked by customer (status Pending or Confirmed)
        const activeBooking = bookings.find(
          (b) =>
            b.bookingDate === date &&
            b.timeSlot === timeSlot &&
            (b.status === 'Pending' || b.status === 'Confirmed')
        );

        if (activeBooking) {
          return {
            timeSlot,
            startTime,
            endTime,
            status: 'booked',
            booking: activeBooking
          };
        }

        return {
          timeSlot,
          startTime,
          endTime,
          status: 'available'
        };
      });
    },
    [bookings, blockedSlots]
  );

  /**
   * Atomically book an hourly slot.
   * Validates slot availability to prevent double-booking.
   */
  const bookSlot = async (bookingData: {
    customerName: string;
    phone: string;
    email: string;
    bookingDate: string;
    timeSlot: string;
    bookingType: Booking['bookingType'];
    guests: number;
    specialRequests?: string;
  }): Promise<Booking> => {
    // Re-read latest storage snapshot to ensure no simultaneous booking collision
    let currentBookings: Booking[] = [];
    try {
      const stored = localStorage.getItem('havenora_bookings');
      currentBookings = stored ? JSON.parse(stored) : bookings;
    } catch {
      currentBookings = bookings;
    }

    let currentBlocked: BlockedSlot[] = [];
    try {
      const storedBlocked = localStorage.getItem('havenora_blocked_slots');
      currentBlocked = storedBlocked ? JSON.parse(storedBlocked) : blockedSlots;
    } catch {
      currentBlocked = blockedSlots;
    }

    // 1. Check if blocked
    const isBlocked = currentBlocked.some(
      (b) =>
        b.date === bookingData.bookingDate &&
        (b.timeSlot === bookingData.timeSlot || b.timeSlot === 'ALL_DAY')
    );
    if (isBlocked) {
      throw new Error('This time slot is blocked and unavailable for reservation.');
    }

    // 2. Check if already booked with active status
    const existingConflict = currentBookings.some(
      (b) =>
        b.bookingDate === bookingData.bookingDate &&
        b.timeSlot === bookingData.timeSlot &&
        (b.status === 'Pending' || b.status === 'Confirmed')
    );

    if (existingConflict) {
      throw new Error(
        'This hourly slot was just reserved by another customer. Please select another available time.'
      );
    }

    // Generate unique reference ID
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const newBooking: Booking = {
      ...bookingData,
      id: `HV-${randomCode}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newBooking, ...currentBookings];
    setBookings(updated);
    localStorage.setItem('havenora_bookings', JSON.stringify(updated));

    return newBooking;
  };

  /**
   * Cancel an existing booking and release the slot back into availability.
   */
  const cancelBooking = async (bookingId: string, reason?: string): Promise<boolean> => {
    let found = false;
    setBookings((prev) => {
      const updated = prev.map((b) => {
        if (b.id === bookingId) {
          found = true;
          return {
            ...b,
            status: 'Cancelled' as BookingStatus,
            cancelledAt: new Date().toISOString(),
            cancellationReason: reason || 'Cancelled by customer',
            updatedAt: new Date().toISOString()
          };
        }
        return b;
      });
      localStorage.setItem('havenora_bookings', JSON.stringify(updated));
      return updated;
    });

    return found;
  };

  /**
   * Update booking status from owner portal.
   */
  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) => {
      const updated = prev.map((b) => {
        if (b.id === bookingId) {
          const isConfirm = status === 'Confirmed';
          const isCancel = status === 'Cancelled';
          return {
            ...b,
            status,
            confirmedAt: isConfirm ? new Date().toISOString() : b.confirmedAt,
            cancelledAt: isCancel ? new Date().toISOString() : b.cancelledAt,
            updatedAt: new Date().toISOString()
          };
        }
        return b;
      });
      localStorage.setItem('havenora_bookings', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteBooking = (bookingId: string) => {
    setBookings((prev) => {
      const updated = prev.filter((b) => b.id !== bookingId);
      localStorage.setItem('havenora_bookings', JSON.stringify(updated));
      return updated;
    });
  };

  /**
   * Owner manually blocks a specific slot.
   */
  const blockSlot = (date: string, timeSlot: string, reason: string) => {
    const newBlock: BlockedSlot = {
      id: `block-${Date.now().toString(36)}`,
      date,
      timeSlot,
      reason: reason || 'Owner Blocked',
      createdAt: new Date().toISOString()
    };
    setBlockedSlots((prev) => {
      const updated = [...prev, newBlock];
      localStorage.setItem('havenora_blocked_slots', JSON.stringify(updated));
      return updated;
    });
  };

  /**
   * Owner reopens a blocked slot.
   */
  const unblockSlot = (id: string) => {
    setBlockedSlots((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      localStorage.setItem('havenora_blocked_slots', JSON.stringify(updated));
      return updated;
    });
  };

  /**
   * Look up booking by ID or Phone number for customer cancellation/status check.
   */
  const findBookingByIdOrPhone = (query: string): Booking[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return bookings.filter(
      (b) =>
        b.id.toLowerCase() === q ||
        b.phone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, '')) ||
        b.email.toLowerCase() === q
    );
  };

  // ENQUIRY METHODS
  const addEnquiry = async (
    data: Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<Enquiry> => {
    const newEnquiry: Enquiry = {
      ...data,
      id: `enq-${Date.now().toString(36)}`,
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    return newEnquiry;
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  const updateEnquiryNotes = (id: string, notes: string) => {
    setEnquiries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, internalNotes: notes, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries((prev) => prev.filter((item) => item.id !== id));
  };

  // ROOM METHODS
  const addRoom = (roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRooms((prev) => [...prev, newRoom]);
  };

  const updateRoom = (id: string, updatedFields: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === id ? { ...room, ...updatedFields, updatedAt: new Date().toISOString() } : room
      )
    );
  };

  const deleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((room) => room.id !== id));
  };

  const togglePublishRoom = (id: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === id ? { ...room, published: !room.published, updatedAt: new Date().toISOString() } : room
      )
    );
  };

  // GALLERY METHODS
  const addGalleryItem = (itemData: Omit<GalleryItem, 'id' | 'createdAt'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };
    setGallery((prev) => [...prev, newItem]);
  };

  const updateGalleryItem = (id: string, updatedFields: Partial<GalleryItem>) => {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
  };

  const togglePublishGallery = (id: string) => {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, published: !item.published } : item))
    );
  };

  // SETTINGS METHODS
  const updateSettings = (newFields: Partial<SiteSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newFields,
      updatedAt: new Date().toISOString()
    }));
  };

  const resetToDefaultData = () => {
    setRooms(initialRooms);
    setEnquiries(initialEnquiries);
    setGallery(initialGallery);
    setSettings(initialSettings);
    setBookings(initialBookings);
    setBlockedSlots(initialBlockedSlots);
    localStorage.removeItem('havenora_rooms');
    localStorage.removeItem('havenora_enquiries');
    localStorage.removeItem('havenora_gallery');
    localStorage.removeItem('havenora_settings');
    localStorage.removeItem('havenora_bookings');
    localStorage.removeItem('havenora_blocked_slots');
  };

  return (
    <DataContext.Provider
      value={{
        rooms,
        enquiries,
        gallery,
        settings,
        bookings,
        blockedSlots,
        bookSlot,
        cancelBooking,
        updateBookingStatus,
        deleteBooking,
        blockSlot,
        unblockSlot,
        getHourlySlotsForDate,
        findBookingByIdOrPhone,
        addEnquiry,
        updateEnquiryStatus,
        updateEnquiryNotes,
        deleteEnquiry,
        addRoom,
        updateRoom,
        deleteRoom,
        togglePublishRoom,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        togglePublishGallery,
        updateSettings,
        resetToDefaultData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
