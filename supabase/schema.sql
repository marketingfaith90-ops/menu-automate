-- ─────────────────────────────────────────────────────────────
--  Menu Automate — Supabase Schema
--  Run this in your Supabase project → SQL Editor
-- ─────────────────────────────────────────────────────────────

-- TEMPLATES: the design layouts designers create
create table if not exists templates (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,                -- e.g. "Indian Takeaway Classic"
  description text,
  style       text not null default 'indian-classic', -- slug for frontend rendering
  thumbnail   text,                         -- public URL to preview image
  color_scheme jsonb default '{"primary":"#243318","accent":"#C8A042","bg":"#F4EFE3"}',
  default_data jsonb not null,              -- full menu JSON used as starting point
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- MENUS: a customer's saved menu (based on a template)
create table if not exists menus (
  id           uuid primary key default gen_random_uuid(),
  template_id  uuid references templates(id) on delete set null,
  business_name text not null,
  slug         text unique,                 -- e.g. "chutneys-southampton" for sharing
  menu_data    jsonb not null,              -- all editable content (sections, items, info)
  is_published boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger menus_updated_at
  before update on menus
  for each row execute function update_updated_at();

-- RLS: open read, anyone can create/update their own menu via anon key
alter table templates enable row level security;
alter table menus enable row level security;

create policy "Templates are public" on templates for select using (is_active = true);
create policy "Anyone can create menus" on menus for insert with check (true);
create policy "Anyone can read menus" on menus for select using (true);
create policy "Anyone can update menus" on menus for update using (true);

-- ─────────────────────────────────────────────────────────────
--  SEED: Insert the "Indian Classic" template
-- ─────────────────────────────────────────────────────────────
insert into templates (name, description, style, default_data) values (
  'Indian Classic',
  'Tri-fold takeaway menu with sections for Biryani, Curries, Tandoori, Rice, Breads and more. Warm cream background, forest green headers, gold accents.',
  'indian-classic',
  '{
    "restaurantName": "Your Restaurant",
    "tagline": "Indian Takeaway",
    "phone": "01234 567890",
    "website": "www.yourrestaurant.co.uk",
    "address": "123 High Street,\nYour Town,\nAB1 2CD",
    "hours": "Open 7 Days a Week\n5PM – Late",
    "deliveryNote": "Delivery available on orders over £13.00",
    "allergyNote": "If you have any food allergies please inform us when ordering",
    "hygiene": 5,
    "mealBox": {
      "title": "MEAL BOX",
      "subtitle": "Collection Only",
      "price": "£11.99",
      "includes": ["Starter", "Side Dish", "Pilau Rice", "Curry of your choice"]
    },
    "setMeals": [
      {
        "id": "sm1",
        "heading": "(A) For One Person",
        "price": "£18.50",
        "body": "(1) Papadum, (1) Starter,\n(1) Main Course,\n(1) Side Dish, (1) Pilau Rice"
      },
      {
        "id": "sm2",
        "heading": "(B) For Two People",
        "price": "£37.50",
        "body": "Starters: (2) Papadums, (1) Prawn Puri, (1) Chicken Tikka\n\nMains: (2) Curry of your choice\n\nSides: (1) Side Dish, (2) Pilau Rice, (1) Naan"
      }
    ],
    "sections": [
      {
        "id": "biryani",
        "title": "Biryani Dishes",
        "subtitle": "A mixed rice dish lightly fried with spices, served with mixed vegetable curry",
        "panel": 1,
        "items": [
          {"id":"b1","name":"Chicken Biryani","price":"£9.50","desc":""},
          {"id":"b2","name":"Meat Biryani","price":"£9.90","desc":""},
          {"id":"b3","name":"Prawn Biryani","price":"£9.50","desc":""},
          {"id":"b4","name":"King Prawn Biryani","price":"£12.00","desc":""},
          {"id":"b5","name":"Vegetable Biryani","price":"£8.50","desc":""}
        ]
      },
      {
        "id": "veg-sides",
        "title": "Vegetable Side Dishes",
        "subtitle": "",
        "panel": 1,
        "items": [
          {"id":"vs1","name":"Bombay Potatoes","price":"£3.95","desc":"Potatoes cooked with herbs and spices, served dry"},
          {"id":"vs2","name":"Sag Aloo","price":"£3.95","desc":"Spinach and potatoes, delicately cooked"},
          {"id":"vs3","name":"Mixed Vegetable Curry","price":"£3.95","desc":""},
          {"id":"vs4","name":"Mushroom Bhajee","price":"£3.95","desc":""},
          {"id":"vs5","name":"Tarka Dhall","price":"£3.95","desc":"Lentils cooked with fresh garlic and coriander"},
          {"id":"vs6","name":"Sag Paneer","price":"£3.95","desc":""}
        ]
      },
      {
        "id": "rice",
        "title": "Rice Dishes",
        "subtitle": "",
        "panel": 2,
        "items": [
          {"id":"r1","name":"Plain Rice","price":"£2.70","desc":"Plain steamed basmati rice"},
          {"id":"r2","name":"Pilau Rice","price":"£3.00","desc":"Specially cooked basmati rice"},
          {"id":"r3","name":"Lemon Rice","price":"£3.60","desc":""},
          {"id":"r4","name":"Coconut Rice","price":"£3.60","desc":""},
          {"id":"r5","name":"Vegetable Rice","price":"£3.60","desc":""},
          {"id":"r6","name":"Egg Fried Rice","price":"£3.60","desc":""},
          {"id":"r7","name":"Garlic Rice","price":"£3.60","desc":""},
          {"id":"r8","name":"Mushroom Rice","price":"£3.60","desc":""},
          {"id":"r9","name":"Chilli Rice","price":"£3.60","desc":""}
        ]
      },
      {
        "id": "breads",
        "title": "Tandoori Breads",
        "subtitle": "Tastiest leavened Indian bread cooked in the tandoor",
        "panel": 2,
        "items": [
          {"id":"br1","name":"Plain Naan","price":"£2.70","desc":""},
          {"id":"br2","name":"Peshwari Naan","price":"£3.10","desc":"Sweet stuffing of coconut and fresh cream"},
          {"id":"br3","name":"Garlic Naan","price":"£3.10","desc":""},
          {"id":"br4","name":"Cheese Naan","price":"£3.10","desc":""},
          {"id":"br5","name":"Keema Naan","price":"£3.10","desc":""},
          {"id":"br6","name":"Stuffed Naan","price":"£3.10","desc":"Mixed vegetables"},
          {"id":"br7","name":"Chilli Naan","price":"£3.10","desc":""},
          {"id":"br8","name":"Paratha","price":"£3.50","desc":"Thick Indian Bread"},
          {"id":"br9","name":"Chapati","price":"£1.20","desc":""},
          {"id":"br10","name":"Puri Bread","price":"£1.50","desc":"Unleavened, thin, soft and crispy"}
        ]
      },
      {
        "id": "starters",
        "title": "Tasty Starters",
        "subtitle": "Served with salad and mint sauce on certain dishes",
        "panel": 4,
        "items": [
          {"id":"st1","name":"Plain Papadums","price":"£0.90","desc":""},
          {"id":"st2","name":"Spicy Papadums","price":"£1.00","desc":""},
          {"id":"st3","name":"Onion Bhajee","price":"£3.30","desc":""},
          {"id":"st4","name":"Samosas (Veg)","price":"£0.90","desc":""},
          {"id":"st5","name":"Chicken Tikka","price":"£4.80","desc":""},
          {"id":"st6","name":"Lamb Tikka","price":"£4.80","desc":""},
          {"id":"st7","name":"Sheek Kebab","price":"£4.80","desc":""},
          {"id":"st8","name":"Prawn Puri","price":"£4.80","desc":""},
          {"id":"st9","name":"King Prawn Puri","price":"£5.50","desc":""}
        ]
      },
      {
        "id": "tandoori",
        "title": "Tandoori Specialities",
        "subtitle": "Marinated overnight with yoghurt and spices, barbecued in the clay oven",
        "panel": 5,
        "items": [
          {"id":"ta1","name":"Tandoori Mixed Grill","price":"£12.50","desc":""},
          {"id":"ta2","name":"Tandoori King Prawn","price":"£12.50","desc":""},
          {"id":"ta3","name":"Tandoori Chicken (Half)","price":"£8.95","desc":""},
          {"id":"ta4","name":"Chicken Tikka","price":"£8.95","desc":""},
          {"id":"ta5","name":"Lamb Tikka","price":"£8.95","desc":""},
          {"id":"ta6","name":"Mixed Tikka","price":"£8.95","desc":""}
        ]
      },
      {
        "id": "curry",
        "title": "Curry Dishes",
        "subtitle": "A traditional curry sauce made to our unique family recipe",
        "panel": 6,
        "items": [
          {"id":"cu1","name":"Chicken Curry","price":"£7.50","desc":""},
          {"id":"cu2","name":"Meat Curry","price":"£7.95","desc":""},
          {"id":"cu3","name":"Prawn Curry","price":"£7.95","desc":""},
          {"id":"cu4","name":"King Prawn Curry","price":"£10.00","desc":""},
          {"id":"cu5","name":"Vegetable Curry","price":"£7.00","desc":""},
          {"id":"cu6","name":"Chicken Tikka Curry","price":"£8.95","desc":""},
          {"id":"cu7","name":"Lamb Tikka Curry","price":"£9.20","desc":""},
          {"id":"cu8","name":"Chicken Madras","price":"£7.50","desc":""},
          {"id":"cu9","name":"Chicken Vindaloo","price":"£7.95","desc":""}
        ]
      },
      {
        "id": "specials",
        "title": "Chef Specials",
        "subtitle": "Our signature dishes — marinated overnight with yoghurt and spices",
        "panel": 7,
        "items": [
          {"id":"sp1","name":"Butter Chicken Tikka","price":"£9.20","desc":"Chicken in a sliced mild cream & butter sauce (mild)"},
          {"id":"sp2","name":"Garlic Chilli Massala","price":"£9.20","desc":"Garlic infused fiery hot dish with green chillies (hot)"},
          {"id":"sp3","name":"Karahi Dishes","price":"£9.50","desc":"Chopped onion, capsicum, tomatoes cooked and tossed in butter"},
          {"id":"sp4","name":"Korma","price":"£8.50","desc":"Cooked in a very rich sauce with cream and coconut (very mild)"},
          {"id":"sp5","name":"Balti Dishes","price":"£9.50","desc":"A sizzling blend of spices and fresh herbs in the Balti style"}
        ]
      }
    ]
  }'
);
