// Today we learn : 
//                  1. writeFile
//                  2. appendFile
//                  3. copy file
//                  4. Rename file
//                  3. unlinkFile
//                  4. rmdir
//                  5. rm

const fs = require('fs');

// fs.writeFile("hey.txt", "THis is a file created by node js", (err) => {
//     if (err)
//         console.log(err);
//     else
//         console.log("DONE");
// })



// fs.appendFile("hey.txt", ". Another Part by using appendFile", (err) => {
//     if (err)
//         console.log(err);
//     else
//         console.log("DONE");
// })


fs.copyFile("hello.txt", "./copy/copy.txt", (err) => {
    if (err)
        console.log(err);
    else
        console.log("DONE");
})


// fs.rename("hey.txt", "hello.txt", (err) => {
//     if (err)
//         console.log(err);
//     else
//         console.log("DONE");
// })


// It's only remove empty directory
// fs.rmdir("./copy", (err) => {
//     if (err)
//         console.log(err);
//     else
//         console.log("DONE");
// })

// But it removes all
// fs.rmdir("./copy", {
//     recursive: true
// }, (err) => {
//     if (err)
//         console.log(err);
//     else
//         console.log("DONE");
// })