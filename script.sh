cd /root/
# Setting Committer
git config --global user.name "FireNet ThemeSync"
git config --global user.email "firenetdesigns@gmail.com"

ssh-keyscan github.com >> /root/.ssh/known_hosts
git clone https://github.com/Jrschellenberg/buddyThemeSync.git themeSyncer

# Download the Env Repo
git clone $GITHUB_SYNC_REPO syncTheme

cd syncTheme
git checkout -b staging
git pull origin staging || echo "Staging does not yet exist, will be created"


cd ../themeSyncer

# Writing Variables
echo "SHOPIFY_STORE=$SHOPIFY_STORE" >> .env
echo "SHOPIFY_API_KEY=$SHOPIFY_API_KEY" >> .env
echo "SHOPIFY_PASSWORD=$SHOPIFY_PASSWORD" >> .env
[[ -z "$SHOPIFY_THEME_ID" ]] && echo "No Shopify Theme Specified, Will use Live Theme" || echo "SHOPIFY_THEME_ID=$SHOPIFY_THEME_ID" >> .env

yarn
yarn start

# now we commit git
cd ../syncTheme
git add -A
git diff --quiet && git diff --staged --quiet || git commit -m "Downloads from live Theme"
git push origin staging
