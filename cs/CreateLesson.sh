#!/usr/bin/env bash

n="$1"
next=$((n + 1))
prev=$((n - 1))

mkdir -p lessons

content="$CSHARP_LESSON_TEMPLATE"
content="${content//lessonX.json/lesson$n.json}"
content="${content//lessonNEXT.json/lesson$next.json}"
content="${content//lessonPREV.json/lesson$prev.json}"

# Write content exactly as-is, then pretty-print with jq
printf "%s\n" "$content" > "lessons/lesson$n.raw.json"
jq . "lessons/lesson$n.raw.json" > "lessons/lesson$n.json"
rm "lessons/lesson$n.raw.json"