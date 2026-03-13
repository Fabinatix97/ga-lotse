/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence;

import static de.eshg.base.centralfile.SamplingPointController.SAMPLING_POINT_REFERENCE_NOT_FOUND;
import static de.eshg.base.util.SamplingPointMatcher.matchesZid;

import de.eshg.base.centralfile.CentralFileAuditLogger;
import de.eshg.base.centralfile.api.samplingpoint.AddSamplingPointFileStateResponse;
import de.eshg.base.centralfile.mapper.SamplingPointMapper;
import de.eshg.base.centralfile.persistence.entity.DataOrigin;
import de.eshg.base.centralfile.persistence.entity.SamplingPoint;
import de.eshg.base.centralfile.persistence.repository.SamplingPointRepository;
import de.eshg.base.util.SamplingPointMatcher;
import de.eshg.mutex.MutexService;
import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class SamplingPointService {

  private static final Logger log = LoggerFactory.getLogger(SamplingPointService.class);
  public static final String MUTEX_SAMPLING_POINT_WRITE = "SAMPLING_POINT_WRITE";
  private final MutexService mutexService;
  private final CentralFileAuditLogger auditLogger;
  private final SamplingPointRepository samplingPointRepository;

  public SamplingPointService(
      MutexService mutexService,
      CentralFileAuditLogger auditLogger,
      SamplingPointRepository samplingPointRepository) {
    this.mutexService = mutexService;
    this.auditLogger = auditLogger;
    this.samplingPointRepository = samplingPointRepository;
  }

  public AddSamplingPointFileStateResponse addSamplingPointFileState(
      SamplingPoint samplingPointFileState, UUID referenceSamplingPointId) {

    try {
      return mutexService.doWithLockedMutex(
          MUTEX_SAMPLING_POINT_WRITE,
          () -> {
            SamplingPoint savedSamplingPointFileState =
                addSamplingPointFileStateWhenLocked(
                    samplingPointFileState, referenceSamplingPointId);
            return SamplingPointMapper.mapSamplingPointFileStateToApi(savedSamplingPointFileState);
          });
    } catch (DataIntegrityViolationException e) {
      if (samplingPointRepository.existsByZid(samplingPointFileState.getZid())) {
        throw new AlreadyExistsException(
            "Sampling point with zid=%s already exists".formatted(samplingPointFileState.getZid()));
      }
      throw e;
    }
  }

  public Optional<SamplingPoint> findMatchingReferenceSamplingPoint(SamplingPoint samplingPoint) {
    return samplingPointRepository
        .findReferenceSamplingPointByNameAndZid(samplingPoint.getName(), samplingPoint.getZid())
        .stream()
        .findFirst();
  }

  private SamplingPoint addSamplingPointFileState(
      SamplingPoint samplingPointFileState, SamplingPoint referenceSamplingPoint) {
    prepareFileStateToAddToDb(samplingPointFileState, referenceSamplingPoint);

    SamplingPoint savedSamplingPointFileState =
        samplingPointRepository.save(samplingPointFileState);
    auditLogger.logAddFileState(savedSamplingPointFileState);
    return savedSamplingPointFileState;
  }

  private SamplingPoint addSamplingPointFileStateWhenLocked(
      SamplingPoint samplingPointFileState, UUID referenceSamplingPointId) {
    SamplingPoint referenceSamplingPoint =
        findOrAddReferenceSamplingPointForAddSamplingPointFileState(
            samplingPointFileState, referenceSamplingPointId);

    return addSamplingPointFileState(samplingPointFileState, referenceSamplingPoint);
  }

  private SamplingPoint findOrAddReferenceSamplingPointForAddSamplingPointFileState(
      SamplingPoint samplingPointFileState, UUID referenceSamplingPointId) {

    if (referenceSamplingPointId != null) {
      return getReferenceSamplingPoint(referenceSamplingPointId);
    } else {
      return findMatchingReferenceSamplingPoint(samplingPointFileState)
          .orElseGet(() -> addSamplingPointForFileState(samplingPointFileState));
    }
  }

  public SamplingPoint getReferenceSamplingPoint(UUID referenceSamplingPointId) {
    return samplingPointRepository
        .findByExternalIdEqualsAndReferenceSamplingPointIsNull(referenceSamplingPointId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    SAMPLING_POINT_REFERENCE_NOT_FOUND.formatted(referenceSamplingPointId)));
  }

  public static boolean isSamplingPointFileStateOutdated(
      SamplingPoint samplingPointFileState, SamplingPoint samplingPointFacility) {
    return !SamplingPointMatcher.isSamplingPointMatch(
        samplingPointFacility, samplingPointFileState);
  }

  private static void prepareFileStateToAddToDb(
      SamplingPoint fileState, SamplingPoint referenceSamplingPoint) {
    fileState.setReferenceSamplingPoint(referenceSamplingPoint);
    fileState.setReferenceFacility(referenceSamplingPoint.getReferenceFacility());
    fileState.setReferenceVersion(referenceSamplingPoint.getVersion());
    referenceSamplingPoint.setDeleteAt(null);
  }

  private SamplingPoint addSamplingPointForFileState(SamplingPoint samplingPointFileState) {
    SamplingPoint samplingPoint = samplingPointFileState.cloneFromFileState();
    SamplingPoint savedReferenceSamplingPoint = samplingPointRepository.save(samplingPoint);

    auditLogger.logAddReferenceData(savedReferenceSamplingPoint);
    return savedReferenceSamplingPoint;
  }

  private void applySamplingPointUpdate(
      SamplingPoint fileStateUpdate, SamplingPoint referenceSamplingPoint) {
    referenceSamplingPoint.setName(fileStateUpdate.getName());
    referenceSamplingPoint.setZid(fileStateUpdate.getZid());
    referenceSamplingPoint.setDataOrigin(DataOrigin.EDIT);
  }

  public AddSamplingPointFileStateResponse updateReferenceSamplingPoint(
      UUID referenceDataId, long version, SamplingPoint referenceSamplingPointUpdate) {
    return mutexService.doWithLockedMutex(
        MUTEX_SAMPLING_POINT_WRITE,
        () -> {
          SamplingPoint updatedFacilityFileState =
              updateReferenceSamplingPointWhenLocked(
                  referenceDataId, version, referenceSamplingPointUpdate);
          return SamplingPointMapper.mapSamplingPointFileStateToApi(updatedFacilityFileState);
        });
  }

  private SamplingPoint updateReferenceSamplingPointWhenLocked(
      UUID referenceDataId, long version, SamplingPoint referenceSamplingPointUpdate) {

    SamplingPoint referenceSamplingPoint = getReferenceSamplingPoint(referenceDataId);
    ValidationUtil.validateVersion(version, referenceSamplingPoint);

    boolean requiresUpdate =
        SamplingPointMatcher.requiresUpdate(referenceSamplingPoint, referenceSamplingPointUpdate);
    if (requiresUpdate) {

      if (!matchesZid(referenceSamplingPoint, referenceSamplingPointUpdate)
          &&
          // zid is about to be updated and already exists at another reference sampling point
          samplingPointRepository.existsByZid(referenceSamplingPointUpdate.getZid())) {
        throw new AlreadyExistsException(
            "Sampling Point with zid=%s already exists".formatted(referenceSamplingPoint.getZid()));
      }

      applySamplingPointUpdate(referenceSamplingPointUpdate, referenceSamplingPoint);
      samplingPointRepository.flush();

      auditLogger.logEditReferenceData(referenceSamplingPoint);
    } else {
      log.debug("Recognized no-op update. Returning a new file state");
    }

    SamplingPoint fileState = referenceSamplingPoint.cloneFromReferenceSamplingPoint();
    return addSamplingPointFileState(fileState, referenceSamplingPoint);
  }
}
