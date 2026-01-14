/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.pdf.identification;

public record AnonymousIdentificationDocument(
    DocumentSender sender, ConsultationAppointment appointment, String durationMinutesRounded) {
  public AnonymousIdentificationDocument(
      DocumentSender sender, ConsultationAppointment appointment) {
    this(sender, appointment, roundToNearestHigherFive(appointment));
  }

  private static String roundToNearestHigherFive(ConsultationAppointment appointment) {
    return String.valueOf((Integer.parseInt(appointment.durationMinutes()) + 4) / 5 * 5);
  }
}
