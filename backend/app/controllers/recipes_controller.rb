class RecipesController < ApplicationController
  before_action :authenticate_user!

  def index
    recipes = current_user.recipes
    render json: RecipeResource.new(recipes).serialize
  end

  def show
    recipe = current_user.recipes.find(params[:id])
    render json: RecipeResource.new(recipe).serialize
  end

  def create
    recipe = current_user.recipes.create!(recipe_params)
    render json: RecipeResource.new(recipe).serialize, status: :created
  end

  def update
    recipe = current_user.recipes.find(params[:id])
    recipe.update!(recipe_params)

    render json: RecipeResource.new(recipe).serialize
  end

  def destroy
    recipe = current_user.recipes.find(params[:id])
    recipe.destroy!

    head :no_content
  end

  private

  def recipe_params
    recipe_attributes.permit(:name, :description)
  end

  def recipe_attributes
    params.key?(:recipe) ? params.require(:recipe) : params
  end
end
