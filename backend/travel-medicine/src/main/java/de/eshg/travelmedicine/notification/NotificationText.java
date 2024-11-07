/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.notification;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneId;
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

  @Value("${de.eshg.travel-medicine.notification.template.new_citizen_procedure.subject}")
  private String newCitizenProcedureSubject;

  @Value("${de.eshg.travel-medicine.notification.template.new_citizen_procedure.body}")
  private Resource newCitizenProcedureBodyTemplate;

  @Value("${de.eshg.travel-medicine.notification.template.booking_by_citizen.subject}")
  private String bookingByCitizenSubject;

  @Value("${de.eshg.travel-medicine.notification.template.booking_by_citizen.body}")
  private Resource bookingByCitizenBodyTemplate;

  @Value("${de.eshg.travel-medicine.notification.template.booking_by_employee.subject}")
  private String bookingByEmployeeSubject;

  @Value("${de.eshg.travel-medicine.notification.template.booking_by_employee.body}")
  private Resource bookingByEmployeeBodyTemplate;

  @Value("${de.eshg.travel-medicine.notification.template.cancellation_by_citizen.subject}")
  private String cancellationByCitizenSubject;

  @Value("${de.eshg.travel-medicine.notification.template.cancellation_by_citizen.body}")
  private Resource cancellationByCitizenBodyTemplate;

  @Value("${de.eshg.travel-medicine.notification.template.cancellation_by_employee.subject}")
  private String cancellationByEmployeeSubject;

  @Value("${de.eshg.travel-medicine.notification.template.cancellation_by_employee.body}")
  private Resource cancellationByEmployeeBodyTemplate;

  @Value("${de.eshg.travel-medicine.notification.template.rebooking_by_citizen.subject}")
  private String rebookingByCitizenSubject;

  @Value("${de.eshg.travel-medicine.notification.template.rebooking_by_citizen.body}")
  private Resource rebookingByCitizenBodyTemplate;

  @Value("${de.eshg.travel-medicine.notification.template.rebooking_by_employee.subject}")
  private String rebookingByEmployeeSubject;

  @Value("${de.eshg.travel-medicine.notification.template.rebooking_by_employee.body}")
  private Resource rebookingByEmployeeBodyTemplate;

  @Value("${de.eshg.travel-medicine.notification.template.new_information_statement.subject}")
  private String newInformationStatementSubject;

  @Value("${de.eshg.travel-medicine.notification.template.new_information_statement.body}")
  private Resource newInformationStatementBodyTemplate;

  @Value("${de.eshg.travel-medicine.notification.template.new_follow_up_appointment.subject}")
  private String newFollowUpAppointmentSubject;

  @Value("${de.eshg.travel-medicine.notification.template.new_follow_up_appointment.body}")
  private Resource newFollowUpAppointmentBodyTemplate;

  private String formatAppointmentStart(Instant appointmentStart) {
    return appointmentStartFormat.format(appointmentStart.atZone(ZoneId.of("Europe/Berlin")));
  }

  public String getNewCitizenProcedureSubject() {
    return newCitizenProcedureSubject;
  }

  public String getNewCitizenProcedureBody(
      String firstName,
      String lastName,
      Instant appointmentStart,
      String loginUrl,
      String accessCode,
      String greeting) {

    String templateBody = readTemplateBody(newCitizenProcedureBodyTemplate);

    return java.lang.String.format(
        templateBody,
        firstName,
        lastName,
        formatAppointmentStart(appointmentStart),
        loginUrl,
        accessCode,
        greeting);
  }

  public String getBookingByCitizenSubject() {
    return bookingByCitizenSubject;
  }

  public String getBookingByCitizenBody(
      String firstName, String lastName, Instant appointmentStart, String greeting) {

    String templateBody = readTemplateBody(bookingByCitizenBodyTemplate);
    return java.lang.String.format(
        templateBody, firstName, lastName, formatAppointmentStart(appointmentStart), greeting);
  }

  public String getBookingByEmployeeSubject() {
    return bookingByEmployeeSubject;
  }

  public String getBookingByEmployeeBody(
      String firstName, String lastName, Instant appointmentStart, String greeting) {

    String templateBody = readTemplateBody(bookingByEmployeeBodyTemplate);
    return java.lang.String.format(
        templateBody, firstName, lastName, formatAppointmentStart(appointmentStart), greeting);
  }

  public String getCancellationByCitizenSubject() {
    return cancellationByCitizenSubject;
  }

  public String getCancellationByCitizenBody(
      String firstName, String lastName, Instant appointmentStart, String greeting) {

    String templateBody = readTemplateBody(cancellationByCitizenBodyTemplate);
    return java.lang.String.format(
        templateBody, firstName, lastName, formatAppointmentStart(appointmentStart), greeting);
  }

  public String getCancellationByEmployeeSubject() {
    return cancellationByEmployeeSubject;
  }

  public String getCancellationByEmployeeBody(
      String firstName, String lastName, Instant appointmentStart, String greeting) {

    String templateBody = readTemplateBody(cancellationByEmployeeBodyTemplate);
    return java.lang.String.format(
        templateBody, firstName, lastName, formatAppointmentStart(appointmentStart), greeting);
  }

  public String getRebookingByCitizenSubject() {
    return rebookingByCitizenSubject;
  }

  public String getRebookingByCitizenBody(
      String firstName,
      String lastName,
      Instant previousAppointmentStart,
      Instant newAppointmentStart,
      String greeting) {

    String templateBody = readTemplateBody(rebookingByCitizenBodyTemplate);
    return java.lang.String.format(
        templateBody,
        firstName,
        lastName,
        formatAppointmentStart(previousAppointmentStart),
        formatAppointmentStart(newAppointmentStart),
        greeting);
  }

  public String getRebookingByEmployeeSubject() {
    return rebookingByEmployeeSubject;
  }

  public String getRebookingByEmployeeBody(
      String firstName,
      String lastName,
      Instant previousAppointmentStart,
      Instant newAppointmentStart,
      String greeting) {

    String templateBody = readTemplateBody(rebookingByEmployeeBodyTemplate);
    return java.lang.String.format(
        templateBody,
        firstName,
        lastName,
        formatAppointmentStart(previousAppointmentStart),
        formatAppointmentStart(newAppointmentStart),
        greeting);
  }

  public String getNewInformationStatementSubject() {
    return newInformationStatementSubject;
  }

  public String getNewInformationStatementBody(String firstName, String lastName, String greeting) {

    String templateBody = readTemplateBody(newInformationStatementBodyTemplate);
    return java.lang.String.format(templateBody, firstName, lastName, greeting);
  }

  public String getNewFollowUpAppointmentSubject() {
    return newFollowUpAppointmentSubject;
  }

  public String getNewFollowUpAppointmentBody(String firstName, String lastName, String greeting) {

    String templateBody = readTemplateBody(newFollowUpAppointmentBodyTemplate);
    return java.lang.String.format(templateBody, firstName, lastName, greeting);
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
