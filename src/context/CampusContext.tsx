import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  ASSET_IMAGES,
  DEMO_STUDENT_USER,
  SEED_REQUESTS,
  SEED_RESOURCES,
} from '../data/seedData';
import {
  AvailabilityStatus,
  ResourceItem,
  ResourceRequest,
  StudentUser,
  ToastMessage,
} from '../types/campus';

const STORAGE_KEYS = {
  USER: 'campusswap_user_v1',
  RESOURCES: 'campusswap_resources_v1',
  REQUESTS: 'campusswap_requests_v1',
};

interface NewResourceInput {
  title: string;
  description: string;
  category: ResourceItem['category'];
  imageUrl: string;
  condition: ResourceItem['condition'];
  transactionType: ResourceItem['transactionType'];
  price?: number;
  borrowingDuration?: string;
  preferredExchangeItem?: string;
  department: string;
  semester: string;
}

interface RegisterInput {
  fullName: string;
  email: string;
  department: string;
  semester: string;
}

interface CampusContextValue {
  currentUser: StudentUser | null;
  resources: ResourceItem[];
  requests: ResourceRequest[];
  toasts: ToastMessage[];
  login: (email: string) => void;
  demoLogin: () => void;
  register: (input: RegisterInput) => void;
  logout: () => void;
  updateProfile: (updates: Partial<StudentUser>) => void;
  addResource: (input: NewResourceInput) => ResourceItem;
  updateResource: (id: string, updates: Partial<ResourceItem>) => void;
  deleteResource: (id: string) => void;
  setResourceStatus: (id: string, status: AvailabilityStatus) => void;
  sendRequest: (resource: ResourceItem, message: string, meetupSpot: string) => void;
  acceptRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  completeTransaction: (requestId: string) => void;
  cancelRequest: (requestId: string) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const CampusContext = createContext<CampusContextValue | undefined>(undefined);

function safeReadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() =>
    safeReadStorage<StudentUser | null>(STORAGE_KEYS.USER, null)
  );
  const [resources, setResources] = useState<ResourceItem[]>(() =>
    safeReadStorage<ResourceItem[]>(STORAGE_KEYS.RESOURCES, SEED_RESOURCES)
  );
  const [requests, setRequests] = useState<ResourceRequest[]>(() =>
    safeReadStorage<ResourceRequest[]>(STORAGE_KEYS.REQUESTS, SEED_REQUESTS)
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } catch {
      // Ignore storage quota errors
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
    } catch {
      // Ignore storage quota errors
    }
  }, [resources]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    } catch {
      // Ignore storage quota errors
    }
  }, [requests]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const demoLogin = useCallback(() => {
    setCurrentUser(DEMO_STUDENT_USER);
    addToast({
      type: 'success',
      title: 'Signed in as Maya Patel',
      description: 'Welcome back to CampusSwap.',
    });
  }, [addToast]);

  const login = useCallback(
    (email: string) => {
      const normalized = email.trim().toLowerCase();
      if (normalized === DEMO_STUDENT_USER.email.toLowerCase()) {
        setCurrentUser(DEMO_STUDENT_USER);
        addToast({
          type: 'success',
          title: `Welcome back, ${DEMO_STUDENT_USER.fullName}`,
        });
        return;
      }

      const namePart = normalized.split('@')[0]?.replace(/[._-]/g, ' ') || 'Campus Student';
      const formattedName = namePart
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const user: StudentUser = {
        id: `stu-${normalized.replace(/[^a-z0-9]/g, '-')}`,
        fullName: formattedName || 'Campus Student',
        email: normalized,
        department: 'Computer Science',
        semester: 'Semester 5',
        avatarUrl: ASSET_IMAGES.avatar,
        bio: 'Verified campus member sharing textbooks and study gear.',
        completedExchanges: 2,
        joinedAt: new Date().toISOString(),
      };
      setCurrentUser(user);
      addToast({
        type: 'success',
        title: `Welcome back, ${user.fullName}`,
      });
    },
    [addToast]
  );

  const register = useCallback(
    (input: RegisterInput) => {
      const newUser: StudentUser = {
        id: `stu-${Date.now()}`,
        fullName: input.fullName.trim(),
        email: input.email.trim().toLowerCase(),
        department: input.department,
        semester: input.semester,
        avatarUrl: ASSET_IMAGES.avatar,
        bio: `${input.department} student (${input.semester}) on CampusSwap.`,
        completedExchanges: 0,
        joinedAt: new Date().toISOString(),
      };
      setCurrentUser(newUser);
      addToast({
        type: 'success',
        title: 'Account created',
        description: `Welcome to CampusSwap, ${newUser.fullName}.`,
      });
    },
    [addToast]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    addToast({
      type: 'info',
      title: 'Signed out',
      description: 'You can sign back in anytime.',
    });
  }, [addToast]);

  const updateProfile = useCallback(
    (updates: Partial<StudentUser>) => {
      setCurrentUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ...updates };
        setResources((resList) =>
          resList.map((r) =>
            r.ownerId === prev.id
              ? {
                  ...r,
                  ownerName: updated.fullName,
                  ownerDepartment: updated.department,
                  ownerSemester: updated.semester,
                  ownerAvatarUrl: updated.avatarUrl,
                }
              : r
          )
        );
        return updated;
      });
      addToast({
        type: 'success',
        title: 'Profile updated',
        description: 'Your student profile details have been saved.',
      });
    },
    [addToast]
  );

  const addResource = useCallback(
    (input: NewResourceInput): ResourceItem => {
      const owner = currentUser || DEMO_STUDENT_USER;
      const newItem: ResourceItem = {
        id: `res-${Date.now()}`,
        title: input.title.trim(),
        description: input.description.trim(),
        category: input.category,
        imageUrl: input.imageUrl || ASSET_IMAGES.textbook,
        condition: input.condition,
        transactionType: input.transactionType,
        price: input.transactionType === 'Sell' ? input.price : undefined,
        borrowingDuration:
          input.transactionType === 'Borrow' ? input.borrowingDuration : undefined,
        preferredExchangeItem:
          input.transactionType === 'Exchange' ? input.preferredExchangeItem : undefined,
        availability: 'Available',
        department: input.department,
        semester: input.semester,
        ownerId: owner.id,
        ownerName: owner.fullName,
        ownerDepartment: owner.department,
        ownerSemester: owner.semester,
        ownerAvatarUrl: owner.avatarUrl,
        ownerCompletedExchanges: owner.completedExchanges,
        createdAt: new Date().toISOString(),
      };

      setResources((prev) => [newItem, ...prev]);
      addToast({
        type: 'success',
        title: 'Resource published',
        description: `"${newItem.title}" is now visible in the campus marketplace.`,
      });
      return newItem;
    },
    [currentUser, addToast]
  );

  const updateResource = useCallback(
    (id: string, updates: Partial<ResourceItem>) => {
      setResources((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      addToast({
        type: 'success',
        title: 'Listing updated',
      });
    },
    [addToast]
  );

  const deleteResource = useCallback(
    (id: string) => {
      setResources((prev) => prev.filter((item) => item.id !== id));
      setRequests((prev) => prev.filter((req) => req.resourceId !== id));
      addToast({
        type: 'info',
        title: 'Listing deleted',
        description: 'The resource was removed from your listings.',
      });
    },
    [addToast]
  );

  const setResourceStatus = useCallback(
    (id: string, status: AvailabilityStatus) => {
      setResources((prev) =>
        prev.map((item) => (item.id === id ? { ...item, availability: status } : item))
      );
      addToast({
        type: 'success',
        title: `Status updated to ${status}`,
      });
    },
    [addToast]
  );

  const sendRequest = useCallback(
    (resource: ResourceItem, message: string, meetupSpot: string) => {
      const requester = currentUser || DEMO_STUDENT_USER;
      const newReq: ResourceRequest = {
        id: `req-${Date.now()}`,
        resourceId: resource.id,
        resourceTitle: resource.title,
        resourceImageUrl: resource.imageUrl,
        resourceCategory: resource.category,
        transactionType: resource.transactionType,
        price: resource.price,
        borrowingDuration: resource.borrowingDuration,
        preferredExchangeItem: resource.preferredExchangeItem,
        ownerId: resource.ownerId,
        ownerName: resource.ownerName,
        ownerEmail: `${resource.ownerName.toLowerCase().replace(/\s+/g, '.')}@northbridge.edu`,
        ownerDepartment: resource.ownerDepartment,
        requesterId: requester.id,
        requesterName: requester.fullName,
        requesterEmail: requester.email,
        requesterDepartment: requester.department,
        requesterSemester: requester.semester,
        status: 'Pending',
        message: message.trim(),
        meetupSpot: meetupSpot.trim() || 'Main Library Atrium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setRequests((prev) => [newReq, ...prev]);
      addToast({
        type: 'success',
        title: 'Request sent',
        description: `${resource.ownerName} will review your request shortly.`,
      });
    },
    [currentUser, addToast]
  );

  const acceptRequest = useCallback(
    (requestId: string) => {
      let targetResourceId: string | null = null;
      let targetTxType: ResourceItem['transactionType'] | null = null;

      setRequests((prev) =>
        prev.map((req) => {
          if (req.id === requestId) {
            targetResourceId = req.resourceId;
            targetTxType = req.transactionType;
            return { ...req, status: 'Accepted', updatedAt: new Date().toISOString() };
          }
          return req;
        })
      );

      if (targetResourceId) {
        const nextAvailability: AvailabilityStatus =
          targetTxType === 'Borrow' ? 'Borrowed' : 'Reserved';
        setResources((prev) =>
          prev.map((item) =>
            item.id === targetResourceId ? { ...item, availability: nextAvailability } : item
          )
        );
      }

      addToast({
        type: 'success',
        title: 'Request accepted',
        description: 'Campus meetup details are now active for coordination.',
      });
    },
    [addToast]
  );

  const rejectRequest = useCallback(
    (requestId: string) => {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? { ...req, status: 'Rejected', updatedAt: new Date().toISOString() }
            : req
        )
      );
      addToast({
        type: 'info',
        title: 'Request declined',
      });
    },
    [addToast]
  );

  const completeTransaction = useCallback(
    (requestId: string) => {
      let targetResourceId: string | null = null;
      setRequests((prev) =>
        prev.map((req) => {
          if (req.id === requestId) {
            targetResourceId = req.resourceId;
            return { ...req, status: 'Completed', updatedAt: new Date().toISOString() };
          }
          return req;
        })
      );

      if (targetResourceId) {
        setResources((prev) =>
          prev.map((item) =>
            item.id === targetResourceId ? { ...item, availability: 'Completed' } : item
          )
        );
      }

      setCurrentUser((prev) =>
        prev ? { ...prev, completedExchanges: prev.completedExchanges + 1 } : prev
      );

      addToast({
        type: 'success',
        title: 'Transaction marked completed',
        description: 'Recorded in your completed campus exchanges.',
      });
    },
    [addToast]
  );

  const cancelRequest = useCallback(
    (requestId: string) => {
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      addToast({
        type: 'info',
        title: 'Request withdrawn',
      });
    },
    [addToast]
  );

  return (
    <CampusContext.Provider
      value={{
        currentUser,
        resources,
        requests,
        toasts,
        login,
        demoLogin,
        register,
        logout,
        updateProfile,
        addResource,
        updateResource,
        deleteResource,
        setResourceStatus,
        sendRequest,
        acceptRequest,
        rejectRequest,
        completeTransaction,
        cancelRequest,
        addToast,
        dismissToast,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export function useCampus() {
  const ctx = useContext(CampusContext);
  if (!ctx) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return ctx;
}
