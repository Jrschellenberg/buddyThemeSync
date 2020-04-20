cd /root/
ssh-keyscan github.com >> /root/.ssh/known_hosts
git clone git@github.com:Jrschellenberg/themeSyncer.git themeSyncer

# Download the Env Repo
git clone $GITHUB_SYNC_REPO syncTheme

# Setting Committer
git config --global user.name "FireNet ThemeSync"
git config --global user.email "firenetdesigns@gmail.com"
cd themeSyncer

# Writing Variables
echo "SHOPIFY_STORE=$SHOPIFY_STORE" >> .env
echo "SHOPIFY_API_KEY=$SHOPIFY_API_KEY" >> .env
echo "SHOPIFY_PASSWORD=$SHOPIFY_PASSWORD" >> .env

yarn
yarn start

# now we commit git
cd ../syncTheme
git checkout -b staging
git add -A
git push origin/staging
