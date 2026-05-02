import os
import json

latest_titles = {}

ROOT = "."

for lang in os.listdir(ROOT):
    lesson_dir = os.path.join(ROOT, lang, "lessons")

    if not os.path.isdir(lesson_dir):
        continue

    lessons = []

    # collect (lesson_number, filename)
    for file in os.listdir(lesson_dir):
        if file.startswith("lesson") and file.endswith(".json"):
            try:
                n = int(file[len("lesson"):-5])
                lessons.append((n, file))
            except ValueError:
                continue

    if not lessons:
        continue

    # pick highest numeric lesson
    n, latest_file = max(lessons, key=lambda x: x[0])

    path = os.path.join(lesson_dir, latest_file)

    try:
        with open(path, "r") as f:
            content = f.read().strip()

            if not content:
                print("Skipping empty file:", path)
                continue

            data = json.loads(content)

    except json.JSONDecodeError:
        print("Skipping invalid JSON:", path)
        continue

    latest_titles[lang] = {
        "lesson": n,
        "title": data.get("title", "Untitled")
    }

# output
for lang, info in latest_titles.items():
    print(f"{lang}: lesson {info['lesson']} - {info['title']}")
