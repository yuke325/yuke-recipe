require 'rails_helper'

  RSpec.describe 'GET /recipes', type: :request do
    context 'レシピが1件ある場合' do
      before do
        create(:recipe, name: 'カレー')
      end

      it 'レシピ一覧を返す' do
        get '/recipes'

        expect(response).to have_http_status(200)

        json = JSON.parse(response.body)
        expect(json.length).to eq(1)
        expect(json.first['name']).to eq('カレー')

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
