/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog.crypto;

import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.PublicEmployeeUserKeyDto;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import java.util.List;
import java.util.UUID;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.stereotype.Service;

/** provides a collection of P-256 public keys */
@Service
public class PublicKeyService {

  private final ModuleClientAuthenticator moduleClientAuthenticator;

  private final UserApi userApi;

  public PublicKeyService(ModuleClientAuthenticator moduleClientAuthenticator, UserApi userApi) {
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.userApi = userApi;
  }

  public List<UserPublicKey> getPublicKeys() {
    return moduleClientAuthenticator
        .doWithReplacedModuleClientAuthentication(userApi::getPublicEmployeeUserKeys)
        .publicUserKeys()
        .stream()
        .map(UserPublicKey::fromPublicEmployeeUserKeyDto)
        .toList();
  }

  public record UserPublicKey(UUID userId, byte[] publicKey) {

    private static UserPublicKey fromPublicEmployeeUserKeyDto(PublicEmployeeUserKeyDto userKeyDto) {
      return new UserPublicKey(userKeyDto.userId(), toByteArray(userKeyDto.publicKey()));
    }

    private static byte[] toByteArray(List<Byte> byteList) {
      return ArrayUtils.toPrimitive(byteList.toArray(Byte[]::new));
    }
  }
}
