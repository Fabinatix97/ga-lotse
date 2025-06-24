/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureType } from "@eshg/medical-registry-api";

export const archivableProcedureTypes = [ApiProcedureType.MedicalRegistryEntry];

export const systemProgressEntryTypeTitles: Record<string, string> = {
  NEW_REGISTRATION: "Neuanmeldung beantragt",
  SECOND_PRACTICE: "Zweitpraxis beantragt",
  RE_REGISTRATION: "Wiederanmeldung beantragt",
  CHANGE_OF_REGISTRATION: "Ummeldung beantragt",
  CHANGE_OF_NAME: "Namensänderung beantragt",
  RELOCATION: "Wegzug beantragt",
  DEREGISTRATION: "Abmeldung beantragt",
  OTHER: "Sonstige Änderungen beantragt",
  DOCUMENT_UPLOAD: "Dokument hochgeladen",
  REQUEST_FOR_WRITTEN_CONFIRMATION: "Meldebestätigung angefordert",
  CHANGE_OF_EMPLOYEES: "Änderung Mitarbeiter:innen beantragt",
};

export const keyDocumentTypes: Record<string, string> = {
  PROFESSIONAL_LICENSE_CERTIFICATE: "Berufserlaubnisurkunde",
  IDENTIFICATION_DOCUMENT: "Ausweis/Pass",
  WORK_PERMIT: "Arbeitserlaubnis",
  OTHER_RELEVANT_DOCUMENTS: "Weitere relevante Dokumente",
};

export const EntryStatus = {
  DraftCitizen: "DRAFT_CITIZEN",
  DraftEmployee: "DRAFT_EMPLOYEE",
  Open: "OPEN",
  Closed: "CLOSED",
} as const;
export type EntryStatus = (typeof EntryStatus)[keyof typeof EntryStatus];

export const entryStatusNames = {
  [EntryStatus.DraftCitizen]: "Externer Entwurf",
  [EntryStatus.DraftEmployee]: "Interner Entwurf",
  [EntryStatus.Open]: "Offen",
  [EntryStatus.Closed]: "Geschlossen",
} satisfies Record<EntryStatus, string>;
