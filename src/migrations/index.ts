import * as migration_20260929_055307_initial from './20260929_055307_initial';
import * as migration_20260929_064400_media_object_key from './20260929_064400_media_object_key';
import * as migration_20260929_070006_google_login from './20260929_070006_google_login';
import * as migration_20260929_072805_client_portal from './20260929_072805_client_portal';
import * as migration_20260929_073628_line from './20260929_073628_line';
import * as migration_20260929_075909_live_preview_drafts from './20260929_075909_live_preview_drafts';
import * as migration_20260929_082714_line_inquiry_flow from './20260929_082714_line_inquiry_flow';
import * as migration_20260929_085129_editable_contact from './20260929_085129_editable_contact';
import * as migration_20260929_091720_localization from './20260929_091720_localization';

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
    name: '20260929_072805_client_portal',
  },
  {
    up: migration_20260929_073628_line.up,
    down: migration_20260929_073628_line.down,
    name: '20260929_073628_line',
  },
  {
    up: migration_20260929_075909_live_preview_drafts.up,
    down: migration_20260929_075909_live_preview_drafts.down,
    name: '20260929_075909_live_preview_drafts',
  },
  {
    up: migration_20260929_082714_line_inquiry_flow.up,
    down: migration_20260929_082714_line_inquiry_flow.down,
    name: '20260929_082714_line_inquiry_flow',
  },
  {
    up: migration_20260929_085129_editable_contact.up,
    down: migration_20260929_085129_editable_contact.down,
    name: '20260929_085129_editable_contact',
  },
  {
    up: migration_20260929_091720_localization.up,
    down: migration_20260929_091720_localization.down,
    name: '20260929_091720_localization'
  },
];
