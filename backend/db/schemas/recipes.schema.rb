 create_table :recipes, force: :cascade do |t|
   t.references :user, null: false, foreign_key: { on_delete: :cascade }, index: true
   t.string     :name, null: false
   t.text       :description
   t.timestamps null: false

   t.index [ :user_id, :updated_at ]
   t.index [ :user_id, :name ], unique: true
 end
