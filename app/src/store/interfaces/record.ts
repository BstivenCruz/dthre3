export interface ClassStyle {
  color: string;
  name?: string;
}

export interface AttendanceClass {
  id: string;
  name: string;
  style?: ClassStyle;
}

export interface Attendance {
  id: string;
  date: string;
  creditsUsed: number;
  entryMethod: string;
  class?: AttendanceClass;
}

export interface Payment {
  id: string;
  amount: string;
  method: string;
  receiptNumber: string;
  status: string;
  createdAt: string;
}

export interface PackageInfo {
  id: string;
  name: string;
  credits: number;
  isUnlimited: boolean;
}

export interface StudentPackage {
  id: string;
  creditsRemaining: number;
  isActive: boolean;
  validUntil: string;
  package?: PackageInfo;
}

export interface RecordData {
  attendances: Attendance[];
  payments: Payment[];
  packages: StudentPackage[];
}
