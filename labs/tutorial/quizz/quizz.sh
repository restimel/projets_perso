#!/bin/bash
#recupere les informations de quizz des fichiers HTML pour les présenter sous formes d'un seul JSON
echo '{"quizz":[' > quizz.test

ls_f=`find . -name '*.html'`

for fichier in $ls_f
do

sed -e '{N
s/[\n\r]/£/g
}' $fichier | sed -e '{N
s/[\n\r]/£/g
}' | sed -e '{N
s/[\n\r]/£/g
}'| sed -e '{N
s/[\n\r]/£/g
}'| sed -e '{N
s/[\n\r]/£/g
}'| sed -e '{N
s/[\n\r]/£/g
}'| sed -e '{N
s/[\n\r]/£/g
}'| sed -e '{N
s/[\n\r]/£/g
}' | sed 's_"_¤_g' | sed 's_\\_§_g' | sed  's_^.*thème\s*:\s*\([^£]\+\).*niveau\s*:\s*\(-\?[0-9.]\+\).*<textarea[^>]\+¤question¤[^>]*>\(.*\)</textarea>.*<ul>\(.*\)</ul>.*</summary>\(.*\)</details>.*$_{"id":0,"theme":["\1"],"niveau":\2,"code":"\3","reponses":[\4],"explication":"\5"},_' | sed 's_\("theme":\["[^"]\+\),\([^"]\+\),\([^"]\+\)"_\1","\2","\3"_g' | sed 's_\("theme":\["[^"]\+\),\([^"]\+\)"_\1","\2"_g'  | sed  's_\s*£\s\+<li>\([^<]*\)</li>_"\1",_g' | sed  's_\("reponses":\[.*\)\s*£\s\+<li\s\+class=¤bonneReponse¤\s*>\(.*\)</li>\([^]]*\]\)_\1"\2",\3,"bonneReponse":"\2"_' | sed 's_,£\+\(],"bonneReponse":\)_\1_' | sed 's_\("explication":"\)[£ 	]\+_\1_' | sed 's_£\+"_"_g' | sed 's_<br>"_"_g' | sed 's_:"£_:"_g' | sed 's_§_\\\\_g' | sed 's_¤_\\"_g' | sed 's_£_\\n_g' | sed 's_[	]_\\t_g' >> quizz.test

done

echo "{}]}" >> quizz.test

cat -n quizz.test

