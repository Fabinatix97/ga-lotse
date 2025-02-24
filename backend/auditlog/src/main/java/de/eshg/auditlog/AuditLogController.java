/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import static de.eshg.auditlog.AuditLogApi.QueryParameter.END_DATE;
import static de.eshg.auditlog.AuditLogApi.QueryParameter.START_DATE;
import static de.eshg.base.user.api.UserRoleDto.AUDITLOG_DECRYPT_AND_ACCESS;
import static de.eshg.file.common.CustomMediaTypes.TEXT_PLAIN_UTF_8;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.auditlog.crypto.AsymmetricEncryption;
import de.eshg.auditlog.crypto.AsymmetricEncryption.EncryptedKey;
import de.eshg.auditlog.crypto.AuditLogDecryptionException;
import de.eshg.auditlog.crypto.AuditLogEncryptionException;
import de.eshg.auditlog.crypto.SymmetricEncryption;
import de.eshg.auditlog.crypto.SymmetricEncryption.EncryptedPayload;
import de.eshg.auditlog.domain.model.AuditLogAccessibleProjection;
import de.eshg.auditlog.domain.model.AuditLogGrantedAccessProjection;
import de.eshg.auditlog.domain.model.AuditLogGranteesProjection;
import de.eshg.auditlog.domain.model.GrantedAccess;
import de.eshg.auditlog.domain.model.GrantedAccessRepository;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.GetUsersRequest;
import de.eshg.base.user.api.GetUsersResponse;
import de.eshg.base.user.api.UserDto;
import de.eshg.base.user.api.UserFilterParameters;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.persistence.IntentionalWritingTransaction;
import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import jakarta.servlet.ServletRequest;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.security.GeneralSecurityException;
import java.security.InvalidKeyException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;
import javax.crypto.AEADBadTagException;
import javax.crypto.Cipher;
import org.apache.commons.lang3.ArrayUtils;
import org.bouncycastle.jcajce.io.CipherInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class AuditLogController implements AuditLogApi, AuditLogArchivingApi {

  private static final Logger log = LoggerFactory.getLogger(AuditLogController.class);

  private static final String IV_FILE_NAME = "iv";
  private static final String ENCAPSULATED_KEY_FILE_NAME = "enc";
  private static final String ENCRYPTED_SYMMETRIC_KEY_FILE_NAME = "ct";
  private static final String CRYPTO_VERSION_FILE_NAME = "cv";
  private static final String ENCRYPTED_LOG_FILE_NAME = "log";

  private static final Comparator<AuditLogDto> AUDIT_LOG_DTO_COMPARATOR =
      Comparator.comparing(AuditLogDto::date).reversed().thenComparing(AuditLogDto::source);

  private static final Comparator<AccessibleAuditLogDto> ACCESSIBLE_AUDIT_LOG_DTO_COMPARATOR =
      (o1, o2) -> AUDIT_LOG_DTO_COMPARATOR.compare(o1.auditLog(), o2.auditLog());

  private final AuditLogServiceConfig auditLogServiceConfig;
  private final GrantedAccessRepository grantedAccessRepository;
  private final Clock clock;
  private final UserApi userApi;
  private final AuditLogger auditLogger;
  private final AsymmetricEncryption asymmetricEncryption;

  public AuditLogController(
      AuditLogServiceConfig auditLogServiceConfig,
      GrantedAccessRepository grantedAccessRepository,
      Clock clock,
      UserApi userApi,
      AuditLogger auditLogger,
      AsymmetricEncryption asymmetricEncryption) {
    this.auditLogServiceConfig = auditLogServiceConfig;
    this.grantedAccessRepository = grantedAccessRepository;
    this.clock = clock;
    this.userApi = userApi;
    this.auditLogger = auditLogger;
    this.asymmetricEncryption = asymmetricEncryption;
  }

  @Override
  public void addAuditlogFile(AddAuditLogFileRequest addAuditLogFileRequest, MultipartFile file) {
    log.info(
        "Received audit log from {} for {} ({} bytes)",
        addAuditLogFileRequest.source(),
        addAuditLogFileRequest.date(),
        file.getSize());

    Path targetDir = getTargetDir(addAuditLogFileRequest);
    validateTargetDirDoesNotExist(addAuditLogFileRequest, targetDir);
    createTargetDir(targetDir);
    encryptAndStoreAuditLog(addAuditLogFileRequest, file, targetDir);

    log.info("Successfully wrote received audit log to targetPath {}", targetDir);
  }

  @Override
  @Transactional
  @IntentionalWritingTransaction(reason = "Audit logging")
  public ResponseEntity<Resource> readAuditLogFile(
      String key, ReadAuditLogFileRequest readAuditLogFileRequest) {
    UserDto selfUser = userApi.getSelfUser();

    Map<String, String> additionalData =
        new LinkedHashMap<>(
            Map.of(
                "Benutzer", selfUser.userId().toString(),
                "Datum", readAuditLogFileRequest.date().format(DateTimeFormatter.ISO_DATE),
                "Modul", readAuditLogFileRequest.source().toString()));
    getRequestRemoteAddress().ifPresent(remoteAddress -> additionalData.put("IP", remoteAddress));
    auditLogger.log("Auditlog", "Auditlog lesen", additionalData);

    Path auditLogFilePath =
        getAuditLogFilePathOrThrow(
            readAuditLogFileRequest.source(), readAuditLogFileRequest.date());
    log.info("Reading audit log from {}", auditLogFilePath);

    Path ivFilePath = getIvFilePathOrThrow(readAuditLogFileRequest, auditLogFilePath);
    log.info("Using IV file {}", ivFilePath);

    validateAccessWasGranted(
        readAuditLogFileRequest.source(), readAuditLogFileRequest.date(), selfUser);

    Cipher cipher = createDecryptionCipher(key, ivFilePath);
    return ResponseEntity.ok()
        .contentType(TEXT_PLAIN_UTF_8)
        .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.inline().build().toString())
        .body(new InputStreamResource(() -> createInputStreamForFile(auditLogFilePath, cipher)));
  }

  private static CipherInputStream createInputStreamForFile(Path file, Cipher cipher)
      throws FileNotFoundException {
    return new CipherInputStream(new FileInputStream(file.toFile()), cipher);
  }

  private static Cipher createDecryptionCipher(String key, Path ivFilePath) {
    try {
      return SymmetricEncryption.createDecryptionCipher(
          Base64.getDecoder().decode(key), Files.readAllBytes(ivFilePath));
    } catch (IOException e) {
      throw new UncheckedIOException("Unable to read audit log files", e);
    } catch (InvalidKeyException e) {
      log.error("Invalid encryption key was given", e);
      throw new BadRequestException("Invalid decryption key");
    } catch (GeneralSecurityException e) {
      throw new AuditLogDecryptionException("Unable to decrypt audit log", e);
    }
  }

  @ExceptionHandler
  public ResponseEntity<ErrorResponse> handleInvalidKey(AEADBadTagException e) {
    log.error("Wrong decryption key was given", e);
    return ResponseEntity.badRequest()
        .contentType(MediaType.APPLICATION_JSON)
        .body(new ErrorResponse(ErrorCode.BAD_REQUEST, "Wrong decryption key"));
  }

  @Override
  public GetUsersResponse getAuditLogGranteesCandidates(
      GetAuditLogDataRequest getAuditLogDataRequest) {
    AuditLogSource source = getAuditLogDataRequest.source();
    LocalDate date = getAuditLogDataRequest.date();

    List<UserDto> users =
        userApi.getUsers(new UserFilterParameters(AUDITLOG_DECRYPT_AND_ACCESS, null)).users();

    List<UserDto> granteesCandidates =
        users.stream().filter(user -> existsUserSpecificDir(user.userId(), source, date)).toList();

    return new GetUsersResponse(granteesCandidates);
  }

  @Override
  public GetAuditLogGrantedAccessesResponse getAuditLogGrantedAccesses(
      GetAuditLogDataRequest getAuditLogDataRequest) {
    AuditLogSource source = getAuditLogDataRequest.source();
    LocalDate date = getAuditLogDataRequest.date();

    List<AuditLogGranteesProjection> grantees =
        grantedAccessRepository.findByAuditLogAndExpiresAtIsAfter(date, source, Instant.now(clock));

    Map<UUID, UserDto> resolvedUsers = resolveUsers(grantees);

    List<GrantedAccessDto> grantedAccesses =
        grantees.stream()
            .sorted(Comparator.comparing(user -> resolveUserLastName(user, resolvedUsers)))
            .map(
                grantee ->
                    new GrantedAccessDto(grantee.getIdOfGrantedUser(), grantee.getExpiresAt()))
            .toList();

    return new GetAuditLogGrantedAccessesResponse(grantedAccesses, resolvedUsers);
  }

  private Map<UUID, UserDto> resolveUsers(List<AuditLogGranteesProjection> grantees) {
    return userApi.getUsersBulk(new GetUsersRequest(getUserIds(grantees), false)).users().stream()
        .sorted(Comparator.comparing(UserDto::lastName))
        .collect(StreamUtil.toLinkedHashMap(UserDto::userId));
  }

  private String resolveUserLastName(
      AuditLogGranteesProjection user, Map<UUID, UserDto> resolvedUsers) {
    return resolvedUsers.get(user.getIdOfGrantedUser()).lastName();
  }

  private Set<UUID> getUserIds(List<AuditLogGranteesProjection> grantedAccessProjection) {
    return grantedAccessProjection.stream()
        .map(AuditLogGranteesProjection::getIdOfGrantedUser)
        .collect(StreamUtil.toLinkedHashSet());
  }

  private Optional<String> getRequestRemoteAddress() {
    RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
    if (requestAttributes instanceof ServletRequestAttributes servletRequestAttributes) {
      ServletRequest servletRequest = servletRequestAttributes.getRequest();
      return Optional.ofNullable(servletRequest.getRemoteAddr());
    }
    log.error("Unable get remote address for request");
    return Optional.empty();
  }

  private void validateAccessWasGranted(AuditLogSource source, LocalDate date, UserDto selfUser) {

    if (!grantedAccessRepository.existsByAuditLogSourceAndDateAndIdOfGrantedUserAndExpiresAtIsAfter(
        source, date, selfUser.userId(), Instant.now(clock))) {
      throw new BadRequestException(
          ErrorCode.INSUFFICIENT_USER_RIGHTS,
          "Access was not granted for audit log of %s of %s to user %s"
              .formatted(source, date, selfUser.username()),
          "Access was not granted for audit log of %s of %s to user with id %s"
              .formatted(source, date, selfUser.userId()));
    }
  }

  @Override
  @Transactional
  public void grantAuditLogAccess(GrantAuditLogAccessRequest grantAuditLogAccessRequest) {
    Set<UUID> idsOfGrantedUser = grantAuditLogAccessRequest.idsOfGrantedUser();

    for (UUID idOfGrantedUser : idsOfGrantedUser) {
      validateUserExists(idOfGrantedUser);
      validateUserIsNotSelf(idOfGrantedUser);
      validateRequestedAuditLogExists(grantAuditLogAccessRequest);
      validateUserSpecificDirExists(idOfGrantedUser, grantAuditLogAccessRequest);
    }

    AuditLogSource source = grantAuditLogAccessRequest.source();
    LocalDate date = grantAuditLogAccessRequest.date();
    Instant expiresAt =
        Instant.now(clock)
            .plus(Duration.ofDays(auditLogServiceConfig.getAccessGrantValidityDays()));

    log.info(
        "Granting access to audit log of {} at {} for {} valid until {}",
        source,
        date,
        idsOfGrantedUser,
        expiresAt);

    List<GrantedAccess> grantedAccesses =
        idsOfGrantedUser.stream()
            .map(id -> new GrantedAccess(date, source, expiresAt, id))
            .toList();

    grantedAccessRepository.saveAll(grantedAccesses);

    UserDto operatorUser = userApi.getSelfUser();

    for (UUID idOfGrantedUser : idsOfGrantedUser) {
      Map<String, String> additionalData =
          new LinkedHashMap<>(
              Map.of(
                  "Gewährt durch",
                  operatorUser.userId().toString(),
                  "Gewährt für",
                  idOfGrantedUser.toString(),
                  "Gewährt bis",
                  expiresAt
                      .atZone(clock.getZone())
                      .toLocalDateTime()
                      .format(DateTimeFormatter.ISO_DATE_TIME),
                  "Modul",
                  source.toString(),
                  "Datum",
                  date.toString()));
      getRequestRemoteAddress().ifPresent(remoteAddress -> additionalData.put("IP", remoteAddress));
      auditLogger.log("Auditlog", "Auditlog Zugriff gewährt", additionalData);
    }
  }

  @Override
  public GetEncryptedSymmetricKeyResponse getEncryptedSymmetricKey(
      GetEncryptedSymmetricKeyRequest getEncryptedSymmetricKeyRequest) {

    UserDto selfUser = userApi.getSelfUser();
    Path userSpecificDir =
        getUserSpecificDirOrThrow(
            selfUser.userId(),
            getEncryptedSymmetricKeyRequest.source(),
            getEncryptedSymmetricKeyRequest.date());
    log.info("Using user specific directory {}", userSpecificDir);

    validateAccessWasGranted(
        getEncryptedSymmetricKeyRequest.source(), getEncryptedSymmetricKeyRequest.date(), selfUser);

    try {
      Path encryptedSymmetricKeyPath = userSpecificDir.resolve(ENCRYPTED_SYMMETRIC_KEY_FILE_NAME);
      byte[] encryptedSymmetricKey = Files.readAllBytes(encryptedSymmetricKeyPath);
      log.info("Using encrypted symmetric key {}", encryptedSymmetricKeyPath);

      Path encapsulatedKeyPath = userSpecificDir.resolve(ENCAPSULATED_KEY_FILE_NAME);
      byte[] encapsulatedKey = Files.readAllBytes(encapsulatedKeyPath);
      log.info("Using encapsulated key {}", encapsulatedKeyPath);

      return new GetEncryptedSymmetricKeyResponse(
          toByteList(encapsulatedKey), toByteList(encryptedSymmetricKey));
    } catch (IOException e) {
      throw new UncheckedIOException("Unable to read user specific key", e);
    }
  }

  private List<Byte> toByteList(byte[] byteArray) {
    return Arrays.asList(ArrayUtils.toObject(byteArray));
  }

  @Override
  public GetAvailableAuditLogsResponse getAvailableLogs(
      GetAvailableAuditLogsFilterOptions filterOptions,
      GetAvailableAuditLogsPaginationOptions paginationOptions) {
    validateFilterOptions(filterOptions);

    List<AuditLogDto> auditLogs = new ArrayList<>();

    for (AuditLogSource source : AuditLogSource.values()) {
      auditLogs.addAll(getAvailableLogsForSource(source));
    }

    int totalElements = auditLogs.size();

    List<AuditLogDto> truncatedAuditLogs =
        auditLogs.stream()
            .filter(auditLog -> filterBySource(auditLog, filterOptions))
            .filter(auditLog -> filterByDate(auditLog, filterOptions))
            .sorted(AUDIT_LOG_DTO_COMPARATOR)
            .skip(getPaginationOffset(paginationOptions))
            .limit(paginationOptions.pageSize())
            .toList();

    List<AuditLogGrantedAccessCountDto> enrichedAuditLogs = new ArrayList<>();

    List<AuditLogGrantedAccessProjection> grantedAccessProjection =
        grantedAccessRepository.findByAuditLogInAndExpiresAtIsAfter(
            getRelevantDates(truncatedAuditLogs),
            getRelevantSources(truncatedAuditLogs),
            Instant.now(clock));

    for (AuditLogDto auditLog : truncatedAuditLogs) {
      int validGrantedAccessCount = getValidGrantedAccessCount(auditLog, grantedAccessProjection);
      enrichedAuditLogs.add(new AuditLogGrantedAccessCountDto(auditLog, validGrantedAccessCount));
    }

    return new GetAvailableAuditLogsResponse(
        Math.ceilDiv(totalElements, paginationOptions.pageSize()),
        totalElements,
        enrichedAuditLogs);
  }

  private boolean filterBySource(
      AuditLogDto auditLog, GetAvailableAuditLogsFilterOptions filterOptions) {
    Set<AuditLogSource> sources = filterOptions.source();

    if (sources == null || sources.isEmpty()) {
      return true;
    }

    return sources.contains(auditLog.source());
  }

  private boolean filterByDate(
      AuditLogDto auditLog, GetAvailableAuditLogsFilterOptions filterOptions) {
    LocalDate startDate = filterOptions.startDate();
    LocalDate endDate = filterOptions.endDate();

    if (startDate == null) {
      return true;
    }

    LocalDate date = auditLog.date();
    return !date.isBefore(startDate) && !date.isAfter(endDate);
  }

  private void validateFilterOptions(GetAvailableAuditLogsFilterOptions filterOptions) {
    LocalDate startDate = filterOptions.startDate();
    LocalDate endDate = filterOptions.endDate();

    if (startDate == null && endDate == null) {
      return;
    }

    if (!(startDate != null && endDate != null)) {
      throw new BadRequestException(
          "Date filtering requires both '%s' and '%s'. ".formatted(START_DATE, END_DATE));
    }

    if (endDate.isBefore(startDate)) {
      throw new BadRequestException(
          "'%s' must not be before '%s'. ".formatted(END_DATE, START_DATE));
    }
  }

  private Set<AuditLogSource> getRelevantSources(List<AuditLogDto> truncatedAuditLogs) {
    return truncatedAuditLogs.stream()
        .map(AuditLogDto::source)
        .collect(StreamUtil.toLinkedHashSet());
  }

  private Set<LocalDate> getRelevantDates(List<AuditLogDto> truncatedAuditLogs) {
    return truncatedAuditLogs.stream().map(AuditLogDto::date).collect(StreamUtil.toLinkedHashSet());
  }

  private Integer getValidGrantedAccessCount(
      AuditLogDto auditLog, List<AuditLogGrantedAccessProjection> grantedAccessProjection) {
    List<Integer> authorizedUsers =
        grantedAccessProjection.stream()
            .filter(aaL -> aaL.getAuditLog().equals(auditLog))
            .map(AuditLogGrantedAccessProjection::getValidGrantedAccessCount)
            .toList();

    if (authorizedUsers.isEmpty()) {
      return 0;
    }

    if (authorizedUsers.size() != 1) {
      throw new IllegalStateException("Expected single or none query result per audit log");
    }

    return authorizedUsers.get(0);
  }

  private long getPaginationOffset(GetAvailableAuditLogsPaginationOptions paginationOptions) {
    Integer pageNumber = paginationOptions.pageNumber();

    if (pageNumber == 0) {
      return 0;
    }

    return (long) paginationOptions.pageNumber() * paginationOptions.pageSize();
  }

  @Override
  public GetAccessibleAuditLogsResponse getAccessibleAuditLogs() {
    UserDto selfUser = userApi.getSelfUser();

    List<AuditLogAccessibleProjection> accesses =
        grantedAccessRepository.findByIdOfGrantedUserAndExpiresAtIsAfter(
            selfUser.userId(), Instant.now(clock));
    return new GetAccessibleAuditLogsResponse(
        accesses.stream()
            .map(this::mapToAccessibleAuditLogDto)
            .sorted(ACCESSIBLE_AUDIT_LOG_DTO_COMPARATOR)
            .toList());
  }

  private void validateUserSpecificDirExists(
      UUID idOfGrantedUser, GrantAuditLogAccessRequest grantAuditLogAccessRequest) {

    getUserSpecificDirOrThrow(
        idOfGrantedUser, grantAuditLogAccessRequest.source(), grantAuditLogAccessRequest.date());
  }

  private void validateRequestedAuditLogExists(
      GrantAuditLogAccessRequest grantAuditLogAccessRequest) {
    getAuditLogFilePathOrThrow(
        grantAuditLogAccessRequest.source(), grantAuditLogAccessRequest.date());
  }

  private void validateUserIsNotSelf(UUID userId) {
    UUID selfUserId = CurrentUserHelper.getCurrentUserId();
    if (selfUserId.equals(userId)) {
      throw new BadRequestException("Granting access to self is not possible");
    }
  }

  private void validateUserExists(UUID userId) {
    try {
      userApi.getUser(userId);
    } catch (HttpClientErrorException.NotFound notFound) {
      throw new NotFoundException("User not found");
    }
  }

  private Path getIvFilePathOrThrow(
      ReadAuditLogFileRequest readAuditLogFileRequest, Path auditLogFilePath) {
    Path ivFilePath = getPathOfCorrespondingIvFile(auditLogFilePath);
    if (!Files.isRegularFile(ivFilePath)) {
      throw new BadRequestException(
          "Unable to decrypt audit log for %s of %s"
              .formatted(readAuditLogFileRequest.date(), readAuditLogFileRequest.source().name()),
          "No initialization vector file found for %s of %s"
              .formatted(readAuditLogFileRequest.date(), readAuditLogFileRequest.source().name()));
    }
    return ivFilePath;
  }

  private Path getAuditLogFilePathOrThrow(AuditLogSource source, LocalDate date) {
    Path logStorageDir = auditLogServiceConfig.getLogStorageDir();
    Path dateAndServiceSpecificDir =
        getDateAndServiceSpecificDirOrThrow(logStorageDir, source, date);
    Path auditLogFilePath = getAuditLogFilePath(dateAndServiceSpecificDir);

    if (!Files.isRegularFile(auditLogFilePath)) {
      throw new BadRequestException(
          "No log found for %s of %s".formatted(date, source.name()),
          "No log file found for %s of %s".formatted(date, source.name()));
    }

    return auditLogFilePath;
  }

  private Path getDateAndServiceSpecificDirOrThrow(
      Path logStorageDir, AuditLogSource source, LocalDate date) {
    Path serviceSpecificDir = getServiceSpecificLogStorageDirOrThrow(logStorageDir, source);
    log.debug("Assuming service specific audit log dir {}", serviceSpecificDir);

    Path dateAndServiceSpecificDir = serviceSpecificDir.resolve(getFormatted(date));
    if (!Files.isDirectory(dateAndServiceSpecificDir)) {
      throw new BadRequestException(
          "Log for %s for %s does not exist".formatted(source.name(), date),
          "Log storage directory for %s for %s does not exist".formatted(source.name(), date));
    }

    log.debug("Assuming date and service specific audit log dir {}", dateAndServiceSpecificDir);
    return dateAndServiceSpecificDir;
  }

  private Path getAuditLogFilePath(Path parent) {
    return parent.resolve(ENCRYPTED_LOG_FILE_NAME);
  }

  private Path getServiceSpecificLogStorageDirOrThrow(Path logStorageDir, AuditLogSource source) {
    Path serviceSpecificLogStorageDir = logStorageDir.resolve(source.name());
    if (!Files.isDirectory(serviceSpecificLogStorageDir)) {
      throw new BadRequestException(
          "Log for %s does not exist".formatted(source.name()),
          "Log storage directory for %s does not exist".formatted(source.name()));
    }
    return serviceSpecificLogStorageDir;
  }

  private Path getTargetDir(AddAuditLogFileRequest addAuditLogFileRequest) {
    return auditLogServiceConfig
        .getLogStorageDir()
        .resolve(addAuditLogFileRequest.source().name())
        .resolve(getFormatted(addAuditLogFileRequest.date()));
  }

  private String getFormatted(LocalDate date) {
    return date.format(DateTimeFormatter.ISO_LOCAL_DATE);
  }

  private LocalDate getDateOrNull(Path dateSpecificDir) {
    if (dateSpecificDir == null) {
      return null;
    }
    try {
      return LocalDate.parse(
          dateSpecificDir.getFileName().toString(), DateTimeFormatter.ISO_LOCAL_DATE);
    } catch (DateTimeParseException e) {
      return null;
    }
  }

  private void createTargetDir(Path targetPath) {
    boolean createdTargetDir = targetPath.toFile().mkdirs();
    if (createdTargetDir) {
      log.debug("Created target directory {}", targetPath);
    }
  }

  private void validateTargetDirDoesNotExist(
      AddAuditLogFileRequest addAuditLogFileRequest, Path targetPath) {
    if (Files.exists(targetPath)) {
      throwBadRequestExceptionBecauseFileAlreadyExists(addAuditLogFileRequest);
    }
  }

  private void encryptAndStoreAuditLog(
      AddAuditLogFileRequest addAuditLogFileRequest, MultipartFile file, Path targetDirPath) {
    try {
      log.info("Encrypting received audit log symmetrically");
      EncryptedPayload encryptedPayload = SymmetricEncryption.encrypt(file.getBytes());

      log.info("Encrypting symmetric key asymmetrically for each user");
      List<EncryptedKey> encryptedKeys = asymmetricEncryption.encrypt(encryptedPayload.key());

      for (EncryptedKey encryptedKey : encryptedKeys) {
        Path dateAndServiceSpecificDir =
            getDateAndServiceSpecificDirOrThrow(
                auditLogServiceConfig.getLogStorageDir(),
                addAuditLogFileRequest.source(),
                addAuditLogFileRequest.date());

        Path userSpecificDir = dateAndServiceSpecificDir.resolve(encryptedKey.userId().toString());
        createTargetDir(userSpecificDir);

        log.debug("Storing user specific encrypted symmetric key in {}", userSpecificDir);
        Files.write(
            userSpecificDir.resolve(ENCRYPTED_SYMMETRIC_KEY_FILE_NAME),
            encryptedKey.encryptedSymmetricKey());
        Files.write(
            userSpecificDir.resolve(ENCAPSULATED_KEY_FILE_NAME), encryptedKey.encapsulatedKey());
      }

      Path ivOutputPath = targetDirPath.resolve(IV_FILE_NAME);
      log.info("Storing initialization vector for symmetric en- / decryption at {}", ivOutputPath);
      Files.write(
          ivOutputPath,
          encryptedPayload.iv(),
          StandardOpenOption.CREATE_NEW,
          StandardOpenOption.WRITE);

      Path cvOutputPath = targetDirPath.resolve(CRYPTO_VERSION_FILE_NAME);
      log.info("Storing crypto version at {}", cvOutputPath);
      Files.writeString(
          cvOutputPath,
          SymmetricEncryption.VERSION,
          StandardCharsets.UTF_8,
          StandardOpenOption.CREATE_NEW,
          StandardOpenOption.WRITE);

      Path logOutputPath = getAuditLogFilePath(targetDirPath);
      log.info("Storing symmetrically encrypted audit log at {}", logOutputPath);
      Files.write(
          logOutputPath,
          encryptedPayload.cipherText(),
          StandardOpenOption.CREATE_NEW,
          StandardOpenOption.WRITE);
    } catch (FileAlreadyExistsException e) {
      throwBadRequestExceptionBecauseFileAlreadyExists(addAuditLogFileRequest);
    } catch (IOException e) {
      throw new UncheckedIOException("Unable to write received audit log to targetPath", e);
    } catch (GeneralSecurityException e) {
      throw new AuditLogEncryptionException("Unable to perform crypto operations on audit log", e);
    }
  }

  private Path getUserSpecificDirOrThrow(UUID uuid, AuditLogSource source, LocalDate date) {
    Path userSpecificDir = getUserSpecificDir(uuid, source, date);
    if (!Files.isDirectory(userSpecificDir)) {
      throw new BadRequestException(
          "Log for the specified user for %s for %s does not exist".formatted(source.name(), date),
          "Log storage directory for user %s for %s for %s does not exist"
              .formatted(uuid, source.name(), date));
    }

    return userSpecificDir;
  }

  private Path getUserSpecificDir(UUID uuid, AuditLogSource source, LocalDate date) {
    Path dateAndServiceSpecificDir =
        getDateAndServiceSpecificDirOrThrow(auditLogServiceConfig.getLogStorageDir(), source, date);

    return dateAndServiceSpecificDir.resolve(uuid.toString());
  }

  private boolean existsUserSpecificDir(UUID uuid, AuditLogSource source, LocalDate date) {
    Path userSpecificDir = getUserSpecificDir(uuid, source, date);
    return Files.isDirectory(userSpecificDir);
  }

  private Path getPathOfCorrespondingIvFile(Path targetPath) {
    return targetPath.resolveSibling(IV_FILE_NAME);
  }

  private List<AuditLogDto> getAvailableLogsForSource(AuditLogSource source) {
    final Path serviceSpecificDir = auditLogServiceConfig.getLogStorageDir().resolve(source.name());

    if (Files.isDirectory(serviceSpecificDir)) {
      try (Stream<Path> dateSpecificDirs = Files.list(serviceSpecificDir)) {
        List<AuditLogDto> auditLogs = new ArrayList<>();

        for (Path dateSpecificDir : dateSpecificDirs.toList()) {
          final AuditLogDto auditLog = getAuditLogDtoOrNull(source, dateSpecificDir);
          if (auditLog != null) {
            auditLogs.add(auditLog);
          }
        }

        return auditLogs;
      } catch (IOException e) {
        throw new UncheckedIOException(
            "Unable to walk the file tree while looking for available logs", e);
      }
    } else {
      log.warn("{} is not a directory. Skipping...", serviceSpecificDir);
      return Collections.emptyList();
    }
  }

  private AuditLogDto getAuditLogDtoOrNull(AuditLogSource source, Path dateSpecificDir) {
    if (!Files.isDirectory(dateSpecificDir)) {
      log.debug("{} is not a directory. Skipping...", dateSpecificDir);
      return null;
    }

    final LocalDate date = getDateOrNull(dateSpecificDir);
    if (date == null) {
      log.debug("Cannot parse date from {}. Skipping...", dateSpecificDir);
      return null;
    }

    if (!Files.exists(dateSpecificDir.resolve(ENCRYPTED_LOG_FILE_NAME))) {
      log.warn("{} does not contain an actual log file. Skipping...", dateSpecificDir);
      return null;
    }

    return new AuditLogDto(date, source);
  }

  private AccessibleAuditLogDto mapToAccessibleAuditLogDto(
      AuditLogAccessibleProjection grantedAccess) {
    return new AccessibleAuditLogDto(
        new AuditLogDto(grantedAccess.getDate(), grantedAccess.getAuditLogSource()),
        grantedAccess.getExpiresAt());
  }

  private void throwBadRequestExceptionBecauseFileAlreadyExists(
      AddAuditLogFileRequest addAuditLogFileRequest) {
    throw new AlreadyExistsException(
        "Audit log for %s of %s already exists"
            .formatted(
                addAuditLogFileRequest.date().format(DateTimeFormatter.ISO_LOCAL_DATE),
                addAuditLogFileRequest.source()),
        "Audit log file for %s of %s already exists"
            .formatted(
                addAuditLogFileRequest.date().format(DateTimeFormatter.ISO_LOCAL_DATE),
                addAuditLogFileRequest.source()));
  }
}
