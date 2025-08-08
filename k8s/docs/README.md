# GA Lotse Helm Charts

These [helm](https://helm.sh/) charts (`eshg-ctr` and `eshg-gas`) install a complete [GA Lotse](https://gitlab.opencode.de/ga-lotse/ga-lotse-documentation) setup on a Kubernetes cluster.

## Overview

### eshg-ctr Chart

The `eshg-ctr` helm chart is used to set up the central services used by all health department instances.

Central services currently consist of
* the service directory with its admin portal UI,
* the relay server,
* the central repository with
* a local service directory and
* a keycloak, which is only used as a certificate store.

### eshg-gas Chart

The `eshg-gas` helm chart will create a health department instance.

A working instance consists of
* a keycloak as identity provider,
* a local service directory,
* the employee portal UI (accessible only to authenticated users) and
* the citizen portal UI ("public" access),
* an auditlog service,
* the base module as central backend service,
* a configurable set of business modules (currently up to 8),
* various supporting services (currently up to 3) and
* a matrix chat server (synapse).
* Additionally, for test instances without access to an SMTP server a "catch all" [maildev](https://maildev.github.io/maildev/) instance can be deployed.

### Library Chart

The `lib` chart holds templates which both `eshg` charts depend upon. Every template needs to be explicitly enabled in the `values` file to be active.

This reduces code duplication because the service mesh is a large part of the configuration.

### Service Mesh

The service directory (SD) holds a list of all known services (named actors) across all health department `eshg-gas` installations, as well as rule sets about allowed communication routes. The service directory assets are updated by the local service directories (LSD) that are a mandatory part of each instance (orgUnits in SD terms).

These communication rules are encapsulated (mutual TLS) and enforced by the `spatz` sidecar container. Each pod has its own `spatz` sidecar. It is configured as a DNS resolver of the application container. It decides based on the rule set whether the request is allowed and only then returns a DNS response (obtained from the cluster DNS resolver). Forbidden routes therefore usually show up as `unknown host` errors in logs etc.

For more details see the official [GA Lotse documentation](https://gitlab.opencode.de/ga-lotse/ga-lotse-documentation)

## Prerequisites

- Kubernetes 1.29+
- Helm 3.17.0+
- PostgreSQL 15
- optional: Helm chartsnap plugin (0.4.2+) for snapshotting

## Installing GA-Lotse

To get a working instance of GA-Lotse a central services instance (based on `eshg-ctr`) is needed as well as at least one health department instance (based on `eshg-gas`).

Additionally, the [service mesh](#service-mesh) (see above) needs to be correctly configured, otherwise some or all communication routes will be blocked. If the `actors.import` configuration for the `eshg-ctr` chart is done correctly and also includes correct information about the health department instance(s) a working configuration will be generated and imported automatically on first startup of the service directory.

When another health department instance is added, the generated configuration is also updated, but will not be imported by the service directory since the DB is already populated. However - currently - it is still necessary to at least add the lsd host of the new orgUnit to the configuration as that is part of the environment variables of the service directory pod.

To get secure and correctly configured instance the initial installation of a health department installation is divided in a two-step process (see [initial bootstrapping](#initial-bootstrapping-of-a-health-department-instance) below).

### Upgrading an existing installation

Currently, the values files are grouped into subdirectories to extract common settings (usually because they concern the target k8s cluster setup). Therefore, when installing the helm charts, two values files should be passed to helm, first the `values.common.yaml` and second the actual target configuration (e.g `values.myenv.central.yaml`).

First upgrade the central services' installation:

```shell
# from the repository root directory
helm dependency update k8s/helmcharts/eshg-ctr
helm upgrade --install --values k8s/helmcharts/eshg-ctr/values/target-cluster/values.common.yaml --values k8s/helmcharts/eshg-ctr/values/target-cluster/values.myenv.central.yaml --namespace central --set image.tag=2.3.4 eshg k8s/helmcharts/eshg-gas
```

Then upgrade (each) health department instance:

```shell
helm dependency update k8s/helmcharts/eshg-gas
helm upgrade --install --values k8s/helmcharts/eshg-gas/values/target-cluster/values.common.yaml --values k8s/helmcharts/eshg-gas/values/target-cluster/values.myenv.first-health-dep.yaml --namespace first-health-dep --set image.tag=2.3.4 eshg k8s/helmcharts/eshg-gas
```

### Initial Installation

For an initial installation you need to configure a central service instance and at least one health department instance. The central service instance should be deployed first, and after checking it is "up and running", the health department can be deployed.

### Cluster specific configuration

GA-Lotse needs PostgreSQL databases and Redis caches. The helm charts have different options to handle these resources.

#### PostgreSQL

If the `database.selfmanaged` and the `database.k8sDeployment` toggle is enabled, then a PSQL database stateful set is created for each needed db. If the `database.k8sDeployment` toggle is disabled, then the services assume that a secret named `<service>-db` exists in the target namespace and contains credentials to access the database (see example below). If both toggles are disabled, the helm chart will provision a custom resource of type `VSHNPostgreSQL` that should take care of everything needed to get a database up and running.

_Note: The PSQL deployment is only intended for development / testing purposes and is not considered production safe._

```yaml
apiVersion: v1
kind: Secret
data:
  POSTGRESQL_DB: servicedirectory
  POSTGRESQL_HOST: 10.11.12.13
  POSTGRESQL_PORT: "5432"
  POSTGRESQL_USER: database-username
  POSTGRESQL_PASSWORD: secret-password
```

#### Redis

The auth service needed for both "portals" relies on a redis cache. If the toggle `cache.selfmanaged` (available for both auth services) is true, then a deployment using a regular redis instance will be provisioned. If the toggle is disabled, a custom resource of type `VSHNRedis` will be provisioned.

### Example Central Services Configuration (eshg-ctr)

`values.myenv.central.yaml`:

```yaml
# These are only a part of the possible configuration values.
# Check values.yaml for more options.

# OCI registry where the application images can be found
image:
  registry: "registry.opencode.de"
  repository: "ga-lotse/ga-lotse-code"
  tag: "my-current-version"
  # k8s secret holding the docker auth in case of a private registry (mandatory)
  # the helm chart does not create / manage this secret!
  pullsecret: oci-registry-pull-secret
# a few third party images are needed as well. They are pulled from public
# sources but can be configured as well, see values.yaml

# this block holds all host name related information -  double check this section
# as typos will most likely produce a non-functional setup
domains:
  # cluster local address of the services
  # usually <namespace>.svc.cluster.local
  clusterLocalSuffix: .central.svc.cluster.local
  # central services hosts that are also relevant for the health department instances
  centralservices:
    servicedirectory: service-directory.cs.my-ga-lotse.de
    relayserver: relay-server.cs.my-ga-lotse.de
    pdfaconverterportal: pdf-converter-portal.cs.my-ga-lotse.de
  # hosts only relevant within this instance
  hosts:
    lsd: lsd.cs.my-ga-lotse.de
    adminportal: admin-portal.cs.my-ga-lotse.de
    # for the central services instance the "external" and keycloakInternal
    # hostname should match (and be a cluster internal only address!)
    keycloak: keycloak-central-internal.cs.my-ga-lotse.de
    keycloakInternal: keycloak-central-internal.cs.my-ga-lotse.de
  # the org unit (see service mesh) to which the local service directory (lsd) belongs
  # this must match with the orgUnit name in the actors.import.orgUnit configuration
  lsdOrgUnit: central
  # cluster issuer for cert manager for public URLs
  clusterIssuer: letsencrypt-prod-issuer
  # cluster issuer for cert manager for internal-only URLs
  internalClusterIssuer: letsencrypt-internal-issuer

# !!! the lsd hostname of each orgUnit below will be included in the
# service directory inbound client cname allow list !!!
#
# this block generates a valid initial service directory configuration which is *only*
# imported when the SD database is empty on application start.
# If the db is already populated the configuration is ignored (the lsd hostnames
# are still important - see above!)
actors:
  import:
    enabled: true
    orgUnits:
      - name: frankfurt
        # make sure to use the actual hostnames / cluster URLs of the (future) health department instance!
        clusterLocalSuffix: .frankfurt.svc.cluster.local
        employeePortal: employee-portal.frankfurt.my-ga-lotse.de
        citizenPortal: citizen-portal.frankfurt.my-ga-lotse.de
        lsd: lsd.frankfurt.my-ga-lotse.de # very important - see above!
        # federalState and type have mostly informational purpose and
        # are used to write wildcard routing rules
        federalState: HE
        type: GA
        # if this contains an explicit list of actors only they will be part of the initial configuration
        # if the list is empty all "business modules" are used
        actors: [ ]
        # this allows to exclude specific actors from the initial configuration
        skipActors:
          - centralrepository
      - name: central
        # since this configuration file is about the central services the clusterLocalSuffix
        # and the lsd hostname must match with these above in the domains block
        clusterLocalSuffix: .central.svc.cluster.local
        lsd: lsd.cs.my-ga-lotse.de
        federalState: DE
        type: ZD
        actors:
          - centralrepository
        skipActors: [ ]

# currently traefik and openshift are supported as ingress controllers
# traefik uses 'IngressRouteTCP'  - openshift uses 'Route'
ingress:
  # Possible values: `traefik`, `openshift`.
  type: "traefik"

# This toggles whether the persistent volume claims (used for debug logs and the auditlog archive)
# should set an explicit storage class attribute - if true then the `debuglog.class` or
# `auditlog.class` property of the module will be used
volumes:
  customStorageClass: false

# This IP address points to the cluster internal DNS resolver - see service mesh
dns:
  upstream: 10.43.0.10

# The following blocks are about different services which will get deployed.
# Quite a few configuration will be skipped here because the default value is used.
# Most services have a `enabled` toggle, a `resources´ and a `dns` block. 
# Check out values.yaml to see all values.

# service directory configuration - defaults should work for most setups
servicedirectory:
  # nothing will work without :D
  enabled: true
  # note: the values below are copied from the default values file
  database:
    # if this is "true" the service expects to find a secret with the necessary db configuration (see above)
    # if this is "false" the custom k8s resource `VSHNPostgreSQL` resource will be provisioned
    selfmanaged: true
  # if resources is specified the whole block will be replaced - not merged with default!
  resources:
    requests:
      cpu: 10m
      memory: 256Mi
    limits:
      memory: 1024Mi
  # most services take a DNS allow list to allow communication with explicit remote hosts
  dns:
    # This configures an allow list for outgoing connections in the spatz container.
    allowList: [ ]

# the admin portal UI - includes the NextJS BFF and nginx as reverse proxy
adminportal:
  enabled: true
  # this is a "list" of public certificates (as expected by nginx) which are
  # accept to authorize via mTLS when accessing the admin portal
  usercerts: |-
    -----BEGIN CERTIFICATE-----
    MIIFfTCCA2WgAwIBAgIUWmNSG+qX9gMYMUY8kz/w1aP+TwcwDQYJKoZIhvcNAQEL
    [...]
    kqEMY6ZK8CPhUhhXCw+oBEk=
    -----END CERTIFICATE-----
    -----BEGIN CERTIFICATE-----
    MIIFfTCCA2WgAwIBAgIUM2JrMws+Onm9X2BA3nq7pDTQV5owDQYJKoZIhvcNAQEL
    [...]
    JwAbNxvexh1VrqU1Ew4DHmg=
    -----END CERTIFICATE-----

# Simple statically served web app to convert PDF files to pdfa files.
pdfaconverterportal:
  enabled: true

# the relay server which handles communication across org units
relayserver:
  enabled: true

# keycloak as certificate store only (when used in central services)
keycloak:
  enabled: true
  # this optional section is merged with the default configuration
  podSecurityContext:
    runAsUser: 1000
    runAsGroup: 1000
    fsGroup: 1000

# local service directory to handle service directory communication / certificate management
lsd:
  enabled: true

# resource limits for the spatz sidecar container (again these are the defaults and could be omitted)
spatz:
  resources:
    requests:
      cpu: 10m
      memory: 64Mi
    limits:
      memory: 512Mi

# resource limits and whether the database is self-hosted (see below) or not can be configured
# for all business modules - overwriting these for individual modules is still possible
# (and again: this block is copied from vales.yaml - so it could be deleted)
businessmoduleDefaults:
  resources:
    requests:
      memory: 128Mi
      cpu: 10m
    limits:
      memory: 1024Mi
  database:
    selfmanaged: true

# there is only centralrepository as business module in the central services instance
businessmodules:
  centralrepository:
    enabled: true
    # debug logs of the spring applications are stored on a separate volume because they contain
    # sensitive data - the volume size can be adjusted and the storage class can be overwritten of the
    # customStorageClass toggle from above is enabled
    # (the debuglog block here is only an example and can be omitted - 1Gi is the default) 
    debuglog:
      size: "1Gi"
      class: "my-storage-class"


# this configures the active spring profiles for the backend service applications
spring:
  profiles:
    active: "dev, preview-features"
    # or maybe
    #active: "production"

# the pod and container securityContext settings can be configured here for *all* pods/containers
# beware that some options might create issues depending on the target cluster
# for example with OpenShift's security context constraints feature
podSecurityContext:
  runAsUser: 1001
  runAsGroup: 1001
  fsGroup: 1001
  runAsNonRoot: true
  seLinuxOptions:
    type: "RuntimeDefault"
  seccompProfile:
    type: "RuntimeDefault"
  # we need to start a DNS server listening at port 53 in all spatz containers
  # using capabilities does not work in this combination
  # see https://github.com/kubernetes/kubernetes/issues/56374
  sysctls:
    - name: net.ipv4.ip_unprivileged_port_start
      value: "52"

containerSecurityContext:
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  privileged: false
  capabilities:
    drop:
      - ALL

# there are a few liveness and readiness probes configured
# for details see the default values.yaml
# Please note if a probe configuration is overwritten by a value file
# it is taken "as is" and not merged!

# Liveness Probe for application containers
#springBootLivenessProbe:
  #[...]
  
# Readiness Probe for application containers
#springBootReadinessProbe:
  #[...]

# Liveness probes for spatz sidecars
#spatzLivenessProbe:
  #[...]

# Readiness probes for spatz sidecars
#spatzReadinessProbe:
  #[...]

# also a preStop lifecycle configuration to allow a graceful spring boot shutdown
#containersLifecycle:
  #[...]

# this configures the file size upload limit for several spring backend applications
backend:
  upload:
    maxFileUploadSizeInBytes: "26214400" # 25MB

# this option is used to handle TLS encrypted communication when deploying to a local
# (k3d) kubernetes cluster (or in theorey any cluster without a "trusted" issuer)
# The JVM truststore is replaced with the provided one and the single CA cert
# is added to the system SSL certificates
#
# This option assumes that a configmap named "ca" with two files exists
# * ca.crt: certificate of the self-signed root CA in PEM format
# * cacerts: the default JVM truststore with imported "ca.crt"
development:
  injectSelfSignedCA: false
```

### Health department Configuration (eshg-gas)

`values.myenv.first-health-dep.yaml`

```yaml
# identical to ctr chart - OCI registry where the application images can be found 
image:
  registry: "registry.opencode.de"
  repository: "ga-lotse/ga-lotse-code"
  tag: "my-current-version"
  pullsecret: oci-registry-pull-secret

# mostly identical to ctr chart
# this block holds all host name related information -  double check this section
# as typos will most likely produce a non-functional setup

domains:
  # cluster local address of the services - must match with configuration 
  # usually <namespace>.svc.cluster.local
  # this must match with the actors.import[].clusterLocalSuffix the ctr configuration
  clusterLocalSuffix: .frankfurt.svc.cluster.local
  # central services hosts that are also relevant for the health department instances
  centralservices:
    servicedirectory: service-directory.cs.my-ga-lotse.de
    relayserver: relay-server.cs.my-ga-lotse.de
    centralrepository: centralrepository.central.svc.cluster.local
    pdfaconverterportal: pdf-converter-portal.cs.my-ga-lotse.de
  # hosts only relevant within this instance    
  hosts:
    # lsd and both portals must match with ctr configuration in actors.import[].*
    lsd: lsd.frankfurt.my-ga-lotse.de
    employeeportal: employee-portal.frankfurt.my-ga-lotse.de
    citizenportal: citizen-portal.frankfurt.my-ga-lotse.de
    maildev: mail.frankfurt.my-ga-lotse.de
    # keycloak is "world accessible" from
    keycloak: keycloak.frankfurt.my-ga-lotse.de
    # cluster internal accesss via
    keycloakInternal: keycloak-internal.frankfurt.my-ga-lotse.de
  # the org unit (see service mesh) to which the local service directory (lsd) belongs
  # this must match with the orgUnit name in the actors.import[].orgUnit name in the ctr configuration
  lsdOrgUnit: frankfurt
  # cluster issuer for cert manager for public URLs
  clusterIssuer: letsencrypt-prod-issuer
  # cluster issuer for cert manager for internal-only URLs
  internalClusterIssuer: letsencrypt-internal-issuer

# currently traefik and openshift are supported as ingress controllers
# traefik uses 'IngressRouteTCP'  - openshift uses 'Route'
ingress:
  # Possible values: `traefik`, `openshift`.
  type: "traefik"

# This toggles whether the persistent volume claims (used for debug logs and the auditlog archive)
# should set an explicit storage class attribute - if true then the `debuglog.class` or
# `auditlog.class` property of the module will be used
volumes:
  customStorageClass: false

# This IP address points to the cluster internal DNS resolver - see service mesh
dns:
  upstream: 10.43.0.10

# In-cluster monitoring using Prometheus and prometheus-operator
monitoring:
  # ServiceMonitors are enabled by default
  # this requires prometheus-operator to be installed in the cluster
  serviceMonitor:
    enabled: true
  # enable an HTTP 200 probe for selected public endpoints of the application (disabled by default)
  httpChecks:
    enabled: true
    blackboxExporterAddress: "prometheus-blackbox-exporter.cluster-monitoring.svc.cluster.local:9115"

# The following blocks are about different services which will get deployed.
# Quite a few configuration will be skipped here because the default value is used.
# Most services have a `enabled` toggle, a `resources´ and a `dns` block.
# The `database.selfmanaged` toggle which decides whether a custom PSQL resource is
# provisioned or not (see above) is also available for most services.
# If a `resources` block is configured it will replace the default configuration - not merged with it! 
# Check out values.yaml to see all values.


# keycloak as IDP
keycloak:
  enabled: true
  # muk = Mein Unternehmenskonto
  # this is a 3rd party identity provider used for some workflows in the citizen portal
  muk:
    profile: "e4k"
    signingCertificate: "MIIF2DCCBAygAwI[...]OhCzzkL4ukTDbqFa+v"
  # this is a 3rd party identity provider used for some workflows in the citizen portal
  bundId:
    profile: "integration"
    signingCertificate: "MIIDGDCCAgCgAwIB[...]rl2v73NQCc1m2Do2Fq7Og=="
    onlineServiceId: "BMI-B0012345"
    organizationDisplayName: "Gesundheitsamt Stadt Frankfurt am Main"

# local service directory to handle service directory communication / certificate management
lsd:
  enabled: true

# maildev smtp server with web UI (URL see above in domains.hosts)
maildev:
  # only used for test instances
  enabled: true

# nginx based reverse proxy for the employee portal
employeeportal:
  enabled: true

# backend service which handles authentication and sessions for employee-portal users
employeeportalauth:
  # Redis cache to hold active sessions
  cache:
    # if this is "true" a deployment with a redis services is provisioned
    # if this is "false" the custom k8s resource `VSHNRedis` resource will be provisioned
    selfmanaged: true

# NextJS server of the employee portal pages (BFF) - has no separate "enabled" toggle
#employeeportalnextjs:

# nginx based reverse proxy for the citizen portal
citizenportal:
  enabled: true

# backend service which handles authentication and sessions for citizen-portal users
citizenportalauth:
  # Redis cache to hold active sessions
  cache:
    # if this is "true" a deployment with a redis services is provisioned
    # if this is "false" the custom k8s resource `VSHNRedis` resource will be provisioned
    selfmanaged: true

# NextJS server of the employee portal pages (BFF) - has no separate "enabled" toggle
#citizenportalnextjs:

# synapse server for matrix chat (integrated into employee portal application - no outside access!)
synapse:
  enabled: false

# backend service which aggregates audit relevant events from the business modules
auditlog:
  enabled: true

# resource limits for the spatz sidecar container (again these are the defaults and could be omitted)
spatz:
  resources:
    requests:
      cpu: 10m
      memory: 64Mi
    limits:
      memory: 512Mi

# resource limits and whether the database is self-hosted (see below) or not can be configured
# for all business modules - overwriting these for individual modules is still possible
# (and again: this block is copied from vales.yaml - so it could be deleted)
businessmoduleDefaults:
  resources:
    requests:
      memory: 128Mi
      cpu: 10m
    limits:
      memory: 1024Mi
  database:
    selfmanaged: true

# list of (active) business modules 
businessmodules:
  base:
    enabled: true
    # these are very important parameters concerning the initial application bootstraping (see below)
    setupAdmin:
      email: email-address-of-the-admin-user
      username: keycloak-username-of-the-admin    
    # production instances allow only passkey logins - enable this to allow username/password based logins as well
    allowEmployeePasswords: false
    # production instances have no pre provisioned users (only groups with a defined set of roles are created in keycloak)
    # turn this on to provision test users as well
    provisionTestUsers: false
    database:
      # PSQL extension that are needed for the module's database
      # (matches default value from values.yaml)
      extensions:
        - name: unaccent
        - name: pg_trgm
    # list of deployments in the same namespace which need a ready state before this services is started
    # (matches default value from values.yaml)
    waitFor:
      - lsd
    # noreply email adresse for emails sent by teh application
    noreplyMail: support@ga-lotse.de
    smtp:
      # This should be false if maildev is used - a real SMTP server is hopefully contacted via TLS
      ssl: false
    # overwrite businessmoduleDefaults resource limits (matches default value from values.yaml)
    resources:
      requests:
        cpu: 10m
        memory: 128Mi
      limits:
        memory: 1500Mi
  schoolentry:
    enabled: true
    # default image name is derived from the module name (schoolentry in this case) but can be overwritten
    imageName: school-entry
    # (matches default value from values.yaml)
    database:
      extensions:
        - name: unaccent
        - name: pg_trgm
    # (matches default value from values.yaml)
    waitFor:
      - lsd
      - base
  inspection:
    enabled: true
    # these options all match the default values
    waitFor:
      - lsd
      - base
    # the inspection module fetches data about business from openstreet map resources
    dns:
      allowList:
        - nominatim.openstreetmap.org
        - download.geofabrik.de
  # the following business modules usually only need to configure the deployments they `waitFor`
  # and the image name in some cases (again see values.yaml)
  measlesprotection:
    enabled: true
  travelmedicine:
    enabled: true
  statistics:
    enabled: true
  stiprotection:
    enabled: true
  medsabroad:
    enabled: true
  medicalregistry:
    enabled: true
    # rate limiting of the public endpoint via Bucket4J in the backend application
    ratelimit:
      capacity: 10000 # per interval
      interval: 1 # in minutes
      drafts: 5000 # draft procedure limit for citizen submitted data
  dental:
    enabled: true
  opendata:
    enabled: true
  chatmanagement:
    enabled: true
  officialmedicalservice:
    enabled: true

# this configures the active spring profiles for the backend service applications
spring:
  profiles:
    active: "dev, preview-features"
    # or maybe
    #active: "production"

# the citizen portal has a separate option to define
# whether it is production deployment or not (default "test") 
deploymenttype: "production"

# Rate limits for public endpoints (based on remote addr)
# These are enforced by the nginx reverse proxy
limitReqZone:
  organisationsReport:
    limitRate: "5r/m"
  tmCitizenProcedure:
    limitRate: "1r/m"
```

### Initial Bootstrapping of a Health Department Instance

The first deployment will create a config map named `keycloak-bootstrap` with a single value `bootstrapEnabled = true`. Additionally, the following values need to be set correctly in the values file:

```yaml
businessmodules:
  base:
    setupAdmin:
      email: email-address-of-the-admin-user
      username: keycloak-username-of-the-admin
```

When the base module starts it will use the temporary bootstrap keycloak admin to create a client for itself. Additionally, it creates an admin account which will be used by the health department admin to further configure the instance. Access to this account needs to be claimed via the email sent automatically by keycloak to the specified email address (`businessmodules.base.setupAdmin.email`). Please note: The link in the email is only valid for twelve hours! However, restarting the base module will send new invitation emails as long as the setup admin was not created (i.e. the link was not used).

When all pods are up and running, and it was confirmed that keycloak was able to send out the admin account activation email, the base module has successfully configured keycloak and the bootstrap admin account must be disabled, by manually setting the `bootstrapEnabled` property in the config map to `false` directly on the cluster. Afterward, the base module needs to be restarted.

When the admin account for the health department employee has been successfully created, the `email` and `username` property should also be removed from the values file, but this change can be delivered with the next regular deployment.

```shell
kubectl --namespace <HEALTH_DEPARTMENT_NAMESPACE> patch configmaps/keycloak-bootstrap -p '{ "data": { "bootstrapEnabled": "false" } }'
```

_replace <HEALTH_DEPARTMENT_NAMESPACE> by the actual health department's namespace_

**Attention**: This will disable the keycloak bootstrap admin and is not easily reversible! If you lost access to keycloak please refer to the ga-lotse-documentation for the [recovery process](https://gitlab.opencode.de/ga-lotse/ga-lotse-documentation/-/blob/main/operations-manual/keycloak-master-realm-administration/use-cases/recover-admin.adoc)!

The `email` and `username` values from the base module configuration can be removed from the values file (this can wait until the next regular update / deployment).

#### Manual migration for instances with completed bootstrapping

Create this config map in the target namespace, the `release-namespace` property needs to be adjusted, the property `release-name` maybe as well.

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  annotations:
    meta.helm.sh/release-name: eshg
    meta.helm.sh/release-namespace: <my-namespace>
  name: keycloak-bootstrap
  labels:
    app.kubernetes.io/managed-by: Helm
data:
  bootstrapEnabled: "false"
```

### Admin Portal Certificates

The local deployment already contains two "pre generated" certificates which are included in the repostory. The password for the PKCS12 certificates is `admin1` or `admin2` respectively. To use them you need to import the PKCS12 certificates located in [k8s/helmcharts/eshg-ctr/values/local/admin-portal-certs](../helmcharts/eshg-ctr/values/local/admin-portal-certs) into your browser's certificate store.

## Changelog

### changes since last version

* A health department specific spring profile is no longer necessary - all configuration must be done via the configurator.

### 1.11.0

* Add new deployment "PDF converter" to central services - its domain name
  needs to be configured for each GA instance\
  see `domains.centralservices.pdfaconverterportal`
* Switch mTLS Spatz connections to TLSv1.3 without certificate_authorities extension
* Revert increased TLS handshake size
* Clean up default values files in preparation for helm chart release

### 1.10.2

* Increase max size of TLS handshake for spatz containers

### 1.10.0

* Add support for new business module "medsabroad"
* Changes to public endpoints - effects monitoring via HTTP probes

### 1.8.1

* Adjust bootstrapping process

### 1.8.0

* Add configuration for a local deployment 

### 1.7.0

* Improve workload hardening \
  The default `values.yaml` now contains a section for pod and container security settings.

### 1.6.9

* Increase memory limits for employee portal nextJS server
* Add `clusterLocalSuffix` as an (important!) value for the OrgUnit configuration in `actors.import` \
  This has no impact on existing instances as this is only relevant for the SD import, which will not run when the DB is populated. \
  However, it is strongly recommended to adjust existing values files to have a clean state / reference.
* Rework of bootstrapping a new health department instance. \
  Instances that already completed the bootstrapping process need to [manually create a config map](#manual-migration-for-instances-with-completed-bootstrapping) **before** installing this version!

### 1.6.8

* Add blackbox exporter for public HTTP endpoint
* Update of nginx (1.27.4) / kubectl (1.32.2) base images
* Group values files by target cluster and extract common values

### 1.6.7

* Change `lsd-import` from configmap into secret
* Default service account privileges dropped to "list deployment" only

### 1.6.6

* Remove the `servicemonitor.enabled` property, ServiceMonitors will be deployed to all envs
* Removed the packaged library chart dependency (tgz) from git - `helm dependency update` must be run explicitly
