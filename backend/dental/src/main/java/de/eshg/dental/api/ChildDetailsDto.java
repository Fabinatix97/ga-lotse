/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Schema(name = "ChildDetails")
public record ChildDetailsDto(
    @NotNull UUID id,
    @NotNull long version,
    @NotNull ProcedureStatusDto status,
    @NotNull UUID fileStateId,
    @NotNull boolean fileStateOutdated,
    @Size(min = 1, max = 119) String title,
    @NotNull SalutationDto salutation,
    @NotNull GenderDto gender,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @NotNull LocalDate dateOfBirth,
    @Size(min = 1, max = 40) String nameAtBirth,
    @Size(min = 1, max = 50) String placeOfBirth,
    CountryCode countryOfBirth,
    @NotNull List<@NotNull @Size(min = 6, max = 254) String> emailAddresses,
    @NotNull List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress,
    @NotNull int year,
    @NotNull String groupName,
    @NotNull @Valid List<ExaminationDto> examinations,
    @NotEmpty @Valid List<AnnualInstitutionDto> institutions) {

  @JsonIgnore
  public InstitutionDto getCurrentInstitution() {
    return institutions.stream()
        .max(Comparator.comparing(AnnualInstitutionDto::year))
        .map(AnnualInstitutionDto::institution)
        .orElseThrow();
  }
}
