// Canonical JSON serialization and client-side SHA-256 helper for real-time previews

export function canonicalizeJson(obj: Record<string, any>): string {
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: Record<string, any> = {};
  for (const key of sortedKeys) {
    const val = obj[key];
    if (val !== undefined && val !== null) {
      if (typeof val === "object" && !Array.isArray(val)) {
        sortedObj[key] = JSON.parse(canonicalizeJson(val));
      } else {
        sortedObj[key] = val;
      }
    }
  }
  return JSON.stringify(sortedObj);
}

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

function jsSha256(str: string): string {
  // UTF-8 encode
  const ascii = unescape(encodeURIComponent(str));
  const maxWord = Math.pow(2, 32);
  let result = "";

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f, 0xc67178f2,
  ];

  let paddedAscii = ascii + "\x80";
  while (paddedAscii.length % 64 !== 56) {
    paddedAscii += "\x00";
  }

  for (let i = 0; i < paddedAscii.length; i++) {
    const j = paddedAscii.charCodeAt(i);
    const wordIdx = i >> 2;
    words[wordIdx] = (words[wordIdx] || 0) | (j << (((3 - i) % 4) * 8));
  }

  words.push(Math.floor(asciiBitLength / maxWord));
  words.push(asciiBitLength | 0);

  for (let j = 0; j < words.length; j += 16) {
    const w = words.slice(j, j + 16);
    const oldHash = [...hash];

    for (let i = 0; i < 64; i++) {
      let wVal = 0;
      if (i < 16) {
        wVal = w[i] || 0;
      } else {
        const w15 = w[i - 15] || 0;
        const w2 = w[i - 2] || 0;
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        wVal = ((w[i - 16] || 0) + s0 + (w[i - 7] || 0) + s1) | 0;
        w[i] = wVal;
      }

      const s1_maj =
        rightRotate(hash[0], 2) ^
        rightRotate(hash[0], 13) ^
        rightRotate(hash[0], 22);
      const maj =
        (hash[0] & hash[1]) ^
        (hash[0] & hash[2]) ^
        (hash[1] & hash[2]);
      const t2 = (s1_maj + maj) | 0;

      const s0_ch =
        rightRotate(hash[4], 6) ^
        rightRotate(hash[4], 11) ^
        rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const t1 = (hash[7] + s0_ch + ch + k[i] + wVal) | 0;

      hash = [(t1 + t2) | 0, hash[0], hash[1], hash[2], (hash[4] + t1) | 0, hash[4], hash[5], hash[6]];
    }

    for (let i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let bIndex = 3; bIndex >= 0; bIndex--) {
      const b = (hash[i] >> (bIndex * 8)) & 255;
      result += (b < 16 ? "0" : "") + b.toString(16);
    }
  }
  return result;
}

export async function sha256Client(message: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle && typeof crypto.subtle.digest === "function") {
    try {
      const msgUint8 = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      // Fall through to jsSha256
    }
  }
  return jsSha256(message);
}

export function formatHash(hash?: string, chars = 8): string {
  if (!hash) return "N/A";
  if (hash.length <= chars * 2) return hash;
  return `${hash.substring(0, chars)}...${hash.substring(hash.length - chars)}`;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (navigator?.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

