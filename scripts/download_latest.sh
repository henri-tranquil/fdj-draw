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

curl -i -H "Accept: application/json" -H "Content-Type:application/json" -X POST --data "{\"content\": \"Les données du loto on été mises à jour\"}" https://discord.com/api/webhooks/1047987192607297566/I_zC3Wma4bLuwDxleVzwreGhkWqQrRdqg7ATJOdIIoUJudX5-G0cAeMUTt8Yvq81O95V
