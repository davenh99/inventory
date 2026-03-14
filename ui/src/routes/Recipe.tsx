import { useParams } from "@solidjs/router";
import { Component } from "solid-js";

import { RecipeForm } from "../views/inventory/RecipeForm";

export const Recipe: Component = () => {
  const params = useParams();

  return <RecipeForm recipeId={params.id} />;
};

export default Recipe;
