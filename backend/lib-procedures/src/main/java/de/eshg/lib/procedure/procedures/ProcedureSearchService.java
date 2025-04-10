/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import static de.eshg.domain.model.SequencedBaseEntity_.ID;
import static java.util.stream.Collectors.toMap;

import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStateIdsByKeyAttributesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.lib.procedure.api.ProcedureSearchParameters;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.model.RelatedFacility;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.model.RelatedPerson_;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.helper.FacilityFileStateSearchableStringFormatter;
import de.eshg.lib.procedure.helper.PersonFileStateSearchableStringFormatter;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.StringJoiner;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.apache.commons.text.similarity.FuzzyScore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import org.springframework.util.StringUtils;

@Component
public class ProcedureSearchService<ProcedureT extends Procedure<ProcedureT, ?, ?, ?>> {

  private static final Logger log = LoggerFactory.getLogger(ProcedureSearchService.class);

  private static final Comparator<ProcedureFuzzyScore<?>> FUZZY_SCORE_COMPARATOR =
      Comparator.comparing(ProcedureFuzzyScore::fuzzyScore);
  private static final EnumSet<ProcedureStatus> RELEVANT_STATUS =
      EnumSet.of(ProcedureStatus.IN_PROGRESS);
  private static final int FUZZY_SCORE_THRESHOLD = 5;
  private static final int RESULT_LIMIT = 10;

  private final PersonFileStateSearchableStringFormatter personFileStateSearchableStringFormatter =
      new PersonFileStateSearchableStringFormatter();
  private final FacilityFileStateSearchableStringFormatter
      facilityFileStateSearchableStringFormatter = new FacilityFileStateSearchableStringFormatter();

  private final ProcedureAsSearchableStringFormatter<ProcedureT>
      procedureAsSearchableStringFormatter;
  private final ProcedureRepository<ProcedureT> procedureRepository;
  private final PersonApi personApi;
  private final FacilityApi facilityApi;

  public ProcedureSearchService(
      ProcedureAsSearchableStringFormatter<ProcedureT> procedureAsSearchableStringFormatter,
      ProcedureRepository<ProcedureT> procedureRepository,
      PersonApi personApi,
      FacilityApi facilityApi) {
    this.procedureAsSearchableStringFormatter = procedureAsSearchableStringFormatter;
    this.procedureRepository = procedureRepository;
    this.personApi = personApi;
    this.facilityApi = facilityApi;
  }

  public record Result<T>(
      List<T> procedures,
      Map<UUID, GetPersonFileStateResponse> personFileStatesById,
      Map<UUID, GetFacilityFileStateResponse> facilityFileStatesById) {}

  public Result<ProcedureT> searchProcedures(String query) {
    return searchProcedures(query, RELEVANT_STATUS);
  }

  public Result<ProcedureT> searchProcedures(String query, Set<ProcedureStatus> relevantStatus) {
    StopWatch stopWatch = new StopWatch("search procedures");

    Map<UUID, GetPersonFileStateResponse> personFileStatesById =
        collectPersonFileStates(stopWatch, relevantStatus);
    Map<UUID, GetFacilityFileStateResponse> facilityFileStatesById =
        collectFacilityFileStates(stopWatch, relevantStatus);

    List<ProcedureT> procedures = getProcedures(relevantStatus);

    stopWatch.start("read from db and fuzzy search");

    List<ProcedureT> foundProcedures =
        procedures.stream()
            .map(formatAsSearchable(personFileStatesById, facilityFileStatesById))
            .map(calculateFuzzyScore(query))
            .filter(procedureFuzzyScore -> procedureFuzzyScore.fuzzyScore > FUZZY_SCORE_THRESHOLD)
            .sorted(FUZZY_SCORE_COMPARATOR.reversed())
            .map(ProcedureFuzzyScore::procedureId)
            .limit(RESULT_LIMIT)
            .toList();

    Result<ProcedureT> results =
        new Result<>(foundProcedures, personFileStatesById, facilityFileStatesById);

    stopWatch.stop();

    if (log.isDebugEnabled()) {
      log.debug(stopWatch.prettyPrint());
    }

    return results;
  }

  public static <T extends Procedure<T, ?, ?, ?>> Specification<T> isInStatusOpen() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get(Procedure_.procedureStatus), ProcedureStatus.OPEN);
  }

  public <PersonT extends RelatedPerson<ProcedureT>>
      Map<PersonKeyAttributes, List<ProcedureT>> searchProceduresByPersons(
          Set<PersonKeyAttributes> searchAttributes,
          PersonType personType,
          Specification<ProcedureT> additionalProcedureSpecification,
          Class<PersonT> relatedPersonClass) {
    if (searchAttributes.isEmpty()) {
      return Map.of();
    }
    Map<PersonKeyAttributes, List<UUID>> fileStateIdsByPersonAttributes =
        personApi
            .getPersonFileStateIdsByReferencePersonKeyAttributes(
                new GetPersonFileStateIdsByKeyAttributesRequest(searchAttributes))
            .fileStateIdsByPersons();

    if (fileStateIdsByPersonAttributes.isEmpty()) {
      return Map.of();
    }

    List<UUID> allPersonFileStateIds =
        fileStateIdsByPersonAttributes.values().stream().flatMap(Collection::stream).toList();

    Specification<ProcedureT> proceduresByRelatedPersons =
        (root, query, criteriaBuilder) -> {
          Subquery<PersonT> relatedPersonSubquery = query.subquery(relatedPersonClass);
          Root<PersonT> personRoot = relatedPersonSubquery.from(relatedPersonClass);

          relatedPersonSubquery.where(
              criteriaBuilder.and(
                  criteriaBuilder.equal(personRoot.get(RelatedPerson_.procedure), root),
                  personRoot.get(RelatedPerson_.centralFileStateId).in(allPersonFileStateIds),
                  criteriaBuilder.equal(personRoot.get(RelatedPerson_.personType), personType)));
          return criteriaBuilder.exists(relatedPersonSubquery);
        };

    List<ProcedureT> allProcedures =
        procedureRepository.findAll(
            proceduresByRelatedPersons.and(additionalProcedureSpecification),
            Sort.by(Direction.DESC, Procedure_.CREATED_AT).and(Sort.by(Direction.ASC, ID)));

    Map<UUID, List<ProcedureT>> proceduresPerPersonFileStateId = new LinkedHashMap<>();
    for (ProcedureT procedure : allProcedures) {
      procedure.getRelatedPersons().stream()
          .filter(person -> person.getPersonType() == personType)
          .map(RelatedPerson::getCentralFileStateId)
          .filter(allPersonFileStateIds::contains)
          .forEach(
              personFileStateId -> {
                List<ProcedureT> procedures =
                    proceduresPerPersonFileStateId.computeIfAbsent(
                        personFileStateId, k -> new ArrayList<>());
                procedures.add(procedure);
              });
    }

    Map<PersonKeyAttributes, List<ProcedureT>> result = new LinkedHashMap<>();
    fileStateIdsByPersonAttributes.forEach(
        (personKeyAttributes, personFileStateIds) -> {
          List<ProcedureT> procedures =
              personFileStateIds.stream()
                  .flatMap(
                      personFileStateId ->
                          proceduresPerPersonFileStateId
                              .getOrDefault(personFileStateId, List.of())
                              .stream())
                  .toList();
          result.put(personKeyAttributes, procedures);
        });
    return result;
  }

  public List<ProcedureT> searchProceduresByPerson(
      ProcedureSearchParameters searchParameters, PersonType personType) {

    if (isFullSearch(searchParameters)) {
      return processSearchResult(performFullSearch(searchParameters), personType);
    } else {
      return processSearchResult(performPartialSearch(searchParameters), personType).stream()
          .filter(procedure -> procedure.getProcedureStatus().isOpen())
          .toList();
    }
  }

  private static boolean isFullSearch(ProcedureSearchParameters searchParameters) {
    return StringUtils.hasText(searchParameters.searchFirstName())
        && StringUtils.hasText(searchParameters.searchLastName())
        && (searchParameters.searchDateOfBirth() != null);
  }

  private List<GetReferencePersonResponse> performFullSearch(
      ProcedureSearchParameters searchParameters) {
    return personApi
        .searchReferencePersons(
            searchParameters.searchFirstName(),
            searchParameters.searchLastName(),
            searchParameters.searchDateOfBirth())
        .persons();
  }

  private List<GetReferencePersonResponse> performPartialSearch(
      ProcedureSearchParameters searchParameters) {
    return personApi
        .searchReferencePersonsWithPartialKnowledgeFactors(
            searchParameters.searchFirstName(),
            searchParameters.searchLastName(),
            searchParameters.searchDateOfBirth())
        .persons();
  }

  private List<ProcedureT> processSearchResult(
      List<GetReferencePersonResponse> searchResult, PersonType personType) {
    List<UUID> fileStateIds =
        searchResult.stream()
            .map(GetReferencePersonResponse::id)
            .map(
                referencePersonId ->
                    personApi
                        .getPersonFileStateIdsAssociatedWithReferencePerson(referencePersonId)
                        .fileStateIds())
            .flatMap(Collection::stream)
            .toList();
    return procedureRepository.findByRelatedPersonsCentralFileStateIds(fileStateIds, personType);
  }

  private Function<ProcedureT, SearchableProcedure<ProcedureT>> formatAsSearchable(
      Map<UUID, GetPersonFileStateResponse> personFileStatesById,
      Map<UUID, GetFacilityFileStateResponse> facilityFileStatesById) {
    return procedure ->
        new SearchableProcedure<>(
            procedure, formatAsSearchable(procedure, personFileStatesById, facilityFileStatesById));
  }

  private record SearchableProcedure<P>(P procedure, String searchableString) {}

  private List<ProcedureT> getProcedures(Set<ProcedureStatus> relevantStatus) {
    return procedureRepository.findByProcedureStatusIn(relevantStatus);
  }

  private Map<UUID, GetFacilityFileStateResponse> collectFacilityFileStates(
      StopWatch stopWatch, Set<ProcedureStatus> relevantStatus) {
    stopWatch.start("resolve facility file states");

    List<UUID> relatedFacilitiesFileStateIds =
        procedureRepository.findAllRelatedFacilitiesFileStateIdsByProcedureStatus(relevantStatus);

    if (relatedFacilitiesFileStateIds.isEmpty()) {
      stopWatch.stop();
      return Map.of();
    }

    Map<UUID, GetFacilityFileStateResponse> facilityFileStatesById =
        facilityApi
            .getFacilityFileStates(new GetFacilityFileStatesRequest(relatedFacilitiesFileStateIds))
            .facilityFileStates()
            .stream()
            .collect(toMap(GetFacilityFileStateResponse::id, Function.identity()));

    stopWatch.stop();

    return facilityFileStatesById;
  }

  private Map<UUID, GetPersonFileStateResponse> collectPersonFileStates(
      StopWatch stopWatch, Set<ProcedureStatus> relevantStatus) {
    stopWatch.start("resolve person file states");

    List<UUID> relatedPersonFileStateIds =
        procedureRepository.findAllRelatedPersonFileStateIdsByProcedureStatus(relevantStatus);

    if (relatedPersonFileStateIds.isEmpty()) {
      stopWatch.stop();
      return Map.of();
    }

    Map<UUID, GetPersonFileStateResponse> personFileStatesById =
        personApi
            .getPersonFileStates(new GetPersonFileStatesRequest(relatedPersonFileStateIds))
            .personFileStates()
            .stream()
            .collect(toMap(GetPersonFileStateResponse::id, Function.identity()));

    stopWatch.stop();
    return personFileStatesById;
  }

  private String formatAsSearchable(
      ProcedureT procedure,
      Map<UUID, GetPersonFileStateResponse> personFileStatesById,
      Map<UUID, GetFacilityFileStateResponse> facilityFileStatesById) {

    List<GetPersonFileStateResponse> personFileStates =
        procedure.getRelatedPersons().stream()
            .map(RelatedPerson::getCentralFileStateId)
            .map(personFileStatesById::get)
            .toList();
    String personFileStatesAsString = formatPersonFileStatesAsString(personFileStates);

    List<GetFacilityFileStateResponse> facilityFileStates =
        procedure.getRelatedFacilities().stream()
            .map(RelatedFacility::getCentralFileStateId)
            .map(facilityFileStatesById::get)
            .toList();
    String facilityFileStatesAsString = formatFacilityFileStatesAsString(facilityFileStates);

    return new StringJoiner(System.lineSeparator())
        .add(personFileStatesAsString)
        .add(facilityFileStatesAsString)
        .add(procedureAsSearchableStringFormatter.formatAsSearchableString(procedure))
        .toString();
  }

  private Function<SearchableProcedure<ProcedureT>, ProcedureFuzzyScore<ProcedureT>>
      calculateFuzzyScore(String query) {
    return searchableProcedure ->
        new ProcedureFuzzyScore<>(
            searchableProcedure.procedure(),
            calculateFuzzyScore(searchableProcedure.searchableString(), query));
  }

  private record ProcedureFuzzyScore<P>(P procedureId, int fuzzyScore) {}

  private int calculateFuzzyScore(String term, String query) {
    FuzzyScore fuzzyScore = new FuzzyScore(Locale.GERMAN);
    return Optional.ofNullable(fuzzyScore.fuzzyScore(term, query)).orElse(0);
  }

  private String formatFacilityFileStatesAsString(
      List<GetFacilityFileStateResponse> facilityFileStates) {
    return facilityFileStates.stream()
        .map(facilityFileStateSearchableStringFormatter::formatAsSearchable)
        .collect(Collectors.joining(System.lineSeparator()));
  }

  private String formatPersonFileStatesAsString(
      List<GetPersonFileStateResponse> getPersonFileStateResponses) {
    return getPersonFileStateResponses.stream()
        .map(personFileStateSearchableStringFormatter::formatAsSearchable)
        .collect(Collectors.joining(System.lineSeparator()));
  }
}
