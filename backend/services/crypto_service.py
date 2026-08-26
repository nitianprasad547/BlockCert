import json
import hashlib
import base64
from typing import Dict, Any, Tuple
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization

class CryptoService:
    @staticmethod
    def generate_ed25519_keypair() -> Tuple[str, str]:
        """Generates an Ed25519 key pair, returning (public_key_b64, private_key_pem)."""
        private_key = ed25519.Ed25519PrivateKey.generate()
        public_key = private_key.public_key()

        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption(),
        ).decode("utf-8")

        public_bytes = public_key.public_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PublicFormat.Raw,
        )
        public_key_b64 = base64.b64encode(public_bytes).decode("utf-8")

        return public_key_b64, private_pem

    @staticmethod
    def canonicalize_data(data: Dict[str, Any]) -> str:
        """Deterministically serializes a dictionary to canonical JSON (sorted keys, no extraneous whitespace)."""
        return json.dumps(data, sort_keys=True, separators=(",", ":"))

    @staticmethod
    def compute_sha256(canonical_str: str) -> str:
        """Computes SHA-256 hash hex digest of a canonical string."""
        return hashlib.sha256(canonical_str.encode("utf-8")).hexdigest()

    @staticmethod
    def sign_hash(hash_hex: str, private_key_pem: str) -> str:
        """Signs a SHA-256 hash hex using the institution's Ed25519 private key."""
        private_key = serialization.load_pem_private_key(
            private_key_pem.encode("utf-8"),
            password=None,
        )
        if not isinstance(private_key, ed25519.Ed25519PrivateKey):
            raise ValueError("Private key is not an Ed25519 key")

        signature_bytes = private_key.sign(hash_hex.encode("utf-8"))
        return base64.b64encode(signature_bytes).decode("utf-8")

    @staticmethod
    def verify_signature(hash_hex: str, signature_b64: str, public_key_b64: str) -> bool:
        """Verifies an Ed25519 digital signature against the hash and public key."""
        try:
            public_bytes = base64.b64decode(public_key_b64)
            public_key = ed25519.Ed25519PublicKey.from_public_bytes(public_bytes)
            signature_bytes = base64.b64decode(signature_b64)

            public_key.verify(signature_bytes, hash_hex.encode("utf-8"))
            return True
        except Exception:
            return False
