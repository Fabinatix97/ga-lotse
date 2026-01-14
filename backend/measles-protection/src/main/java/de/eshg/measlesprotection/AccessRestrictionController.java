/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.lib.procedure.model.FileMetaDataDto;
import de.eshg.measlesprotection.api.AccessRestrictionDto;
import de.eshg.measlesprotection.api.AccessRestrictionLetterDto;
import de.eshg.measlesprotection.api.CreateAccessRestrictionDto;
import de.eshg.measlesprotection.api.CreateAccessRestrictionLetterDto;
import de.eshg.measlesprotection.api.UpdateAccessRestrictionDto;
import de.eshg.measlesprotection.config.MeaslesProtectionFeatureToggle;
import de.eshg.measlesprotection.mapper.AccessRestrictionLetterMapper;
import de.eshg.measlesprotection.mapper.AccessRestrictionMapper;
import de.eshg.measlesprotection.persistence.db.AccessRestriction;
import de.eshg.measlesprotection.persistence.db.AccessRestrictionLetter;
import de.eshg.measlesprotection.validation.ProtectedProcedure;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(value = ProtectionProcedureController.BASE_URL)
@Tag(name = "AccessRestriction")
public class AccessRestrictionController {

  private final AccessRestrictionService accessRestrictionService;

  public AccessRestrictionController(
      AccessRestrictionService accessRestrictionService,
      MeaslesProtectionFeatureToggle featureToggle) {
    this.accessRestrictionService = accessRestrictionService;
  }

  @PostMapping("/{id}/access-restriction")
  @Operation(summary = "Enforce an access restriction")
  @Transactional
  public AccessRestrictionDto createAccessRestriction(
      @PathVariable("id") @ProtectedProcedure UUID id,
      @Valid @RequestBody CreateAccessRestrictionDto request) {
    AccessRestriction accessRestriction =
        accessRestrictionService.createAccessRestriction(id, request);
    return AccessRestrictionMapper.toInterfaceType(accessRestriction);
  }

  @PostMapping(path = "/{id}/access-restriction/letters", consumes = MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Create or attach an access restriction letter.")
  @Transactional
  public AccessRestrictionLetterDto createAccessRestrictionLetter(
      @PathVariable("id") @ProtectedProcedure UUID id,
      @RequestPart(name = "request") @Valid CreateAccessRestrictionLetterDto request,
      @RequestPart(name = "file", required = false) MultipartFile file,
      @RequestPart(name = "fileMetaData", required = false) @Valid FileMetaDataDto fileMetaData)
      throws IOException {
    AccessRestrictionLetter accessRestrictionLetter =
        accessRestrictionService.createAccessRestrictionLetter(id, request, file, fileMetaData);
    return AccessRestrictionLetterMapper.toInterfaceType(accessRestrictionLetter);
  }

  @PatchMapping("/{id}/access-restriction")
  @Operation(summary = "Update an access restriction of a procedure")
  @Transactional
  public AccessRestrictionDto updateAccessRestriction(
      @PathVariable("id") @ProtectedProcedure UUID id,
      @Valid @RequestBody UpdateAccessRestrictionDto request) {
    AccessRestriction accessRestriction =
        accessRestrictionService.updateAccessRestriction(id, request);
    return AccessRestrictionMapper.toInterfaceType(accessRestriction);
  }
}
