/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure;

import static de.eshg.officialmedicalservice.document.persistence.entity.OmsDocumentStatus.ACCEPTED;

import de.eshg.base.user.api.UserDto;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.officialmedicalservice.appointment.api.BookingInfoDto;
import de.eshg.officialmedicalservice.appointment.api.PostOmsAppointmentRequest;
import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointment;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocument;
import de.eshg.officialmedicalservice.procedure.persistence.entity.MedicalOpinionResult;
import de.eshg.officialmedicalservice.procedure.persistence.entity.MedicalOpinionStatus;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.user.UserClient;
import java.time.Clock;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class ProgressEntryService {

  private final Clock clock;
  private final UserClient userClient;
  private final DateTimeFormatter dateTimeFormatter =
      DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
  private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
  private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

  public ProgressEntryService(Clock clock, UserClient userClient) {
    this.clock = clock;
    this.userClient = userClient;
  }

  public void createProgressEntryForUpdateAffectedPerson(
      OmsProcedure procedure, UUID previousPersonFileStateId) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.UPDATE_AFFECTED_PERSON.name(), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(procedure.getId());
    progressEntry.setPreviousPersonFileStateId(previousPersonFileStateId);
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForSyncAffectedPerson(
      OmsProcedure procedure, UUID previousPersonFileStateId) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.SYNC_AFFECTED_PERSON.name(), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(procedure.getId());
    progressEntry.setPreviousPersonFileStateId(previousPersonFileStateId);
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForSyncFacility(OmsProcedure procedure) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.SYNC_FACILITY.name(), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForAddingSelfBookingAppointment(OmsProcedure procedure) {
    String note = "Ein neuer Termin zum Selbstbuchen wurde hinzugefügt.";
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.APPOINTMENT_FOR_SELF_BOOKING_ADDED.name(),
            note,
            TriggerType.EMPLOYEE);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForAddingAppointmentWithBooking(
      OmsProcedure procedure, PostOmsAppointmentRequest appointment) {

    String note =
        "Ein neuer Termin mit Buchung für den "
            + dateFormatter.format(appointment.bookingInfo().start().atZone(clock.getZone()))
            + " um "
            + timeFormatter.format(appointment.bookingInfo().start().atZone(clock.getZone()))
            + " Uhr wurde hinzugefügt.";
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.APPOINTMENT_ADDED_WITH_BOOKING.name(), note, TriggerType.EMPLOYEE);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForRebookedAppointment(
      OmsProcedure procedure, OmsAppointment oldAppointment, BookingInfoDto bookingInfo) {
    String note =
        "Der Termin vom "
            + dateFormatter.format(oldAppointment.getStart().atZone(clock.getZone()))
            + " um "
            + timeFormatter.format(oldAppointment.getStart().atZone(clock.getZone()))
            + " Uhr wurde auf "
            + dateFormatter.format(bookingInfo.start().atZone(clock.getZone()))
            + " um "
            + timeFormatter.format(bookingInfo.start().atZone(clock.getZone()))
            + " Uhr umgebucht.";
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.APPOINTMENT_REBOOKED.name(), note, TriggerType.EMPLOYEE);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForRebookedAppointmentByCitizen(
      OmsProcedure procedure, Instant oldAppointmentStart, Instant newAppointmentStart) {
    String note =
        "Der Termin vom "
            + dateFormatter.format(oldAppointmentStart.atZone(clock.getZone()))
            + " um "
            + timeFormatter.format(oldAppointmentStart.atZone(clock.getZone()))
            + " Uhr wurde auf den "
            + dateFormatter.format(newAppointmentStart.atZone(clock.getZone()))
            + " um "
            + timeFormatter.format(newAppointmentStart.atZone(clock.getZone()))
            + " Uhr durch Bürger:In umgebucht.";
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.APPOINTMENT_REBOOKED.name(), note, TriggerType.CITIZEN);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForBookingAppointment(
      OmsProcedure procedure, BookingInfoDto bookingInfo) {
    String note =
        "Ein Termin wurde für "
            + dateFormatter.format(bookingInfo.start().atZone(clock.getZone()))
            + " um "
            + timeFormatter.format(bookingInfo.start().atZone(clock.getZone()))
            + " Uhr gebucht.";
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.APPOINTMENT_BOOKED.name(), note, TriggerType.EMPLOYEE);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForBookingAppointmentByCitizen(
      OmsProcedure procedure, Instant appointmentStart, TriggerType triggerType) {
    String note =
        "Ein Termin wurde für den "
            + dateFormatter.format(appointmentStart.atZone(clock.getZone()))
            + " um "
            + timeFormatter.format(appointmentStart.atZone(clock.getZone()))
            + " Uhr durch Bürger:In gebucht.";
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.APPOINTMENT_BOOKED.name(), note, triggerType);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForCancelingAppointment(
      OmsProcedure procedure, OmsAppointment appointment) {
    String note =
        "Der Termin vom "
            + dateFormatter.format(appointment.getStart().atZone(clock.getZone()))
            + " um "
            + timeFormatter.format(appointment.getStart().atZone(clock.getZone()))
            + " Uhr wurde abgesagt.";
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.APPOINTMENT_CANCELED.name(), note, TriggerType.EMPLOYEE);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForCancelingAppointmentByCitizen(
      OmsProcedure procedure, Instant appointmentStart) {
    String note =
        "Der Termin vom "
            + dateFormatter.format(appointmentStart.atZone(clock.getZone()))
            + " um "
            + timeFormatter.format(appointmentStart.atZone(clock.getZone()))
            + " Uhr wurde durch Bürger:In abgesagt.";
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.APPOINTMENT_CANCELED.name(), note, TriggerType.CITIZEN);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForWithdrawingAppointmentOption(OmsProcedure procedure) {
    String note = "Eine Terminoption wurde zurückgezogen.";
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.APPOINTMENT_OPTION_WITHDRAWN.name(), note, TriggerType.EMPLOYEE);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForClosingAppointment(
      OmsProcedure procedure, OmsAppointment omsAppointment) {
    String note =
        "Der Termin vom "
            + dateFormatter.format(omsAppointment.getStart().atZone(clock.getZone()))
            + " um "
            + timeFormatter.format(omsAppointment.getStart().atZone(clock.getZone()))
            + " wurde im Buchungsstatus "
            + omsAppointment.getAppointmentState().getGermanName()
            + " abgeschlossen.";
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.APPOINTMENT_CLOSED.name(), note, TriggerType.EMPLOYEE);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryAddDocumentEmployee(
      OmsProcedure omsProcedure,
      OmsProgressEntryType omsProgressEntryType,
      OmsDocument omsDocument) {

    String action = "";
    if (omsProgressEntryType == OmsProgressEntryType.DOCUMENT_MISSING_BY_CITIZEN) {
      action = "für Upload durch Bürger:In hinzugefügt.";
    } else if (omsProgressEntryType == OmsProgressEntryType.DOCUMENT_MISSING_BY_EMPLOYEE) {
      action = "hinzugefügt.";
    } else if (omsProgressEntryType == OmsProgressEntryType.DOCUMENT_ACCEPTED) {
      action = "hinzugefügt und Dateie(n) hochgeladen.";
    }

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            omsProgressEntryType.name(),
            "Dokument %s %s %s"
                .formatted(
                    omsDocument.getDocumentTypeDe(),
                    !StringUtils.isBlank(omsDocument.getHelpTextDe())
                        ? "- " + omsDocument.getHelpTextDe()
                        : "",
                    action),
            TriggerType.EMPLOYEE);
    omsProcedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryUpdateDocumentInformation(
      OmsProcedure omsProcedure,
      OmsDocument omsDocument,
      String oldDocumentTypeDe,
      String oldHelpTextDe) {

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.DOCUMENT_INFORMATION_CHANGED.name(),
            "Dokument %s %s wurde in %s %s umbenannt."
                .formatted(
                    oldDocumentTypeDe,
                    !StringUtils.isBlank(oldHelpTextDe) ? "- " + oldHelpTextDe : "",
                    omsDocument.getDocumentTypeDe(),
                    !StringUtils.isBlank(omsDocument.getHelpTextDe())
                        ? "- " + omsDocument.getHelpTextDe()
                        : ""),
            TriggerType.EMPLOYEE);
    omsProcedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryCompleteDocumentFileUploadEmployee(
      OmsProcedure omsProcedure, OmsDocument omsDocument) {

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.DOCUMENT_STATUS_CHANGE_ACCEPTED.name(),
            "Für Dokument %s %s wurden Dateien hinzugefügt."
                .formatted(
                    omsDocument.getDocumentTypeDe(),
                    !StringUtils.isBlank(omsDocument.getHelpTextDe())
                        ? "- " + omsDocument.getHelpTextDe()
                        : ""),
            TriggerType.EMPLOYEE);
    omsProcedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForDocumentDeletion(OmsProcedure procedure, OmsDocument document) {
    String changeDescription =
        new StringBuilder()
            .append("Dokument ")
            .append(assembleDocumentDescription(document))
            .append(" gelöscht.")
            .toString();

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.DOCUMENT_DELETED.name(),
            changeDescription,
            TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForReviewDocument(OmsProcedure procedure, OmsDocument document) {
    String changeDescription =
        "Das Dokument "
            + assembleDocumentDescription(document)
            + " wurde "
            + (document.getDocumentStatus() == ACCEPTED ? "akzeptiert." : "abgelehnt.");

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.DOCUMENT_REVIEWED.name(), changeDescription, TriggerType.EMPLOYEE);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  private String assembleDocumentDescription(OmsDocument document) {
    StringBuilder documentDescription = new StringBuilder();
    documentDescription.append(document.getDocumentTypeDe());
    String helpTextDe = document.getHelpTextDe();
    if (helpTextDe != null && !helpTextDe.isEmpty())
      documentDescription.append(" - ").append(helpTextDe);
    return documentDescription.toString();
  }

  public void createProgressEntryForFacilityAdded(OmsProcedure procedure, String facilityName) {
    String changeDescription =
        new StringBuilder()
            .append("Die Einrichtung ")
            .append(facilityName)
            .append(" wurde als Auftraggeber eingetragen.")
            .toString();

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.FACILITY_ADDED.name(),
            changeDescription,
            TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForMedicalOpinionStatusChanged(
      OmsProcedure procedure,
      MedicalOpinionStatus oldStatus,
      MedicalOpinionStatus newStatus,
      MedicalOpinionResult result) {
    StringBuilder sb =
        new StringBuilder()
            .append("Der Gutachtenstatus wurde von ")
            .append(oldStatus.getGermanName())
            .append(" auf ")
            .append(newStatus.getGermanName())
            .append(" gesetzt.");

    if (result != null && result != MedicalOpinionResult.UNKNOWN) {
      sb.append(" Das Ergebnis ist: ").append(result.getGermanName());
    }

    String changeDescription = sb.toString();

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.MEDICAL_OPINION_STATUS_CHANGED.name(),
            changeDescription,
            TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForAdditionalInfoChanged(OmsProcedure procedure) {
    String concernNameDe = procedure.getConcern().getNameDe();
    String cutOffDate =
        procedure.getMedicalOpinionCutOffDate() != null
            ? procedure.getMedicalOpinionCutOffDate().format(dateFormatter)
            : "-";
    UUID physicianId = procedure.getPhysicianId();
    UserDto newPhysician = null;
    if (physicianId != null) {
      newPhysician = userClient.validateUser(physicianId, userClient.getTechnicalGroupPhysicians());
    }
    String physician =
        newPhysician != null ? newPhysician.firstName() + " " + newPhysician.lastName() : "-";
    String mailNotification = procedure.isSendEmailNotifications() ? "Aktiviert" : "Deaktiviert";
    String changeDescription =
        "Zusatzinfos wurden aktualisiert."
            + "\nAnliegen: "
            + concernNameDe
            + "\nStichtag: "
            + cutOffDate
            + "\nZugewiesene(r) Ärztin / Arzt: "
            + physician
            + "\nE-Mail-Benachrichtigung: "
            + mailNotification;

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.ADDITIONAL_INFO_CHANGED.name(),
            changeDescription,
            TriggerType.EMPLOYEE);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForConcernChanged(OmsProcedure procedure, String concernNameDe) {
    String changeDescription =
        new StringBuilder()
            .append("Das Anliegen wurde auf ")
            .append(concernNameDe)
            .append(" gesetzt.")
            .toString();

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.CONCERN_CHANGED.name(),
            changeDescription,
            TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForAnamnesisChangedByEmployee(OmsProcedure procedure) {
    String note = "Die Inhalte der Anamnese wurden geändert.";
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.ANAMNESIS_CHANGED_BY_EMPLOYEE.name(), note, TriggerType.EMPLOYEE);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForAnamnesisChangedByCitizen(OmsProcedure procedure) {
    String note = "Die Inhalte der Anamnese wurden geändert.";
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.ANAMNESIS_CHANGED_BY_CITIZEN.name(), note, TriggerType.CITIZEN);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }
}
