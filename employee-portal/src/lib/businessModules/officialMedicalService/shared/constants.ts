/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDocumentStatus,
  ApiMedicalOpinionStatus,
  ApiWaitingStatus,
} from "@eshg/official-medical-service-api";
import { ChipProps } from "@mui/joy";

export const systemProgressEntryTypeTitles: Record<string, string> = {
  UPDATE_AFFECTED_PERSON: "Geänderte Personendaten übernommen",
  SYNC_AFFECTED_PERSON: "Geänderte Personendaten synchronisiert",
  SYNC_FACILITY: "Geänderte Auftraggeberdaten übernommen",
  PROCEDURE_STARTED: "Vorgang gestartet",
  DOCUMENT_DELETED: "Dokument gelöscht",
  DOCUMENT_REVIEWED: "Dokument geprüft",
  APPOINTMENT_FOR_SELF_BOOKING_ADDED: "Selbstbucheroption hinzugefügt",
  APPOINTMENT_ADDED_WITH_BOOKING: "Termin mit Buchung hinzugefügt",
  APPOINTMENT_BOOKED: "Termin gebucht",
  APPOINTMENT_REBOOKED: "Termin geändert",
  APPOINTMENT_CANCELED: "Termin abgesagt",
  APPOINTMENT_OPTION_WITHDRAWN: "Terminoption zurückgezogen",
  APPOINTMENT_CLOSED: "Termin wurde geschlossen",
  DOCUMENT_MISSING_BY_CITIZEN:
    "Dokument hinzugefügt mit Upload durch Bürger:In Option",
  DOCUMENT_MISSING_BY_EMPLOYEE: "Dokument hinzugefügt mit Upload später Option",
  DOCUMENT_ACCEPTED: "Dokument hinzugefügt mit Dateien",
  DOCUMENT_INFORMATION_CHANGED:
    "Dokument bearbeitet mit Änderung Dokumentenart und/oder Hilfstext",
  DOCUMENT_STATUS_CHANGE_ACCEPTED:
    "Dokument von “Fehlt”  nach “Akzeptiert” (Upload durch MA)",
  FACILITY_ADDED: "Auftraggeber hinzugefügt",
  MEDICAL_OPINION_STATUS_CHANGED: "Gutachtenstatus verändert",
  ADDITIONAL_INFO_CHANGED: "Zusatzinfos aktualisiert",
  CONCERN_CHANGED: "Anliegen gesetzt",
  ANAMNESIS_CHANGED: "Anamnese aktualisiert",
};

export const statusColorsDocumentStatus = {
  [ApiDocumentStatus.Accepted]: "success",
  [ApiDocumentStatus.Missing]: "danger",
  [ApiDocumentStatus.Rejected]: "danger",
  [ApiDocumentStatus.Submitted]: "warning",
} satisfies Record<ApiDocumentStatus, ChipProps["color"]>;

export const statusColorsMedicalOpinionStatus = {
  [ApiMedicalOpinionStatus.InProgress]: "neutral",
  [ApiMedicalOpinionStatus.Accomplished]: "success",
} satisfies Record<ApiMedicalOpinionStatus, ChipProps["color"]>;

export const statusColorsWaitingStatus = {
  [ApiWaitingStatus.WaitingForConsultation]: "warning",
  [ApiWaitingStatus.InConsultation]: "primary",
  [ApiWaitingStatus.Done]: "success",
} satisfies Record<ApiWaitingStatus, ChipProps["color"]>;
