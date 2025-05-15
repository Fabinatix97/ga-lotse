/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CallOutlined,
  DescriptionOutlined,
  EmailOutlined,
  ImageOutlined,
  NoteAltOutlined,
  PictureAsPdfOutlined,
  UploadOutlined,
} from "@mui/icons-material";
import { ReactNode } from "react";

import { FileType } from "@eshg/lib-portal/components/formFields/file/types";
import {
  ApiInboxProgressEntryType,
  ApiManualProgressEntryType,
} from "@eshg/lib-procedures-api";

export const manualProgressEntryTypeNames = {
  [ApiManualProgressEntryType.Document]: "Dokument",
  [ApiManualProgressEntryType.Email]: "E-Mail",
  [ApiManualProgressEntryType.Image]: "Bild",
  [ApiManualProgressEntryType.Letter]: "Brief",
  [ApiManualProgressEntryType.PhoneCall]: "Anruf",
  [ApiManualProgressEntryType.Note]: "Bemerkung",
} satisfies Record<ApiManualProgressEntryType, string>;

export const manualProgressEntryTitles = {
  [ApiManualProgressEntryType.Document]: "Dokument hochgeladen",
  [ApiManualProgressEntryType.Email]: "E-Mail hochgeladen",
  [ApiManualProgressEntryType.Image]: "Bild hochgeladen",
  [ApiManualProgressEntryType.Letter]: "Brief hochgeladen",
  [ApiManualProgressEntryType.PhoneCall]: "Anruf erhalten",
  [ApiManualProgressEntryType.Note]: "Bemerkung verfasst",
} satisfies Record<ApiManualProgressEntryType, string>;

export const manualProgressEntryIndicators = {
  [ApiManualProgressEntryType.Document]: (
    <PictureAsPdfOutlined color="primary" />
  ),
  [ApiManualProgressEntryType.Email]: <EmailOutlined color="primary" />,
  [ApiManualProgressEntryType.Image]: <ImageOutlined color="primary" />,
  [ApiManualProgressEntryType.Letter]: <DescriptionOutlined color="primary" />,
  [ApiManualProgressEntryType.PhoneCall]: <CallOutlined color="primary" />,
  [ApiManualProgressEntryType.Note]: <NoteAltOutlined color="primary" />,
} satisfies Record<ApiManualProgressEntryType, ReactNode>;

export const systemProgressEntryIndicators: Record<string, ReactNode> = {
  DOCUMENT_UPLOAD: <UploadOutlined />,
};

export const manualProgressEntryFileTypes = {
  [ApiManualProgressEntryType.Document]: [FileType.Pdf],
  [ApiManualProgressEntryType.Email]: [FileType.Eml],
  [ApiManualProgressEntryType.Image]: [FileType.Jpeg, FileType.Png],
  [ApiManualProgressEntryType.Letter]: [FileType.Pdf],
  [ApiManualProgressEntryType.PhoneCall]: [],
  [ApiManualProgressEntryType.Note]: [],
} satisfies Record<ApiManualProgressEntryType, FileType[]>;

export const generalSystemProgressEntryTypeTitles: Record<string, string> = {
  CREATED: "Vorgang erstellt",
  CLOSED: "Vorgang geschlossen",
  CREATED_FROM_INBOX_PROCEDURE: "Vorgang erstellt aus Posteingang",
  REOPENED: "Vorgang neu geöffnet",
  PROCEDURE_MODIFIED: "Vorgang bearbeitet",
  PROCEDURE_TYPE_MODIFIED: "Vorgangstyp bearbeitet",
};

export const inboxProgressEntryTitles = {
  [ApiInboxProgressEntryType.Email]: "Email erhalten",
  [ApiInboxProgressEntryType.Letter]: "Brief erhalten",
  [ApiInboxProgressEntryType.PhoneCall]: "Anruf erhalten",
} satisfies Record<ApiInboxProgressEntryType, string>;
