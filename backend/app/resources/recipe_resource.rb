class RecipeResource
  include Alba::Resource

  attributes :id, :name, :description

  attribute :created_at do |recipe|
    recipe.created_at&.utc&.iso8601(3)
  end

  attribute :updated_at do |recipe|
    recipe.updated_at&.utc&.iso8601(3)
  end
end
