/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.persistence;

import de.eshg.lib.procedure.domain.model.RelatedPerson;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

/** currently unused -- inspections don't have related persons as far as we know. */
@Entity
@Table(indexes = @Index(columnList = "procedure_id"))
public class InspectionPerson extends RelatedPerson<Inspection> {}
