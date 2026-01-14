/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { fromBER } from "asn1js";
import { Certificate } from "pkijs";

export function getCommonName(pem: string): string | undefined {
  const b64Certs = pem
    .split("-----END CERTIFICATE-----")
    .map((s) =>
      s.replace("-----BEGIN CERTIFICATE-----", "").replace(/\s+/g, ""),
    )
    .filter((s) => s.length > 0);

  if (b64Certs.length === 0) {
    // eslint-disable-next-line no-console
    console.error("No certificates found in PEM");
    return undefined;
  }

  const rawCert = base64StringToArrayBuffer(b64Certs[0]!);

  const asn1 = fromBER(rawCert);
  const cert = new Certificate({ schema: asn1.result });

  const CN = "2.5.4.3";
  return cert.subject.typesAndValues.find((attr) => attr.type === CN)?.value
    .valueBlock.value;
}

function base64StringToArrayBuffer(b64str: string): ArrayBuffer {
  return Uint8Array.from(atob(b64str), (m) => m.codePointAt(0)!).buffer;
}
