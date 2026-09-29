import * as migration_20260929_055307_initial from './20260929_055307_initial';
import * as migration_20260929_064400_media_object_key from './20260929_064400_media_object_key';
import * as migration_20260929_070006_google_login from './20260929_070006_google_login';
import * as migration_20260929_072805_client_portal from './20260929_072805_client_portal';

export const migrations = [
  {
    up: migration_20260929_055307_initial.up,
    down: migration_20260929_055307_initial.down,
    name: '20260929_055307_initial',
  },
  {
    up: migration_20260929_064400_media_object_key.up,
    down: migration_20260929_064400_media_object_key.down,
    name: '20260929_064400_media_object_key',
  },
  {
    up: migration_20260929_070006_google_login.up,
    down: migration_20260929_070006_google_login.down,
    name: '20260929_070006_google_login',
  },
  {
    up: migration_20260929_072805_client_portal.up,
    down: migration_20260929_072805_client_portal.down,
    name: '20260929_072805_client_portal'
  },
];
