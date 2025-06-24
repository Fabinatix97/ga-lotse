/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  createPdfToPdfaMessage,
  isPdfToPdfaResponse,
} from "@/messageModel";
import {downloadFile} from "@/downloadLink";
import {
  setError, setIdle,
  setProgressSpinner,
} from "@/setState";

export async function convertAndDownload(files?: FileList) {
  if (!files?.length) {
    // eslint-disable-next-line no-console
    console.error("No files selected");
    return;
  }
  if (files.length > 1) {
    // eslint-disable-next-line no-console
    console.warn("Multiple files selected, only the first will be converted: ");
  }

  setProgressSpinner();

  try {
    const pdfFile = files[0]!;
    const pdf = await pdfFile.arrayBuffer()

    const pdfa = await pdfToPdfa(pdf);
    const pdfaFile = new File([pdfa], pdfFile.name, {
      type: 'application/pdf',
      lastModified: Date.now()
    });
    downloadFile(pdfaFile);
    setIdle();
  } catch {
    setError();
  }

}

async function pdfToPdfa(pdf: ArrayBuffer): Promise<Uint8Array> {
  const worker = new Worker(
    new URL("./pdfToPdfa.worker", import.meta.url),
    {type: "module"},
  );
  const channel = new MessageChannel();
  return new Promise<Uint8Array>((resolve, reject) => {
    channel.port1.onmessage = (event: MessageEvent<unknown>) => {
      if (!isPdfToPdfaResponse(event.data)) {
        throw new Error(
          "Message event data is not a PdfToPdfaResponse: " +
          JSON.stringify(event.data),
        );
      }
      const pdfa = event.data.outputFile;
      if (!pdfa) {
        reject(new Error(`Failed to convert to PDFA: ${event.data.output}`));
      } else {
        resolve(pdfa);
      }
      setTimeout(() => worker.terminate(), 0);
    };
    const message = createPdfToPdfaMessage(pdf);
    worker.postMessage(message, [channel.port2, pdf]);
  });
}
