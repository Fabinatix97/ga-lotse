/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.pdf.identification;

public record Appointment(
    Department department,
    String date,
    String time,
    String durationMinutes,
    String room,
    String url,
    String ticketNumber) {}
