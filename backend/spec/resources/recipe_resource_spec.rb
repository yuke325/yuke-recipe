require 'rails_helper'

RSpec.describe RecipeResource do
  describe '#serialize' do
    def serialized_recipe(recipe)
      {
        'id' => recipe.id,
        'name' => recipe.name,
        'description' => recipe.description,
        'created_at' => recipe.created_at.utc.iso8601(3),
        'updated_at' => recipe.updated_at.utc.iso8601(3)
      }
    end

    context '一件のレシピをシリアライズする場合' do
      let(:recipe) do
        create(
          :recipe,
          name: 'カレー',
          description: 'スパイスの効いたカレー'
        )
      end

      it '公開対象の属性をシリアライズする場合' do
        json = JSON.parse(described_class.new(recipe).serialize)

        expect(json).to eq(serialized_recipe(recipe))
      end
    end

    context '複数のレシピをシリアライズする場合' do
      let!(:curry) { create(:recipe, name: 'カレー', description: '定番') }
      let!(:pasta) { create(:recipe, name: 'パスタ', description: 'トマトソース') }

      it '各レシピを順番どおりにシリアライズする' do
        json = JSON.parse(described_class.new(Recipe.order(:id)).serialize)

        expect(json).to eq([serialized_recipe(curry), serialized_recipe(pasta)])
      end
    end
  end
end
