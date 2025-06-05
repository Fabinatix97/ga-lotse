/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.specification;

import static de.eshg.domain.model.SequencedBaseEntity_.id;
import static de.eshg.lib.procedure.MapperHelper.mapEnumSet;
import static de.eshg.lib.procedure.domain.model.Procedure_.createdAt;
import static de.eshg.lib.procedure.domain.model.Procedure_.procedureStatus;
import static de.eshg.lib.procedure.domain.model.Procedure_.procedureType;
import static de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure_.requestForWrittenConfirmation;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.medicalregistry.api.GetMedicalRegistryProceduresFilterOptions;
import de.eshg.medicalregistry.domain.model.FullMedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.FullMedicalRegistryEntryChange_;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry_;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.model.ProfessionInformation;
import de.eshg.medicalregistry.domain.model.ProfessionInformation_;
import de.eshg.medicalregistry.domain.model.ProfessionalTitle;
import de.eshg.medicalregistry.mapper.PersonMapper;
import de.eshg.rest.service.error.BadRequestException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.SequencedSet;
import java.util.Set;
import java.util.stream.Stream;
import org.springframework.data.jpa.domain.Specification;

public class MedicalRegistryProcedureOverviewSpecification
    implements Specification<MedicalRegistryProcedure> {
  @Serial private static final long serialVersionUID = 1L;

  private static final SequencedSet<ProcedureStatus> OVERVIEW_SORTING_ORDER =
      new LinkedHashSet<>(
          List.of(ProcedureStatus.DRAFT, ProcedureStatus.OPEN, ProcedureStatus.CLOSED));

  private final transient Set<ProcedureStatus> statuses;
  private final transient Set<ProcedureType> types;
  private final transient Set<ProfessionalTitle> professionalTitles;
  private final transient Boolean certificateRequested;

  public MedicalRegistryProcedureOverviewSpecification(
      Set<ProcedureStatus> statuses,
      Set<ProcedureType> types,
      Set<ProfessionalTitle> professionalTitles,
      Boolean certificateRequested) {
    this.statuses = statuses;
    this.types = types;
    this.professionalTitles = professionalTitles;
    this.certificateRequested = certificateRequested;
  }

  public static MedicalRegistryProcedureOverviewSpecification fromFilterOptions(
      GetMedicalRegistryProceduresFilterOptions filterOptions) {
    validateFilterOptions(filterOptions);
    return new MedicalRegistryProcedureOverviewSpecification(
        mapEnumSet(filterOptions.procedureStatus(), ProcedureMapper::toDomainType),
        mapEnumSet(filterOptions.procedureType(), ProcedureMapper::toDomainType),
        mapEnumSet(filterOptions.professionalTitle(), PersonMapper::mapToDomain),
        filterOptions.certificateRequested());
  }

  @Override
  public Predicate toPredicate(
      Root<MedicalRegistryProcedure> procedure, CriteriaQuery<?> query, CriteriaBuilder cb) {
    List<Predicate> filters = new ArrayList<>();
    if (statuses != null) {
      filters.add(filterByStatus(procedure));
    }

    if (types != null) {
      filters.add(filterByType(procedure));
    }

    if (professionalTitles != null) {
      filters.add(filterByProfessionalTitle(procedure, cb));
    }

    if (certificateRequested != null) {
      filters.add(filterByCertificateRequested(procedure, cb));
    }

    query.orderBy(
        cb.asc(statusToSortingIndex(procedure.get(procedureStatus), cb)),
        cb.asc(procedure.get(createdAt)),
        cb.asc(procedure.get(id)));

    return cb.and(filters.toArray(Predicate[]::new));
  }

  private Predicate filterByCertificateRequested(
      Root<MedicalRegistryProcedure> procedure, CriteriaBuilder cb) {
    return cb.equal(procedure.get(requestForWrittenConfirmation), certificateRequested);
  }

  private Predicate filterByProfessionalTitle(
      Root<MedicalRegistryProcedure> procedure, CriteriaBuilder cb) {
    Join<MedicalRegistryEntry, ProfessionInformation> confirmedEntryProfessionalInformation =
        cb.treat(procedure, MedicalRegistryEntry.class)
            .join(MedicalRegistryEntry_.professionInformation, JoinType.LEFT);

    Join<FullMedicalRegistryEntryChange, ProfessionInformation> changeEntryProfessionalInformation =
        cb.treat(procedure, FullMedicalRegistryEntryChange.class)
            .join(FullMedicalRegistryEntryChange_.professionInformation, JoinType.LEFT);

    return cb.or(
        Stream.of(confirmedEntryProfessionalInformation, changeEntryProfessionalInformation)
            .map(this::filterByProfessionalTitle)
            .toArray(Predicate[]::new));
  }

  private Predicate filterByProfessionalTitle(Path<ProfessionInformation> join) {
    return join.get(ProfessionInformation_.professionalTitle).in(professionalTitles);
  }

  private Predicate filterByStatus(Root<MedicalRegistryProcedure> procedure) {
    return procedure.get(procedureStatus).in(statuses);
  }

  private Predicate filterByType(Root<MedicalRegistryProcedure> procedure) {
    return procedure.get(procedureType).in(types);
  }

  private static void validateFilterOptions(
      GetMedicalRegistryProceduresFilterOptions filterOptions) {
    if ((filterOptions.procedureStatus() == null && filterOptions.procedureType() != null)
        || (filterOptions.procedureStatus() != null && filterOptions.procedureType() == null)) {
      throw new BadRequestException(
          "Procedure status and procedure type have to be either set together or not at all");
    }
  }

  private static Expression<Integer> statusToSortingIndex(
      Path<ProcedureStatus> procedureStatus, CriteriaBuilder criteriaBuilder) {
    CriteriaBuilder.Case<Integer> number = criteriaBuilder.selectCase();
    int index = 0;
    for (ProcedureStatus orderStatus : OVERVIEW_SORTING_ORDER) {
      number.when(
          criteriaBuilder.equal(procedureStatus, criteriaBuilder.literal(orderStatus)),
          criteriaBuilder.literal(index));
      index++;
    }
    number.otherwise(criteriaBuilder.literal(index));
    return number;
  }
}
