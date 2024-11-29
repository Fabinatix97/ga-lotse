/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiInboxProgressEntryType,
  ApiManualProgressEntryType,
  ApiProgressEntryClass,
} from "@eshg/employee-portal-api/businessProcedures";
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

import { systemProgressEntryTypeTitles as inspectionSystemProgressEntryTypeTitles } from "@/lib/businessModules/inspection/shared/constants";
import { systemProgressEntryTypeTitles as measlesProtectionSystemProgressEntryTypeTitles } from "@/lib/businessModules/measlesProtection/shared/constants";
import { systemProgressEntryTypeTitles as medicalRegistrySystemProgressEntryTypeTitles } from "@/lib/businessModules/medicalRegistry/shared/constants";
import { systemProgressEntryTypeTitles as schoolEntrySystemProgressEntryTypeTitles } from "@/lib/businessModules/schoolEntry/shared/constants";
import { systemProgressEntryTypeTitles as stiProtectionSystemProgressEntryTypeTitles } from "@/lib/businessModules/stiProtection/shared/constants";
import { systemProgressEntryTypeTitles as travelMedicineSystemProgressEntryTypeTitles } from "@/lib/businessModules/travelMedicine/shared/constants";
import { FileType } from "@/lib/shared/components/formFields/file/FileType";

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
    <PictureAsPdfOutlined color={"primary"} />
  ),
  [ApiManualProgressEntryType.Email]: <EmailOutlined color={"primary"} />,
  [ApiManualProgressEntryType.Image]: <ImageOutlined color={"primary"} />,
  [ApiManualProgressEntryType.Letter]: (
    <DescriptionOutlined color={"primary"} />
  ),
  [ApiManualProgressEntryType.PhoneCall]: <CallOutlined color={"primary"} />,
  [ApiManualProgressEntryType.Note]: <NoteAltOutlined color={"primary"} />,
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

export const systemProgressEntryTypeTitles: Record<string, string> = {
  ...generalSystemProgressEntryTypeTitles,
  ...inspectionSystemProgressEntryTypeTitles,
  ...schoolEntrySystemProgressEntryTypeTitles,
  ...travelMedicineSystemProgressEntryTypeTitles,
  ...measlesProtectionSystemProgressEntryTypeTitles,
  ...stiProtectionSystemProgressEntryTypeTitles,
  ...medicalRegistrySystemProgressEntryTypeTitles,
};

export const inboxProgressEntryTitles = {
  [ApiInboxProgressEntryType.Email]: "Email erhalten",
  [ApiInboxProgressEntryType.Letter]: "Brief erhalten",
  [ApiInboxProgressEntryType.PhoneCall]: "Anruf erhalten",
} satisfies Record<ApiInboxProgressEntryType, string>;

export const keyDocumentTypes: Record<string, string> = {
  INVOICE: "Rechnung",
  REPORT: "Bericht",
};

export const progressEntryClassTitles = {
  [ApiProgressEntryClass.ManualProgressEntry]: "Manueller-Verlaufseintrag",
  [ApiProgressEntryClass.SystemProgressEntry]: "System-Verlaufseintrag",
  [ApiProgressEntryClass.ProcessedInboxProgressEntry]:
    "Posteingangs-Verlaufseintrag",
} satisfies Record<ApiProgressEntryClass, string>;
