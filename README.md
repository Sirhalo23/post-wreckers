# Post Wreckers

Paste a link to any post on X, and it shows up on a demolition site where you can shoot, blast and jetpack around it as a stick figure, or drop a crew of stick figures who tear it apart for you.

## What's in here

| File | What it does |
|---|---|
| `index.html` | The whole game: the page, the physics, the stick figures, the weapons. |
| `api/post.js` | Takes a post link and returns the post's name, handle, text, picture and counts. |
| `api/img.js` | Passes avatars and attached images through your site so the game can break them into pieces. Only accepts images from X's image servers. |
| `lib/x.js` | The shared code that reads a link and talks to X. |
| `vercel.json` | Makes links like `yoursite.com/username/status/123` open the game with that post loaded. |
| `dev-server.js` | Lets you run it on your own computer for testing. Not used once deployed. |

## Put it online (free, about 5 minutes)

You need a free [GitHub](https://github.com) account and a free [Vercel](https://vercel.com) account (sign up to Vercel with GitHub to make this easier).

1. On GitHub, create a new repository (for example `post-wreckers`). Leave it empty.
2. On the new repository's page, click **uploading an existing file**, drag in everything from this folder (keep the `api` and `lib` folders), and click **Commit changes**.
3. On Vercel, click **Add New → Project**, pick the repository, and click **Deploy**. You don't need to change any settings.
4. When it finishes, Vercel gives you an address like `post-wreckers.vercel.app`. That's your site.

Any time you change a file on GitHub, Vercel republishes the site automatically.

Prefer the command line? From this folder, run `npx vercel` and follow the prompts.

## Try it on your own computer first (optional)

You need [Node.js](https://nodejs.org) 18 or newer. In this folder, run:

```
npm run dev
```

Then open http://localhost:3000.

## Ways to load a post

- Paste a link into the box at the top and press **Wreck it**.
- Paste a link anywhere on the page (Ctrl+V or ⌘V) outside a text box.
- Swap `x.com` for your site's address in any post link, for example `post-wreckers.vercel.app/jack/status/20`.
- Add `?post=` and a link or post ID to your site's address.
- No link? Paste a screenshot of a post anywhere on the page (Ctrl+V or ⌘V), or drop the image onto the site.

Links from x.com, twitter.com, mobile.twitter.com, fxtwitter.com and vxtwitter.com all work, with or without extra bits like `?s=20` on the end.

## Good to know

- **The data source is unofficial.** X's paid API costs money, so this reads the free public feed that X's own embedded posts use. X can change or block it at any time. If links stop working, the game still works with typed-in posts and screenshots.
- **Repost and view counts aren't available** from that feed, so those spots on the card stay blank. Reply and like counts come through.
- **Some posts can't be loaded:** deleted posts, protected accounts and age-restricted posts.
- **Long posts** are cut off by X's feed and end with "…".
- **Videos** show their preview frame.
- Results are cached for 10 minutes, so a very fresh like count may lag.
