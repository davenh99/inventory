import { useParams } from "@solidjs/router";
import { Component } from "solid-js";

import { RecipeForm } from "../views/inventory/RecipeForm";

export const Recipe: Component = () => {
  const params = useParams();

  return <RecipeForm recordId={params.id} />;
};

export default Recipe;
