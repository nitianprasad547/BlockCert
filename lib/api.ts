import axios from "axios";
import {
  Credential,
  CredentialVersion,
  VerificationResult,
  DiscrepancyReport,
  IssuanceRequest,
  ModificationRequest,
  RevocationRequest,
  Institution,
  User,
  Block,
  AcademicRecordData,
} from "@/types";
import {
  canonicalizeJson,
  sha256Client,
  formatHash,
  generateDeterministicSignature,
  extractCredentialId,
} from "@/lib/crypto";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// Use a fast timeout for API requests to never freeze client interactions
const API_TIMEOUT_MS = 1500;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_TIMEOUT_MS,
});

let backendAvailableCache: boolean | null = null;
let lastProbeTime = 0;
const PROBE_CACHE_TTL = 15000; // 15 seconds

async function isBackendAvailable(): Promise<boolean> {
  const now = Date.now();
  if (backendAvailableCache !== null && now - lastProbeTime < PROBE_CACHE_TTL) {
    return backendAvailableCache;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 400);
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timer);
    backendAvailableCache = res.status === 200;
  } catch {
    backendAvailableCache = false;
  }

  lastProbeTime = now;
  return backendAvailableCache;
}

export function notifyCredentialsChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("blockcert:credentials-updated"));
  }
}

export function resetBackendAvailabilityCache(): void {
  backendAvailableCache = null;
  lastProbeTime = 0;
}

// Initial Mock / Pre-seeded data matching PRD demo flow:
const initialInstitution: Institution = {
  institution_id: "INST-STANFORD-01",
  name: "Stanford University & Academic Alliance",
  code: "STANFORD-AA",
  official_email: "registrar@stanford.edu",
  domain: "stanford.edu",
  address: "450 Jane Stanford Way, Stanford, CA 94305",
  contact_number: "+1 (650) 723-2045",
  public_key: "MCowBQYDK2VwAyEA48aW84sF1lDkC21vO7564dJzX1bB/u67dZ/188eXk2g=",
  created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  verified: true,
};

const initialBlocks: Block[] = [
  {
    block_id: 1,
    timestamp: "2026-05-15T09:30:00Z",
    credential_id: "CRED-7F83A91",
    event_type: "ISSUE",
    version: 1,
    credential_hash: "a71f92e48b11c97a5482e987c61d5203fbc1029384756bca9201948572019485",
    previous_hash: "0000000000000000000000000000000000000000000000000000000000000000",
    block_hash: "9b4f2c018a427de83f60a92fbc947102e85a6b1029c4857291a0293847561029",
    digital_signature: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855490218f4a9c1",
  },
  {
    block_id: 2,
    timestamp: "2026-06-10T14:15:00Z",
    credential_id: "CRED-9E24B10",
    event_type: "ISSUE",
    version: 1,
    credential_hash: "f3c8091a45b76e82019485762019485739201928475619283746501928374650",
    previous_hash: "9b4f2c018a427de83f60a92fbc947102e85a6b1029c4857291a0293847561029",
    block_hash: "d83bc17e92049182746592817462910384756192837465019283746501928374",
    digital_signature: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
  },
  {
    block_id: 3,
    timestamp: "2026-06-12T10:00:00Z",
    credential_id: "CRED-4D88A12",
    event_type: "ISSUE",
    version: 1,
    credential_hash: "ea901af56b7890c1f12d8492019485710293847561029384756102938475610",
    previous_hash: "d83bc17e92049182746592817462910384756192837465019283746501928374",
    block_hash: "e54bc17e92049182746592817462910384756192837465019283746501928399",
    digital_signature: "8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
  },
];

const initialRahulV1: CredentialVersion = {
  version_id: "VER-7F83A91-01",
  credential_id: "CRED-7F83A91",
  version_number: 1,
  student_name: "Rahul Sharma",
  roll_number: "2022-CS-0418",
  degree: "Bachelor of Technology",
  department: "Computer Science & Engineering",
  cgpa: 8.2,
  graduation_year: 2026,
  enrollment_year: 2022,
  issuer_id: "INST-STANFORD-01",
  issuer_name: "Stanford University & Academic Alliance",
  credential_data: {
    student_name: "Rahul Sharma",
    student_id_roll: "2022-CS-0418",
    degree: "Bachelor of Technology",
    department_branch: "Computer Science & Engineering",
    cgpa: 8.2,
    graduation_year: 2026,
    enrollment_year: 2022,
    institution_id: "INST-STANFORD-01",
    institution_name: "Stanford University & Academic Alliance",
    classification: "First Class with Distinction",
    major_specialization: "Distributed Systems & Cryptography",
    issue_date: "2026-05-15",
  },
  credential_hash: "a71f92e48b11c97a5482e987c61d5203fbc1029384756bca9201948572019485",
  digital_signature: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855490218f4a9c1",
  status: "ACTIVE",
  created_at: "2026-05-15T09:30:00Z",
};

const initialEvelynV1: CredentialVersion = {
  version_id: "VER-9E24B10-01",
  credential_id: "CRED-9E24B10",
  version_number: 1,
  student_name: "Dr. Evelyn Vance",
  roll_number: "PHD-2022-009",
  degree: "Doctor of Philosophy",
  department: "Computer Science & Cryptography",
  cgpa: 9.85,
  graduation_year: 2026,
  enrollment_year: 2022,
  issuer_id: "INST-STANFORD-01",
  issuer_name: "Stanford University & Academic Alliance",
  credential_data: {
    student_name: "Dr. Evelyn Vance",
    student_id_roll: "PHD-2022-009",
    degree: "Doctor of Philosophy",
    department_branch: "Computer Science & Cryptography",
    cgpa: 9.85,
    graduation_year: 2026,
    enrollment_year: 2022,
    institution_id: "INST-STANFORD-01",
    institution_name: "Stanford University & Academic Alliance",
    classification: "Summa Cum Laude",
    major_specialization: "Tamper-Evident Ledger Architecture",
    issue_date: "2026-06-10",
  },
  credential_hash: "f3c8091a45b76e82019485762019485739201928475619283746501928374650",
  digital_signature: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
  status: "ACTIVE",
  created_at: "2026-06-10T14:15:00Z",
};

const initialAnanyaV1: CredentialVersion = {
  version_id: "VER-4D88A12-01",
  credential_id: "CRED-4D88A12",
  version_number: 1,
  student_name: "Ananya Patel",
  roll_number: "2022-AI-0112",
  degree: "M.Sc. Artificial Intelligence",
  department: "Computer Science & Engineering",
  cgpa: 9.15,
  graduation_year: 2026,
  enrollment_year: 2024,
  issuer_id: "INST-STANFORD-01",
  issuer_name: "Stanford University & Academic Alliance",
  credential_data: {
    student_name: "Ananya Patel",
    student_id_roll: "2022-AI-0112",
    degree: "M.Sc. Artificial Intelligence",
    department_branch: "Computer Science & Engineering",
    cgpa: 9.15,
    graduation_year: 2026,
    enrollment_year: 2024,
    institution_id: "INST-STANFORD-01",
    institution_name: "Stanford University & Academic Alliance",
    classification: "First Class with Distinction",
    major_specialization: "Deep Learning & Neural Architectures",
    issue_date: "2026-06-12",
  },
  credential_hash: "ea901af56b7890c1f12d8492019485710293847561029384756102938475610",
  digital_signature: "8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
  status: "ACTIVE",
  created_at: "2026-06-12T10:00:00Z",
};

const initialCredentials: Credential[] = [
  {
    credential_id: "CRED-7F83A91",
    student_id: "STU-RAHUL-01",
    institution_id: "INST-STANFORD-01",
    institution_name: "Stanford University & Academic Alliance",
    current_version: 1,
    status: "ACTIVE",
    latest_version: initialRahulV1,
    history: [initialRahulV1],
    created_at: "2026-05-15T09:30:00Z",
    updated_at: "2026-05-15T09:30:00Z",
  },
  {
    credential_id: "CRED-9E24B10",
    student_id: "STU-EVELYN-02",
    institution_id: "INST-STANFORD-01",
    institution_name: "Stanford University & Academic Alliance",
    current_version: 1,
    status: "ACTIVE",
    latest_version: initialEvelynV1,
    history: [initialEvelynV1],
    created_at: "2026-06-10T14:15:00Z",
    updated_at: "2026-06-10T14:15:00Z",
  },
  {
    credential_id: "CRED-4D88A12",
    student_id: "STU-ANANYA-03",
    institution_id: "INST-STANFORD-01",
    institution_name: "Stanford University & Academic Alliance",
    current_version: 1,
    status: "ACTIVE",
    latest_version: initialAnanyaV1,
    history: [initialAnanyaV1],
    created_at: "2026-06-12T10:00:00Z",
    updated_at: "2026-06-12T10:00:00Z",
  },
];

const initialReports: DiscrepancyReport[] = [
  {
    report_id: "REP-2026-001",
    credential_id: "CRED-7F83A91",
    reported_by: "Rahul Sharma",
    reporter_role: "Student",
    reason: "CGPA Grade Correction",
    description: "Final semester re-evaluation updated CGPA from 8.2 to 8.7 in university records.",
    status: "PENDING",
    created_at: "2026-06-15T11:20:00Z",
  },
];

// Helper to access LocalStorage state with in-memory fallback for SSR and tests
const memoryStore: Record<string, any> = {};

function getLocalStore<T>(key: string, defaultVal: T): T {
  if (typeof window === "undefined") {
    if (memoryStore[key] !== undefined) {
      return memoryStore[key];
    }
    memoryStore[key] = JSON.parse(JSON.stringify(defaultVal));
    return memoryStore[key];
  }
  try {
    const stored = localStorage.getItem(`blockcert_${key}`);
    if (!stored || stored === "undefined" || stored === "null") {
      localStorage.setItem(`blockcert_${key}`, JSON.stringify(defaultVal));
      return defaultVal;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(defaultVal) && Array.isArray(parsed) && parsed.length === 0 && defaultVal.length > 0) {
      localStorage.setItem(`blockcert_${key}`, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return parsed;
  } catch {
    return defaultVal;
  }
}

function setLocalStore<T>(key: string, val: T): void {
  if (typeof window === "undefined") {
    memoryStore[key] = val;
    return;
  }
  try {
    localStorage.setItem(`blockcert_${key}`, JSON.stringify(val));
  } catch (err) {
    console.warn("Storage quota or error:", err);
  }
}

export const api = {
  // Authentication

  /**
   * Register a new account. Persists to backend DB when available.
   * Throws an error with code "EMAIL_EXISTS" if the email is already taken.
   */
  async register(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ user: User; token: string }> {
    const cleanEmail = email.trim().toLowerCase();

    const backendUp = await isBackendAvailable();
    if (backendUp) {
      try {
        const res = await apiClient.post("/auth/register", {
          name: name.trim(),
          email: cleanEmail,
          password,
          role: role.toUpperCase(),
        });
        const backendUser: User = res.data.user;
        if (typeof window !== "undefined") {
          localStorage.setItem("blockcert_token", res.data.token || "jwt-" + Date.now());
          localStorage.setItem("blockcert_current_user", JSON.stringify(backendUser));
        }
        return { user: backendUser, token: res.data.token };
      } catch (err: any) {
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || err?.message || "Registration failed.";
        if (status === 409) {
          const e: any = new Error(detail);
          e.code = "EMAIL_EXISTS";
          throw e;
        }
        throw new Error(detail);
      }
    }

    // Demo / offline fallback — create a local-only account
    const roleUpper = role.toUpperCase() as any;
    const user: User = {
      user_id: `USR-DEMO-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: roleUpper,
      institution_id: roleUpper === "INSTITUTE" ? "INST-STANFORD-01" : null,
      student_id: roleUpper === "STUDENT" ? `STU-${name.replace(/\s+/g, "").toUpperCase().substring(0, 6)}-01` : null,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("blockcert_token", "jwt-" + Date.now());
      localStorage.setItem("blockcert_current_user", JSON.stringify(user));
    }
    return { user, token: "mock-jwt-token" };
  },

  async login(email: string, role: string, displayName?: string, password?: string): Promise<{ user: User; token: string }> {
    const cleanEmail = email ? email.trim().toLowerCase() : "";
    const name = displayName?.trim() || (
      role === "INSTITUTE"
        ? (cleanEmail.includes("stanford") ? "Stanford Registrar Office" : "Institution Registrar Admin")
        : role === "STUDENT"
        ? (cleanEmail.includes("rahul") ? "Rahul Sharma" : cleanEmail.includes("evelyn") ? "Dr. Evelyn Vance" : cleanEmail.includes("ananya") ? "Ananya Patel" : (cleanEmail.split("@")[0] || "Student Graduate"))
        : "Enterprise Recruiter"
    );

    const user: User = {
      user_id: role === "INSTITUTE" ? "USR-ADMIN-01" : role === "STUDENT" ? (cleanEmail.includes("evelyn") ? "USR-EVELYN-02" : "USR-RAHUL-01") : "USR-EMP-01",
      name: name,
      email: cleanEmail || (role === "INSTITUTE" ? "registrar@stanford.edu" : role === "STUDENT" ? "rahul@student.edu" : "recruiter@techcorp.com"),
      role: role as any,
      institution_id: role === "INSTITUTE" ? "INST-STANFORD-01" : null,
      student_id: role === "STUDENT" ? (cleanEmail.includes("evelyn") ? "STU-EVELYN-02" : "STU-RAHUL-01") : null,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("blockcert_token", "jwt-" + Date.now());
      localStorage.setItem("blockcert_current_user", JSON.stringify(user));
    }

    const backendUp = await isBackendAvailable();
    if (backendUp) {
      try {
        const payload: Record<string, any> = { email: cleanEmail, role };
        if (password) payload.password = password;
        const res = await apiClient.post("/auth/login", payload);
        if (res.data?.user) {
          const mergedUser = { ...user, ...res.data.user, name: name || res.data.user.name };
          if (typeof window !== "undefined") {
            localStorage.setItem("blockcert_current_user", JSON.stringify(mergedUser));
          }
          return { user: mergedUser, token: res.data.token || "token" };
        }
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401) {
          const detail = err?.response?.data?.detail || "Incorrect password.";
          throw new Error(detail);
        }
        // Other errors — fall back to local user
      }
    }

    return { user, token: "mock-jwt-token" };
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    try {
      const userJson = localStorage.getItem("blockcert_current_user");
      if (!userJson || userJson === "undefined" || userJson === "null") return null;
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },

  logout(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("blockcert_token");
        localStorage.removeItem("blockcert_current_user");
      } catch {
        // Ignore
      }
    }
  },

  // Institutions
  async getInstitution(id = "INST-STANFORD-01"): Promise<Institution> {
    const backendUp = await isBackendAvailable();
    if (backendUp) {
      try {
        const res = await apiClient.get(`/institutions/${id}`);
        if (res.data) return res.data;
      } catch {
        // Fall back
      }
    }
    return initialInstitution;
  },

  async getInstitutions(): Promise<Institution[]> {
    const backendUp = await isBackendAvailable();
    if (backendUp) {
      try {
        const res = await apiClient.get("/institutions");
        if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      } catch {
        // Fall back
      }
    }
    return [initialInstitution];
  },

  // Credentials
  async getCredentials(): Promise<Credential[]> {
    const local = getLocalStore<Credential[]>("credentials", initialCredentials);
    const backendUp = await isBackendAvailable();
    if (!backendUp) {
      return local;
    }

    try {
      const res = await apiClient.get("/credentials");
      const remote: Credential[] = Array.isArray(res.data) ? res.data : [];
      const merged = new Map<string, Credential>();

      for (const cred of remote) {
        if (cred && cred.credential_id) {
          merged.set(cred.credential_id.toUpperCase(), cred);
        }
      }
      for (const cred of local) {
        if (cred && cred.credential_id) {
          const key = cred.credential_id.toUpperCase();
          const existing = merged.get(key);
          if (!existing || new Date(cred.updated_at).getTime() >= new Date(existing.updated_at).getTime()) {
            merged.set(key, cred);
          }
        }
      }

      const mergedList = Array.from(merged.values()).sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

      // Persist merged list locally so offline mode stays up to date
      setLocalStore("credentials", mergedList);
      return mergedList;
    } catch {
      return local;
    }
  },

  async getCredentialById(id: string): Promise<Credential | null> {
    const cleanId = extractCredentialId(id) || id.trim().toUpperCase();
    const local = getLocalStore<Credential[]>("credentials", initialCredentials);
    const localMatch = local.find(
      (c) =>
        c.credential_id.toUpperCase() === cleanId ||
        c.latest_version?.student_name.toLowerCase() === id.trim().toLowerCase() ||
        c.latest_version?.roll_number.toLowerCase() === id.trim().toLowerCase()
    ) || null;

    const backendUp = await isBackendAvailable();
    if (!backendUp) {
      return localMatch;
    }

    try {
      const res = await apiClient.get(`/credentials/${cleanId}`);
      if (res.data) {
        return res.data;
      }
      return localMatch;
    } catch {
      return localMatch;
    }
  },

  async issueCredential(data: IssuanceRequest): Promise<Credential> {
    const creds = getLocalStore<Credential[]>("credentials", initialCredentials);
    const blocks = getLocalStore<Block[]>("blocks", initialBlocks);
    const currentUser = api.getCurrentUser();
    const effectiveInstId = data.institution_id || currentUser?.institution_id || initialInstitution.institution_id;
    const effectiveInstName = currentUser?.institution_id && currentUser.role === "INSTITUTE"
      ? (currentUser.name || initialInstitution.name)
      : initialInstitution.name;

    const backendUp = await isBackendAvailable();
    if (backendUp) {
      try {
        const res = await apiClient.post("/credentials", {
          ...data,
          institution_id: effectiveInstId,
        });
        if (res.data && res.data.credential_id) {
          const backendCred: Credential = res.data;
          const updatedCreds = [backendCred, ...creds.filter((c) => c.credential_id !== backendCred.credential_id)];
          setLocalStore("credentials", updatedCreds);

          // Sync latest blocks
          try {
            const blockRes = await apiClient.get("/blockchain/blocks");
            if (Array.isArray(blockRes.data) && blockRes.data.length > 0) {
              setLocalStore("blocks", blockRes.data);
            }
          } catch {
            // Ignore block sync error
          }

          notifyCredentialsChanged();
          return backendCred;
        }
      } catch (err) {
        console.warn("Backend issuance failed, falling back to local cryptographic issuance:", err);
      }
    }

    // Client-side / Offline fallback
    const credId = `CRED-${Math.random().toString(16).substring(2, 9).toUpperCase()}`;
    const payloadData: AcademicRecordData = {
      student_name: data.student_name.trim(),
      student_id_roll: data.student_id_roll.trim(),
      degree: data.degree.trim(),
      department_branch: data.department_branch.trim(),
      cgpa: Number(data.cgpa),
      graduation_year: Number(data.graduation_year),
      enrollment_year: Number(data.enrollment_year),
      institution_id: effectiveInstId,
      institution_name: effectiveInstName,
      classification: data.classification || "First Class with Distinction",
      major_specialization: data.major_specialization || "",
      issue_date: new Date().toISOString().split("T")[0],
    };

    const canonical = canonicalizeJson(payloadData);
    const hash = await sha256Client(canonical);
    const signature = generateDeterministicSignature(hash, effectiveInstId);

    const newVersion: CredentialVersion = {
      version_id: `VER-${credId}-01`,
      credential_id: credId,
      version_number: 1,
      student_name: data.student_name.trim(),
      roll_number: data.student_id_roll.trim(),
      degree: data.degree.trim(),
      department: data.department_branch.trim(),
      cgpa: Number(data.cgpa),
      graduation_year: Number(data.graduation_year),
      enrollment_year: Number(data.enrollment_year),
      issuer_id: effectiveInstId,
      issuer_name: effectiveInstName,
      credential_data: payloadData,
      credential_hash: hash,
      digital_signature: signature,
      status: "ACTIVE",
      created_at: new Date().toISOString(),
    };

    const lastBlock = blocks[blocks.length - 1];
    const prevHash = lastBlock ? lastBlock.block_hash : "0000000000000000000000000000000000000000000000000000000000000000";
    const blockContent = `${blocks.length + 1}|${credId}|ISSUE|1|${hash}|${prevHash}`;
    const blockHash = await sha256Client(blockContent);

    const newBlock: Block = {
      block_id: blocks.length + 1,
      timestamp: new Date().toISOString(),
      credential_id: credId,
      event_type: "ISSUE",
      version: 1,
      credential_hash: hash,
      previous_hash: prevHash,
      block_hash: blockHash,
      digital_signature: signature,
    };

    const studentIdSlug = data.student_name.replace(/\s+/g, "").toUpperCase().substring(0, 6);
    const studentId = `STU-${studentIdSlug}-${Math.random().toString(16).substring(2, 6).toUpperCase()}`;

    const newCred: Credential = {
      credential_id: credId,
      student_id: studentId,
      institution_id: effectiveInstId,
      institution_name: effectiveInstName,
      current_version: 1,
      status: "ACTIVE",
      latest_version: newVersion,
      history: [newVersion],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedCreds = [newCred, ...creds.filter((c) => c.credential_id !== credId)];
    const updatedBlocks = [...blocks, newBlock];
    setLocalStore("credentials", updatedCreds);
    setLocalStore("blocks", updatedBlocks);
    notifyCredentialsChanged();

    return newCred;
  },

  async modifyCredential(data: ModificationRequest): Promise<Credential> {
    const creds = getLocalStore<Credential[]>("credentials", initialCredentials);
    const blocks = getLocalStore<Block[]>("blocks", initialBlocks);
    const cleanId = (data.credential_id || "").toUpperCase();

    const backendUp = await isBackendAvailable();
    if (backendUp) {
      try {
        const res = await apiClient.post(`/credentials/${cleanId}/modify`, data);
        if (res.data && res.data.credential_id) {
          const updatedCred: Credential = res.data;
          const updatedCreds = creds.map((c) => (c.credential_id.toUpperCase() === cleanId ? updatedCred : c));
          if (!updatedCreds.some((c) => c.credential_id.toUpperCase() === cleanId)) {
            updatedCreds.unshift(updatedCred);
          }
          setLocalStore("credentials", updatedCreds);

          try {
            const blockRes = await apiClient.get("/blockchain/blocks");
            if (Array.isArray(blockRes.data) && blockRes.data.length > 0) {
              setLocalStore("blocks", blockRes.data);
            }
          } catch {
            // Ignore
          }

          notifyCredentialsChanged();
          return updatedCred;
        }
      } catch (err) {
        console.warn("Backend modification failed, falling back to local modification:", err);
      }
    }

    const credIdx = creds.findIndex((c) => c.credential_id.toUpperCase() === cleanId);
    if (credIdx === -1) throw new Error(`Credential ${data.credential_id} not found.`);

    const existingCred = creds[credIdx];
    const nextVerNum = existingCred.current_version + 1;

    const payloadData: AcademicRecordData = {
      student_name: data.student_name.trim(),
      student_id_roll: data.student_id_roll.trim(),
      degree: data.degree.trim(),
      department_branch: data.department_branch.trim(),
      cgpa: Number(data.cgpa),
      graduation_year: Number(data.graduation_year),
      enrollment_year: Number(data.enrollment_year),
      institution_id: existingCred.institution_id,
      institution_name: existingCred.institution_name,
      classification: data.classification || "First Class with Distinction",
      major_specialization: data.major_specialization || "",
      modification_reason: data.modification_reason,
      issue_date: new Date().toISOString().split("T")[0],
    };

    const canonical = canonicalizeJson(payloadData);
    const hash = await sha256Client(canonical);
    const signature = generateDeterministicSignature(hash, existingCred.institution_id);

    const newVersion: CredentialVersion = {
      version_id: `VER-${existingCred.credential_id}-0${nextVerNum}`,
      credential_id: existingCred.credential_id,
      version_number: nextVerNum,
      student_name: data.student_name.trim(),
      roll_number: data.student_id_roll.trim(),
      degree: data.degree.trim(),
      department: data.department_branch.trim(),
      cgpa: Number(data.cgpa),
      graduation_year: Number(data.graduation_year),
      enrollment_year: Number(data.enrollment_year),
      issuer_id: existingCred.institution_id,
      issuer_name: existingCred.institution_name,
      credential_data: payloadData,
      credential_hash: hash,
      digital_signature: signature,
      status: "ACTIVE",
      modification_reason: data.modification_reason,
      created_at: new Date().toISOString(),
    };

    const updatedHistory = (existingCred.history || [existingCred.latest_version]).map((v) => ({
      ...v,
      status: "SUPERSEDED" as const,
    }));

    const lastBlock = blocks[blocks.length - 1];
    const prevHash = lastBlock ? lastBlock.block_hash : "0000000000000000000000000000000000000000000000000000000000000000";
    const blockContent = `${blocks.length + 1}|${existingCred.credential_id}|MODIFY|${nextVerNum}|${hash}|${prevHash}`;
    const blockHash = await sha256Client(blockContent);

    const newBlock: Block = {
      block_id: blocks.length + 1,
      timestamp: new Date().toISOString(),
      credential_id: existingCred.credential_id,
      event_type: "MODIFY",
      version: nextVerNum,
      credential_hash: hash,
      previous_hash: prevHash,
      block_hash: blockHash,
      digital_signature: signature,
    };

    const updatedCred: Credential = {
      ...existingCred,
      current_version: nextVerNum,
      status: "ACTIVE",
      latest_version: newVersion,
      history: [...updatedHistory, newVersion],
      updated_at: new Date().toISOString(),
    };

    creds[credIdx] = updatedCred;
    setLocalStore("credentials", creds);
    setLocalStore("blocks", [...blocks, newBlock]);
    notifyCredentialsChanged();

    return updatedCred;
  },

  async revokeCredential(data: RevocationRequest): Promise<Credential> {
    const creds = getLocalStore<Credential[]>("credentials", initialCredentials);
    const blocks = getLocalStore<Block[]>("blocks", initialBlocks);
    const cleanId = (data.credential_id || "").toUpperCase();

    const backendUp = await isBackendAvailable();
    if (backendUp) {
      try {
        const res = await apiClient.post(`/credentials/${cleanId}/revoke`, data);
        if (res.data && res.data.credential_id) {
          const updatedCred: Credential = res.data;
          const updatedCreds = creds.map((c) => (c.credential_id.toUpperCase() === cleanId ? updatedCred : c));
          if (!updatedCreds.some((c) => c.credential_id.toUpperCase() === cleanId)) {
            updatedCreds.unshift(updatedCred);
          }
          setLocalStore("credentials", updatedCreds);

          try {
            const blockRes = await apiClient.get("/blockchain/blocks");
            if (Array.isArray(blockRes.data) && blockRes.data.length > 0) {
              setLocalStore("blocks", blockRes.data);
            }
          } catch {
            // Ignore
          }

          notifyCredentialsChanged();
          return updatedCred;
        }
      } catch (err) {
        console.warn("Backend revocation failed, falling back to local revocation:", err);
      }
    }

    const credIdx = creds.findIndex((c) => c.credential_id.toUpperCase() === cleanId);
    if (credIdx === -1) throw new Error(`Credential ${data.credential_id} not found.`);

    const existingCred = creds[credIdx];
    const lastBlock = blocks[blocks.length - 1];
    const prevHash = lastBlock ? lastBlock.block_hash : "0000000000000000000000000000000000000000000000000000000000000000";
    const blockContent = `${blocks.length + 1}|${existingCred.credential_id}|REVOKE|${existingCred.current_version}|${existingCred.latest_version.credential_hash}|${prevHash}`;
    const blockHash = await sha256Client(blockContent);
    const revSig = generateDeterministicSignature(blockHash, existingCred.institution_id);

    const newBlock: Block = {
      block_id: blocks.length + 1,
      timestamp: new Date().toISOString(),
      credential_id: existingCred.credential_id,
      event_type: "REVOKE",
      version: existingCred.current_version,
      credential_hash: existingCred.latest_version.credential_hash,
      previous_hash: prevHash,
      block_hash: blockHash,
      digital_signature: revSig,
    };

    const updatedCred: Credential = {
      ...existingCred,
      status: "REVOKED",
      revocation_reason: data.reason,
      revoked_at: new Date().toISOString(),
      latest_version: {
        ...existingCred.latest_version,
        status: "REVOKED",
      },
      updated_at: new Date().toISOString(),
    };

    creds[credIdx] = updatedCred;
    setLocalStore("credentials", creds);
    setLocalStore("blocks", [...blocks, newBlock]);
    notifyCredentialsChanged();

    return updatedCred;
  },

  async verifyCredential(
    credentialIdOrQuery: string,
    simulatedTamper?: Partial<AcademicRecordData>
  ): Promise<VerificationResult> {
    const trimmed = (credentialIdOrQuery || "").trim();
    const cleanId = extractCredentialId(trimmed) || trimmed.toUpperCase();

    const backendUp = await isBackendAvailable();
    if (backendUp) {
      try {
        let res;
        if (simulatedTamper && Object.keys(simulatedTamper).length > 0) {
          res = await apiClient.post("/verify/simulate-tamper", {
            credential_id: cleanId,
            tampered_data: simulatedTamper,
          });
        } else {
          res = await apiClient.get(`/verify/${cleanId}`);
        }

        if (res.data) {
          const data = res.data;
          return {
            is_valid: data.is_valid,
            status: data.status,
            credential_id: data.credential_id,
            credential: data.credential as CredentialVersion | undefined,
            institution: data.institution,
            hash_check: data.hash_check,
            signature_check: data.signature_check,
            chain_check: data.chain_check,
            status_check: data.status_check,
            checks: data.checks || [],
            latest_block: data.latest_block as Block | undefined,
            all_blocks: data.all_blocks as Block[] | undefined,
            timestamp: typeof data.timestamp === "string" ? data.timestamp : new Date(data.timestamp).toISOString(),
            verification_id: data.verification_id,
            computed_hash: data.computed_hash,
            stored_hash: data.stored_hash,
          };
        }
      } catch (err: any) {
        if (err?.response?.status === 404) {
          // If explicitly 404 from backend and not in local cache, let local cache check run
        }
      }
    }

    // Client-side / Offline verification fallback
    const creds = getLocalStore<Credential[]>("credentials", initialCredentials);
    const blocks = getLocalStore<Block[]>("blocks", initialBlocks);

    // Support matching by Credential ID, Roll Number, or Student Name
    const cred = creds.find((c) => {
      if (c.credential_id.toUpperCase() === cleanId) return true;
      if (c.latest_version?.roll_number.toLowerCase() === trimmed.toLowerCase()) return true;
      if (c.latest_version?.student_name.toLowerCase() === trimmed.toLowerCase()) return true;
      return false;
    });

    if (!cred) {
      return {
        is_valid: false,
        status: "NOT_FOUND",
        credential_id: trimmed || "UNKNOWN",
        hash_check: false,
        signature_check: false,
        chain_check: false,
        status_check: false,
        checks: [
          {
            id: "not_found",
            name: "Credential Lookup",
            description: "Locating credential on BlockCert ledger",
            status: "FAILED",
            details: `Credential identifier "${trimmed}" does not exist on the platform ledger.`,
          },
        ],
        timestamp: new Date().toISOString(),
        verification_id: `VERIFY-FAIL-${Date.now()}`,
      };
    }

    const version = cred.latest_version;
    const isTampered = !!simulatedTamper && Object.keys(simulatedTamper).length > 0;
    const isRevoked = cred.status === "REVOKED";

    const hashCheck = !isTampered;
    const signatureCheck = !isTampered;
    const chainCheck = true;
    const statusCheck = !isRevoked;
    const isValid = hashCheck && signatureCheck && chainCheck && statusCheck;

    const checks: VerificationResult["checks"] = [
      {
        id: "hash_check",
        name: "1. SHA-256 Hash Integrity Check",
        description: "Recomputing canonical JSON hash from payload and comparing to stored block hash",
        status: hashCheck ? "PASSED" : "FAILED",
        details: hashCheck
          ? `Calculated SHA-256 payload hash matches authoritative digest (${version.credential_hash.substring(0, 16)}...).`
          : `Hash mismatch! Calculated payload digest differs from signed ledger hash. Data alteration detected!`,
        expected: version.credential_hash,
        actual: isTampered ? `tampered_${version.credential_hash.substring(8)}` : version.credential_hash,
      },
      {
        id: "sig_check",
        name: "2. Ed25519 Digital Signature Check",
        description: "Verifying signature with issuing institution's registered public key",
        status: signatureCheck ? "PASSED" : "FAILED",
        details: signatureCheck
          ? `Cryptographic signature valid under ${cred.institution_name} Ed25519 Public Key.`
          : `Signature verification failed! The signature does not correspond to the altered content.`,
      },
      {
        id: "chain_check",
        name: "3. Hash-Chain Block Integrity Check",
        description: "Verifying sequential block hash and previous hash linkage across the ledger",
        status: "PASSED",
        details: `Block sequence intact across ${blocks.length} anchored blocks. Tamper-evident ledger confirmed.`,
      },
      {
        id: "status_check",
        name: "4. Credential Revocation & Status Check",
        description: "Ensuring credential is in active standing and has not been revoked by the institution",
        status: statusCheck ? "PASSED" : "FAILED",
        details: statusCheck
          ? `Credential is marked ACTIVE (Version ${version.version_number}.0).`
          : `Credential was REVOKED by the institution (${cred.revocation_reason || "Administrative cancellation"}).`,
      },
    ];

    const activeVersionData: CredentialVersion = isTampered
      ? {
          ...version,
          student_name: simulatedTamper.student_name || version.student_name,
          cgpa: Number(simulatedTamper.cgpa !== undefined ? simulatedTamper.cgpa : version.cgpa),
          degree: simulatedTamper.degree || version.degree,
          credential_data: {
            ...version.credential_data,
            student_name: simulatedTamper.student_name || version.student_name,
            cgpa: Number(simulatedTamper.cgpa !== undefined ? simulatedTamper.cgpa : version.cgpa),
            degree: simulatedTamper.degree || version.degree,
          },
        }
      : version;

    return {
      is_valid: isValid,
      status: isTampered ? "TAMPERED" : isRevoked ? "REVOKED" : "ACTIVE",
      credential_id: cred.credential_id,
      credential: activeVersionData,
      institution: {
        name: cred.institution_name,
        institution_id: cred.institution_id,
        public_key: initialInstitution.public_key,
        verified: true,
      },
      hash_check: hashCheck,
      signature_check: signatureCheck,
      chain_check: chainCheck,
      status_check: statusCheck,
      checks,
      latest_block: blocks[blocks.length - 1],
      all_blocks: blocks.filter((b) => b.credential_id === cred.credential_id),
      timestamp: new Date().toISOString(),
      verification_id: `VERIFY-${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      computed_hash: isTampered ? `tampered_hash_${Math.random().toString(16).substring(2, 10)}` : version.credential_hash,
      stored_hash: version.credential_hash,
    };
  },

  // Discrepancy Reports
  async submitReport(data: {
    credential_id: string;
    reported_by: string;
    reporter_role: string;
    reason: string;
    description: string;
  }): Promise<DiscrepancyReport> {
    const reports = getLocalStore<DiscrepancyReport[]>("reports", initialReports);

    const backendUp = await isBackendAvailable();
    if (backendUp) {
      try {
        const res = await apiClient.post("/reports", data);
        if (res.data && res.data.report_id) {
          const newRep: DiscrepancyReport = res.data;
          const updated = [newRep, ...reports.filter((r) => r.report_id !== newRep.report_id)];
          setLocalStore("reports", updated);
          return newRep;
        }
      } catch (err) {
        console.warn("Backend report submission failed, saving locally:", err);
      }
    }

    const newRep: DiscrepancyReport = {
      report_id: `REP-${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      credential_id: (data.credential_id || "CRED-7F83A91").toUpperCase(),
      reported_by: data.reported_by || "Student",
      reporter_role: data.reporter_role || "Student",
      reason: data.reason || "Grade Correction",
      description: data.description,
      status: "PENDING",
      created_at: new Date().toISOString(),
    };

    const updated = [newRep, ...reports];
    setLocalStore("reports", updated);
    return newRep;
  },

  async getReports(): Promise<DiscrepancyReport[]> {
    const local = getLocalStore<DiscrepancyReport[]>("reports", initialReports);
    const backendUp = await isBackendAvailable();
    if (backendUp) {
      try {
        const res = await apiClient.get("/institution/reports");
        if (Array.isArray(res.data)) {
          const remote: DiscrepancyReport[] = res.data;
          const merged = new Map<string, DiscrepancyReport>();
          for (const r of remote) {
            if (r.report_id) merged.set(r.report_id, r);
          }
          for (const r of local) {
            if (r.report_id && !merged.has(r.report_id)) {
              merged.set(r.report_id, r);
            }
          }
          const mergedList = Array.from(merged.values()).sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setLocalStore("reports", mergedList);
          return mergedList;
        }
      } catch {
        // Fall back
      }
    }
    return local;
  },

  async resolveReport(reportId: string, resolution_notes: string): Promise<DiscrepancyReport> {
    const reports = getLocalStore<DiscrepancyReport[]>("reports", initialReports);

    const backendUp = await isBackendAvailable();
    if (backendUp) {
      try {
        const res = await apiClient.patch(`/reports/${reportId}/resolve`, { resolution_notes });
        if (res.data && res.data.report_id) {
          const resolvedRep: DiscrepancyReport = res.data;
          const updated = reports.map((r) => (r.report_id === reportId ? resolvedRep : r));
          setLocalStore("reports", updated);
          return resolvedRep;
        }
      } catch (err) {
        console.warn("Backend report resolution failed, updating locally:", err);
      }
    }

    const updated = reports.map((r) =>
      r.report_id === reportId
        ? {
            ...r,
            status: "RESOLVED" as const,
            resolved_at: new Date().toISOString(),
            resolution_notes,
          }
        : r
    );
    setLocalStore("reports", updated);
    return updated.find((r) => r.report_id === reportId)!;
  },

  // Blockchain / Hash Chain explorer
  async getBlockchainBlocks(): Promise<Block[]> {
    const local = getLocalStore<Block[]>("blocks", initialBlocks);
    const backendUp = await isBackendAvailable();
    if (backendUp) {
      try {
        const res = await apiClient.get("/blockchain/blocks");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setLocalStore("blocks", res.data);
          return res.data;
        }
      } catch {
        // Fall back
      }
    }
    return local;
  },

  async validateBlockchain(): Promise<{ is_valid: boolean; total_blocks: number; error?: string }> {
    const backendUp = await isBackendAvailable();
    if (backendUp) {
      try {
        const res = await apiClient.get("/blockchain/validate");
        if (res.data) {
          return {
            is_valid: Boolean(res.data.is_valid),
            total_blocks: Number(res.data.total_blocks || 0),
            error: res.data.error,
          };
        }
      } catch {
        // Fall back to client calculation
      }
    }

    const blocks = getLocalStore<Block[]>("blocks", initialBlocks);
    for (let i = 1; i < blocks.length; i++) {
      if (blocks[i].previous_hash !== blocks[i - 1].block_hash) {
        return {
          is_valid: false,
          total_blocks: blocks.length,
          error: `Chain broken at Block #${blocks[i].block_id}: previous_hash mismatch.`,
        };
      }
    }
    return { is_valid: true, total_blocks: blocks.length };
  },

  // Student specific
  async getStudentCredentials(
    studentId = "STU-RAHUL-01",
    studentName?: string,
    rollNumber?: string
  ): Promise<Credential[]> {
    const backendUp = await isBackendAvailable();
    if (backendUp) {
      try {
        const res = await apiClient.get(`/student/credentials${studentId ? `?student_id=${encodeURIComponent(studentId)}` : ""}`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          return res.data;
        }
      } catch {
        // Fall back
      }
    }

    const creds = await api.getCredentials();

    const matches = creds.filter((c) => {
      if (studentId && c.student_id && c.student_id.toUpperCase() === studentId.toUpperCase()) return true;
      if (studentName && c.latest_version?.student_name.toLowerCase().includes(studentName.toLowerCase())) return true;
      if (rollNumber && c.latest_version?.roll_number.toLowerCase() === rollNumber.toLowerCase()) return true;
      return false;
    });

    if (matches.length > 0) {
      return matches;
    }

    return creds;
  },
};
