/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import createModule, {MainModule} from "@eshg/lib-gs-wasm/gs";
import {
  PdfToPdfaResponse,
  createPdfToPdfaResponse,
  isPdfToPdfaMessage,
} from "@/messageModel";

async function convertPdfWithGs(
  inputFile: ArrayBuffer,
  sendResponse: (response: PdfToPdfaResponse) => void,
) {
  let output = "";
  let error = false;

  await createModule({
    preRun: ({FS}: MainModule) => {
      FS.writeFile("input.pdf", new Uint8Array(inputFile));
    },
    postRun: ({FS}: MainModule) => {
      let outputFile: Uint8Array | undefined = undefined;
      if (!error) {
        try {
          outputFile = FS.readFile("output.pdf", {
            encoding: "binary",
          }) as Uint8Array;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("Failed to read output file of gs", e);
        }
      }
      sendResponse(createPdfToPdfaResponse(output, outputFile));
    },
    arguments: [
      "-sDEVICE=pdfwrite",
      "-DNOPAUSE",
      "-dBATCH",
      "-dPDFA",
      "-dPDFACompatibilityPolicy=1",
      "-sColorConversionStrategy=UseDeviceIndependentColor",
      "-sOutputFile=output.pdf",
      "input.pdf",
    ],
    print: (text: string) => {
      // eslint-disable-next-line no-console
      console.log(text);
      output += `${text}\n`;
    },
    printErr: (text: string) => {
      // eslint-disable-next-line no-console
      console.error(text);
      output += `${text}\n`;
    },
    onAbort: () => {
      // eslint-disable-next-line no-console
      console.error("gs aborted");
      output += "gs aborted\n";
      error = true;
    },
    onExit: function (code: number) {
      if (code !== 0) {
        // eslint-disable-next-line no-console
        console.error('gs exited with code:', code);
        output += `gs exited with code ${code}
`;
        error = true;
      }
    }
  });
}

function handleMessage(event: MessageEvent<unknown>) {
  if (!event.ports[0]) {
    throw new Error("Missing MessagePort");
  }
  const port = event.ports[0];
  if (!isPdfToPdfaMessage(event.data)) {
    throw new Error(
      "Message event data is not a PdfToPdfaMessage: " +
      JSON.stringify(event.data),
    );
  }

  function sendResponse(response: PdfToPdfaResponse) {
    const transfer: ArrayBufferLike[] = [];
    if (response.outputFile) {
      transfer.push(response.outputFile.buffer);
    }
    port.postMessage(response, transfer);
  }

  void convertPdfWithGs(event.data.inputFile, sendResponse);
}

self.addEventListener("message", handleMessage);
