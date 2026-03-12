require 'rails_helper'

RSpec.describe Recipe, type: :model do
  describe 'バリデーション' do
    it '有効な属性をもつ場合は有効であること' do
      recipe = build(:recipe)

      expect(recipe).to be_valid
    end

    it 'name が nil の場合は無効であること' do
      recipe = build(:recipe, name: nil)

      expect(recipe).not_to be_valid
      expect(recipe.errors[:name]).to include("can't be blank")
    end

    it 'name が空文字の場合は無効であること' do
      recipe = build(:recipe, name: '')

      expect(recipe).not_to be_valid
      expect(recipe.errors[:name]).to include("can't be blank")
    end

    it 'user が nil の場合は無効であること' do
      recipe = build(:recipe, user: nil)

      expect(recipe).not_to be_valid
      expect(recipe.errors[:user]).to include('must exist')
    end

    it 'description が nil の場合は有効であること' do
      recipe = build(:recipe, description: nil)

      expect(recipe).to be_valid
    end
  end

  describe '関連付け' do
    it 'user に属すること' do
      association = described_class.reflect_on_association(:user)

      expect(association.macro).to eq(:belongs_to)
    end
  end
end
