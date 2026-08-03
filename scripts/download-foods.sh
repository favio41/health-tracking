#!/bin/bash

curl -L -o /tmp/usda-national-nutrient-database.zip https://www.kaggle.com/api/v1/datasets/download/demomaster/usda-national-nutrient-database
unzip -d /tmp/usda-data /tmp/usda-national-nutrient-database.zip
python3 -c "import csv, json, sys; print(json.dumps([dict(r) for r in csv.DictReader(sys.stdin)]))" < /tmp/usda-data/USDA.csv > data/USDA.json

curl -L -o /tmp/uk-coFID.xlsx https://assets.publishing.service.gov.uk/media/60538b91e90e07527df82ae4/McCance_Widdowsons_Composition_of_Foods_Integrated_Dataset_2021..xlsx
libreoffice --headless --convert-to csv:"Text - txt - csv (StarCalc)":44,34,UTF8,1,,0,false,true,false,false,false,-1 --outdir /tmp "/tmp/uk-coFID.xlsx"
python3 -c "import csv, json, sys; print(json.dumps([dict(r) for r in csv.DictReader(sys.stdin)]))" < "/tmp/uk-coFID-1.3 Proximates.csv" > data/UK-coFID.json
