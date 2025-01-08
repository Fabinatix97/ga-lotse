/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.pdf.identification;

public record AnonymousIdentificationDocument(
    DocumentSender sender, ConsultationAppointment appointment) {}
