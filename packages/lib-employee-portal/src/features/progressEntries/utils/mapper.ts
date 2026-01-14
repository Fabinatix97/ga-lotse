/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined, isEmpty } from "remeda";

import { mapOptionalValue } from "@eshg/lib-portal";
import {
  ApiCreateManualProgressEntryRequest,
  ApiFileMetaData,
  ApiInboxProgressEntryFileReference,
  ApiManualProgressEntryType,
  ApiPatchManualProgressEntryRequest,
  ApiUpdateFileMetaDataRequest,
} from "@eshg/lib-procedures-api";

import { CreateProgressEntryFormValues } from "../components/sidebars/CreateProgressEntrySidebar";
import { ProgressEntryDetailsValues } from "../components/sidebars/progressEntryDetailsSidebar/ManualProgressEntryDetails";

import { hasFileField, hasKeyDocumentTypeField } from "./helper";

function mapValuesToFile(
  values: CreateProgressEntryFormValues,
): File | undefined {
  if (!hasFileField(values.type) || values.file === null) {
    return undefined;
  }
  return values.file;
}

function mapDescriptionToFileMetaData(
  values: CreateProgressEntryFormValues,
): ApiFileMetaData | undefined {
  return hasFileField(values.type) && !isEmpty(values.documentDescription)
    ? { description: values.documentDescription }
    : undefined;
}

function mapKeyDocumentType(
  values: CreateProgressEntryFormValues,
): string | undefined {
  return hasKeyDocumentTypeField(values.type)
    ? mapOptionalValue(values.keyDocumentType)
    : undefined;
}

function mapFormValuesToCreateManualProgressEntryRequest(
  values: CreateProgressEntryFormValues,
): ApiCreateManualProgressEntryRequest {
  return {
    manualProgressEntryType: values.type as ApiManualProgressEntryType,
    note: mapOptionalValue(values.text),
    keyDocumentType: mapKeyDocumentType(values),
  };
}

export function mapFormValuesToCreateProgressEntryRequest(
  values: CreateProgressEntryFormValues,
): {
  request: ApiCreateManualProgressEntryRequest;
  file: File | undefined;
  fileMetaData: ApiFileMetaData | undefined;
} {
  return {
    request: mapFormValuesToCreateManualProgressEntryRequest(values),
    file: mapValuesToFile(values),
    fileMetaData: mapDescriptionToFileMetaData(values),
  };
}

export function mapToPatchRequest(
  values: ProgressEntryDetailsValues,
  note: string | undefined,
): ApiPatchManualProgressEntryRequest | undefined {
  if (values.text === note || (isEmpty(values.text) && note === undefined))
    return undefined;
  return {
    note: isEmpty(values.text) ? null : values.text,
  };
}

export function mapToUpdateMetaDataRequest(
  values: ProgressEntryDetailsValues,
  fileReference?: ApiInboxProgressEntryFileReference,
): ApiUpdateFileMetaDataRequest | undefined {
  if (!isDefined(fileReference)) return undefined;
  if (fileReference.deleted) return undefined;
  if (fileReference.type === "GenericFileReference") return undefined;
  if (
    !isDefined(fileReference.metaData?.description) &&
    isEmpty(values.documentDescription)
  )
    return undefined;
  if (!isDefined(fileReference.metaData)) {
    const type =
      fileReference.type === "Image"
        ? "ImageMetaData"
        : fileReference.type === "Mail"
          ? "MailMetaData"
          : "PdfMetaData";
    return {
      type,
      description: values.documentDescription,
    } as ApiUpdateFileMetaDataRequest;
  }
  if (fileReference.metaData.description === values.documentDescription)
    return undefined;
  return {
    ...fileReference.metaData,
    description: mapOptionalValue(values.documentDescription),
  } as ApiUpdateFileMetaDataRequest;
}
