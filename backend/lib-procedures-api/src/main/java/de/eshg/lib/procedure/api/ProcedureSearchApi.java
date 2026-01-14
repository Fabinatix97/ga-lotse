/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import de.eshg.lib.procedure.model.AbstractGetProceduresByPersonResponse;
import de.eshg.lib.procedure.model.AbstractProcedureDto;
import de.eshg.rest.service.security.config.BaseUrls.ProcedureLibrary;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;

public interface ProcedureSearchApi<P extends AbstractProcedureDto> {

  @GetExchange(ProcedureLibrary.PROCEDURES_API + "/searchByPerson")
  AbstractGetProceduresByPersonResponse<P> searchProceduresByPerson(
      @RequestParam("firstName") String firstName,
      @RequestParam("lastName") String lastName,
      @RequestParam("dateOfBirth") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate dateOfBirth);
}
