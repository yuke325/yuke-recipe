class RecipesController < ApplicationController
  def index
    recipes = Recipe.all
    render json: RecipeResource.new(recipes).serialize
  end
end
