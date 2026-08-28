export type UserRole = "INSTITUTE" | "STUDENT" | "EMPLOYER" | "ADMIN";

export type CredentialStatus = "ACTIVE" | "SUPERSEDED" | "REVOKED";

export type EventType = "ISSUE" | "MODIFY" | "REVOKE";

export type DiscrepancyStatus = "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";

export interface Institution {
  institution_id: string;
  name: string;
  code: string;
  official_email: string;
  domain?: string;
  address?: string;
  contact_number?: string;
  public_key: string;
  created_at: string;
  verified?: boolean;
}

export interface User {
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  institution_id?: string | null;
  student_id?: string | null;
  is_email_verified?: boolean;
  firebase_uid?: string | null;
  created_at?: string;
}

export interface EmailVerificationState {
  email: string;
  isVerified: boolean;
  verificationSentAt?: string;
  userRole?: UserRole;
  displayName?: string;
}

export interface Student {
  student_id: string;
  user_id: string;
  name: string;
  email: string;
  roll_number: string;
  department: string;
  enrollment_year: number;
}

export interface AcademicRecordData {
  student_name: string;
  student_id_roll: string;
  degree: string;
  department_branch: string;
  cgpa: number | string;
  graduation_year: number;
  enrollment_year: number;
  institution_id: string;
  institution_name: string;
  classification?: string;
  major_specialization?: string;
  honors?: string;
  issue_date?: string;
  additional_notes?: string;
  modification_reason?: string;
}

export interface CredentialVersion {
  version_id: string;
  credential_id: string;
  version_number: number;
  student_name: string;
  roll_number: string;
  degree: string;
  department: string;
  cgpa: number;
  graduation_year: number;
  enrollment_year: number;
  issuer_id: string;
  issuer_name: string;
  credential_data: AcademicRecordData;
  credential_hash: string;
  digital_signature: string;
  status: CredentialStatus;
  modification_reason?: string;
  created_at: string;
}

export interface Block {
  block_id: number;
  timestamp: string;
  credential_id: string;
  event_type: EventType;
  version: number;
  credential_hash: string;
  previous_hash: string;
  block_hash: string;
  digital_signature: string;
  signer_public_key?: string;
}

export interface Credential {
  credential_id: string;
  student_id: string;
  institution_id: string;
  institution_name: string;
  current_version: number;
  status: CredentialStatus;
  latest_version: CredentialVersion;
  history?: CredentialVersion[];
  qr_code_url?: string;
  revocation_reason?: string;
  revoked_at?: string;
  created_at: string;
  updated_at: string;
}

export interface VerificationCheck {
  id: string;
  name: string;
  description: string;
  status: "PASSED" | "FAILED" | "WARNING";
  details: string;
  expected?: string;
  actual?: string;
}

export interface VerificationResult {
  is_valid: boolean;
  status: CredentialStatus | "NOT_FOUND" | "TAMPERED";
  credential_id: string;
  credential?: CredentialVersion;
  institution?: {
    name: string;
    institution_id: string;
    public_key: string;
    verified: boolean;
  };
  hash_check: boolean;
  signature_check: boolean;
  chain_check: boolean;
  status_check: boolean;
  checks: VerificationCheck[];
  latest_block?: Block;
  all_blocks?: Block[];
  timestamp: string;
  verification_id: string;
  computed_hash?: string;
  stored_hash?: string;
}

export interface DiscrepancyReport {
  report_id: string;
  credential_id: string;
  reported_by: string;
  reporter_role: string;
  reason: string;
  description: string;
  status: DiscrepancyStatus;
  created_at: string;
  resolved_at?: string;
  resolution_notes?: string;
}

export interface IssuanceRequest {
  student_name: string;
  student_id_roll: string;
  degree: string;
  department_branch: string;
  cgpa: number;
  graduation_year: number;
  enrollment_year: number;
  major_specialization?: string;
  classification?: string;
  additional_notes?: string;
  institution_id?: string;
}

export interface ModificationRequest {
  credential_id: string;
  student_name: string;
  student_id_roll: string;
  degree: string;
  department_branch: string;
  cgpa: number;
  graduation_year: number;
  enrollment_year: number;
  major_specialization?: string;
  classification?: string;
  modification_reason: string;
}

export interface RevocationRequest {
  credential_id: string;
  reason: string;
}
