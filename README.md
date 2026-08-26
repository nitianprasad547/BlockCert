# BlockCert — Blockchain-Based Academic Credential Verification Platform

![BlockCert Status](https://img.shields.io/badge/BlockCert-v1.0.0-emerald)
![Security Standard](https://img.shields.io/badge/Security-Ed25519%20%2B%20SHA--256-cyan)
![Ledger](https://img.shields.io/badge/Ledger-Tamper--Evident%20Hash%20Chain-amber)

> **"The institution issues the credential. The student owns and shares it. The employer verifies it independently. The hash chain preserves evidence of its history."**

BlockCert is an end-to-end cryptographic platform for issuing, versioning, revoking, and verifying academic credentials (degrees, marksheets, certificates, and transcripts). It eliminates credential fraud and slow manual background checks using **Ed25519 digital signatures**, **RFC-8785 canonical SHA-256 digests**, **linear single-node hash chains**, and **permanent QR codes**.

---

## 🏛️ Core Product Concept

```
                                BLOCKCERT
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
    Institute Portal         Student Portal           Employer Verifier
    (Issuance / Revoke)      (Ownership / Share)      (Instant 4-Point Check)
           │                        │                        │
           └────────────────────────┼────────────────────────┘
                                    │ REST API
                                    ▼
                             FastAPI Backend
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
     SQLite / Postgres        Crypto Engine             Hash Chain
   (Credentials & Users)   (Ed25519 / SHA-256)      (ISSUE / MODIFY / REVOKE)
```

---

## 🚀 Key Features

1. **Cryptographic Issuance Core**:
   - Asymmetric **Ed25519** key pair generated per institution.
   - Private keys are strictly isolated in server-side storage and never exposed to clients.
   - Canonicalized JSON hashing via **SHA-256**.
2. **Permanent Credential ID & Permanent QR**:
   - Each credential receives a permanent ID (e.g. `CRED-7F83A91`) and stable QR code.
   - The ID and QR remain completely unchanged across legitimate version modifications.
3. **Immutable Credential Versioning**:
   - Corrections create **Version 2.0 (ACTIVE)** and preserve older records as **SUPERSEDED**.
   - Appends a `MODIFY` block to the linear hash chain.
4. **Instant Revocation Mechanism**:
   - Registrars can revoke credentials with a required reason.
   - Appends a `REVOKE` block to the hash chain; verifications immediately reflect `REVOKED`.
5. **Employer 4-Point Verification**:
   1. **SHA-256 Hash Integrity Check**: Recomputed payload hash matches stored hash.
   2. **Ed25519 Digital Signature Check**: Verified against the issuing university's public key.
   3. **Hash-Chain Linkage Check**: Parent block sequence integrity confirmed.
   4. **Status & Revocation Check**: Confirms active non-revoked standing.
6. **Built-in Tampering Detection Sandbox**:
   - 1-click simulator on `/verify` to test unauthorized alterations (e.g., changing CGPA 8.2 → 10.0), showing real-time `INVALID / TAMPERED` detection.
7. **Discrepancy Reporting Workflow**:
   - Students and employers can submit discrepancy alerts; registrars review and resolve from their inbox.

---

## 💻 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, QRCode.
- **Backend**: Python 3.14, FastAPI, SQLAlchemy ORM, SQLite / PostgreSQL.
- **Cryptography**: `cryptography` (Ed25519 signing & verification), `hashlib` (SHA-256).
- **Authentication**: JWT (JSON Web Tokens).

---

## 📂 Project Structure

```
BlockCert/
├── backend/
│   ├── main.py                      # FastAPI app entry point & CORS
│   ├── database/
│   │   ├── connection.py            # SQLite engine & session
│   │   └── seed.py                  # Seed script with demo candidates
│   ├── models/                      # SQLAlchemy models (Institution, Credential, Block, etc.)
│   ├── schemas/                     # Pydantic validation schemas
│   ├── services/
│   │   ├── crypto_service.py        # Ed25519 keypair, canonical JSON, SHA-256 & signing
│   │   ├── blockchain_service.py    # Tamper-evident single-node hash chain
│   │   ├── credential_service.py    # Issuance, versioning, revocation, verification
│   │   └── qr_service.py            # QR code generation
│   ├── routes/                      # REST endpoints (auth, credentials, verify, reports, etc.)
│   ├── requirements.txt             # Python requirements
│   └── test_crypto_flow.py          # Cryptographic test suite
│
├── app/
│   ├── layout.tsx                   # Root layout with BlockCert metadata
│   ├── globals.css                  # Design system tokens & certificate styling
│   ├── page.tsx                     # Landing Page (Hero certificate mockup, stats, flow)
│   ├── about/page.tsx               # Product mission & compliance
│   ├── how-it-works/page.tsx        # 8-stage interactive lifecycle
│   ├── security/page.tsx            # Cryptographic specifications & PRD requirements
│   ├── login/page.tsx               # Unified login with 1-click Quick Personas
│   ├── verify/                      # Employer verification portal + QR scanner + Tamper simulator
│   ├── institute/                   # Institution Registrar command center & issuance
│   └── student/                     # Student credential locker & discrepancy tracker
│
├── components/                      # Reusable UI components
│   ├── Navbar.tsx                   # Navigation header
│   ├── Footer.tsx                   # Footer with specs & links
│   ├── CredentialCard.tsx           # Realistic digital academic certificate
│   ├── QRScanner.tsx                # Camera & image QR scanner
│   ├── VerificationResult.tsx       # 4-stage cryptographic proof card & tamper sandbox
│   ├── BlockchainExplorerModal.tsx  # Hash chain inspector
│   └── DiscrepancyModal.tsx         # Discrepancy submission modal
│
├── lib/
│   ├── api.ts                       # API client connecting to FastAPI with mock fallback
│   └── crypto.ts                    # Client-side hash preview helpers
└── types/
    └── index.ts                     # TypeScript data interfaces
```

---

## ⚡ Getting Started

### 1. Run the Python FastAPI Backend

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Seed the database with demo credentials (Rahul Sharma & Dr. Evelyn Vance)
python backend/database/seed.py

# Run the backend server
python backend/main.py
# API runs on http://127.0.0.1:8000
# OpenAPI Docs: http://127.0.0.1:8000/docs
```

### 2. Run the Next.js Frontend

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🧪 Hackathon Demo Flow (PRD Section 30 & 31)

1. **Institution Login**: Sign in as Stanford Registrar Admin on `/login`.
2. **Credential Issuance**: Navigate to `/institute/credentials/new`, fill in Rahul Sharma's credentials, watch real-time SHA-256 hash calculation, and click *Digitally Sign & Issue*.
3. **Student View**: Sign in to `/student/dashboard` to view Rahul's official certificate, download the QR code, and copy the verification link.
4. **Employer Verification**: Navigate to `/verify`, enter `CRED-7F83A91` -> view **VERIFIED** with all 4 green cryptographic checkmarks.
5. **Tamper Detection Test**: In the verifier, click *Simulate Altered CGPA (8.2 → 10.0)* -> immediately observe status switch to **INVALID / TAMPERED** with hash mismatch proof.
6. **Legitimate Modification**: In the registrar portal, create Version 2 (CGPA 8.7) -> verify that the same Credential ID and QR now resolve to **Version 2.0 ACTIVE** while Version 1.0 is preserved as **SUPERSEDED**.
7. **Revocation**: Click *Revoke Credential* in the registrar portal -> verify that querying the same QR now displays **REVOKED**.

---

## 📄 License
BlockCert — Hackathon Edition.
