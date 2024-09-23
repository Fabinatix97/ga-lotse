/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.measlesprotection.api.CreateProofRequestLetterRequest;
import de.eshg.measlesprotection.api.GetProofRequestLettersResponse;
import de.eshg.measlesprotection.api.ProofRequestLetterDto;
import de.eshg.measlesprotection.api.SaveProofRequestLetterRequest;
import de.eshg.measlesprotection.mapper.ProofRequestLetterMapper;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.validation.ProtectedProcedure;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = ProtectionProcedureController.BASE_URL)
@Tag(name = "ProofRequestLetter")
public class ProofRequestLetterController {

  private final ProofRequestLetterService proofRequestLetterService;
  private final ProcedureFinder procedureFinder;
  private final ProofRequestLetterMapper proofRequestLetterMapper;

  public ProofRequestLetterController(
      ProofRequestLetterService proofRequestLetterService,
      ProcedureFinder procedureFinder,
      ProofRequestLetterMapper proofRequestLetterMapper) {
    this.proofRequestLetterService = proofRequestLetterService;
    this.procedureFinder = procedureFinder;
    this.proofRequestLetterMapper = proofRequestLetterMapper;
  }

  @PostMapping(path = "/{id}/proof-submissions/letters/create")
  @Operation(summary = "Create a proof request letter")
  public ResponseEntity<byte[]> createProofRequestLetter(
      @PathVariable("id") @ProtectedProcedure UUID id,
      @Valid @RequestBody CreateProofRequestLetterRequest request) {

    Pdf coverLetter = proofRequestLetterService.createCoverLetter(id, request);

    byte[] content = coverLetter.getFileContent().getContent();
    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_PDF)
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename(coverLetter.getFileName(), StandardCharsets.UTF_8)
                .build()
                .toString())
        .body(content);
  }

  @PostMapping(path = "/{id}/proof-submissions/letters/save")
  @Operation(summary = "Create and save a proof request letter")
  public ResponseEntity<Void> saveProofRequestLetter(
      @PathVariable("id") @ProtectedProcedure UUID id,
      @Valid @RequestBody SaveProofRequestLetterRequest request) {

    proofRequestLetterService.saveCoverLetter(id, request);
    return ResponseEntity.ok().build();
  }

  @GetMapping(path = "/{id}/proof-submissions/letters")
  @Operation(summary = "List proof submission letters")
  @Transactional(readOnly = true)
  public GetProofRequestLettersResponse getProofRequestLetters(@PathVariable("id") UUID id) {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(id);
    List<ProofRequestLetterDto> letters =
        procedure.getProofRequestLetters().stream()
            .map(proofRequestLetterMapper::toInterface)
            .toList();
    return new GetProofRequestLettersResponse(letters);
  }
}
