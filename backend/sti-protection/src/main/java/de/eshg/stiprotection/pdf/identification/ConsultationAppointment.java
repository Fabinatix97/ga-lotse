/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.pdf.identification;

public record ConsultationAppointment(
    Department department,
    String date,
    String time,
    String durationMinutes,
    String url,
    String registrationCode,
    String location) {
  public ConsultationAppointment(
      Department department,
      String date,
      String time,
      String durationMinutes,
      String url,
      String registrationCode) {
    this(department, date, time, durationMinutes, url, registrationCode, null);
  }
}
