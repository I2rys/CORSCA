//Dependencies
const Axios = require("Axios")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

var Self = {
    check_index: 0,
    data: null,
    results: []
}

//Functions
async function check(i){
    try{
        const response = await Axios({
            method: "GET",
            url: Self.data[i],
            headers: {
                origin: "https://attacker.com"
            }
        })

        if(JSON.stringify(response.headers).indexOf("https://attacker.com") !== -1){
            console.log(`${Self.data[i]} vulnerable to CORS.`)
            Self.results.push(Self.data[i])
        }else{
            console.log(`${Self.data[i]} not vulnerable to CORS.`)
        }
    }catch{
        console.log(`${Self.data[i]} not vulnerable to CORS.`)
    }

    Self.check_index++
    if(Self.check_index === Self.data.length){
        console.log("Finished checking.")
        if(!Self.results.length){
            console.log("No links is vulnerable to CORS.")
        }else{
            console.log(`Saving results to ${Self_Args[1]}`)
            Fs.writeFileSync(Self_Args[1], Self.results.join("\n"), "utf8")
            console.log(`Results successfully saved to ${Self_Args[1]}`)
        }

        process.exit()
    }
}

//Main
if(!Self_Args.length){
    console.log("node index.js <input> <output>")
    process.exit()
}

if(!Fs.existsSync(Self_Args[0])){
    console.log("Invalid input.")
    process.exit()
}

if(!Self_Args[1]){
    console.log("Invalid output.")
    process.exit()
}

const input_data =  Fs.readFileSync(Self_Args[0], "utf8").replace(/\r/g, "").split("\n")

if(!input_data.length){
    console.log("Input data is empty.")
    process.exit()
}

Self.data = input_data

for( i = 0; i <= input_data.length-1; i++ ){
    check(i)
}