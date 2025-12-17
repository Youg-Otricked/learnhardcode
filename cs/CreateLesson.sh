n="$1"
next=$((n + 1))
prev=$((n - 1))

mkdir -p lessons

content="$CSHARP_LESSON_TEMPLATE"

# Replace id
content="${content//lessonX.json/lesson$n.json}"

# Replace nextLesson and previous
content="${content//lessonNEXT.json/lesson$next.json}"
content="${content//lessonPREV.json/lesson$prev.json}"
echo $content > lessons/lesson$1.json
jq . "lessons/lesson$1.json" > "lessons/lesson$1.pretty.json"
mv "lessons/lesson$1.pretty.json" "lessons/lesson$1.json"