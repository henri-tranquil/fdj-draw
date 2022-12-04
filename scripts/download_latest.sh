cd ~/fdj-draw/resources
wget https://media.fdj.fr/static-draws/csv/euromillions/euromillions_202002.zip
unzip euromillions_202002.zip
mv euromillions_202002.csv euromillions.csv
rm -rf euromillions_202002.zip
rm -rf euromillions_202002
cd ../parser
npm run fillData
rm -rf ../resources/euromillions.csv
git commit -m "New data added" -a && git push

curl -i -H "Accept: application/json" -H "Content-Type:application/json" -X POST --data "{\"content\": \"Les données du loto on été mises à jour\"}" $DISCORD_HOOK