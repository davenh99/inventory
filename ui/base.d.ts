/* This file was automatically generated, changes will be overwritten. */

interface BaseRecord {
  id: string;
  collectionName: string;
  collectionId: string;
  created: string;
  updated: string;
}

/* Collection type: auth */
interface User {
  email: string; // email
  emailVisibility?: boolean; // bool
  verified?: boolean; // bool
  name?: string; // text
  avatar?: string; // file
  role: string; // relation
}

type UserRecord = User & BaseRecord;

/* Collection type: base */
interface Changelog {
  collection: string; // text
  recordId: string; // text
  changeType: "create" | "update" | "delete"; // select
  changedBy: string; // relation
  reason?: string; // text
}

type ChangelogRecord = Changelog & BaseRecord;

/* Collection type: base */
interface ChangelogDiff {
  changelogId: string; // relation
  field: string; // text
  valueOld?: string; // text
  valueNew?: string; // text
}

type ChangelogDiffRecord = ChangelogDiff & BaseRecord;

/* Collection type: base */
interface Role {
  name: string; // text
  permissions?: string[]; // relation
}

type RoleRecord = Role & BaseRecord;

/* Collection type: base */
interface Permission {
  name: string; // text
  collections?: any; // json
  canView?: boolean; // bool
  canList?: boolean; // bool
  canCreate?: boolean; // bool
  canUpdate?: boolean; // bool
  canDelete?: boolean; // bool
}

type PermissionRecord = Permission & BaseRecord;

