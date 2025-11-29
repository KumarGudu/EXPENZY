export enum InviteType {
  LOAN = 'loan',
  SPLIT = 'split',
  GROUP = 'group',
}

export enum InviteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  REJECTED = 'rejected',
}

export interface InviteDetails {
  type: InviteType;
  status: InviteStatus;
  invitedAt: Date;
  isExpired: boolean;
  entityId: string;
  entityDetails: LoanInviteDetails | SplitInviteDetails | GroupInviteDetails;
}

export interface LoanInviteDetails {
  loanId: string;
  amount: number;
  currency: string;
  description: string | null;
  role: 'lender' | 'borrower';
  createdBy: {
    id: string;
    username: string;
    email: string;
  };
}

export interface SplitInviteDetails {
  splitId: string;
  totalAmount: number;
  currency: string;
  description: string | null;
  amountOwed: number;
  createdBy: {
    id: string;
    username: string;
    email: string;
  };
}

export interface GroupInviteDetails {
  groupId: string;
  groupName: string;
  description: string | null;
  memberCount: number;
  role: 'admin' | 'member';
  createdBy: {
    id: string;
    username: string;
    email: string;
  };
}
