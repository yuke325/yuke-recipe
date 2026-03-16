class RecipesController < ApplicationController
  DEFAULT_RECIPE_USER_EMAIL = 'recipe-dev@example.com'.freeze

  def index
    recipes = Recipe.all
    render json: RecipeResource.new(recipes).serialize
  end

  def show
    recipe = Recipe.find(params[:id])
    render json: RecipeResource.new(recipe).serialize
  end

  def create
    recipe = Recipe.create!(recipe_params.merge(user: default_recipe_user))
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
    recipe_attributes.permit(:name, :description)
  end

  def recipe_attributes
    params.key?(:recipe) ? params.require(:recipe) : params
  end

  def default_recipe_user
    User.find_or_create_by!(email: DEFAULT_RECIPE_USER_EMAIL) do |user|
      user.name = 'Recipe Demo User'
      user.password_hash = 'temporary-password-hash'
    end
  end
end
