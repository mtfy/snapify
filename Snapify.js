const fs = require("fs");
const request = require('request');
const r = require("readline-sync");
const chalk = require("chalk");

let i = 0;
let taken = 0;
let available = 0;
let deleted = 0;
let unavailable = 0;
let errors = 0;

const xsrf_token = "CSRF_TOKEN"; // USED FOR
const web_client_id = "WEB_CLIENT_ID";

const usernames = [...new Set(fs.readFileSync("./in.txt", "utf-8").replace(/\r/g, "").split("\n"))]
check(usernames[i])
function check(username){
    if (username) {
        if (username.includes(" ")) {
            username = username.replace(" ", "_")
        }
    }
    
    if (i < usernames.length) {
        const url = `https://accounts.snapchat.com/accounts/get_username_suggestions?requested_username=${username}&xsrf_token=${xsrf_token}`

        request.post({
            url: url,
            headers: {
                "Accept": "*/*",
                "Accept-Encoding":  "*",
                "Accept-Language": "en",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
                "Cookie": `xsrf_token=${xsrf_token}; web_client_id=${web_client_id}`
            },
            timeout: 10000
        }, async(err, body, res) => {
            if(err){
                unavailable++
                let date = new Date();
                let logDate = date.toISOString();
                try {
                    fs.writeFileSync(`./errors/${date.getFullYear()}-${date.getMonth()}-${date.getDay()}_${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}_${date.getTimezoneOffset()}.txt`, `[${logDate}] Error : ${err}\r\n\r\n\r\n[RESPONSE BODY]\r\n\r\n${body}`, {
                        encoding: 'utf-8',
                        flag: 'w'
                    });
                } catch (err) {
                   console.log(chalk.red(`[${logDate}] Filesystem error -->\n\t${err}`));
                   errors++
                }
                console.log(chalk.red(`[ERROR] ${username} threw an exception! See the log file for more details.`));
            } else {
                try {  
                    res = JSON.parse(res).reference.status_code
                    if (res == "TAKEN") {
                        taken++
                        let date = new Date();
                        let logDate = date.toISOString();
                        console.log(chalk.red(`[${logDate}] Username '${username}' is not available.`));
                    } else if (res == "DELETED") {
                        deleted++
                        let date = new Date();
                        let logDate = date.toISOString();
                        console.log(chalk.yellow(`[${logDate}] Username '${username}' is DELETED.`));
                    } else if (res == "OK") {
                        available++
                        let date = new Date();
                        let logDate = date.toISOString();
                       
                        try {
                            fs.writeFileSync('./hits.txt', `[${logDate}] Username '${username}' is available\r\n`, {
                                encoding: 'utf-8',
                                flag: 'a+'
                            });
                        } catch (err) {
                           console.log(chalk.red(`[${logDate}] Filesystem error -->\n\t${err}`));
                           errors++
                        }
                       
                        console.log(chalk.greenBright(`[${logDate}] Username '${username}' is available.`));
                    }
                } catch (err) {
                    errors++
                    console.log(err)
                }
            }

            await new Promise(resolve => setTimeout(resolve, 2002));
            i++
            check(usernames[i])
        })
    } else {
        r.question()
    }
}
