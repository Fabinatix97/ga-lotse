/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.pdf.identification;

public record ConsultationAppointment(
    Department department,
    String date,
    String time,
    String durationMinutes,
    String url,
    String accessCode,
    String qrCode,
    String location) {
  public ConsultationAppointment(
      Department department,
      String date,
      String time,
      String durationMinutes,
      String url,
      String accessCode,
      String qrCode) {
    this(department, date, time, durationMinutes, url, accessCode, qrCode, null);
  }
}
