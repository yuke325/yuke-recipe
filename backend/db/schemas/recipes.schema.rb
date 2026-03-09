 create_table :recipes, force: :cascade do |t|
   t.references :user, null: false, foreign_key: { on_delete: :cascade }
   t.string     :name,        null: false
   t.text       :description
   t.timestamps               null: false
 end
