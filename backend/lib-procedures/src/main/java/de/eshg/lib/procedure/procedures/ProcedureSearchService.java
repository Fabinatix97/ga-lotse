/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import static java.util.stream.Collectors.toMap;

import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.RelatedFacility;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.helper.FacilityFileStateSearchableStringFormatter;
import de.eshg.lib.procedure.helper.PersonFileStateSearchableStringFormatter;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.StringJoiner;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.apache.commons.text.similarity.FuzzyScore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

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

  List<ProcedureT> searchProcedures(String query) {
    StopWatch stopWatch = new StopWatch("search procedures");

    Map<UUID, AddPersonFileStateResponse> personFileStatesById = collectPersonFileStates(stopWatch);
    Map<UUID, AddFacilityFileStateResponse> facilityFileStatesById =
        collectFacilityFileStates(stopWatch);

    List<ProcedureT> procedures = getProcedures();

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

    stopWatch.stop();

    if (log.isDebugEnabled()) {
      log.debug(stopWatch.prettyPrint());
    }

    return foundProcedures;
  }

  public List<ProcedureT> searchProceduresByPerson(
      String firstName, String lastName, LocalDate dateOfBirth, PersonType personType) {
    List<UUID> fileStateIds =
        personApi.searchReferencePersons(firstName, lastName, dateOfBirth).persons().stream()
            .map(GetReferencePersonResponse::id)
            .map(
                referencePersonId ->
                    personApi
                        .getPersonFileStateIdsAssociatedWithReferencePerson(referencePersonId)
                        .fileStateIds())
            .flatMap(Collection::stream)
            .toList();
    return procedureRepository
        .findByRelatedPersonsCentralFileStateIdInAndRelatedPersonsPersonTypeOrderByCreatedAtDescIdAsc(
            fileStateIds, personType);
  }

  private Function<ProcedureT, SearchableProcedure<ProcedureT>> formatAsSearchable(
      Map<UUID, AddPersonFileStateResponse> personFileStatesById,
      Map<UUID, AddFacilityFileStateResponse> facilityFileStatesById) {
    return procedure ->
        new SearchableProcedure<>(
            procedure, formatAsSearchable(procedure, personFileStatesById, facilityFileStatesById));
  }

  private record SearchableProcedure<P>(P procedure, String searchableString) {}

  private List<ProcedureT> getProcedures() {
    return procedureRepository.findByProcedureStatusIn(EnumSet.of(ProcedureStatus.IN_PROGRESS));
  }

  private Map<UUID, AddFacilityFileStateResponse> collectFacilityFileStates(StopWatch stopWatch) {
    stopWatch.start("resolve facility file states");

    List<UUID> relatedFacilitiesFileStateIds =
        procedureRepository.findAllRelatedFacilitiesFileStateIdsByProcedureStatus(RELEVANT_STATUS);

    Map<UUID, AddFacilityFileStateResponse> facilityFileStatesById =
        facilityApi
            .getFacilityFileStates(new GetFacilityFileStatesRequest(relatedFacilitiesFileStateIds))
            .facilityFileStates()
            .stream()
            .collect(toMap(AddFacilityFileStateResponse::id, Function.identity()));

    stopWatch.stop();

    return facilityFileStatesById;
  }

  private Map<UUID, AddPersonFileStateResponse> collectPersonFileStates(StopWatch stopWatch) {
    stopWatch.start("resolve person file states");

    List<UUID> relatedPersonFileStateIds =
        procedureRepository.findAllRelatedPersonFileStateIdsByProcedureStatus(RELEVANT_STATUS);

    Map<UUID, AddPersonFileStateResponse> personFileStatesById =
        personApi
            .getPersonFileStates(new GetPersonFileStatesRequest(relatedPersonFileStateIds))
            .personFileStates()
            .stream()
            .collect(toMap(AddPersonFileStateResponse::id, Function.identity()));

    stopWatch.stop();
    return personFileStatesById;
  }

  private String formatAsSearchable(
      ProcedureT procedure,
      Map<UUID, AddPersonFileStateResponse> personFileStatesById,
      Map<UUID, AddFacilityFileStateResponse> facilityFileStatesById) {

    List<AddPersonFileStateResponse> personFileStates =
        procedure.getRelatedPersons().stream()
            .map(RelatedPerson::getCentralFileStateId)
            .map(personFileStatesById::get)
            .toList();
    String personFileStatesAsString = formatPersonFileStatesAsString(personFileStates);

    List<AddFacilityFileStateResponse> facilityFileStates =
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
      List<AddFacilityFileStateResponse> facilityFileStates) {
    return facilityFileStates.stream()
        .map(facilityFileStateSearchableStringFormatter::formatAsSearchable)
        .collect(Collectors.joining(System.lineSeparator()));
  }

  private String formatPersonFileStatesAsString(
      List<AddPersonFileStateResponse> addPersonFileStateResponses) {
    return addPersonFileStateResponses.stream()
        .map(personFileStateSearchableStringFormatter::formatAsSearchable)
        .collect(Collectors.joining(System.lineSeparator()));
  }
}
