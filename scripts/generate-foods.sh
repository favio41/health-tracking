
npx tsx scripts/generate-foods.ts
jq 'sort_by(.name)' /tmp/foods.json > public/foods.json
echo 'done'