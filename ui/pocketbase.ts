/* This file was automatically generated, changes will be overwritten. */

import PocketBase, { RecordService } from "pocketbase";

export const Collections = {
  User: "user",
  Changelog: "changelog",
  ChangelogDiff: "changelogDiff",
  Role: "role",
  Permission: "permission",
} as const;

export interface CollectionRecords {
  user: UserRecord;
  changelog: ChangelogRecord;
  changelogDiff: ChangelogDiffRecord;
  role: RoleRecord;
  permission: PermissionRecord;
}

export interface TypedPocketBase extends PocketBase {
  collection<K extends keyof CollectionRecords>(
    name: K
  ): RecordService<CollectionRecords[K]>;

  // fallback for dynamic strings
  collection(name: string): RecordService<any>;
}

