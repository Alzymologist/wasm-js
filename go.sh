#!/bin/sh

clear

name=mainjs

HOST=/home/work/www/rustcode/${name}
SITE=http://q.lleo.me/rustcode/${name}/

rm pkg/* ; rm pkg/.gitignore

wasm-pack build --target web --out-name ${name}

if [ ! -d "${HOST}" ]; then
    mkdir ${HOST}
    chmod 777 ${HOST}
fi

cp -f pkg/${name}_bg.wasm ${HOST}/wasm.wasm
cp -f pkg/${name}.js      ${HOST}/wasm.js
cp -f ./index.html 	  ${HOST}
cp -f ./main.js    	  ${HOST}
cp -f ./main.css   	  ${HOST}

echo "\nOpen: ${SITE}\n"
