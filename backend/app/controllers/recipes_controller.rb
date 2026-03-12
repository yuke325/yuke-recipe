class RecipesController < ApplicationController
  def index
    recipes = Recipe.all
    render json: RecipeResource.new(recipes).serialize
  end

  def show
    recipe = Recipe.find(params[:id])
    render json: RecipeResource.new(recipe).serialize
  end

  def create
    recipe = Recipe.create!(recipe_params)
    render json: RecipeResource.new(recipe).serialize, status: :created
  end

  def update
    recipe = Recipe.find(params[:id])
    recipe.update!(recipe_params)

    render json: RecipeResource.new(recipe).serialize
  end

  def destroy
    recipe = Recipe.find(params[:id])
    recipe.destroy!

    head :no_content
  end

  private

  def recipe_params
    params.require(:recipe).permit(:user_id, :name, :description)
  end
end
