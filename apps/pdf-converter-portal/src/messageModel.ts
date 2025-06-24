/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export interface PdfToPdfaMessage {
  inputFile: ArrayBuffer;
}

export function isPdfToPdfaMessage(data: unknown): data is PdfToPdfaMessage {
  return (
    !!data &&
    typeof data === "object" &&
    "inputFile" in data &&
    data.inputFile instanceof ArrayBuffer
  );
}

export function createPdfToPdfaMessage(
  inputFile: ArrayBuffer,
): PdfToPdfaMessage {
  return {inputFile};
}

export interface PdfToPdfaResponse {
  output: string;
  outputFile?: Uint8Array;
}

export function createPdfToPdfaResponse(
  output: string,
  outputFile?: Uint8Array,
): PdfToPdfaResponse {
  return {output, outputFile};
}

export function isPdfToPdfaResponse(data: unknown): data is PdfToPdfaResponse {
  return (
    !!data &&
    typeof data === "object" &&
    "output" in data &&
    typeof data.output === "string" &&
    (!("outputFile" in data) ||
      data.outputFile === undefined ||
      data.outputFile instanceof Uint8Array)
  );
}

type ACK = "pdf-to-pdfa-request-ack";

export function createPdfToPdfaAck(): ACK {
  return "pdf-to-pdfa-request-ack";
}

export function isPdfToPdfaAck(data: unknown): data is ACK {
  return data === "pdf-to-pdfa-request-ack";
}
