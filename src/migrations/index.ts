import * as migration_20260929_055307_initial from './20260929_055307_initial';

export const migrations = [
  {
    up: migration_20260929_055307_initial.up,
    down: migration_20260929_055307_initial.down,
    name: '20260929_055307_initial'
  },
];
