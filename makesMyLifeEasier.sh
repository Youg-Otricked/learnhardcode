#! /usr/bin/env bash
if [[ $# -eq 1 && $1 == "version" ]]; then
    echo "WTF u mean version this is a 2 minute shell script. Did I drink 3 gallons of milk tea again? 1.0.0 ig"
    exit 241
fi;
if [[ $# -eq 1 && $1 == "help" ]]; then
    echo "I guess i forgot a basic script and can't read bash anymore. mmle <md file> <json file>"
    exit 230
fi;
if [ $# -lt 2 ]; then
    echo "Please pass 2 arguments"
    exit 1
fi;
MD_FILE_PATH=$1
JSON_FILE_PATH=$2
if [[ -f $MD_FILE_PATH && -f $JSON_FILE_PATH ]]; then
    jq --rawfile md "$MD_FILE_PATH" \
        '.description = $md' \
        "$JSON_FILE_PATH" > tmp.json && mv tmp.json "$JSON_FILE_PATH"
fi;