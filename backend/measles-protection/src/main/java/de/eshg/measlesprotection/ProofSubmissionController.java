/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.lib.procedure.model.FileMetaDataDto;
import de.eshg.measlesprotection.api.CreateProofSubmissionDto;
import de.eshg.measlesprotection.api.ProofSubmissionDto;
import de.eshg.measlesprotection.api.UpdateProofSubmissionDto;
import de.eshg.measlesprotection.mapper.ProofSubmissionMapper;
import de.eshg.measlesprotection.persistence.db.ProofSubmission;
import de.eshg.measlesprotection.validation.ProtectedProcedure;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.UUID;
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
@Tag(name = "ProofSubmission")
public class ProofSubmissionController {

  private final ProofSubmissionService proofSubmissionService;

  public ProofSubmissionController(ProofSubmissionService proofSubmissionService) {
    this.proofSubmissionService = proofSubmissionService;
  }

  @PostMapping(path = "/{id}/proof-submissions", consumes = MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Add a proof submission to a procedure")
  public ProofSubmissionDto createProofSubmission(
      @PathVariable("id") @ProtectedProcedure UUID id,
      @RequestPart(name = "request") @Valid CreateProofSubmissionDto request,
      @RequestPart(name = "file", required = false) MultipartFile file,
      @RequestPart(name = "fileMetaData", required = false) @Valid FileMetaDataDto fileMetaData)
      throws IOException {
    ProofSubmission proofSubmission =
        proofSubmissionService.createProofSubmission(id, request, file, fileMetaData);
    return ProofSubmissionMapper.toInterfaceType(proofSubmission);
  }

  @PatchMapping("/{id}/proof-submissions/{proofSubmissionId}")
  @Operation(summary = "Update a proof submission of a procedure")
  public ProofSubmissionDto updateProofSubmission(
      @PathVariable("id") @ProtectedProcedure UUID id,
      @PathVariable("proofSubmissionId") UUID proofSubmissionId,
      @Valid @RequestBody UpdateProofSubmissionDto request) {
    ProofSubmission proofSubmission =
        proofSubmissionService.updateProofSubmission(id, proofSubmissionId, request);
    return ProofSubmissionMapper.toInterfaceType(proofSubmission);
  }
}
