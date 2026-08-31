# BlockCert

**Cryptographically secured academic credential verification platform enabling institutions to issue, modify, revoke, and independently verify digital academic credentials.**

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Vercel-emerald?style=for-the-badge&logo=vercel)](https://block-cert-three.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Security: Ed25519 + SHA-256](https://img.shields.io/badge/Security-Ed25519%20%2B%20SHA--256-cyan?style=for-the-badge)](https://block-cert-three.vercel.app/security)
[![Ledger: Tamper--Evident](https://img.shields.io/badge/Ledger-Tamper--Evident%20Hash%20Chain-amber?style=for-the-badge)](#-hash-chain-architecture--transparency)

> *"The institution issues the credential. The student owns and shares it. The employer verifies it independently."*

---

## 🌐 Quick Links

* **Live Demo**: [https://block-cert-three.vercel.app](https://block-cert-three.vercel.app/)
* **Local Frontend**: `http://localhost:3000`
* **Local Backend API**: `http://127.0.0.1:8000`
* **Interactive API Documentation**: `http://127.0.0.1:8000/docs`

---

## 📌 The Problem

Academic credential fraud and manual degree verification represent a costly, multi-billion-dollar bottleneck worldwide:
* **Diploma Mills & CV Padding**: Unverifiable paper certificates and easily doctored PDF marksheets allow bad actors to forge credentials and manipulate GPAs.
* **Bureaucratic Verification Delays**: Employers and background check agencies wait days or weeks for registrar offices to respond to manual record confirmation inquiries.
* **Loss of History & Version Confusion**: Legitimate grade corrections, re-evaluations, or clerical updates often cause discrepancy disputes between student transcripts and registrar databases.
* **Centralized Database Vulnerabilities**: Static databases lack cryptographically provable audit trails; an unauthorized database modification may go undetected indefinitely.

---

## 💡 The Solution

BlockCert replaces trust in vulnerable paper documents and unverifiable PDFs with **mathematical proof**. 

* **Institutions** digitally sign canonicalized student achievement payloads with an asymmetric private key (`Ed25519`) stored strictly on the server.
* **Students** receive a permanent digital certificate featuring a stable Credential ID and permanent QR code that never change across subsequent revisions.
* **Employers & Recruiters** scan the QR code or input the Credential ID into an open verification portal to execute an instantaneous **4-point cryptographic integrity check** in under 2 seconds—without creating an account or contacting the university.
* **A Tamper-Evident Hash Chain** records every lifecycle event (`ISSUE`, `MODIFY`, `REVOKE`) with cryptographic parent block linkage, ensuring an unbroken, auditable event trail.

---

## ✨ Key Features

### 1. Cryptographic Credential Issuance
* **Ed25519 Digital Signatures**: High-speed, collision-resistant asymmetric signatures generated using Edwards-curve Digital Signature Algorithm (EdDSA).
* **Deterministic Canonical JSON Serialization**: Standardized key sorting and whitespace stripping ensure identical input byte-streams for cryptographic hashing.
* **SHA-256 Payload Digest**: Generates a unique 256-bit cryptographic digest representing the student's complete academic record.
* **Server-Side Key Isolation**: Institution private signing keys reside exclusively in secure backend storage and are never transmitted to client browsers.

### 2. Stable Credential Identity
* **Permanent Credential ID**: Each student certificate is assigned a permanent identifier (e.g., `CRED-7F83A91`).
* **Permanent Verifiable QR Code**: High-contrast, scannable QR code encoding the canonical verification endpoint. The QR code remains permanently valid across subsequent degree updates.

### 3. Transparent Credential Versioning
* **Immutable Historical Preservation**: Correcting an error or updating a GPA creates **Version 2.0 (ACTIVE)**, while Version 1.0 remains immutably preserved on the ledger as **SUPERSEDED**.
* **Audit Lineage**: Both versions link to the parent block in the ledger, maintaining complete historical lineage for academic forensics.

### 4. Institution-Controlled Revocation
* **Mandatory Justification**: Revoking a credential requires a recorded institutional reason (e.g., academic recall, disciplinary finding, administrative error).
* **Immediate Revocation Propagation**: Appends a `REVOKE` block to the hash chain; any subsequent employer verification check fails automatically with the recorded revocation reason.

### 5. Independent 4-Point Verification
Every verification query executes four independent automated cryptographic checks:
1. **SHA-256 Hash Integrity Check**: Recomputes the canonical JSON hash from the current payload and verifies that it matches the authoritative stored digest.
2. **Ed25519 Digital Signature Check**: Validates the cryptographic signature against the issuing institution's registered public key.
3. **Hash-Chain Linkage Check**: Confirms parent block hash continuity and sequential integrity from the genesis block to the tip of the chain.
4. **Credential Status & Revocation Check**: Validates that the credential is in active standing and has not been revoked or superseded.

### 6. Built-in Tampering Detection Sandbox
* Includes an interactive 1-click simulator on the `/verify` portal allowing reviewers to test unauthorized field alterations (e.g., modifying CGPA `8.2` → `10.0`).
* Real-time demonstration shows the recalculation mismatch: the modified payload yields a diverging SHA-256 digest, immediately triggering an **INVALID / TAMPERED** status.

### 7. Discrepancy Reporting Workflow
* Students and employers can submit discrepancy alerts directly from the credential scorecard.
* University registrars review, inspect, and resolve pending discrepancy reports through their administrative dashboard.

---

## 🔄 How It Works

```
                        BLOCKCERT ECOSYSTEM
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
 1. Institution Portal    2. Student Locker       3. Employer Verifier
 • Digital Issuance       • Permanent Diploma     • Instant QR / ID Scan
 • Version Corrections    • Verifiable QR Code    • 4-Point Crypto Check
 • Revocation Controls    • Discrepancy Alerts    • Tamper-Detection Sandbox
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │ REST API (or Client Mock Fallback)
                                 ▼
                          FastAPI Backend
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
 SQLite / SQLAlchemy        Crypto Engine        Tamper-Evident Ledger
 Credentials & Versions   (Ed25519 / SHA-256)   (ISSUE / MODIFY / REVOKE)
```

---

## 🔒 Cryptographic Architecture

The lifecycle of every academic credential follows a strict cryptographic pipeline:

```
[ Academic Record Data ]
           │
           ▼
[ Canonical JSON Serialization ]  ─── Deterministic sorting of keys & separators
           │
           ▼
   [ SHA-256 Digest ]             ─── 32-byte unique cryptographic fingerprint
           │
           ▼
[ Ed25519 Private Key Sign ]      ─── Institution signs the digest server-side
           │
           ▼
 [ Hash Chain Append Block ]      ─── Links block hash to previous block hash
           │
           ▼
   [ Permanent QR Seal ]          ─── Encodes verification URI with Credential ID
```

### Verification Pipeline (Step-by-Step)
When a verifier enters a Credential ID or scans a QR code:
1. **Retrieve**: Fetches the active credential version and issuing institution public key.
2. **Canonicalize**: Normalizes the payload dictionary deterministically into sorted canonical JSON.
3. **Recompute Hash**: Computes SHA-256 over the canonical representation.
4. **Verify Signature**: Verifies the stored Ed25519 signature against the recomputed hash using the university's public key.
5. **Inspect Ledger**: Validates backward block hash linkages across the chain to detect any backend ledger tampering.
6. **Evaluate Standing**: Confirms whether the certificate status is `ACTIVE`, `SUPERSEDED`, or `REVOKED`.

---

## ⛓️ Hash Chain Architecture & Transparency

> **Important Disclosure**:
> BlockCert currently implements a **linear, single-node hash chain** stored in a relational database rather than a decentralized, multi-node consensus network (e.g., Ethereum or Hyperledger).

* **Design Rationale**: A single-node cryptographic hash chain was chosen for the hackathon implementation to provide **tamper-evident auditability, rapid sub-second verification, zero gas fees, and predictable computational overhead** without the operational complexity of managing distributed validator nodes.
* **Tamper-Evidence Property**: Each block computes its hash from:
  $$\text{Block Hash} = \text{SHA-256}(\text{BlockID} \parallel \text{Timestamp} \parallel \text{CredID} \parallel \text{Event} \parallel \text{Version} \parallel \text{CredHash} \parallel \text{PrevHash} \parallel \text{Signature})$$
  Any post-facto modification to past rows in the database breaks the `previous_hash` chain links, which is detected immediately by `BlockchainService.validate_chain()`.
* **Future Path**: This architecture is intentionally decoupled so that the event appending mechanism can be migrated to a distributed consortium ledger or public blockchain network without altering the core credential data structures or user experience.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router) | High-performance React framework with Turbopack |
| **UI Library** | React 19 | Modern component architecture with React Hooks |
| **Language** | TypeScript 5 | End-to-end static type safety |
| **Styling** | Tailwind CSS v4 & PostCSS | Next-generation CSS design tokens and dark mode styling |
| **Icons & Media** | Lucide React | Lightweight, consistent SVG iconography |
| **QR Code Engine** | `qrcode` / `@types/qrcode` | Client-side and server-side QR generation |
| **Backend Framework** | FastAPI (Python 3.14 / 3.10+) | High-throughput asynchronous REST API |
| **Data Validation** | Pydantic v2 | Strict schema validation for requests and responses |
| **ORM & Database** | SQLAlchemy 2.0 / SQLite | Relational persistence (PostgreSQL connection compatible) |
| **Cryptography** | `cryptography` (Python) | Ed25519 keypair generation, signing, and verification |
| **Hashing Engine** | Python `hashlib` & Web Crypto API | SHA-256 canonical hashing across backend and frontend |
| **Authentication** | PyJWT | JSON Web Token (JWT) token issuance |
| **Testing & Hooks** | Husky | Automated pre-commit lint validation |

---

## 📁 Project Structure

```text
BlockCert/
├── app/                             # Next.js 16 App Router pages & layouts
│   ├── layout.tsx                   # Root HTML shell & metadata
│   ├── globals.css                  # Tailored dark-mode tokens & CSS styling
│   ├── page.tsx                     # Landing page with interactive hero & stats
│   ├── about/                       # Mission, compliance & ecosystem overview
│   ├── how-it-works/                # 8-stage interactive cryptographic lifecycle
│   ├── security/                    # Cryptographic specifications & threat models
│   ├── login/                       # Unified authentication with 1-click personas
│   ├── signup/                      # Account registration for institutions & students
│   ├── verify/                      # Employer verification portal + QR scanner
│   │   └── [credentialId]/          # Direct dynamic credential verification view
│   ├── institute/                   # University Registrar command center & issuance
│   ├── student/                     # Student credential locker & discrepancy tracker
│   └── employer/                    # Employer portal & verification history
│
├── backend/                         # FastAPI application
│   ├── main.py                      # Application entrypoint & CORS middleware
│   ├── requirements.txt             # Python dependencies
│   ├── test_crypto_flow.py          # 8-stage cryptographic lifecycle test suite
│   ├── database/
│   │   ├── connection.py            # SQLAlchemy engine, session & SQLite configuration
│   │   └── seed.py                  # Seed script with verified demo records
│   ├── models/                      # SQLAlchemy database entities
│   │   ├── block.py                 # Tamper-evident hash chain block
│   │   ├── credential.py            # Primary credential entity
│   │   ├── credential_version.py    # Multi-version immutable snapshot
│   │   ├── institution.py           # Registered universities & Ed25519 keys
│   │   ├── user.py                  # Accounts & roles
│   │   └── discrepancy_report.py    # Discrepancy alert tickets
│   ├── routes/                      # REST API endpoints (auth, credentials, verify, etc.)
│   ├── schemas/                     # Pydantic request/response validation models
│   └── services/                    # Core business logic
│       ├── crypto_service.py        # Ed25519 signing, verification & SHA-256
│       ├── blockchain_service.py    # Hash chain block construction & chain audits
│       ├── credential_service.py    # Issuance, versioning, revocation & 4-point checks
│       └── qr_service.py            # High-contrast PNG QR generation
│
├── components/                      # Reusable React UI components
│   ├── Navbar.tsx                   # Main navigation header
│   ├── Footer.tsx                   # System specifications & navigation footer
│   ├── CredentialCard.tsx           # Official academic certificate presentation
│   ├── VerificationResult.tsx       # 4-stage cryptographic proof card & tamper sandbox
│   ├── BlockchainExplorerModal.tsx  # Interactive hash chain inspector
│   ├── QRScanner.tsx                # Camera & image file QR reader
│   ├── RegistrarDashboard.tsx       # Registrar issuance & metrics overview
│   ├── RevocationControl.tsx        # Credential revocation modal
│   └── DiscrepancyModal.tsx         # Discrepancy report submission
│
├── lib/                             # Shared frontend utilities
│   ├── api.ts                       # API client with health probe & standalone mock fallback
│   ├── crypto.ts                    # Client-side canonical JSON & SHA-256 preview helper
│   └── firebase.ts                  # Optional Firebase authentication provider
│
├── public/                          # Static assets (logo.png, favicon.ico)
├── types/                           # TypeScript interfaces and shared type definitions
├── .husky/                          # Git hooks (pre-commit lint verification)
├── eslint.config.mjs                # ESLint configuration
├── next.config.ts                   # Next.js configuration
├── postcss.config.mjs               # PostCSS configuration
├── tsconfig.json                    # TypeScript compiler configuration
├── vercel.json                      # Vercel deployment configuration
└── LICENSE                          # MIT License
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: Version `20.x` or higher (verified via `.nvmrc`)
* **npm**: Version `9.x` or higher
* **Python**: Version `3.10` to `3.14`

---

### 1. Backend Setup (FastAPI & SQLite)

1. Open a terminal and navigate to the project directory:
   ```bash
   cd BlockCert
   ```

2. Create and activate a Python virtual environment (recommended):
   ```bash
   # On macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate

   # On Windows (PowerShell):
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. Initialize and seed the database with verified demo credentials:
   ```bash
   python backend/database/seed.py
   ```
   *Output confirmation:*
   ```text
   🌱 Initializing database schema...
   🏛️ Registering Stanford University Alliance with Ed25519 keys...
   👤 Creating demo users...
   🎓 Registering student profiles...
   📜 Issuing authoritative demo credentials...
   🚨 Seeding sample discrepancy report...
   ✅ Database successfully seeded with BlockCert demo records!
   ```

5. Run the backend development server:
   ```bash
   python backend/main.py
   ```
   *Alternative with Uvicorn:*
   ```bash
   uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   * Backend REST API: `http://127.0.0.1:8000`
   * Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup (Next.js 16)

1. In a separate terminal window, navigate to the repository root:
   ```bash
   cd BlockCert
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Run the Next.js development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```text
   http://localhost:3000
   ```

> **Note on Standalone / Disconnected Mode**:
> If running the frontend without launching the Python backend, the frontend automatically detects the absence of `http://127.0.0.1:8000/api/health` and activates its built-in client-side mock engine. All features (verification, QR rendering, tamper simulation, issuance, and versioning) remain fully interactive.

---

## 🎬 Demo Flow

Follow this end-to-end walkthrough using the pre-seeded demo records:

### Pre-Seeded Demo Personas

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **University Registrar** | Stanford Registrar Office | `registrar@stanford.edu` | `password123` *(or Quick Persona)* |
| **Student** | Rahul Sharma | `rahul@student.edu` | `password123` *(or Quick Persona)* |
| **Student (PhD)** | Dr. Evelyn Vance | `evelyn@stanford.edu` | `password123` *(or Quick Persona)* |
| **Recruiter / Employer** | TechCorp Talent Acquisition | `recruiter@techcorp.com` | `password123` *(or Quick Persona)* |

---

### Step-by-Step Demonstration

1. **Step 1 — Verify an Authentic Credential**:
   * Navigate to `/verify`.
   * Click on the sample ID **`CRED-7F83A91`** (or enter it in the search box).
   * Observe the **VERIFIED / ACTIVE** badge and confirm all **4 cryptographic checkmarks** turn green:
     * *SHA-256 Hash Integrity* — Verified
     * *Ed25519 Digital Signature* — Valid under Stanford Public Key
     * *Hash-Chain Integrity* — Unbroken parent linkage
     * *Credential Standing* — Active (Version 1)

2. **Step 2 — Tamper Simulation Sandbox**:
   * On the verification result page for `CRED-7F83A91`, locate the **Tamper Simulation Sandbox**.
   * Click **"Simulate Altered CGPA (8.2 → 10.0)"**.
   * Notice that the status immediately flips to **INVALID / TAMPERED**:
     * Check 1 (*SHA-256 Hash Integrity*) fails with a detailed mismatch proof comparing the recomputed payload digest against the stored block digest.
     * Check 2 (*Ed25519 Signature Check*) fails because the signature was computed over the authentic hash.

3. **Step 3 — Student Credential Locker**:
   * Visit `/login` and select the **Rahul Sharma** persona (or sign in with `rahul@student.edu`).
   * View the official degree certificate card, examine the permanent QR code seal, and copy the direct verification link.

4. **Step 4 — Registrar Credential Issuance**:
   * Visit `/login` and select the **Stanford Registrar** persona (`registrar@stanford.edu`).
   * Access the Registrar Command Center (`/institute/dashboard`).
   * Click **"Issue New Credential"** (`/institute/credentials/new`).
   * Notice real-time client-side SHA-256 hash generation as form values are typed.
   * Click **"Digitally Sign & Issue"** to sign with the university's Ed25519 private key and record the `ISSUE` block to the hash chain.

5. **Step 5 — Legitimate Version Modification**:
   * From the Registrar dashboard, open `CRED-7F83A91`.
   * Trigger a modification (e.g., updating CGPA from `8.2` to `8.7` due to re-evaluation).
   * Confirm that a `MODIFY` block is appended to the chain. The credential updates to **Version 2.0 (ACTIVE)**, while Version 1.0 is preserved as **SUPERSEDED**.
   * Re-verifying the original Credential ID or QR code seamlessly resolves to the updated active version.

6. **Step 6 — Credential Revocation**:
   * In the registrar view, select **"Revoke Credential"**.
   * Enter a required revocation reason: *"Administrative diploma recall / test revocation"*.
   * Verify on `/verify` that the same Credential ID now displays **REVOKED** with the exact stated justification.

---

## 🧪 Testing

### 1. Automated Cryptographic Lifecycle Suite
The repository includes a comprehensive 8-step backend test script verifying issuance, verification, tampering detection, version modification, revocation, and full chain audits:

```bash
python backend/test_crypto_flow.py
```

*Expected output:*
```text
1. [ISSUE] Testing credential issuance for Rahul...
   -> Credential ID: CRED-7F83A91, Version: 1
2. [VERIFY] Testing normal verification (should be ACTIVE & VALID)...
   -> Result: VERIFIED (All 4 checks passed)
3. [TAMPER] Testing unauthorized data tampering (altering CGPA from 8.2 to 10.0)...
   -> Result: INVALID / TAMPERED (Tampering correctly caught!)
4. [MODIFY] Testing legitimate modification to Version 2 (CGPA 8.7)...
   -> Version updated to: 2
5. [VERIFY V2] Testing verification of modified credential (same ID & QR)...
   -> Result: VERIFIED Version 2 (ACTIVE)
6. [REVOKE] Testing revocation with reason...
7. [VERIFY REVOKED] Testing verification of revoked credential...
   -> Result: REVOKED (Correctly detected!)
8. [CHAIN INTEGRITY] Validating entire hash chain...
   -> Total Chain Blocks: 4, Chain Integrity: 100% VALID

🎉 ALL PRD CRYPTOGRAPHIC AND LIFECYCLE TESTS PASSED PERFECTLY!
```

### 2. Frontend Code Quality & Static Analysis
Run ESLint flat config:
```bash
npm run lint
```

### 3. Production Build Validation
Compile TypeScript, validate App Router page routes, and generate static bundles:
```bash
npm run build
```

---

## 🛡️ Security Model

### Cryptographic Guarantees
* **Private Key Isolation**: Private Ed25519 signing keys are stored in encrypted format on the server and are never exposed across API responses or client bundles.
* **Non-Repudiation**: Because only the issuing university possesses the Ed25519 private key, a valid signature provides mathematical proof that the credential was authorized by that specific institution.
* **Tamper-Evidence (vs. Tamper-Proof)**:
  * BlockCert is **tamper-evident**: while an attacker or dishonest database administrator might alter a database record or modify a local PDF, doing so immediately breaks the SHA-256 digest and invalidates the Ed25519 digital signature.
  * Any unauthorized change is visibly exposed during verification; it cannot be passed off as authentic.
* **Chain Continuity**: Each block contains `previous_hash` referencing the SHA-256 digest of the predecessor block, preventing hidden insertions, row deletions, or reorderings.

---

## 🚧 Limitations & Future Work

While BlockCert is a fully functional, end-to-end working prototype, enterprise production deployment can be extended with the following planned enhancements:

1. **Distributed Consortium Ledger**: Transition from a single-node hash chain to a permissioned consortium network (e.g., Hyperledger Fabric) where multiple universities act as consensus nodes.
2. **Hardware Security Module (HSM) Key Storage**: Migrate private key storage from local environment/database storage to dedicated cloud KMS or HSM solutions (e.g., AWS KMS, Azure Key Vault, or YubiHSM).
3. **Decentralized Identifiers & W3C Verifiable Credentials**: Standardize credential JSON schemas to adhere to the W3C Verifiable Credentials Data Model v2.0.
4. **Institutional Identity Federation**: Integrate with eduGAIN or Shibboleth single sign-on to formally verify university registrar administrative identities.
5. **Production PostgreSQL Cluster**: Deploy with managed PostgreSQL using `psycopg2` connection pooling, automated database backups, and read replicas.
6. **Rate Limiting & Anti-Scraping**: Implement token-bucket rate limiting on the `/api/verify` public endpoints to safeguard against credential enumeration scans.

---

## 👥 Contributors

* **BlockCert Team** — Architecture, Cryptographic Engineering, Full-Stack Development.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
