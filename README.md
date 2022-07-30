# Snapify 1.0.0
* Used for mass-checking available Snapchat usernames, back when they added [a feature to allow users change their nicknames](https://www.theverge.com/2022/2/17/22938769/snapchat-username-change-update).
* I wrote this script some Friday night back in February while being drunk. So, the script looks awfully hardcoded. Anyways, this is just a proof-of-concept how exploitable the Snapchat's undocumented REST API is.
* I will leave the [Pull requests](https://github.com/mtfy/snapify/pulls) free to use, at least for now. However, I will archive this sometime soon.


The script saves all results into a file named **hits.txt** in the working directory. You will have to create your own wordlist for the usernames you want to check for... just read the script instead.

![Snapify: PoC Snapchat Username Checker](https://i.imgur.com/YWj8nda.png)
