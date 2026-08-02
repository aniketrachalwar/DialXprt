const fs = require('fs');
const file = 'src/data/mockVendors.ts';
let code = fs.readFileSync(file, 'utf8');

const newItems = `  { id: 'c_new1', name: 'Tours & Travels', slug: 'tours-travels', iconName: 'Plane', emoji: '✈️', group: 'Travel', description: 'Tours & Travels services', activeProvidersCount: 42, popularSearch: true },
  { id: 'c_new2', name: 'Dairy Products', slug: 'dairy-products', iconName: 'Coffee', emoji: '🥛', group: 'Food & Beverage', description: 'Dairy Products services', activeProvidersCount: 15, popularSearch: true },
  { id: 'c_new3', name: 'Events', slug: 'events', iconName: 'Star', emoji: '🎉', group: 'Events', description: 'Events services', activeProvidersCount: 28, popularSearch: true },
  { id: 'c_new4', name: 'Contractors', slug: 'contractors', iconName: 'Home', emoji: '🏗️', group: 'Construction', description: 'Contractors services', activeProvidersCount: 35, popularSearch: true },
  { id: 'c_new5', name: 'Fashion', slug: 'fashion', iconName: 'Shirt', emoji: '👗', group: 'Shopping', description: 'Fashion services', activeProvidersCount: 60, popularSearch: true },
  { id: 'c_new6', name: 'Fitness', slug: 'fitness', iconName: 'Heart', emoji: '🏋️', group: 'Health & Wellness', description: 'Fitness services', activeProvidersCount: 22, popularSearch: true },
  { id: 'c_new7', name: 'Restaurants', slug: 'restaurants', iconName: 'Utensils', emoji: '🍽️', group: 'Food & Beverage', description: 'Restaurants services', activeProvidersCount: 45, popularSearch: true },
  { id: 'c_new8', name: 'Caterers', slug: 'caterers', iconName: 'Coffee', emoji: '👨‍🍳', group: 'Caterers', description: 'Caterers services', activeProvidersCount: 31, popularSearch: true },
  { id: 'c_new9', name: 'Tailor', slug: 'tailor', iconName: 'Scissors', emoji: '🧵', group: 'Home Maintenance', description: 'Tailor services', activeProvidersCount: 50, popularSearch: true },
  { id: 'c_new10', name: 'Jhatka Meat & Poultry', slug: 'jhatka-meat-poultry', iconName: 'Activity', emoji: '🍗', group: 'Food & Beverage', description: 'Jhatka Meat & Poultry', activeProvidersCount: 12, popularSearch: true },\n`;

code = code.replace(
  /export const INITIAL_CATEGORIES: Category\[\] = \[\n/,
  'export const INITIAL_CATEGORIES: Category[] = [\n' + newItems
);

const toRemove = [
  /\s*{ id: 'c10', name: 'Tailor'.*\n/g,
  /\s*{ id: 'c108', name: 'Restaurants'.*\n/g,
  /\s*{ id: 'c127', name: 'Caterers'.*\n/g,
  /\s*{ id: 'c111', name: 'Gyms & Fitness'.*\n/g,
  /\s*{ id: 'c22', name: 'All Caterers'.*\n/g
];

for (const regex of toRemove) {
  code = code.replace(regex, '\n');
}

fs.writeFileSync(file, code);
console.log('done');
