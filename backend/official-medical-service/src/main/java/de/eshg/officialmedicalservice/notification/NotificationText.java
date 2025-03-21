/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.notification;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

@Component
public class NotificationText {

  private final DateTimeFormatter appointmentStartFormat =
      DateTimeFormatter.ofPattern("dd.MM.yyyy, HH:mm", Locale.GERMAN);

  @Value("${de.eshg.official-medical-service.notification.template.new_citizen_user.subject}")
  private String newCitizenUserSubject;

  @Value("${de.eshg.official-medical-service.notification.template.new_citizen_user.body}")
  private Resource newCitizenUserBodyTemplate;

  @Value("${de.eshg.official-medical-service.notification.template.new_citizen_procedure.subject}")
  private String newCitizenProcedureSubject;

  @Value("${de.eshg.official-medical-service.notification.template.new_citizen_procedure.body}")
  private Resource newCitizenProcedureBodyTemplate;

  @Value("${de.eshg.official-medical-service.notification.template.new_document.subject}")
  private String newDocumentSubject;

  @Value("${de.eshg.official-medical-service.notification.template.new_document.body}")
  private Resource newDocumentBodyTemplate;

  @Value(
      "${de.eshg.official-medical-service.notification.template.new_appointment_with_booking.subject}")
  private String newAppointmentWithBookingSubject;

  @Value(
      "${de.eshg.official-medical-service.notification.template.new_appointment_with_booking.body}")
  private Resource newAppointmentWithBookingTemplate;

  @Value(
      "${de.eshg.official-medical-service.notification.template.new_appointment_self_booking.subject}")
  private String newAppointmentSelfBookingSubject;

  @Value(
      "${de.eshg.official-medical-service.notification.template.new_appointment_self_booking.body}")
  private Resource newAppointmentSelfBookingTemplate;

  @Value("${de.eshg.official-medical-service.notification.template.cancel_appointment.subject}")
  private String cancelAppointmentSubject;

  @Value("${de.eshg.official-medical-service.notification.template.cancel_appointment.body}")
  private Resource cancelAppointmentTemplate;

  @Value("${de.eshg.official-medical-service.notification.template.rebook_appointment.subject}")
  private String rebookAppointmentSubject;

  @Value("${de.eshg.official-medical-service.notification.template.rebook_appointment.body}")
  private Resource rebookAppointmentTemplate;

  @Value("${de.eshg.official-medical-service.notification.template.close_appointment.subject}")
  private String closeAppointmentSubject;

  @Value("${de.eshg.official-medical-service.notification.template.close_appointment.body}")
  private Resource closeAppointmentTemplate;

  @Value("${de.eshg.official-medical-service.notification.template.book_appointment_cp.subject}")
  private String bookAppointmentCpSubject;

  @Value("${de.eshg.official-medical-service.notification.template.book_appointment_cp.body}")
  private Resource bookAppointmentCpTemplate;

  @Value("${de.eshg.official-medical-service.notification.template.rebook_appointment_cp.subject}")
  private String rebookAppointmentCpSubject;

  @Value("${de.eshg.official-medical-service.notification.template.rebook_appointment_cp.body}")
  private Resource rebookAppointmentCpTemplate;

  @Value("${de.eshg.official-medical-service.notification.template.cancel_appointment_cp.subject}")
  private String cancelAppointmentCpSubject;

  @Value("${de.eshg.official-medical-service.notification.template.cancel_appointment_cp.body}")
  private Resource cancelAppointmentCpTemplate;

  public String getNewCitizenUserSubject() {
    return newCitizenUserSubject;
  }

  public String assembleNewCitizenUserBody(
      String firstName, String lastName, String loginUrl, String accessCode) {

    String templateBody = readTemplateBody(newCitizenUserBodyTemplate);

    return String.format(templateBody, firstName, lastName, loginUrl, loginUrl, accessCode);
  }

  public String getNewCitizenProcedureSubject() {
    return newCitizenProcedureSubject;
  }

  public String assembleNewCitizenProcedureBody(String firstName, String lastName) {
    String templateBody = readTemplateBody(newCitizenProcedureBodyTemplate);
    return String.format(templateBody, firstName, lastName);
  }

  public String getNewDocumentSubject() {
    return newDocumentSubject;
  }

  public String assembleNewDocumentBody(
      String firstName, String lastName, String documentTypeDe, String helpTextDe) {
    String templateBody = readTemplateBody(newDocumentBodyTemplate);
    return String.format(templateBody, firstName, lastName, documentTypeDe, helpTextDe);
  }

  public String getNewAppointmentWithBookingSubject() {
    return newAppointmentWithBookingSubject;
  }

  public String assembleNewAppointmentWithBookingBody(
      String firstName,
      String lastName,
      String appointmentDate,
      String appointmentTime,
      String appointmentDuration) {
    String templateBody = readTemplateBody(newAppointmentWithBookingTemplate);
    return String.format(
        templateBody, firstName, lastName, appointmentDate, appointmentTime, appointmentDuration);
  }

  public String getNewAppointmentSelfBookingSubject() {
    return newAppointmentSelfBookingSubject;
  }

  public String assembleNewAppointmentSelfBookingBody(
      String firstName, String lastName, String appointmentDuration) {
    String templateBody = readTemplateBody(newAppointmentSelfBookingTemplate);
    return String.format(templateBody, firstName, lastName, appointmentDuration);
  }

  public String getCancelAppointmentSubject() {
    return cancelAppointmentSubject;
  }

  public String assembleCancelAppointmentBody(
      String firstName, String lastName, String appointmentDate, String appointmentTime) {
    String templateBody = readTemplateBody(cancelAppointmentTemplate);
    return String.format(templateBody, firstName, lastName, appointmentDate, appointmentTime);
  }

  public String getRebookAppointmentSubject() {
    return rebookAppointmentSubject;
  }

  public String assembleRebookAppointmentBody(
      String firstName,
      String lastName,
      String oldAppointmentDate,
      String oldAppointmentTime,
      String newAppointmentDate,
      String newAppointmentTime) {
    String templateBody = readTemplateBody(rebookAppointmentTemplate);
    return String.format(
        templateBody,
        firstName,
        lastName,
        oldAppointmentDate,
        oldAppointmentTime,
        newAppointmentDate,
        newAppointmentTime);
  }

  public String getCloseAppointmentSubject() {
    return closeAppointmentSubject;
  }

  public String assembleCloseAppointmentBody(String firstName, String lastName) {
    String templateBody = readTemplateBody(closeAppointmentTemplate);
    return String.format(templateBody, firstName, lastName);
  }

  public String getBookAppointmentCpSubject() {
    return bookAppointmentCpSubject;
  }

  public String assembleBookAppointmentCpBody(
      String firstName, String lastName, String appointmentDate, String appointmentTime) {
    String templateBody = readTemplateBody(bookAppointmentCpTemplate);
    return String.format(templateBody, firstName, lastName, appointmentDate, appointmentTime);
  }

  public String getRebookAppointmentCpSubject() {
    return rebookAppointmentCpSubject;
  }

  public String assembleRebookAppointmentCpBody(
      String firstName,
      String lastName,
      String oldAppointmentDate,
      String oldAppointmentTime,
      String newAppointmentDate,
      String newAppointmentTime) {
    String templateBody = readTemplateBody(rebookAppointmentCpTemplate);
    return String.format(
        templateBody,
        firstName,
        lastName,
        oldAppointmentDate,
        oldAppointmentTime,
        newAppointmentDate,
        newAppointmentTime);
  }

  public String getCancelAppointmentCpSubject() {
    return cancelAppointmentCpSubject;
  }

  public String assembleCancelAppointmentCpBody(
      String firstName, String lastName, String appointmentDate, String appointmentTime) {
    String templateBody = readTemplateBody(cancelAppointmentCpTemplate);
    return String.format(templateBody, firstName, lastName, appointmentDate, appointmentTime);
  }

  private static String readTemplateBody(Resource bodyTemplateResource) {
    try (Reader reader =
        new InputStreamReader(bodyTemplateResource.getInputStream(), StandardCharsets.UTF_8)) {
      return FileCopyUtils.copyToString(reader);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }
}
