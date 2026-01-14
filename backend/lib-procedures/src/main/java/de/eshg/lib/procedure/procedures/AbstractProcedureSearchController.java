/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.lib.procedure.api.ProcedureSearchApi;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.model.AbstractGetProceduresByPersonResponse;
import de.eshg.lib.procedure.model.AbstractProcedureDto;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.BiFunction;
import java.util.function.Function;
import org.springframework.transaction.annotation.Transactional;

@Tag(name = "Procedure")
public abstract class AbstractProcedureSearchController<
        DomainProcedure extends Procedure<DomainProcedure, ?, ?, ?>,
        ProcedureDto extends AbstractProcedureDto,
        GetProceduresByPersonResponse extends AbstractGetProceduresByPersonResponse<ProcedureDto>>
    implements ProcedureSearchApi<ProcedureDto> {

  private final ProcedureMapper<DomainProcedure, ProcedureDto> procedureMapper;
  private final BiFunction<
          Map<UUID, List<ProcedureDto>>,
          Map<UUID, GetReferencePersonResponse>,
          GetProceduresByPersonResponse>
      responseFactory;
  private final ProcedureRepository<DomainProcedure> procedureRepository;
  private final PersonApi personApi;

  protected AbstractProcedureSearchController(
      ProcedureMapper<DomainProcedure, ProcedureDto> procedureMapper,
      BiFunction<
              Map<UUID, List<ProcedureDto>>,
              Map<UUID, GetReferencePersonResponse>,
              GetProceduresByPersonResponse>
          responseFactory,
      ProcedureRepository<DomainProcedure> procedureRepository,
      PersonApi personApi) {
    this.procedureMapper = procedureMapper;
    this.responseFactory = responseFactory;
    this.procedureRepository = procedureRepository;
    this.personApi = personApi;
  }

  @Override
  @Transactional(readOnly = true)
  public GetProceduresByPersonResponse searchProceduresByPerson(
      String firstName, String lastName, LocalDate dateOfBirth) {
    List<GetReferencePersonResponse> persons =
        personApi.searchReferencePersons(firstName, lastName, dateOfBirth).persons();
    Map<UUID, List<DomainProcedure>> proceduresByPersonUUID =
        searchProceduresByPersonIds(persons.stream().map(GetReferencePersonResponse::id).toList());
    return responseFactory.apply(
        procedureMapper.mapToInterface(proceduresByPersonUUID), toPersonByIdMap(persons));
  }

  private Map<UUID, List<DomainProcedure>> searchProceduresByPersonIds(List<UUID> persons) {
    return persons.stream()
        .collect(
            StreamUtil.toLinkedHashMap(
                Function.identity(),
                person ->
                    procedureRepository.findByRelatedPersonsCentralFileStateId(
                        personApi
                            .getPersonFileStateIdsAssociatedWithReferencePerson(person)
                            .fileStateIds())));
  }

  private Map<UUID, GetReferencePersonResponse> toPersonByIdMap(
      List<GetReferencePersonResponse> persons) {
    return persons.stream().collect(StreamUtil.toLinkedHashMap(GetReferencePersonResponse::id));
  }
}
