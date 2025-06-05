/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { vi } from "vitest";

import {
  GET_EXISTING_PASSWORD,
  GET_PASSWORD,
  createOfflinePasswordBroadCastChannelEndpoint,
  createPasswordMessage,
} from "@/serviceWorker/common/offlinePasswordBroadCastChannel";
import {
  decryptWithKey,
  encryptWithKey,
} from "@/serviceWorker/sw/crypto/crypto";

// bit-flip subtle-crypto mock
// for testing only
// DO NOT USE IN PRODUCTION

const mockKey = {} as CryptoKey;
const notImplemented = new Error("not implemented");

function encryptBuffer(data: BufferSource): ArrayBuffer {
  const buffer = new Uint8Array(data.byteLength);
  const input = new Uint8Array("buffer" in data ? data.buffer : data);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = ~input[i]!;
  }
  return buffer;
}

function decryptBuffer(data: BufferSource) {
  const buffer = new Uint8Array(data.byteLength);
  const input = new Uint8Array("buffer" in data ? data.buffer : data);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = ~input[i]!;
  }
  return buffer;
}

const textEncoder = new TextEncoder();

export async function encryptJson(data: unknown): Promise<ArrayBuffer> {
  return await encryptWithKey(
    textEncoder.encode(JSON.stringify(data)),
    mockKey,
  );
}

const textDecoder = new TextDecoder();

export async function decryptJson(data: ArrayBufferLike): Promise<unknown> {
  return JSON.parse(
    textDecoder.decode(await decryptWithKey(data, mockKey)),
  ) as unknown;
}

export function decrypt(data: ArrayBufferLike): Promise<ArrayBufferLike> {
  return decryptWithKey(data, mockKey);
}

const cryptoMock: Crypto = {
  getRandomValues: <T extends ArrayBufferView | null>(buffer: T) => buffer,

  subtle: {
    decrypt: function (
      _algorithm:
        | AlgorithmIdentifier
        | RsaOaepParams
        | AesCtrParams
        | AesCbcParams
        | AesGcmParams,
      _key: CryptoKey,
      data: BufferSource,
    ): Promise<ArrayBuffer> {
      return Promise.resolve(decryptBuffer(data));
    },
    deriveKey: function (): Promise<CryptoKey> {
      return Promise.resolve(mockKey);
    },
    encrypt: function (
      _algorithm:
        | AlgorithmIdentifier
        | RsaOaepParams
        | AesCtrParams
        | AesCbcParams
        | AesGcmParams,
      _key: CryptoKey,
      data: BufferSource,
    ): Promise<ArrayBuffer> {
      return Promise.resolve(encryptBuffer(data));
    },
    importKey: function (): Promise<CryptoKey> {
      return Promise.resolve({} as CryptoKey);
    },
    deriveBits: function (): Promise<ArrayBuffer> {
      return Promise.reject(notImplemented);
    },
    digest: function (): Promise<ArrayBuffer> {
      return Promise.reject(notImplemented);
    },
    // @ts-expect-error overload
    exportKey: function (): Promise<ArrayBuffer | JsonWebKey> {
      return Promise.reject(notImplemented);
    },
    // @ts-expect-error overload
    generateKey: function (): Promise<CryptoKeyPair | CryptoKey> {
      return Promise.reject(notImplemented);
    },
    sign: function (): Promise<ArrayBuffer> {
      return Promise.reject(notImplemented);
    },
    unwrapKey: function (): Promise<CryptoKey> {
      return Promise.reject(notImplemented);
    },
    verify: function (): Promise<boolean> {
      return Promise.reject(notImplemented);
    },
    wrapKey: function (): Promise<ArrayBuffer> {
      return Promise.reject(notImplemented);
    },
  },
};

vi.stubGlobal("crypto", cryptoMock);

const offlinePasswordChannel = createOfflinePasswordBroadCastChannelEndpoint();

offlinePasswordChannel.onmessage = (ev) => {
  if (GET_EXISTING_PASSWORD === ev.data || GET_PASSWORD === ev.data) {
    offlinePasswordChannel.postMessage(
      createPasswordMessage(";dTW0MgF+2Bm76O^><wP"),
    );
  }
};
