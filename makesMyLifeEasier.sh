#! /usr/bin/env bash
if [[ $# -eq 1 && $1 == "version" ]]; then
    echo "WTF u mean version this is a 2 minute shell script. Did I drink 3 gallons of milk tea again? 1.0.0 ig"
    exit 241
fi;
if [[ $# -eq 1 && $1 == "help" ]]; then
    echo "I guess i forgot a basic script and can't read bash anymore. mmle < run | starter | submit | text > <file> <json file>"
    exit 230
fi;
if [ $# -lt 3 ]; then
    echo "Please pass 3 arguments"
    exit 1
fi;
TYPE=$1
JSON_FILE_PATH=$3
FIELD=""
case "$TYPE" in
  text) FIELD=".description" ;;
  starter) FIELD=".starterCode" ;;
  run) FIELD=".runHarness" ;;
  submit) FIELD=".submitHarness" ;;
  *) echo "Invalid type"; exit 1 ;;
esac

jq --rawfile md "$2" \
   "$FIELD = \$md" \
   "$JSON_FILE_PATH" > tmp.json && mv tmp.json "$JSON_FILE_PATH"

