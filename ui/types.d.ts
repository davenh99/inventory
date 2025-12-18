/* The rest of your app types */

// Stronger typed version of the auto-generated, as the auto generated doesn't know the type of json
type TPermission = Omit<Permission, "collections"> & { collections: string[] };

type TRole = Role & { expand?: { permissions: TPermission[] } };

type TUser = User & { expand?: { role: TRole } };
