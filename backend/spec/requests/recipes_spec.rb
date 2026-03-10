require 'rails_helper'

RSpec.describe 'GET /recipes', type: :request do
  def serialized_recipe(recipe)
    {
      'id' => recipe.id,
      'name' => recipe.name,
      'description' => recipe.description,
      'created_at' => recipe.created_at.utc.iso8601(3),
      'updated_at' => recipe.updated_at.utc.iso8601(3)
    }
  end

  context 'レシピが1件ある場合' do
    let!(:recipe) { create(:recipe, name: 'カレー', description: 'スパイスの効いたカレー') }

    it 'レシピ一覧を返す' do
      get '/recipes'

      expect(response).to have_http_status(200)

      json = JSON.parse(response.body)
      expect(json).to eq([serialized_recipe(recipe)])

      assert_response_schema_confirm(200)
    end
  end

  context 'レシピが0件の場合' do
    it '空配列を返す' do
      get '/recipes'

      expect(response).to have_http_status(200)
      expect(JSON.parse(response.body)).to eq([])

      assert_response_schema_confirm(200)
    end
  end
end
