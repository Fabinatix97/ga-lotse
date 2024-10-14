/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.registry;

import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;

public interface MedicalRegistryEntryRepository extends ProcedureRepository<MedicalRegistryEntry> {}
