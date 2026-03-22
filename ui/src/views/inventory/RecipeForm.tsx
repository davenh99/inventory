import { Component, createResource } from "solid-js";
import { Card } from "@solidpb/ui-kit";

import { useAuthPB } from "../../config/pocketbase";
import { NEW_RECORD_ID } from "../../../constants";
import { Collections } from "../../../pocketbase-types";
import { useSearchParams } from "@solidjs/router";
import { BaseQueryParams } from "../../services/navigation";

interface RecipeFormProps {
  recordId?: string;
}

type RecipeSearchParams = BaseQueryParams & {
  product: string;
};

export const RecipeForm: Component<RecipeFormProps> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams<RecipeSearchParams>();
  const { pb } = useAuthPB();

  const [recipe] = createResource(async () => {
    if (props.recordId && props.recordId !== NEW_RECORD_ID) {
      const record = await pb.collection(Collections.Bom).getOne(props.recordId);

      return record;
    } else {
      return { active: true, product: searchParams.product } as Partial<BomRecord>;
    }
  });

  return (
    <Card>
      <h2 class="text-md">Recipe for {searchParams.product}</h2>
    </Card>
  );
};

export default RecipeForm;
