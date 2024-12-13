/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import static de.eshg.travelmedicine.util.TravelMedicineProgressEntryType.ADD_INFORMATION_STATEMENT;
import static de.eshg.travelmedicine.util.TravelMedicineProgressEntryType.ANSWER_INFORMATION_STATEMENT;
import static de.eshg.travelmedicine.util.TravelMedicineProgressEntryType.ANSWER_MEDICAL_HISTORY;
import static de.eshg.travelmedicine.util.TravelMedicineProgressEntryType.CANCEL_APPOINTMENT;
import static de.eshg.travelmedicine.util.TravelMedicineProgressEntryType.FOLLOWUP_APPOINTMENT;
import static de.eshg.travelmedicine.util.TravelMedicineProgressEntryType.NEW_APPOINTMENT;
import static de.eshg.travelmedicine.util.TravelMedicineProgressEntryType.REBOOK_APPOINTMENT;
import static de.eshg.travelmedicine.util.TravelMedicineProgressEntryType.REMOVE_INFORMATION_STATEMENT;
import static de.eshg.travelmedicine.util.TravelMedicineProgressEntryType.RESET_INFORMATION_STATEMENT;

import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.CreatedByUserType;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import java.time.Clock;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import org.springframework.stereotype.Service;

@Service
public class ProgressEntryService {

  private final Clock clock;
  private final UserApi userApi;
  private final DateTimeFormatter dateTimeFormatter =
      DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
  private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");

  public ProgressEntryService(Clock clock, UserApi userApi) {
    this.clock = clock;
    this.userApi = userApi;
  }

  public void createProgressEntryForNewAppointment(
      VaccinationConsultation vaccinationConsultation,
      AppointmentTypeDto appointmentTypeDto,
      Instant appointment) {
    String date = appointment.atZone(clock.getZone()).format(dateTimeFormatter);
    String note =
        "Ein neuer "
            + (appointmentTypeDto == AppointmentTypeDto.CONSULTATION
                ? "Beratungstermin"
                : "Impftermin")
            + " für %s Uhr wurde hinzugefügt.";

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            NEW_APPOINTMENT.name(), note.formatted(date), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    vaccinationConsultation.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForFollowUpAppointment(
      VaccinationConsultation vaccinationConsultation,
      ProcedureStep procedureStep,
      boolean sendMailSuccessfully) {

    boolean selfBooking =
        procedureStep.getAppointment() == null && procedureStep.getUserDefinedAppointment() == null;

    String note =
        selfBooking
            ? "Ein neuer Folgetermin zur Buchung ab %s wurde hinzugefügt."
            : "Ein neuer Folgetermin für %s Uhr wurde hinzugefügt.";

    if (vaccinationConsultation.getCreatedBy() == CreatedByUserType.CITIZEN_PORTAL) {
      note +=
          sendMailSuccessfully
              ? " Eine E-Mail Benachrichtigung wurde versendet."
              : " Die E-Mail Benachrichtigung konnte nicht versendet werden.";
    }
    String date;
    if (selfBooking && procedureStep.getEarliestDate() != null) {
      date = procedureStep.getEarliestDate().format(dateFormatter);
    } else {
      Instant appointment =
          procedureStep.getAppointment() == null
              ? procedureStep.getUserDefinedAppointment().getAppointmentStart()
              : procedureStep.getAppointment().getAppointmentStart();
      date = appointment.atZone(clock.getZone()).format(dateTimeFormatter);
    }
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            FOLLOWUP_APPOINTMENT.name(), note.formatted(date), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    vaccinationConsultation.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForAppointmentRebookingByCitizen(
      VaccinationConsultation vaccinationConsultation,
      AppointmentType appointmentType,
      Instant previousAppointmentStart,
      Instant newAppointmentStart,
      boolean sendMailSuccessfully) {
    String note =
        "Der "
            + (appointmentType == AppointmentType.CONSULTATION ? "Beratungstermin" : "Impftermin")
            + " am %s Uhr wurde seitens Bürger:In auf den %s Uhr umgebucht.";

    if (vaccinationConsultation.getCreatedBy() == CreatedByUserType.CITIZEN_PORTAL) {
      note +=
          sendMailSuccessfully
              ? " Eine Bestätigung per E-Mail wurde versendet."
              : " Eine Bestätigung per E-Mail konnte nicht versendet werden.";
    }
    String previousDate =
        previousAppointmentStart.atZone(clock.getZone()).format(dateTimeFormatter);
    String newDate = newAppointmentStart.atZone(clock.getZone()).format(dateTimeFormatter);
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            REBOOK_APPOINTMENT.name(),
            note.formatted(previousDate, newDate),
            TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    vaccinationConsultation.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForAppointmentRebookingByEmployee(
      VaccinationConsultation vaccinationConsultation,
      AppointmentType appointmentType,
      Instant previousAppointmentStart,
      Instant newAppointmentStart,
      boolean sendMailSuccessfully) {
    String note =
        "Der "
            + (appointmentType == AppointmentType.CONSULTATION ? "Beratungstermin" : "Impftermin")
            + " am %s Uhr wurde von %s auf den %s Uhr umgebucht.";

    if (vaccinationConsultation.getCreatedBy() == CreatedByUserType.CITIZEN_PORTAL) {
      note +=
          sendMailSuccessfully
              ? " Eine Bestätigung per E-Mail wurde versendet."
              : " Eine Bestätigung per E-Mail konnte nicht versendet werden.";
    }
    String previousDate =
        previousAppointmentStart.atZone(clock.getZone()).format(dateTimeFormatter);
    String newDate = newAppointmentStart.atZone(clock.getZone()).format(dateTimeFormatter);
    UserDto employeeUser = userApi.getSelfUser();
    String fullName = employeeUser.firstName() + " " + employeeUser.lastName();
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            REBOOK_APPOINTMENT.name(),
            note.formatted(previousDate, fullName, newDate),
            TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    vaccinationConsultation.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForAppointmentBookingByCitizen(
      VaccinationConsultation vaccinationConsultation,
      AppointmentType appointmentType,
      Instant appointment,
      boolean sendMailSuccessfully) {
    String note =
        "Der "
            + (appointmentType == AppointmentType.CONSULTATION ? "Beratungstermin" : "Impftermin")
            + " am %s Uhr wurde seitens Bürger:In gebucht.";

    if (vaccinationConsultation.getCreatedBy() == CreatedByUserType.CITIZEN_PORTAL) {
      note +=
          sendMailSuccessfully
              ? " Eine Bestätigung per E-Mail wurde versendet."
              : " Eine Bestätigung per E-Mail konnte nicht versendet werden.";
    }
    String date = appointment.atZone(clock.getZone()).format(dateTimeFormatter);
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            FOLLOWUP_APPOINTMENT.name(), note.formatted(date), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    vaccinationConsultation.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForCancelAppointmentByCitizen(
      VaccinationConsultation vaccinationConsultation,
      AppointmentType appointmentType,
      Instant appointment,
      boolean sendMailSuccessfully) {
    String note =
        "Der "
            + (appointmentType == AppointmentType.CONSULTATION ? "Beratungstermin" : "Impftermin")
            + " am %s Uhr wurde seitens Bürger:In abgesagt.";

    if (vaccinationConsultation.getCreatedBy() == CreatedByUserType.CITIZEN_PORTAL) {
      note +=
          sendMailSuccessfully
              ? " Eine Bestätigung per E-Mail wurde versendet."
              : " Eine Bestätigung per E-Mail konnte nicht versendet werden.";
    }
    String date = appointment.atZone(clock.getZone()).format(dateTimeFormatter);
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            CANCEL_APPOINTMENT.name(), note.formatted(date), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    vaccinationConsultation.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForCancelAppointmentByEmployee(
      VaccinationConsultation vaccinationConsultation,
      AppointmentType appointmentType,
      Instant appointment,
      boolean sendMailSuccessfully) {
    String note =
        "Der "
            + (appointmentType == AppointmentType.CONSULTATION ? "Beratungstermin" : "Impftermin")
            + " am %s Uhr wurde von %s abgesagt.";

    if (vaccinationConsultation.getCreatedBy() == CreatedByUserType.CITIZEN_PORTAL) {
      note +=
          sendMailSuccessfully
              ? " Eine E-Mail Benachrichtigung wurde versendet."
              : " Die E-Mail Benachrichtigung konnte nicht versendet werden.";
    }
    String date = appointment.atZone(clock.getZone()).format(dateTimeFormatter);
    UserDto employeeUser = userApi.getSelfUser();
    String fullName = employeeUser.firstName() + " " + employeeUser.lastName();
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            CANCEL_APPOINTMENT.name(),
            note.formatted(date, fullName),
            TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    vaccinationConsultation.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForAnswerMedicalHistoryByEmployee(
      VaccinationConsultation vaccinationConsultation,
      ProcedureStep procedureStep,
      boolean completelyAnswered) {
    boolean selfBooking =
        procedureStep.getAppointment() == null && procedureStep.getUserDefinedAppointment() == null;

    String note =
        "Die Anamnese für den Termin"
            + (selfBooking ? " zur Buchung ab %s" : " am %s Uhr")
            + " wurde von %s"
            + (completelyAnswered ? " vollständig" : " teilweise")
            + " ausgefüllt.";

    String date;
    if (selfBooking && procedureStep.getEarliestDate() != null) {
      date = procedureStep.getEarliestDate().format(dateFormatter);
    } else {
      Instant appointment =
          procedureStep.getAppointment() == null
              ? procedureStep.getUserDefinedAppointment().getAppointmentStart()
              : procedureStep.getAppointment().getAppointmentStart();
      date = appointment.atZone(clock.getZone()).format(dateTimeFormatter);
    }
    UserDto employeeUser = userApi.getSelfUser();
    String fullName = employeeUser.firstName() + " " + employeeUser.lastName();
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            ANSWER_MEDICAL_HISTORY.name(),
            note.formatted(date, fullName),
            TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    vaccinationConsultation.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForAnswerMedicalHistoryByCitizen(
      VaccinationConsultation vaccinationConsultation,
      ProcedureStep procedureStep,
      boolean completelyAnswered) {
    boolean selfBooking =
        procedureStep.getAppointment() == null && procedureStep.getUserDefinedAppointment() == null;

    String note =
        "Die Anamnese für den Termin"
            + (selfBooking ? " zur Buchung ab %s" : " am %s Uhr")
            + " wurde seitens Bürger:In"
            + (completelyAnswered ? " vollständig" : " teilweise")
            + " ausgefüllt.";

    String date;
    if (selfBooking && procedureStep.getEarliestDate() != null) {
      date = procedureStep.getEarliestDate().format(dateFormatter);
    } else {
      Instant appointment =
          procedureStep.getAppointment() == null
              ? procedureStep.getUserDefinedAppointment().getAppointmentStart()
              : procedureStep.getAppointment().getAppointmentStart();
      date = appointment.atZone(clock.getZone()).format(dateTimeFormatter);
    }
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            ANSWER_MEDICAL_HISTORY.name(), note.formatted(date), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    vaccinationConsultation.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForAnswerInformationStatementByCitizen(
      VaccinationConsultation vaccinationConsultation, String title) {

    String note = "Der Aufklärungsbogen %s wurde seitens Bürger:In ausgefüllt.";

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            ANSWER_INFORMATION_STATEMENT.name(),
            note.formatted(title),
            TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    vaccinationConsultation.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForAddInformationStatement(
      VaccinationConsultation vaccinationConsultation, String title) {

    String note = "Der Aufklärungsbogen %s wurde von %s zum Vorgang hinzugefügt.";

    UserDto employeeUser = userApi.getSelfUser();
    String fullName = employeeUser.firstName() + " " + employeeUser.lastName();
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            ADD_INFORMATION_STATEMENT.name(),
            note.formatted(title, fullName),
            TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    vaccinationConsultation.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForRemoveInformationStatement(
      VaccinationConsultation vaccinationConsultation, String title) {

    String note = "Der Aufklärungsbogen %s wurde von %s aus dem Vorgang entfernt.";

    UserDto employeeUser = userApi.getSelfUser();
    String fullName = employeeUser.firstName() + " " + employeeUser.lastName();
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            REMOVE_INFORMATION_STATEMENT.name(),
            note.formatted(title, fullName),
            TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    vaccinationConsultation.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForResetInformationStatement(
      VaccinationConsultation vaccinationConsultation, String title) {

    String note = "Der Aufklärungsbogen %s wurde von %s zurückgesetzt.";

    UserDto employeeUser = userApi.getSelfUser();
    String fullName = employeeUser.firstName() + " " + employeeUser.lastName();
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            RESET_INFORMATION_STATEMENT.name(),
            note.formatted(title, fullName),
            TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    vaccinationConsultation.addProgressEntry(progressEntry);
  }
}
