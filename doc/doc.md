# How to create a https server on localhost

1. Get a domain on `Freenom`
2. Add A record against 127.0.0.1
3. Get a SLL Auth doc by DNC auth on `Let's Encrypt`
4. create a https server on localohost:8000

# How to set up a Github OAuth App

1. Goto `https://github.com/settings/applications/new`
2. Set `Application name` to `Deploy Chat Example`
3. Set `Homepage URL` to your Deno Deploy project URL.
4. Set `Authorization callback URL` to `http://hoge` or localhost for development.
5. Add `Client ID` and `Client Secret` in the `.env` file.

## How to access registered Github OAuth Apps

- `https://github.com/settings/developers`
