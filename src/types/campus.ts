export type ResourceCategory =
  | 'Textbooks'
  | 'Reference Books'
  | 'Lab Equipment'
  | 'Calculators'
  | 'Record Books'
  | 'Stationery'
  | 'Other Academic Materials';

export type ResourceCondition = 'New' | 'Good' | 'Used';

export type TransactionType = 'Sell' | 'Borrow' | 'Exchange' | 'Donate';

export type AvailabilityStatus = 'Available' | 'Reserved' | 'Borrowed' | 'Completed';

export type RequestStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Completed';

export interface StudentUser {
  id: string;
  fullName: string;
  email: string;
  department: string;
  semester: string;
  avatarUrl: string;
  bio?: string;
  completedExchanges: number;
  joinedAt: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  imageUrl: string;
  condition: ResourceCondition;
  transactionType: TransactionType;
  price?: number;
  borrowingDuration?: string;
  preferredExchangeItem?: string;
  availability: AvailabilityStatus;
  department: string;
  semester: string;
  ownerId: string;
  ownerName: string;
  ownerDepartment: string;
  ownerSemester: string;
  ownerAvatarUrl: string;
  ownerCompletedExchanges: number;
  createdAt: string;
}

export interface ResourceRequest {
  id: string;
  resourceId: string;
  resourceTitle: string;
  resourceImageUrl: string;
  resourceCategory: ResourceCategory;
  transactionType: TransactionType;
  price?: number;
  borrowingDuration?: string;
  preferredExchangeItem?: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerDepartment: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterDepartment: string;
  requesterSemester: string;
  status: RequestStatus;
  message: string;
  meetupSpot: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  description?: string;
}
