/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.crypto;

import de.eshg.prostituteprotection.domain.model.RandomSalt;
import de.eshg.prostituteprotection.domain.repository.RandomSaltRepository;
import jakarta.annotation.PostConstruct;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class RandomSaltService {

  public static final int SALT_LENGTH = 16;

  private static final SecureRandom SECURE_RANDOM = new SecureRandom();

  private final RandomSaltRepository repository;
  private byte[] cachedSalt;

  public RandomSaltService(RandomSaltRepository repository) {
    this.repository = repository;
  }

  byte[] getSalt() {
    return cachedSalt;
  }

  @PostConstruct
  public void initialize() {
    initSalt();
  }

  void initSalt() {
    List<RandomSalt> salts = repository.findAll();

    if (salts.isEmpty()) {
      byte[] salt = new byte[SALT_LENGTH];
      SECURE_RANDOM.nextBytes(salt);

      RandomSalt randomSalt = new RandomSalt();
      randomSalt.setSalt(salt);
      randomSalt.setCreatedAt(Instant.now());

      repository.save(randomSalt);
      cachedSalt = salt;
    } else {
      cachedSalt = salts.getFirst().getSalt();
    }
  }
}
