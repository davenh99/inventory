import { useContext } from "solid-js";
import { PBContext } from "./context";

import { EXPAND_PRODATTR, EXPAND_USER } from "../../../constants";
import { Collections } from "../../../pocketbase-types";
import { ClientResponseError } from "pocketbase";

const BaseSignUpData = {
  dob: "",
  height: 0,
  weight: 0,
};

export function usePB() {
  const context = useContext(PBContext);
  if (!context) {
    throw new Error("usePB must be used within PBProvider");
  }
  const { pb } = context;

  const login = async (usernameOrEmail: string, password: string) => {
    await pb
      .collection(Collections.User)
      .authWithPassword(usernameOrEmail, password, { expand: EXPAND_USER });
  };

  const signUp = async (email: string, name: string, password: string, passwordConfirm: string) => {
    await pb
      .collection(Collections.User)
      .create({ ...BaseSignUpData, name, email, password, passwordConfirm });
    await login(email, password);
  };

  const logout = () => {
    pb.authStore.clear();
  };

  const OAuthSignIn = async (provider: string) => {
    const authData = await pb.collection(Collections.User).authWithOAuth2({
      provider,
      createData: { ...BaseSignUpData, name: Collections.User },
      query: { expand: EXPAND_USER },
    });
    // after succesful auth we can update the user with a different username from the authData
    if (authData.meta?.name) {
      try {
        const formData = new FormData();

        if (authData.meta?.name) {
          formData.append("name", authData.meta.name);
        }

        await pb.collection(Collections.User).update(authData.record.id, formData, { expand: EXPAND_USER });
      } catch (e) {
        console.error("Could not update name: ", e);
      }
    }
  };

  return { ...context, login, signUp, logout, OAuthSignIn };
}

export function useAuthPB() {
  const {
    pb,
    store: { user },
    logout,
  } = usePB();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const safeGetRecord = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    try {
      return await fn();
    } catch (e) {
      if (e instanceof ClientResponseError && e.status === 404) {
        return null;
      } else {
        throw e;
      }
    }
  };

  const createTag = async (name: string) => {
    return pb.collection(Collections.Tag).create({ name });
  };

  const upsertAttribute = async (name: string, id?: string): Promise<AttributeRecord | null> => {
    let existingRecord: AttributeRecord | null = null;

    if (id) {
      existingRecord = await safeGetRecord(() => pb.collection(Collections.Attribute).getOne(id));
    } else {
      existingRecord = await safeGetRecord(() =>
        pb.collection(Collections.Attribute).getFirstListItem(`name="${name}"`),
      );
    }

    const attribute = existingRecord ?? (await pb.collection(Collections.Attribute).create({ name }));

    return attribute;
  };

  const upsertAttributeValue = async (
    name: string,
    attributeId: string,
    id?: string,
  ): Promise<AttributeValueRecord | null> => {
    let existingRecord: AttributeValueRecord | null = null;

    if (id) {
      existingRecord = await safeGetRecord(() => pb.collection(Collections.AttributeValue).getOne(id));
    } else {
      existingRecord = await safeGetRecord(
        () =>
          pb
            .collection(Collections.AttributeValue)
            .getFirstListItem(`name="${name}" && attribute="${attributeId}"`), // TODO use pb query builder later for safety
      );
    }

    const attributeValue =
      existingRecord ??
      (await pb.collection(Collections.AttributeValue).create({ name, attribute: attributeId }));

    return attributeValue;
  };

  return { pb, user, logout, createTag, upsertAttribute, upsertAttributeValue };
}
