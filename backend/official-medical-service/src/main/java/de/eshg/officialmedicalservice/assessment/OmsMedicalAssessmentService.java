/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.assessment;

import static de.eshg.rest.service.error.ErrorCode.INSUFFICIENT_USER_RIGHTS;

import de.eshg.base.address.AddressDto;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.GetUsersRequest;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.assessment.domain.model.AssessmentResult;
import de.eshg.lib.assessment.domain.model.AssessmentStatus;
import de.eshg.lib.assessment.domain.model.AssessmentType;
import de.eshg.lib.assessment.domain.model.RecipientType;
import de.eshg.officialmedicalservice.assessment.api.AssessmentDetailsDto;
import de.eshg.officialmedicalservice.assessment.api.AssessmentDto;
import de.eshg.officialmedicalservice.assessment.api.AssessmentRecipientDto;
import de.eshg.officialmedicalservice.assessment.api.AssessmentResultDto;
import de.eshg.officialmedicalservice.assessment.api.AssessmentStatusDto;
import de.eshg.officialmedicalservice.assessment.api.AssessmentTypeDto;
import de.eshg.officialmedicalservice.assessment.api.CreateAssessmentDto;
import de.eshg.officialmedicalservice.assessment.api.RecipientTypeDto;
import de.eshg.officialmedicalservice.assessment.api.UpdateLegalBasisDto;
import de.eshg.officialmedicalservice.assessment.api.UpdatePreviewReaderDto;
import de.eshg.officialmedicalservice.assessment.api.UpdateSourcesDto;
import de.eshg.officialmedicalservice.assessment.persistence.MedicalAssessmentRepository;
import de.eshg.officialmedicalservice.assessment.persistence.entity.MedicalAssessment;
import de.eshg.officialmedicalservice.assessment.persistence.entity.OmsLegalBasis;
import de.eshg.officialmedicalservice.assessment.persistence.entity.OmsSource;
import de.eshg.officialmedicalservice.facility.FacilityClient;
import de.eshg.officialmedicalservice.person.PersonClient;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Facility;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Person;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OmsMedicalAssessmentService {
  private static final String TXT_ASSESSMENT_NOT_FOUND = "Assessment with id %s not found";
  private static final String TXT_PROCEDURE_NOT_FOUND = "Related procedure with id %s not found";
  private static final OmsMapper MAPPER = OmsMapper.INSTANCE;

  private final MedicalAssessmentRepository medicalAssessmentRepository;
  private final OmsProcedureRepository procedureRepository;
  private final PersonClient personClient;
  private final FacilityClient facilityClient;
  private final PolicyFactory htmlPolicyFactory =
      new HtmlPolicyBuilder()
          .allowElements(
              "blockquote",
              "code",
              "div",
              "em",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "li",
              "ol",
              "p",
              "pre",
              "s",
              "span",
              "strong",
              "u",
              "ul")
          .allowAttributes(
              "class",
              "data-active",
              "data-background-color",
              "data-block-color",
              "data-block-style",
              "data-bn-thread-id",
              "data-checked",
              "data-colwidth",
              "data-content-type",
              "data-decoration-id",
              "data-depth",
              "data-depth-change",
              "data-editable",
              "data-file-block",
              "data-id",
              "data-index",
              "data-inline",
              "data-inline-content-type",
              "data-is-empty-and-focused",
              "data-is-only-empty-block",
              "data-language",
              "data-level",
              "data-mod-new-val",
              "data-mod-prev-val",
              "data-mod-type",
              "data-name",
              "data-nesting-level",
              "data-node-type",
              "data-node-view-wrapper",
              "data-orphan",
              "data-page-break",
              "data-prev-",
              "data-prev-depth-change",
              "data-prev-depth-changed",
              "data-prev-index",
              "data-prev-level",
              "data-prev-type",
              "data-show-children",
              "data-show-selection",
              "data-start",
              "data-style-type",
              "data-test",
              "data-text-alignment",
              "data-text-color",
              "data-type",
              "data-url",
              "data-value")
          .globally()
          .toFactory();
  private final String style;
  private final Clock clock;
  private final UserApi userApiClient;

  public OmsMedicalAssessmentService(
      MedicalAssessmentRepository medicalAssessmentRepository,
      OmsProcedureRepository procedureRepository,
      PersonClient personClient,
      FacilityClient facilityClient,
      Clock clock,
      UserApi userApiClient)
      throws IOException {
    this.medicalAssessmentRepository = medicalAssessmentRepository;
    this.procedureRepository = procedureRepository;
    this.personClient = personClient;
    this.facilityClient = facilityClient;
    this.clock = clock;
    InputStream resourceAsStream =
        OmsMedicalAssessmentService.class.getResourceAsStream("/assessments/style.css");
    assert resourceAsStream != null;
    try (Reader reader = new InputStreamReader(resourceAsStream, StandardCharsets.UTF_8)) {
      style = FileCopyUtils.copyToString(reader);
    }
    this.userApiClient = userApiClient;
  }

  @Transactional(readOnly = true)
  public List<AssessmentDto> getAssessmentsByProcedure(UUID procedureExternalId) {
    List<MedicalAssessment> assessments =
        medicalAssessmentRepository.findAllByProcedureExternalId(procedureExternalId);

    Map<UUID, UserDto> users = getUsersForAssessments(assessments);

    return MAPPER.map(assessments, users);
  }

  @Transactional(readOnly = true)
  public AssessmentDetailsDto getAssessmentById(UUID externalId) {
    MedicalAssessment assessment =
        medicalAssessmentRepository
            .findByExternalId(externalId)
            .orElseThrow(
                () -> new NotFoundException("Assessment %s not found".formatted(externalId)));

    if (!canCurrentUserCanReadDetail(assessment)) {
      throw new BadRequestException(
          INSUFFICIENT_USER_RIGHTS, "Only editor and previewReaders may assess open assessments");
    }

    Map<UUID, UserDto> users = getUsersForAssessments(List.of(assessment));

    return MAPPER.mapWithDetails(assessment, users, this::styleHtml);
  }

  @Transactional(readOnly = true)
  public AssessmentRecipientDto getAssessmentRecipientById(UUID externalId) {
    return medicalAssessmentRepository
        .findByExternalId(externalId)
        .map(this::toRecipientDto)
        .orElseThrow(() -> new NotFoundException(TXT_ASSESSMENT_NOT_FOUND.formatted(externalId)));
  }

  @Transactional()
  public UUID createAssessment(CreateAssessmentDto createAssessmentDto) {
    UUID procedureId = createAssessmentDto.procedureExternalId();
    OmsProcedure procedure =
        procedureRepository
            .findByExternalId(procedureId)
            .map(OmsMedicalAssessmentService::assertProcedureIsNotFinalized)
            .orElseThrow(
                () -> new NotFoundException(TXT_PROCEDURE_NOT_FOUND.formatted(procedureId)));

    MedicalAssessment entity = new MedicalAssessment();
    entity.setProcedure(procedure);

    AssessmentType assessmentType = MAPPER.map(createAssessmentDto.assessmentType());
    entity.setAssessmentType(assessmentType);

    RecipientType recipientType =
        Optional.ofNullable(createAssessmentDto.recipientType()).map(MAPPER::map).orElse(null);
    entity.setRecipientType(recipientType);

    entity.setTitle(createAssessmentDto.title());

    entity.setSummary(null);

    entity.setAssessmentStatus(AssessmentStatus.OPEN);
    entity.setAssessmentResult(null);
    entity.setSummary("");
    entity.setDocumentContent("");
    entity.setDocumentCache("");

    entity.setEditor(CurrentUserHelper.getCurrentUserId());

    medicalAssessmentRepository.save(entity);

    return entity.getExternalId();
  }

  @Transactional()
  public void deleteAssessment(UUID externalId) {
    MedicalAssessment assessment =
        medicalAssessmentRepository
            .findByExternalId(externalId)
            .map(OmsMedicalAssessmentService::assertAssessmentProcedureIsNotFinalized)
            .map(OmsMedicalAssessmentService::assertCurrentUserIsEditor)
            .map(OmsMedicalAssessmentService::assertAssessmentIsEditable)
            .orElseThrow(
                () -> new NotFoundException(TXT_ASSESSMENT_NOT_FOUND.formatted(externalId)));

    medicalAssessmentRepository.delete(assessment);
  }

  @Transactional()
  public void updateAssessmentTitleAndType(
      UUID externalId, String newTitle, AssessmentTypeDto newType) {
    MedicalAssessment assessment =
        medicalAssessmentRepository
            .findByExternalId(externalId)
            .map(OmsMedicalAssessmentService::assertAssessmentProcedureIsNotFinalized)
            .map(OmsMedicalAssessmentService::assertCurrentUserIsEditor)
            .map(OmsMedicalAssessmentService::assertAssessmentIsEditable)
            .orElseThrow(
                () -> new NotFoundException(TXT_ASSESSMENT_NOT_FOUND.formatted(externalId)));

    assessment.setTitle(newTitle);
    assessment.setAssessmentType(MAPPER.map(newType));

    medicalAssessmentRepository.save(assessment);
  }

  @Transactional()
  public void updateAssessmentSummary(UUID externalId, String newSummary) {
    MedicalAssessment assessment =
        medicalAssessmentRepository
            .findByExternalId(externalId)
            .map(OmsMedicalAssessmentService::assertAssessmentProcedureIsNotFinalized)
            .map(OmsMedicalAssessmentService::assertCurrentUserIsEditor)
            .orElseThrow(
                () -> new NotFoundException(TXT_ASSESSMENT_NOT_FOUND.formatted(externalId)));

    assessment.setSummary(newSummary);

    medicalAssessmentRepository.save(assessment);
  }

  @Transactional()
  public void updateAssessmentContent(
      UUID externalId, String newJsonContent, String newHtmlContent) {
    MedicalAssessment assessment =
        medicalAssessmentRepository
            .findByExternalId(externalId)
            .map(OmsMedicalAssessmentService::assertAssessmentProcedureIsNotFinalized)
            .map(OmsMedicalAssessmentService::assertCurrentUserIsEditor)
            .map(OmsMedicalAssessmentService::assertAssessmentIsEditable)
            .orElseThrow(
                () -> new NotFoundException(TXT_ASSESSMENT_NOT_FOUND.formatted(externalId)));

    String sanitizedHtml = sanitizeHtml(newHtmlContent);

    assessment.setDocumentContent(newJsonContent);
    assessment.setDocumentCache(sanitizedHtml);

    medicalAssessmentRepository.save(assessment);
  }

  @Transactional()
  public void updateAssessmentSources(UUID externalId, UpdateSourcesDto newSources) {
    MedicalAssessment assessment =
        medicalAssessmentRepository
            .findByExternalId(externalId)
            .map(OmsMedicalAssessmentService::assertAssessmentProcedureIsNotFinalized)
            .map(OmsMedicalAssessmentService::assertCurrentUserIsEditor)
            .map(OmsMedicalAssessmentService::assertAssessmentIsEditable)
            .orElseThrow(
                () -> new NotFoundException(TXT_ASSESSMENT_NOT_FOUND.formatted(externalId)));

    List<OmsSource> sources = newSources.sources().stream().map(MAPPER::map).toList();

    assessment.getSources().clear();
    assessment.getSources().addAll(sources);

    medicalAssessmentRepository.save(assessment);
  }

  @Transactional()
  public void updateAssessmentLegalBasis(UUID externalId, UpdateLegalBasisDto newLegalBasis) {
    MedicalAssessment assessment =
        medicalAssessmentRepository
            .findByExternalId(externalId)
            .map(OmsMedicalAssessmentService::assertAssessmentProcedureIsNotFinalized)
            .map(OmsMedicalAssessmentService::assertCurrentUserIsEditor)
            .map(OmsMedicalAssessmentService::assertAssessmentIsEditable)
            .orElseThrow(
                () -> new NotFoundException(TXT_ASSESSMENT_NOT_FOUND.formatted(externalId)));

    List<OmsLegalBasis> legalBases = newLegalBasis.legalBases().stream().map(MAPPER::map).toList();

    assessment.getLegalBases().clear();
    assessment.getLegalBases().addAll(legalBases);

    medicalAssessmentRepository.save(assessment);
  }

  @Transactional()
  public void updateAssessmentPreviewReader(
      UUID externalId, UpdatePreviewReaderDto updatePreviewReaderDto) {
    MedicalAssessment assessment =
        medicalAssessmentRepository
            .findByExternalId(externalId)
            .map(OmsMedicalAssessmentService::assertAssessmentProcedureIsNotFinalized)
            .map(OmsMedicalAssessmentService::assertCurrentUserIsEditor)
            .map(OmsMedicalAssessmentService::assertAssessmentIsEditable)
            .map(medicalAssessmentRepository::save)
            .orElseThrow(
                () -> new NotFoundException(TXT_ASSESSMENT_NOT_FOUND.formatted(externalId)));

    assessment.getPreviewReader().clear();
    assessment.getPreviewReader().addAll(updatePreviewReaderDto.previewPersons());

    medicalAssessmentRepository.save(assessment);
  }

  @Transactional()
  public void updateAssessmentStatus(UUID externalId, AssessmentStatusDto assessmentStatusDto) {
    MedicalAssessment assessment =
        medicalAssessmentRepository
            .findByExternalId(externalId)
            .map(OmsMedicalAssessmentService::assertAssessmentProcedureIsNotFinalized)
            .map(OmsMedicalAssessmentService::assertCurrentUserIsEditor)
            .orElseThrow(
                () -> new NotFoundException(TXT_ASSESSMENT_NOT_FOUND.formatted(externalId)));

    AssessmentStatus currentStatus = assessment.getAssessmentStatus();
    if (currentStatus == AssessmentStatus.PUBLISHED) {
      throw new IllegalStateException();
    }

    AssessmentStatus targetStatus = MAPPER.map(assessmentStatusDto);
    if (currentStatus == targetStatus) {
      throw new IllegalStateException();
    }

    if (currentStatus == AssessmentStatus.OPEN) {
      if (targetStatus != AssessmentStatus.FINISHED) {
        throw new IllegalStateException();
      }

      assessment.setAssessmentStatus(targetStatus);
      assessment.setFinished(clock.instant());
    }

    if (currentStatus == AssessmentStatus.FINISHED
        && (targetStatus == AssessmentStatus.OPEN || targetStatus == AssessmentStatus.PUBLISHED)) {
      assessment.setAssessmentStatus(targetStatus);
      if (targetStatus == AssessmentStatus.OPEN) {
        assessment.setFinished(null);
      }
    }

    medicalAssessmentRepository.save(assessment);
  }

  @Transactional()
  public void updateAssessmentResult(UUID externalId, AssessmentResultDto assessmentResultDto) {
    MedicalAssessment assessment =
        medicalAssessmentRepository
            .findByExternalId(externalId)
            .map(OmsMedicalAssessmentService::assertAssessmentProcedureIsNotFinalized)
            .map(OmsMedicalAssessmentService::assertCurrentUserIsEditor)
            .map(OmsMedicalAssessmentService::assertAssessmentIsEditable)
            .orElseThrow(
                () -> new NotFoundException(TXT_ASSESSMENT_NOT_FOUND.formatted(externalId)));

    AssessmentResult assessmentResult = MAPPER.map(assessmentResultDto);

    assessment.setAssessmentResult(assessmentResult);

    medicalAssessmentRepository.save(assessment);
  }

  @Transactional()
  public void updateAssessmentRecipientType(UUID externalId, RecipientTypeDto recipientTypeDto) {
    MedicalAssessment assessment =
        medicalAssessmentRepository
            .findByExternalId(externalId)
            .map(OmsMedicalAssessmentService::assertAssessmentProcedureIsNotFinalized)
            .map(OmsMedicalAssessmentService::assertCurrentUserIsEditor)
            .map(OmsMedicalAssessmentService::assertAssessmentIsEditable)
            .orElseThrow(
                () -> new NotFoundException(TXT_ASSESSMENT_NOT_FOUND.formatted(externalId)));

    RecipientType recipientType = MAPPER.map(recipientTypeDto);

    assessment.setRecipientType(recipientType);

    medicalAssessmentRepository.save(assessment);
  }

  private static MedicalAssessment assertAssessmentProcedureIsNotFinalized(
      MedicalAssessment assessment) {
    if (assessment == null) return null;

    OmsProcedure procedure = assessment.getProcedure();

    assertProcedureIsNotFinalized(procedure);

    return assessment;
  }

  private static OmsProcedure assertProcedureIsNotFinalized(OmsProcedure procedure) {
    if (procedure == null) return null;

    if (procedure.isFinalized()) {
      throw new BadRequestException(TXT_PROCEDURE_NOT_FOUND);
    }

    return procedure;
  }

  private static MedicalAssessment assertAssessmentIsEditable(MedicalAssessment assessment) {
    if (assessment == null) return null;

    if (assessment.getAssessmentStatus() != AssessmentStatus.OPEN) {
      throw new IllegalStateException(
          "Assessments may not be updated in status " + assessment.getAssessmentStatus());
    }

    return assessment;
  }

  private static MedicalAssessment assertCurrentUserIsEditor(MedicalAssessment assessment) {
    if (assessment == null) return null;

    UUID currentUserId = CurrentUserHelper.getCurrentUserId();
    if (!currentUserId.equals(assessment.getEditor())) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Assessment may only be updated by editor");
    }

    return assessment;
  }

  private static boolean canCurrentUserCanReadDetail(MedicalAssessment assessment) {
    if (assessment == null) return false;

    UUID currentUserId = CurrentUserHelper.getCurrentUserId();
    boolean isEditor = currentUserId.equals(assessment.getEditor());
    if (isEditor) {
      return true;
    }

    boolean isPreviewer = assessment.getPreviewReader().contains(currentUserId);
    return switch (assessment.getAssessmentStatus()) {
      case OPEN -> isPreviewer;
      case FINISHED, PUBLISHED -> true;
    };
  }

  private String sanitizeHtml(String rawHtml) {
    return htmlPolicyFactory.sanitize(rawHtml);
  }

  private String styleHtml(String html) {
    // TODO: make these configurable via the configurator.
    //  Be sure to supply RtfEditorField in the frontend with the same values.
    int fontSize = 16;
    String fontFamily =
        "Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, Open Sans, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif";

    String fontStyle =
        """
      .bn-content-view {
        font-size: %dpx;
        font-family: %s;
      }
      """
            .formatted(fontSize, fontFamily);
    return "<style>%s%s</style><div class=\"bn-content-view\">%s</div>"
        .formatted(fontStyle, style, html);
  }

  private AssessmentRecipientDto toRecipientDto(MedicalAssessment assessment) {
    OmsProcedure procedure = assessment.getProcedure();
    RecipientType recipientType = assessment.getRecipientType();
    if (recipientType == null) {
      throw new IllegalStateException("Recipient type is null");
    }

    String name;
    AddressDto address;
    if (recipientType == RecipientType.PERSON) {
      var person =
          Optional.ofNullable(procedure.findAffectedPerson())
              .map(Person::getCentralFileStateId)
              .map(personClient::getPersonFileState)
              .orElseThrow(
                  () ->
                      new IllegalStateException("Recipient type was person, but no person found"));

      name = person.firstName() + " " + person.lastName();
      address = person.contactAddress();
    } else if (recipientType == RecipientType.FACILITY) {
      var facility =
          procedure
              .getFacility()
              .map(Facility::getCentralFileStateId)
              .map(facilityClient::getFacilityFileState)
              .orElseThrow(
                  () ->
                      new IllegalStateException(
                          "Recipient type was facility, but no facility found"));

      name = facility.name();
      address = facility.contactAddress(); // Maybe use first contact person if available?
    } else {
      throw new IllegalStateException("Unrecognized recipient type");
    }

    return new AssessmentRecipientDto(name, address);
  }

  private Map<UUID, UserDto> getUsersForAssessments(List<MedicalAssessment> assessments) {
    List<UUID> userIds =
        assessments.stream()
            .flatMap(
                assessment ->
                    Stream.concat(
                        Stream.of(assessment.getEditor()), assessment.getPreviewReader().stream()))
            .distinct()
            .toList();
    return userApiClient.getUsersBulk(new GetUsersRequest(userIds, true)).users().stream()
        .collect(Collectors.toMap(UserDto::userId, Function.identity()));
  }
}
