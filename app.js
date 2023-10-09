// console.log("This is app.js file!");
const fs = require('fs');
if (process.argv[2] == 'create' && process.argv[3] != '') {
    fs.writeFileSync(process.argv[3], process.argv[4]);
} else if (process.argv[2] == 'read' && process.argv[3] != '') {
    try {
        fs.readFile(process.argv[3], 'utf8', (err, data) => {
            if (err) throw err;
            console.log(data);
        })
    } catch (err) {
        console.log("err");
    }
}
else if (process.argv[2] == 'append' && process.argv[3] != '') {
    try {
        fs.appendFileSync(process.argv[3], process.argv[4], (err) => {
            if (err) throw err;
            console.log('Updated!');
        })
    } catch (err) {
        console.log("err");
    }
}
else if (process.argv[2] == 'remove' && process.argv[3] != ''){
    fs.unlinkSync(process.argv[3])
}else{
    console.log('Invalide Input!')
}