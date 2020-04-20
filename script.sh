cd /root/
ssh-keyscan github.com >> /root/.ssh/known_hosts
git clone https://github.com/Jrschellenberg/buddyThemeSync.git themeSyncer

# Download the Env Repo
git clone $GITHUB_SYNC_REPO syncTheme

cd syncTheme
git checkout -b staging
git pull origin staging

# Setting Committer
git config --global user.name "FireNet ThemeSync"
git config --global user.email "firenetdesigns@gmail.com"
cd ../themeSyncer

# Writing Variables
echo "SHOPIFY_STORE=$SHOPIFY_STORE" >> .env
echo "SHOPIFY_API_KEY=$SHOPIFY_API_KEY" >> .env
echo "SHOPIFY_PASSWORD=$SHOPIFY_PASSWORD" >> .env

yarn
yarn start

# now we commit git
cd ../syncTheme
git add -A
git diff --quiet && git diff --staged --quiet || git commit -m "Downloads from live Theme"
git push origin staging
