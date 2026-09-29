import * as migration_20260929_055307_initial from './20260929_055307_initial';
import * as migration_20260929_064400_media_object_key from './20260929_064400_media_object_key';

export const migrations = [
  {
    up: migration_20260929_055307_initial.up,
    down: migration_20260929_055307_initial.down,
    name: '20260929_055307_initial',
  },
  {
    up: migration_20260929_064400_media_object_key.up,
    down: migration_20260929_064400_media_object_key.down,
    name: '20260929_064400_media_object_key'
  },
];
