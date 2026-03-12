require 'rails_helper'

RSpec.describe 'Recipes API', type: :request do
  def serialized_recipe(recipe)
    {
      'id' => recipe.id,
      'name' => recipe.name,
      'description' => recipe.description,
      'created_at' => recipe.created_at.utc.iso8601(3),
      'updated_at' => recipe.updated_at.utc.iso8601(3)
    }
  end

  describe 'GET /recipes' do
    context 'レシピが1件ある場合' do
      let!(:recipe) { create(:recipe, name: 'カレー', description: 'スパイスの効いたカレー') }

      it 'レシピ一覧を返す' do
        get '/recipes'

        expect(response).to have_http_status(200)
        json = JSON.parse(response.body)
        expect(json).to eq([ serialized_recipe(recipe) ])
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

  describe 'GET /recipes/:id' do
    context 'レシピが存在する場合' do
      let!(:recipe) { create(:recipe, name: 'カレー', description: 'スパイスの効いたカレー') }

      it 'レシピ詳細を返す' do
        get "/recipes/#{recipe.id}"

        expect(response).to have_http_status(200)
        json = JSON.parse(response.body)
        expect(json).to eq(serialized_recipe(recipe))
        assert_response_schema_confirm(200)
      end
    end

    context 'レシピが存在しない場合' do
      it '404エラーを返す' do
        get '/recipes/0'

        expect(response).to have_http_status(404)
        json = JSON.parse(response.body)
        expect(json['errors'][0]['code']).to eq('not_found')
        assert_response_schema_confirm(404)
      end
    end
  end

  describe 'POST /recipes' do
    let(:user) { create(:user) }

    context '有効なパラメータの場合' do
      let(:valid_params) do
        { recipe: { user_id: user.id, name: '肉じゃが', description: '家庭の味' } }
      end

      it 'レシピが作成される' do
        expect {
          post '/recipes', params: valid_params, as: :json
        }.to change { Recipe.count }.by(1)

        expect(response).to have_http_status(201)
        json = JSON.parse(response.body)
        expect(json['name']).to eq('肉じゃが')
        expect(json['description']).to eq('家庭の味')
        assert_response_schema_confirm(201)
      end
    end

    context 'name が空の場合' do
      let(:invalid_params) do
        { recipe: { user_id: user.id, name: '', description: '説明だけ' } }
      end

      it '422エラーを返し、レシピは作成されない' do
        expect {
          post '/recipes', params: invalid_params, as: :json
        }.not_to change { Recipe.count }

        expect(response).to have_http_status(422)
        json = JSON.parse(response.body)
        expect(json['errors'][0]['code']).to eq('unprocessable_entity')
        expect(json['errors'][0]['message']).to eq("Name can't be blank")
        assert_response_schema_confirm(422)
      end
    end
  end

  describe 'PATCH /recipes/:id' do
    let!(:recipe) { create(:recipe, name: '元の名前', description: '元の説明') }

    context '有効なパラメータの場合' do
      let(:update_params) do
        { recipe: { name: '更新後の名前', description: '更新後の説明' } }
      end

      it 'レシピが更新される' do
        patch "/recipes/#{recipe.id}", params: update_params, as: :json

        expect(response).to have_http_status(200)
        json = JSON.parse(response.body)
        expect(json['name']).to eq('更新後の名前')
        expect(json['description']).to eq('更新後の説明')
        recipe.reload
        expect(recipe.name).to eq('更新後の名前')
        assert_response_schema_confirm(200)
      end
    end

    context 'レシピが存在しない場合' do
      it '404エラーを返す' do
        patch '/recipes/0', params: { recipe: { name: 'test' } }, as: :json

        expect(response).to have_http_status(404)
        assert_response_schema_confirm(404)
      end
    end

    context 'name を空に更新する場合' do
      it '422エラーを返す' do
        patch "/recipes/#{recipe.id}", params: { recipe: { name: '' } }, as: :json

        expect(response).to have_http_status(422)
        recipe.reload
        expect(recipe.name).to eq('元の名前')
        assert_response_schema_confirm(422)
      end
    end
  end

  describe 'DELETE /recipes/:id' do
    let!(:recipe) { create(:recipe) }

    context 'レシピが存在する場合' do
      it 'レシピが削除される' do
        expect {
          delete "/recipes/#{recipe.id}"
        }.to change { Recipe.count }.by(-1)

        expect(response).to have_http_status(204)
        expect(response.body).to be_empty
      end
    end

    context 'レシピが存在しない場合' do
      it '404エラーを返す' do
        delete '/recipes/0'

        expect(response).to have_http_status(404)
        assert_response_schema_confirm(404)
      end
    end
  end
end
