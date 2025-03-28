/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { FormControl, FormHelperText } from "@mui/joy";
import assert from "assert";
import { useId } from "react";

import { useAnonymousIdentificationDocumentQuery } from "@/lib/businessModules/stiProtection/api/queries/publicCitizenApi";

import { DownloadDocumentCard } from "./DownloadDocumentCard";

export interface DownloadDocumentCardFieldProps {
  documentTitle: string;
  required: string;
  hint: string;
  downloadLabel: string;
  downloadedLabel: string;
  procedureId?: string;
}
export function DownloadDocumentCardField(
  props: DownloadDocumentCardFieldProps,
) {
  const { input, error, helperText, helpers } = useBaseField<boolean>({
    name: "hasDownloadedDoc",
    hint: props.hint,
    required: props.required,
    validate: (v) => (v === true ? undefined : props.required),
  });
  const hasDownloadedDoc = input.value;
  assert.ok(props.procedureId);
  const document = useAnonymousIdentificationDocumentQuery(props.procedureId);

  async function downloadAnonIdentificationDoc() {
    await document.download();
    await helpers.setValue(true);
  }

  const sectionDescId = useId();
  return (
    <FormControl
      error={error}
      component={"section"}
      aria-describedby={sectionDescId}
    >
      <DownloadDocumentCard
        sectionId={sectionDescId}
        fieldInputProps={input}
        documentTitle={props.documentTitle}
        downloadLabel={props.downloadLabel}
        downloadedLabel={props.downloadedLabel}
        onClick={() => downloadAnonIdentificationDoc()}
        hasDownloadedDoc={hasDownloadedDoc}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}
