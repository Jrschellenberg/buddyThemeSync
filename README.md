# buddyThemeSync
 - A Script written using `bash` and `node` to Theme Sync
 - This is used to keep Repo in sync with Shopify. Will have script execute in ubuntu / node docker container recurring and will update Repo's `staging` branch with targeted theme
 - By default will sync live theme, unless theme id is specified
 - At time of writing, has only been tested using the devops platform https://app.buddy.works/login
### Prerequisites
 - Node -v `12.13.1`
 - Yarn -v `1.19.2`
 - Linux Ubuntu -v `18.04`
 
### Getting Started
 - Log into Buddy works
 - Setup Node Action
 - Paste `script.sh` into shell
 - Setup Environment Variables, they should be called what what is in `.env.example` Please see attached Screenshot
 - 
 - Copy the buddy `.ssh key` and add it as a `deploy key` with `write access` under github project settings for repo to sync (This will grant the Container access to read / write of repo)
 - 
 
 

