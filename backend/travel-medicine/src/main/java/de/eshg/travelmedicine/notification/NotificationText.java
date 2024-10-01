/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.notification;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class NotificationText {
  private static final DateTimeFormatter APPOINTMENT_START_FORMAT =
      DateTimeFormatter.ofPattern("dd.MM.yyyy, HH:mm", Locale.GERMAN);

  private static final String NEW_CITIZEN_PROCEDURE_SUBJECT = "Deine Terminbuchung bei uns!";
  private static final String NEW_CITIZEN_PROCEDURE_BODY =
      """
      Sehr geehrte(r) %s %s,

    wir möchten Ihnen mitteilen, dass Ihre Terminbuchung für den %s Uhr erfolgreich eingegangen ist. Bitte bewahren Sie diese Email als Bestätigung Ihrer Buchung auf.
    Für den Fall, dass Sie Ihren Termin ändern oder stornieren möchten, bitten wir Sie dies über unseren Online-Service vorzunehmen. Nutzen Sie hierfür bitte den folgenden Link:
    %s

    Anmeldecode: %s
    Zur Verifikation wird Ihr Geburtsdatum benötigt.

    Beachten Sie bitte, dass es nicht möglich ist auf diese Email zu antworten. Für Änderungen und Stornierungen verwenden Sie bitte den angegebenen Link.

    Vielen Dank, dass Sie unseren Service nutzen. Wir freuen uns darauf Sie bald bei uns begrüßen zu dürfen.

      Mit freundlichen Grüßen,

      %s""";

  public static String getNewCitizenProcedureSubject() {
    return NEW_CITIZEN_PROCEDURE_SUBJECT;
  }

  public static String getNewCitizenProcedureBody(
      String firstName,
      String lastName,
      Instant appointmentStart,
      String loginUrl,
      String accessCode,
      String greeting) {
    return String.format(
        NEW_CITIZEN_PROCEDURE_BODY,
        firstName,
        lastName,
        APPOINTMENT_START_FORMAT.format(appointmentStart.atZone(ZoneId.of("Europe/Berlin"))),
        loginUrl,
        accessCode,
        greeting);
  }
}
